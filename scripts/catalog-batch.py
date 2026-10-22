"""Write a batch of catalog keys into the English and Chinese message catalogs.

Usage:
    python3 scripts/catalog-batch.py <namespace> <key> <en> <zh> [...]
    python3 scripts/catalog-batch.py --file <namespace> <json file>
"""

from __future__ import annotations

import importlib.util
import json
import pathlib
import sys

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOGS = {
    "en": REPO_ROOT / "ui" / "litellm-dashboard" / "src" / "messages" / "en.json",
    "zh": REPO_ROOT / "ui" / "litellm-dashboard" / "src" / "messages" / "zh-CN.json",
}


def load_catalog_set():
    spec = importlib.util.spec_from_file_location("catalog_set", REPO_ROOT / "scripts" / "catalog-set.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


catalog_set = load_catalog_set()


def write_keys(namespace: str, pairs: list[tuple[str, str, str]]) -> None:
    for key, en, zh in pairs:
        for locale, value in (("en", en), ("zh", zh)):
            catalog_set.set_key(CATALOGS[locale], f"{namespace}.{key}", value)


def main() -> int:
    if sys.argv[1] == "--file":
        namespace = sys.argv[2]
        pairs = [tuple(item) for item in json.loads(pathlib.Path(sys.argv[3]).read_text(encoding="utf-8"))]
    else:
        namespace = sys.argv[1]
        pairs = [tuple(sys.argv[index : index + 3]) for index in range(2, len(sys.argv), 3)]
    write_keys(namespace, pairs)
    print(f"{namespace}: 写入 {len(pairs)} 个键")
    return 0


if __name__ == "__main__":
    sys.exit(main())
