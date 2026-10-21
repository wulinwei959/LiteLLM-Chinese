"""Extract the fork's translation edits as a replacement list.

The upstream sync produced files where the fork's translated copy was merged
into upstream's newer structure. For each such file this reads the diff between
upstream and the working tree and pairs the removed English string with the
replacement that replaced it, so the pairs can be applied to upstream's version
of the file.

Only hunks that remove and add the same number of lines are paired, which
keeps a restructured hunk from producing nonsense pairs.

Usage: python3 scripts/extract-i18n-pairs.py <path> [<path> ...]
"""

from __future__ import annotations

import json
import subprocess
import sys

REPO = "/home/wlw/opencode/LiteLLM-Chinese"


def hunks(path: str) -> list[tuple[list[str], list[str]]]:
    diff = subprocess.run(
        ["git", "diff", "upstream/main", "--", path], cwd=REPO, capture_output=True, text=True
    ).stdout
    removed: list[str] = []
    added: list[str] = []
    out: list[tuple[list[str], list[str]]] = []
    for line in diff.split("\n"):
        if line.startswith("---") or line.startswith("+++"):
            continue
        if line.startswith("-"):
            removed.append(line[1:].strip())
        elif line.startswith("+"):
            added.append(line[1:].strip())
        elif line.startswith("@@"):
            out.append((removed, added))
            removed, added = [], []
    out.append((removed, added))
    return out


def pairs_for(path: str) -> list[list[str]]:
    pairs: list[list[str]] = []
    for removed, added in hunks(path):
        if len(removed) != len(added):
            continue
        for old, new in zip(removed, added):
            if old == new or "t(" not in new:
                continue
            if len(old) > 220 or len(new) > 220:
                continue
            pairs.append([old, new])
    return pairs


def main() -> int:
    result: dict[str, list[list[str]]] = {}
    for path in sys.argv[1:]:
        pairs = pairs_for(path)
        if pairs:
            result[path] = pairs
    print(json.dumps(result, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
