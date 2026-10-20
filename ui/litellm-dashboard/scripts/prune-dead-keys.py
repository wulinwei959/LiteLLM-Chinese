"""Remove dead message-catalog keys from en.json and zh-CN.json.

The catalogs are edited line by line rather than re-serialized, because the
committed files carry hand-tuned indentation that a JSON round trip would
rewrite wholesale and bury the real change in noise.

Only leaves are supported: a key whose value is an object is skipped, since
deleting it would take its whole subtree with it.
"""

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def flat(obj, prefix=""):
    out = {}
    for key, value in obj.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            out.update(flat(value, path))
        else:
            out[path] = value
    return out


def leaf_line_index(lines: list[str]) -> dict[str, int]:
    """Map every leaf key path to the line that holds it.

    The key stack is rebuilt from the file's own braces, so the same key in
    two namespaces stays distinct.
    """
    stack: list[str] = []
    index_by_key: dict[str, int] = {}
    for index, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('"') and ":" in stripped:
            key = stripped.split('"')[1]
            candidate = ".".join([*stack, key])
            if stripped.rstrip().endswith("{"):
                stack.append(key)
                continue
            index_by_key.setdefault(candidate, index)
            continue
        if stripped.startswith("}") and stack:
            stack.pop()
    return index_by_key


def strip_trailing_commas(lines: list[str]) -> list[str]:
    """Drop the comma of any member that is now the last one in its object."""
    out = list(lines)
    for index, line in enumerate(out):
        if not line.rstrip().endswith(","):
            continue
        # Find the next line that is not blank and not a comment.
        follower = index + 1
        while follower < len(out) and not out[follower].strip():
            follower += 1
        if follower < len(out) and out[follower].strip().startswith("}"):
            out[index] = line.rstrip().rstrip(",") + "\n"
    return out


def remove_lines(path: pathlib.Path, dead: set[str]) -> int:
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    catalog = json.load(open(path, encoding="utf-8"))
    known = set(flat(catalog))
    unknown = dead - known
    if unknown:
        raise SystemExit(f"{path.name}: unknown keys {sorted(unknown)}")

    index_by_key = leaf_line_index(lines)
    drop: set[int] = set()
    for key in dead:
        if key not in index_by_key:
            raise SystemExit(f"{path.name}: {key} is not a leaf line")
        drop.add(index_by_key[key])

    kept = [line for index, line in enumerate(lines) if index not in drop]
    path.write_text("".join(strip_trailing_commas(kept)), encoding="utf-8")
    return len(drop)


def main() -> None:
    targets = sys.argv[1:]
    if not targets:
        raise SystemExit("usage: prune-dead-keys.py <key> [key ...]")
    dead = set(targets)
    for name in ("en.json", "zh-CN.json"):
        path = ROOT / "src/messages" / name
        removed = remove_lines(path, dead)
        catalog = json.load(open(path, encoding="utf-8"))
        print(f"{name}: removed {removed} keys, {len(flat(catalog))} left")


if __name__ == "__main__":
    main()
