"""Restore catalog keys that the upstream sync stranded in the wrong namespace.

The sync rebuilt translated files against upstream's newer structure, and some
of the keys those files call live in a different namespace than the one the
file's translator is bound to. This copies the value from wherever the key
still lives in the previous catalog into the namespace the code asks for.

The catalogs are edited as text, so the diff stays limited to the keys that
actually moved.

Usage: python3 scripts/restore-catalog-keys.py <old commit> [tsc output file]
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
    r"error TS2345: Argument of type '\"([^\"]+)\"' is not assignable to parameter of type 'NamespacedMessageKeys<.*,\s*\"([^\"]+)\">"
)

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
    old_commit = sys.argv[1]
    report = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else None

    def read_old(name: str) -> dict[str, object]:
        raw = subprocess.run(
            ["git", "show", f"{old_commit}:ui/litellm-dashboard/src/messages/{name}"],
            cwd=REPO,
            capture_output=True,
            text=True,
            check=True,
        ).stdout
        return flat(json.loads(raw))

    old_en = read_old("en.json")
    old_zh = read_old("zh-CN.json")
    by_suffix: dict[str, list[str]] = collections.defaultdict(list)
    for key in old_en:
        by_suffix[key.split(".")[-1]].append(key)

    wanted: list[tuple[str, str]] = []
    if report and report.exists():
        for line in report.read_text(encoding="utf-8").splitlines():
            match = ERROR.search(line)
            if match:
                wanted.append((match.group(2), match.group(1)))

    en_path = MESSAGES / "en.json"
    zh_path = MESSAGES / "zh-CN.json"
    en_flat = flat(json.loads(en_path.read_text(encoding="utf-8")))
    zh_flat = flat(json.loads(zh_path.read_text(encoding="utf-8")))

    restored = 0
    for namespace, key in wanted:
        target = f"{namespace}.{key}"
        if target in en_flat:
            continue
        candidates = by_suffix.get(key.split(".")[-1], [])
        source = next((candidate for candidate in candidates if candidate in en_flat), None)
        if source is None:
            print(f"  no source for {target}")
            continue
        en_value = json.dumps(en_flat[source], ensure_ascii=False)
        zh_value = json.dumps(zh_flat.get(source, en_flat[source]), ensure_ascii=False)
        _catalog.set_key(en_path, target, en_value)
        _catalog.set_key(zh_path, target, zh_value)
        restored += 1
        print(f"  {target} <- {source}")

    print(f"restored {restored} keys")
    return 0


if __name__ == "__main__":
    sys.exit(main())
