"""Add or remove a key in a message catalog without disturbing the file's layout.

The catalogs are edited as text so the diff stays small. This finds the object
that holds the key by indentation, adds the new entry after the last one, and
keeps the commas right.

Usage:
    python3 scripts/catalog-key.py <catalog> <namespace.path> <key> <value>
    python3 scripts/catalog-key.py <catalog> <namespace.path> <key> --remove
"""

from __future__ import annotations

import pathlib
import sys


def find_object(lines: list[str], path: list[str]) -> tuple[int, int]:
    """Line range of the object at the given path, as (first, last) indexes."""
    index = 0
    for name in path:
        while index < len(lines) and lines[index].strip() != f'"{name}": {{':
            index += 1
        if index >= len(lines):
            raise SystemExit(f"namespace {'.'.join(path)} not found")
        indent = len(lines[index]) - len(lines[index].lstrip())
        closing = index + 1
        while closing < len(lines):
            stripped = lines[closing].strip()
            if stripped in ("}", "},") and len(lines[closing]) - len(lines[closing].lstrip()) == indent:
                break
            closing += 1
        else:
            raise SystemExit(f"namespace {'.'.join(path)} not closed")
        index += 1
    return index - 1, closing


def main() -> int:
    catalog = pathlib.Path(sys.argv[1])
    path = sys.argv[2].split(".")
    key = sys.argv[3]
    value = None if sys.argv[4] == "--remove" else sys.argv[4]

    lines = catalog.read_text(encoding="utf-8").split("\n")
    start, end = find_object(lines, path)
    indent = " " * (len(lines[start]) - len(lines[start].lstrip()) + 2)

    existing = [index for index in range(start + 1, end) if lines[index].strip().startswith(f'"{key}"')]
    if value is None:
        if not existing:
            print(f"{catalog}: {key} not found")
            return 1
        del lines[existing[0]]
        catalog.write_text("\n".join(lines), encoding="utf-8")
        print(f"{catalog}: removed {key}")
        return 0

    if existing:
        lines[existing[0]] = f'{indent}"{key}": {value},'
        catalog.write_text("\n".join(lines), encoding="utf-8")
        print(f"{catalog}: replaced {key}")
        return 0

    last = end - 1
    while last > start and not lines[last].strip():
        last -= 1
    if not lines[last].rstrip().endswith(","):
        lines[last] = lines[last].rstrip() + ","
    lines.insert(last + 1, f'{indent}"{key}": {value}')
    catalog.write_text("\n".join(lines), encoding="utf-8")
    print(f"{catalog}: added {key}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
