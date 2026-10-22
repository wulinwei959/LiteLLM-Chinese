"""Add or replace a key in a message catalog without reformatting the file.

The catalogs are hand-maintained text: a JSON round trip would rewrite the
whole file and bury the real change in noise. This edits the file as text,
creating intermediate namespaces when they are missing.

Usage:
    python3 scripts/catalog-key.py <catalog> <namespace.path> <key> <value>
    python3 scripts/catalog-key.py <catalog> <namespace.path> <key> --remove
"""

from __future__ import annotations

import pathlib
import sys


def indent_of(line: str) -> int:
    return len(line) - len(line.lstrip())


def namespace_end(lines: list[str], start: int) -> int:
    """Index of the line that closes the object opened at start."""
    indent = indent_of(lines[start])
    for index in range(start + 1, len(lines)):
        stripped = lines[index].strip()
        if stripped in ("}", "},") and indent_of(lines[index]) == indent:
            return index
    raise KeyError("unclosed object")


def find_namespace(lines: list[str], path: list[str]) -> tuple[int, int]:
    """(open, close) line indexes of the object at path."""
    index = 0
    for name in path:
        while index < len(lines) and lines[index].strip() != f'"{name}": {{':
            index += 1
        if index >= len(lines):
            raise KeyError(name)
        index = namespace_end(lines, index)
    return index, namespace_end(lines, index)


def set_key(path: pathlib.Path, dotted: str, value: str) -> None:
    parts = dotted.split(".")
    key = parts[-1]
    namespace = parts[:-1]
    lines = path.read_text(encoding="utf-8").split("\n")

    try:
        open_at, close_at = find_namespace(lines, namespace)
    except KeyError:
        # Create the nested namespaces at the end of the root object.
        root_close = namespace_end(lines, 0)
        indent = 2
        block = []
        for depth, name in enumerate(namespace):
            block.append(" " * (indent + 2 * depth) + f'"{name}": {{')
        block.append(" " * (indent + 2 * len(namespace)) + f'"{key}": {value}')
        for depth in range(len(namespace) - 1, -1, -1):
            block.append(" " * (indent + 2 * depth) + "},")
        lines[root_close:root_close] = block
        path.write_text("\n".join(lines), encoding="utf-8")
        print(f"{path}: created {'.'.join(namespace)} with {key}")
        return

    indent = " " * (indent_of(lines[open_at]) + 2)
    existing = [index for index in range(open_at + 1, close_at) if lines[index].strip().startswith(f'"{key}"')]
    if existing:
        index = existing[0]
        lines[index] = f'{indent}"{key}": {value},'
        if index + 1 >= close_at:
            lines[index] = f'{indent}"{key}": {value}'
    else:
        last = close_at - 1
        while last > open_at and not lines[last].strip():
            last -= 1
        if not lines[last].rstrip().endswith(","):
            lines[last] = lines[last].rstrip() + ","
        lines.insert(last + 1, f'{indent}"{key}": {value}')
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"{path}: set {key}")


def remove_key(path: pathlib.Path, dotted: str) -> None:
    parts = dotted.split(".")
    key = parts[-1]
    namespace = parts[:-1]
    lines = path.read_text(encoding="utf-8").split("\n")
    open_at, close_at = find_namespace(lines, namespace)
    existing = [index for index in range(open_at + 1, close_at) if lines[index].strip().startswith(f'"{key}"')]
    if not existing:
        print(f"{path}: {key} not found")
        return
    del lines[existing[0]]
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"{path}: removed {key}")


def main() -> int:
    if len(sys.argv) < 5:
        print(__doc__)
        return 2
    catalog = pathlib.Path(sys.argv[1])
    dotted = f"{sys.argv[2]}.{sys.argv[3]}" if sys.argv[2] else sys.argv[3]
    if sys.argv[4] == "--remove":
        remove_key(catalog, dotted)
        return 0
    set_key(catalog, dotted, sys.argv[4])
    return 0


if __name__ == "__main__":
    sys.exit(main())
