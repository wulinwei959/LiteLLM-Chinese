"""Point each file's translator hook at the namespace its keys live in.

The upstream sync rebuilt translated files against upstream's newer structure,
and some files carry more than one namespace. The rebuild picked the first
`useTranslations` call it found, which is not always the namespace the file's
`t(...)` calls belong to. This looks at every key the file asks for, finds the
namespace that holds them, and rewrites the hook.

Usage: python3 scripts/fix-translator-namespace.py <tsc output file>
"""

from __future__ import annotations

import collections
import json
import pathlib
import re
import sys

REPO = pathlib.Path("/home/wlw/opencode/LiteLLM-Chinese")
MESSAGES = REPO / "ui/litellm-dashboard/src/messages"
ERROR = re.compile(
    r"^(.*?)\(\d+,\d+\): error TS2345: Argument of type '\"([^\"]+)\"' is not assignable to parameter of type "
    r"'NamespacedMessageKeys<.*,\s*\"([^\"]+)\">"
)
HOOK = re.compile(r"const t = useTranslations\(\"([^\"]+)\"\)")


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
    report = pathlib.Path(sys.argv[1])
    catalog = flat(json.loads((MESSAGES / "en.json").read_text(encoding="utf-8")))
    namespaces = {path.split(".")[0] for path in catalog}

    wanted: dict[str, set[str]] = collections.defaultdict(set)
    for line in report.read_text(encoding="utf-8").splitlines():
        match = ERROR.search(line)
        if match:
            wanted[match.group(1)].add(match.group(2))

    for path, keys in wanted.items():
        target = REPO / "ui/litellm-dashboard" / path
        if not target.exists():
            continue
        content = target.read_text(encoding="utf-8")
        hook = HOOK.search(content)
        if not hook:
            continue
        current = hook.group(1)
        if all(f"{current}.{key}" in catalog for key in keys):
            continue
        options = [
            namespace
            for namespace in sorted(namespaces)
            if sum(1 for key in keys if f"{namespace}.{key}" in catalog) > 0
        ]
        if not options:
            continue
        best = max(options, key=lambda namespace: sum(1 for key in keys if f"{namespace}.{key}" in catalog))
        content = content[: hook.start()] + f'const t = useTranslations("{best}")' + content[hook.end() :]
        target.write_text(content, encoding="utf-8")
        print(f"{path}: hook {current} -> {best}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
