"""Rebuild a file from upstream's version with the fork's translations applied.

After the upstream sync, files that the fork had translated were merged with
upstream's newer structure, and the result is a mix of two eras. This takes
upstream's version of a file and puts the fork's translations back into it, by
applying the replacement pairs that `extract-i18n-pairs.py` reads from the diff.

Every function that ends up calling the translator gets its own hook, since a
file can hold several, and a hook belongs to the function that uses it.

Usage: python3 scripts/rebuild-i18n.py <path> <namespace>
"""

from __future__ import annotations

import importlib.util
import pathlib
import re
import subprocess
import sys

REPO = pathlib.Path("/home/wlw/opencode/LiteLLM-Chinese")
sys.path.insert(0, str(REPO / "scripts"))

_spec = importlib.util.spec_from_file_location("extract_i18n_pairs", REPO / "scripts" / "extract-i18n-pairs.py")
_module = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_module)
pairs_for = _module.pairs_for

CALL = re.compile(r"\bt\(\"")


def _match(content: str, start: int, open_char: str, close_char: str) -> int:
    depth = 0
    for index in range(start, len(content)):
        char = content[index]
        if char == open_char:
            depth += 1
        elif char == close_char:
            depth -= 1
            if depth == 0:
                return index
    return -1


def blocks(content: str) -> list[tuple[int, int]]:
    """(body start, body end) of every function-like block in the file."""
    out: list[tuple[int, int]] = []
    seen: set[int] = set()

    for match in re.finditer(r"\bfunction\b", content):
        paren = content.find("(", match.end())
        if paren == -1:
            continue
        close = _match(content, paren, "(", ")")
        if close == -1:
            continue
        brace = content.find("{", close)
        if brace == -1:
            continue
        if brace in seen:
            continue
        seen.add(brace)
        end = _match(content, brace, "{", "}")
        if end != -1:
            out.append((brace + 1, end))

    for match in re.finditer(r"=>\s*\{", content):
        brace = match.end() - 1
        if brace in seen:
            continue
        seen.add(brace)
        end = _match(content, brace, "{", "}")
        if end != -1:
            out.append((brace + 1, end))

    return out


def add_hooks(content: str, namespace: str) -> str:
    """Give every function that calls the translator its own hook."""
    hook = f'  const t = useTranslations("{namespace}");'
    for _ in range(60):
        found = blocks(content)
        calls = [match.start() for match in CALL.finditer(content)]
        target = None
        for call in calls:
            enclosing = [block for block in found if block[0] < call < block[1]]
            if not enclosing:
                continue
            start, end = min(enclosing, key=lambda block: block[1] - block[0])
            inner = [block for block in found if start < block[0] < end]
            scope_end = min((block[0] for block in inner), default=end)
            if "useTranslations" not in content[start:scope_end]:
                target = start
                break
        if target is None:
            return content
        content = content[:target] + "\n" + hook + content[target:]
    return content


def main() -> int:
    path = sys.argv[1]
    namespace = sys.argv[2]
    relative = path if path.startswith("ui/") else f"ui/litellm-dashboard/{path}"
    pairs = pairs_for(relative)
    if not pairs:
        print(f"{path}: no translation pairs found")
        return 1

    upstream = subprocess.run(
        ["git", "show", f"upstream/main:{relative}"], cwd=REPO, capture_output=True, check=True
    ).stdout.decode("utf-8")

    missing: list[str] = []
    for old, new in pairs:
        if upstream.count(old) != 1:
            missing.append(old[:70])
            continue
        upstream = upstream.replace(old, new)

    if 'from "next-intl"' not in upstream:
        match = re.search(r"^import .*\n", upstream, re.M)
        if match:
            upstream = upstream[: match.end()] + 'import { useTranslations } from "next-intl";\n' + upstream[match.end() :]

    upstream = add_hooks(upstream, namespace)
    (REPO / relative).write_text(upstream, encoding="utf-8")
    print(f"{path}: applied {len(pairs) - len(missing)}/{len(pairs)}")
    for old in missing:
        print("   NOT FOUND:", old)
    return 0


if __name__ == "__main__":
    sys.exit(main())
