"""Apply a batch of translations to a dashboard source file and the catalogs.

Translating a component means three edits that have to agree: the source
calls a translator, the English catalog carries the source string, and the
Chinese catalog carries the translation. Doing that by hand across dozens of
files is where mistakes creep in, so this module keeps the three in step and
refuses to write a file whose replacements did not all match.

Usage from a driver script:

    from i18n_apply import apply_batch, Replacement

    apply_batch(
        path="ui/litellm-dashboard/src/app/.../Foo.tsx",
        namespace="playground",
        translator_type="PlaygroundTranslator",
        hooks=["Foo", "Bar"],
        replacements=[
            Replacement(find='placeholder="Name"', replace='placeholder={t("settings.name")}',
                        key="settings.name", en="Name", zh="名称"),
        ],
    )
"""

from __future__ import annotations

import importlib.util
import pathlib
import subprocess
import sys
from dataclasses import dataclass

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent
DASHBOARD = REPO_ROOT / "ui" / "litellm-dashboard"
CATALOGS = (
    DASHBOARD / "src" / "messages" / "en.json",
    DASHBOARD / "src" / "messages" / "zh-CN.json",
)


def _load_catalog_set():
    spec = importlib.util.spec_from_file_location("catalog_set", REPO_ROOT / "scripts" / "catalog-set.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


catalog_set = _load_catalog_set()


@dataclass(frozen=True)
class Replacement:
    find: str
    replace: str
    key: str
    en: str
    zh: str
    more: tuple[tuple[str, str, str], ...] = ()
    """Extra catalog entries the replacement text refers to but does not itself name."""


def apply_batch(
    path: str,
    namespace: str,
    replacements: list[Replacement],
    hooks: list[str] | None = None,
    translator_type: str | None = None,
) -> None:
    source = pathlib.Path(REPO_ROOT / path)
    content = source.read_text(encoding="utf-8")

    for item in replacements:
        count = content.count(item.find)
        if count == 0:
            raise SystemExit(f"{path}: 未命中 {item.find!r}")
        content = content.replace(item.find, item.replace)

    source.write_text(content, encoding="utf-8")

    for catalog, value in ((CATALOGS[0], "en"), (CATALOGS[1], "zh")):
        for item in replacements:
            if not item.key:
                continue
            catalog_set.set_key(catalog, f"{namespace}.{item.key}", item.zh if value == "zh" else item.en)
            for key, en, zh in item.more:
                catalog_set.set_key(catalog, f"{namespace}.{key}", zh if value == "zh" else en)

    if hooks:
        script = DASHBOARD / "scripts" / "add-i18n-hooks.mjs"
        result = subprocess.run(
            ["node", str(script), str(source.relative_to(DASHBOARD)), namespace, *hooks],
            cwd=DASHBOARD,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            raise SystemExit(f"{path}: 加 hook 失败 {result.stderr.strip()}")

    if translator_type:
        content = source.read_text(encoding="utf-8")
        if f"import type {{ {translator_type} }}" not in content:
            anchor = 'import { useTranslations } from "next-intl";'
            if anchor not in content:
                raise SystemExit(f"{path}: 找不到 useTranslations 的 import")
            content = content.replace(
                anchor,
                f'{anchor}\n\nimport type {{ {translator_type} }} from "@/lib/i18n/translators";',
                1,
            )
            source.write_text(content, encoding="utf-8")


def main() -> int:
    print(__doc__)
    return 0


if __name__ == "__main__":
    sys.exit(main())
