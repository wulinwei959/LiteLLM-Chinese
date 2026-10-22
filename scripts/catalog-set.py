"""Set or remove keys in a message catalog while keeping the file's own style.

The catalogs are hand-maintained and their formatting is not what a plain
``json.dumps`` produces: some arrays of strings sit on one line, others do not,
and a round trip through the standard encoder would rewrite them. This parses
the file while recording where every value starts and ends, then writes the
file back so that untouched parts keep their original text byte for byte. Only
the part that actually changed is re-rendered.

Usage:
    python3 scripts/catalog-set.py <catalog> <key.path> <json value>
    python3 scripts/catalog-set.py <catalog> <key.path> --remove
    python3 scripts/catalog-set.py <catalog> --list <key.path prefix>
"""

from __future__ import annotations

import json
import pathlib
import sys
from typing import Any, NamedTuple


class Node(NamedTuple):
    kind: str
    value: Any
    start: int
    end: int
    members: list[tuple[str, "Node"]]
    items: list["Node"]


class Parser:
    def __init__(self, text: str) -> None:
        self.text = text
        self.pos = 0

    def parse(self) -> Node:
        self.skip_space()
        node = self.parse_value()
        return node

    def skip_space(self) -> None:
        while self.pos < len(self.text) and self.text[self.pos] in " \t\r\n":
            self.pos += 1

    def parse_value(self) -> Node:
        self.skip_space()
        char = self.text[self.pos]
        if char == "{":
            return self.parse_object()
        if char == "[":
            return self.parse_array()
        if char == '"':
            start = self.pos
            value = self.parse_string()
            return Node("scalar", value, start, self.pos, [], [])
        return self.parse_scalar()

    def parse_object(self) -> Node:
        start = self.pos
        self.pos += 1
        members: list[tuple[str, Node]] = []
        value: dict[str, Any] = {}
        self.skip_space()
        if self.text[self.pos] == "}":
            self.pos += 1
            return Node("obj", value, start, self.pos, members, [])
        while True:
            self.skip_space()
            key = self.parse_string()
            self.skip_space()
            self.pos += 1  # colon
            child = self.parse_value()
            members.append((key, child))
            value[key] = child.value
            self.skip_space()
            if self.text[self.pos] == ",":
                self.pos += 1
                continue
            self.pos += 1  # closing brace
            break
        return Node("obj", value, start, self.pos, members, [])

    def parse_array(self) -> Node:
        start = self.pos
        self.pos += 1
        items: list[Node] = []
        value: list[Any] = []
        self.skip_space()
        if self.text[self.pos] == "]":
            self.pos += 1
            return Node("arr", value, start, self.pos, [], [])
        while True:
            child = self.parse_value()
            items.append(child)
            value.append(child.value)
            self.skip_space()
            if self.text[self.pos] == ",":
                self.pos += 1
                continue
            self.pos += 1  # closing bracket
            break
        return Node("arr", value, start, self.pos, [], items)

    def parse_string(self) -> str:
        assert self.text[self.pos] == '"'
        end = self.pos + 1
        while self.text[end] != '"' or self.text[end - 1] == "\\":
            end += 1
        raw = self.text[self.pos : end + 1]
        self.pos = end + 1
        return json.loads(raw)

    def parse_scalar(self) -> Node:
        start = self.pos
        while self.text[self.pos] not in ",]}":
            self.pos += 1
        raw = self.text[start : self.pos].strip()
        return Node("scalar", json.loads(raw), start, self.pos, [], [])


def render_scalar(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


def render_array(values: list[Any], indent: int) -> str:
    if not values:
        return "[]"
    if all(isinstance(item, str) for item in values):
        return "[" + ", ".join(render_scalar(item) for item in values) + "]"
    pad = " " * (indent + 2)
    body = ",\n".join(
        f"{pad}{render_array([item], indent + 2) if isinstance(item, list) else render_value(item, indent + 2)}"
        for item in values
    )
    return "[\n" + body + f"\n{' ' * indent}]"


def render_value(value: Any, indent: int) -> str:
    if isinstance(value, dict):
        return render_object(value, indent)
    if isinstance(value, list):
        return render_array(value, indent)
    return render_scalar(value)


def render_object(value: dict[str, Any], indent: int) -> str:
    if not value:
        return "{}"
    pad = " " * (indent + 2)
    body = ",\n".join(
        f"{pad}{json.dumps(key, ensure_ascii=False)}: {render_value(item, indent + 2)}" for key, item in value.items()
    )
    return "{\n" + body + f"\n{' ' * indent}}}"


def write_node(node: Node | None, value: Any, text: str, indent: int) -> str:
    """Render value, keeping node's original text when the value is unchanged."""
    if node is not None and node.value == value and node.kind != "obj":
        return text[node.start : node.end]
    if isinstance(value, dict):
        if node is not None and node.kind == "obj":
            pad = " " * (indent + 2)
            parts = []
            rendered = {key: child for key, child in node.members}
            for key, child in node.members:
                if key not in value:
                    continue
                parts.append(
                    f"{pad}{json.dumps(key, ensure_ascii=False)}: {write_node(child, value[key], text, indent + 2)}"
                )
            for key, item in value.items():
                if key in rendered:
                    continue
                parts.append(f"{pad}{json.dumps(key, ensure_ascii=False)}: {render_value(item, indent + 2)}")
            if not parts:
                return "{}"
            return "{\n" + ",\n".join(parts) + f"\n{' ' * indent}}}"
        return render_object(value, indent)
    if isinstance(value, list):
        if node is not None and node.kind == "arr":
            pad = " " * (indent + 2)
            parts = []
            for index, child in enumerate(node.items):
                if index >= len(value):
                    break
                parts.append(f"{pad}{write_node(child, value[index], text, indent + 2)}")
            for item in value[len(node.items) :]:
                parts.append(f"{pad}{render_value(item, indent + 2)}")
            return "[\n" + ",\n".join(parts) + f"\n{' ' * indent}]"
        return render_array(value, indent)
    return render_scalar(value)


def get_path(tree: dict[str, Any], path: list[str]) -> Any:
    node: Any = tree
    for name in path:
        node = node[name]
    return node


def set_key(catalog: pathlib.Path, dotted: str, value: str) -> None:
    """Write a string value at dotted key path, keeping the file's own style."""
    text = catalog.read_text(encoding="utf-8")
    root = Parser(text).parse()
    tree: dict[str, Any] = root.value
    path = [part for part in dotted.split(".") if part]
    holder = tree
    for name in path[:-1]:
        child = holder.get(name)
        if child is not None and not isinstance(child, dict):
            raise SystemExit(f"{catalog}: {name} 已经是字符串，不能再往里加键")
        if not isinstance(child, dict):
            child = {}
            holder[name] = child
        holder = child
    holder[path[-1]] = value
    catalog.write_text(write_node(root, tree, text, 0) + "\n", encoding="utf-8")


def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    catalog = pathlib.Path(sys.argv[1])
    text = catalog.read_text(encoding="utf-8")
    root = Parser(text).parse()
    tree: dict[str, Any] = root.value

    if sys.argv[2] == "--list":
        prefix = [part for part in sys.argv[3].split(".") if part]
        node: Any = tree
        for name in prefix:
            node = node.get(name, {}) if isinstance(node, dict) else {}
        for key in sorted(node) if isinstance(node, dict) else []:
            print(key)
        return 0

    path = [part for part in sys.argv[2].split(".") if part]
    if sys.argv[3] == "--remove":
        holder = get_path(tree, path[:-1])
        if path[-1] not in holder:
            print(f"{catalog}: {sys.argv[2]} 不存在")
            return 1
        del holder[path[-1]]
    else:
        value = json.loads(sys.argv[3])
        holder = tree
        for name in path[:-1]:
            child = holder.get(name)
            if not isinstance(child, dict):
                child = {}
                holder[name] = child
            holder = child
        holder[path[-1]] = value

    catalog.write_text(write_node(root, tree, text, 0) + "\n", encoding="utf-8")
    action = "已删除" if sys.argv[3] == "--remove" else "已写入"
    print(f"{catalog}: {action} {sys.argv[2]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
