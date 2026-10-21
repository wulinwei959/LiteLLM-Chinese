"""Restore import lines the upstream sync dropped from a file.

Rebuilding a translated file from upstream's version can lose an import when the
import block itself changed. This finds the names the file uses but does not
import, looks them up in upstream's version of the same file, and puts the
matching import statement back.

Usage: python3 scripts/restore-imports.py <tsc output file>
"""

from __future__ import annotations

import collections
import pathlib
import re
import subprocess
import sys

REPO = pathlib.Path("/home/wlw/opencode/LiteLLM-Chinese")
ROOT = REPO / "ui/litellm-dashboard"
ERROR = re.compile(r"^(.*?)\(\d+,\d+\): error TS2304: Cannot find name '([^']+)'")


def statements(text: str) -> list[str]:
    """Every top-level import statement in the file."""
    out: list[str] = []
    lines = text.split("\n")
    index = 0
    while index < len(lines):
        line = lines[index]
        if not line.startswith("import "):
            index += 1
            continue
        block = [line]
        while not block[-1].rstrip().endswith(";") and index + 1 < len(lines):
            index += 1
            block.append(lines[index])
        out.append("\n".join(block))
        index += 1
    return out


def names_of(statement: str) -> set[str]:
    names: set[str] = set()
    for block in re.findall(r"\{([^}]*)\}", statement, re.S):
        for part in block.split(","):
            name = part.strip().split(" as ")[-1].strip().lstrip("type ").strip()
            if name:
                names.add(name)
    match = re.search(r"^import\s+(?:type\s+)?([A-Za-z_]\w*)\s*(?:,|from)", statement)
    if match:
        names.add(match.group(1))
    return names


def main() -> int:
    report = pathlib.Path(sys.argv[1])
    wanted: dict[str, set[str]] = collections.defaultdict(set)
    for line in report.read_text(encoding="utf-8").splitlines():
        match = ERROR.search(line)
        if match:
            wanted[match.group(1)].add(match.group(2))

    for path, names in wanted.items():
        target = ROOT / path
        if not target.exists():
            continue
        content = target.read_text(encoding="utf-8")
        have = names_of(content)
        missing = {name for name in names if name not in have}
        if not missing:
            continue
        upstream = subprocess.run(
            ["git", "show", f"upstream/main:ui/litellm-dashboard/{path}"],
            cwd=REPO,
            capture_output=True,
            text=True,
        ).stdout
        if not upstream:
            continue
        picked: list[str] = []
        for statement in statements(upstream):
            provided = names_of(statement)
            if provided & missing and not (provided & have):
                picked.append(statement)
                missing -= provided
        if not picked:
            continue
        anchor = re.search(r"^import .*\n", content, re.M)
        insertion = "\n".join(picked) + "\n"
        content = content[: anchor.end()] + insertion + content[anchor.end() :]
        target.write_text(content, encoding="utf-8")
        print(f"{path}: restored {len(picked)} imports")
    return 0


if __name__ == "__main__":
    sys.exit(main())
