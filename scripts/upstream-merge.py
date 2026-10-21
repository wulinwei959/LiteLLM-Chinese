"""Three-way merge of the upstream tree onto this fork.

The fork has no common ancestor with upstream: it imported an upstream snapshot
as a squashed commit and diverged from there. A plain `git merge` would try to
reconcile two unrelated histories. This walks the two trees instead and merges
file by file, with the right base per path:

- dashboard: the base is the snapshot the fork imported, because the fork's
  dashboard source is that snapshot plus this project's translations. The base
  must be the fork's own pre-translation state, not an older upstream commit:
  using an older one makes upstream's own evolution look like the fork's
  edits, and the merge interleaves two eras of the same file.
- everything else: the base is the upstream release the fork's Python side
  already matches byte for byte, so a merge there is upstream's version plus
  the fork's own edits.

Upstream also moves files around, so a path the fork changed and upstream
renamed is merged under its new name, carrying the fork's edits along.

Paths only one side has are taken from that side. Paths both sides changed are
merged with `git merge-file`; the ones it cannot decide are left out of the
index and reported, so they can be resolved by hand.

Usage:
    python3 scripts/upstream-merge.py --paths ui/litellm-dashboard/ [--apply]
"""

from __future__ import annotations

import argparse
import pathlib
import subprocess
import sys
import tempfile

REPO = pathlib.Path(__file__).resolve().parent.parent
DASHBOARD = "ui/litellm-dashboard/"


def git(*args: str, check: bool = True, stdin: bytes | None = None) -> subprocess.CompletedProcess:
    return subprocess.run([*args], cwd=REPO, capture_output=True, check=check, input=stdin)


def tree(ref: str) -> dict[str, str]:
    """path -> blob id for every file in a ref."""
    out: dict[str, str] = {}
    for line in git("git", "ls-tree", "-r", ref).stdout.decode().splitlines():
        meta, path = line.split("\t", 1)
        _mode, kind, blob = meta.split()
        if kind == "blob":
            out[path] = blob
    return out


def show(ref: str, path: str) -> bytes:
    return git("git", "show", f"{ref}:{path}").stdout


def renames(base: str, theirs: str, prefixes: tuple[str, ...]) -> dict[str, str]:
    """old path -> new path for the files upstream moved."""
    args = ["git", "diff", "-M", "--name-status", base, theirs]
    if prefixes:
        args += ["--", *prefixes]
    mapping: dict[str, str] = {}
    for line in git(*args).stdout.decode().splitlines():
        parts = line.split("\t")
        if parts[0].startswith("R"):
            mapping[parts[1]] = parts[2]
    return mapping


def merge_file(base: bytes, ours: bytes, theirs: bytes) -> tuple[bytes, bool]:
    with tempfile.TemporaryDirectory() as tmp:
        root = pathlib.Path(tmp)
        base_path, ours_path, theirs_path = root / "base", root / "ours", root / "theirs"
        base_path.write_bytes(base)
        ours_path.write_bytes(ours)
        theirs_path.write_bytes(theirs)
        result = subprocess.run(
            ["git", "merge-file", "-p", "--ours", str(ours_path), str(base_path), str(theirs_path)],
            capture_output=True,
        )
        return result.stdout, result.returncode != 0


def hash_object(content: bytes) -> str:
    return git("git", "hash-object", "-w", "--stdin", stdin=content).stdout.decode().strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ours", default="HEAD")
    parser.add_argument("--theirs", default="upstream/main")
    parser.add_argument("--dashboard-base", default="v1.105.0")
    parser.add_argument("--rest-base", default="v1.105.0")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--paths", default="", help="comma separated path prefixes to limit the merge")
    parser.add_argument("--exclude-paths", default="", help="comma separated path prefixes to skip")
    parser.add_argument(
        "--keep",
        default="",
        help="comma separated path prefixes to keep this fork's version of when upstream removed them",
    )
    args = parser.parse_args()

    ours_tree = tree(args.ours)
    theirs_tree = tree(args.theirs)
    dashboard_base = tree(args.dashboard_base)
    rest_base = tree(args.rest_base)

    prefixes = tuple(p for p in args.paths.split(",") if p)
    excluded = tuple(p for p in args.exclude_paths.split(",") if p)
    kept = tuple(p for p in args.keep.split(",") if p)
    in_scope = lambda path: (  # noqa: E731
        (not prefixes or path.startswith(prefixes))
        and not any(path.startswith(prefix) for prefix in excluded)
    )

    moved = renames(args.dashboard_base, args.theirs, prefixes or DASHBOARD)
    moved.update(renames(args.rest_base, args.theirs, prefixes))

    stats = {"same": 0, "theirs": 0, "added": 0, "deleted": 0, "merged": 0, "conflict": 0, "moved": 0}
    conflicts: list[str] = []
    dropped: list[str] = []
    removed_with_changes: list[str] = []
    planned: list[tuple[str, str]] = []

    def base_tree_for(path: str) -> dict[str, str]:
        return dashboard_base if path.startswith(DASHBOARD) else rest_base

    def base_ref_for(path: str) -> str:
        return args.dashboard_base if path.startswith(DASHBOARD) else args.rest_base

    for path in sorted(set(ours_tree) | set(theirs_tree)):
        if not in_scope(path):
            continue
        ours = ours_tree.get(path)
        theirs = theirs_tree.get(path)
        base = base_tree_for(path).get(path)

        if ours == theirs:
            stats["same"] += 1
            if ours:
                planned.append((path, ours))
            continue

        if ours is None:
            stats["added"] += 1
            if theirs:
                planned.append((path, theirs))
            continue

        if theirs is None:
            new_path = moved.get(path)
            if new_path and new_path in theirs_tree:
                ours_bytes = show(args.ours, path)
                theirs_bytes = show(args.theirs, new_path)
                if b"\x00" in ours_bytes or b"\x00" in theirs_bytes:
                    stats["moved"] += 1
                    planned.append((new_path, theirs_tree[new_path]))
                    dropped.append(path)
                    continue
                content, conflicted = merge_file(
                    show(base_ref_for(path), path) if base else b"", ours_bytes, theirs_bytes
                )
                if conflicted:
                    stats["conflict"] += 1
                    conflicts.append(f"{path} -> {new_path}")
                else:
                    stats["moved"] += 1
                    planned.append((new_path, hash_object(content)))
                dropped.append(path)
                continue
            if base is None or any(path.startswith(prefix) for prefix in kept):
                planned.append((path, ours))
                continue
            stats["deleted"] += 1
            if ours != base:
                removed_with_changes.append(path)
            dropped.append(path)
            continue

        if ours == base:
            stats["theirs"] += 1
            planned.append((path, theirs))
            continue

        content, conflicted = merge_file(
            show(base_ref_for(path), path) if base else b"", show(args.ours, path), show(args.theirs, path)
        )
        if conflicted:
            stats["conflict"] += 1
            conflicts.append(path)
            continue
        stats["merged"] += 1
        planned.append((path, hash_object(content)))

    print(
        "same {same} | took-theirs {theirs} | merged {merged} | moved {moved} | added {added} | "
        "deleted-upstream {deleted} | conflicts {conflict}".format(**stats)
    )
    for path in removed_with_changes[:40]:
        print("  removed-upstream-but-changed", path)
    if len(removed_with_changes) > 40:
        print(f"  ... and {len(removed_with_changes) - 40} more")
    for path in conflicts[:60]:
        print("  conflict", path)
    if len(conflicts) > 60:
        print(f"  ... and {len(conflicts) - 60} more")

    if args.apply:
        for path, blob_id in planned:
            git("git", "update-index", "--add", "--cacheinfo", f"100644,{blob_id},{path}")
        for path in conflicts:
            git("git", "update-index", "--force-remove", path)
        for path in dropped:
            git("git", "update-index", "--force-remove", path)
        print(
            f"index updated with {len(planned)} paths; {len(conflicts)} conflicts "
            f"and {len(dropped)} upstream deletions left out"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
