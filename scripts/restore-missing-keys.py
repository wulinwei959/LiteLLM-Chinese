"""Restore catalog keys the upstream sync left missing.

Rebuilding translated files against upstream's newer structure can move a key to
a different namespace, and pruning dead keys can drop one that is about to be
used again. This reads the type errors, finds the key each one names, and
copies its value back from the catalog as it was before the sync.

Usage: python3 scripts/restore-missing-keys.py <pre-sync commit> <tsc output file>
"""

from __future__ import annotations

import collections
import importlib.util
import json
import pathlib
import re
import subprocess
import sys

REPO = pathlib.Path("/home/wlw/opencode/LiteLLM-Chinese")
MESSAGES = REPO / "ui/litellm-dashboard/src/messages"
ERROR = re.compile(
    r"error TS(?:2322|2345|2739): (?:Type|Argument of type) '([^']+)' is not assignable to (?:parameter of )?type "
    r"'NamespacedMessageKeys<.*\"([\w.]+)\">"
)
LITERAL = re.compile(r"\"([A-Za-z0-9_.]+)\"")

_spec = importlib.util.spec_from_file_location("catalog_key", REPO / "scripts" / "catalog-key.py")
_catalog = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_catalog)


def flat(obj: object, prefix: str = "") -> dict[str, object]:
    out: dict[str, object] = {}
    for key, value in obj.items():  # type: ignore[attr-defined]
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            out.update(flat(value, path))
        else:
            out[path] = value
    return out


def main() -> int:
    commit = sys.argv[1]
    report = pathlib.Path(sys.argv[2])

    def read_old(name: str) -> dict[str, object]:
        raw = subprocess.run(
            ["git", "show", f"{commit}:ui/litellm-dashboard/src/messages/{name}"],
            cwd=REPO,
            capture_output=True,
            text=True,
            check=True,
        ).stdout
        return flat(json.loads(raw))

    old_en = read_old("en.json")
    old_zh = read_old("zh-CN.json")

    wanted: set[tuple[str, str]] = set()
    for line in report.read_text(encoding="utf-8").splitlines():
        match = ERROR.search(line)
        if not match:
            continue
        namespace = match.group(2)
        for key in LITERAL.findall(match.group(1)):
            wanted.add((namespace, key))

    en_path = MESSAGES / "en.json"
    zh_path = MESSAGES / "zh-CN.json"
    en_flat = flat(json.loads(en_path.read_text(encoding="utf-8")))
    zh_flat = flat(json.loads(zh_path.read_text(encoding="utf-8")))

    restored = 0
    for namespace, key in sorted(wanted):
        if f"{namespace}.{key}" in en_flat:
            continue
        source = next(
            (path for path in old_en if path.split(".")[-1] == key.split(".")[-1] and path in old_zh),
            None,
        )
        if source is None:
            print(f"  no source for {namespace}.{key}")
            continue
        en_value = json.dumps(old_en[source], ensure_ascii=False)
        zh_value = json.dumps(old_zh.get(source, old_en[source]), ensure_ascii=False)
        _catalog.set_key(en_path, f"{namespace}.{key}", en_value)
        _catalog.set_key(zh_path, f"{namespace}.{key}", zh_value)
        restored += 1
        print(f"  {namespace}.{key} <- {source}")
    print(f"restored {restored} keys")
    return 0


if __name__ == "__main__":
    sys.exit(main())
