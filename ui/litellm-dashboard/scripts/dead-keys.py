"""List message-catalog keys that no source file references.

The scanner resolves a key against the namespace scope of the file that
references it, covering three call shapes:

- `useTranslations("ns")` in the same file
- a translator handed in as a prop (`t: SomeTranslator`), whose namespace
  comes from the wrapper in `src/lib/i18n/translators.ts`
- the `toastMessage` bridge, which reads the `toast` namespace

The vendor package (`vendor/lens-ui`) takes its translator from the host, so
its keys read as bare relative paths (`t("sidebar.lensNavigation")`) rather
than through a namespace scope. Those literals reach the verbatim rescue
below, which is why the scan covers the vendor tree too.

Keys reached through a table constant (`labelKey: "authType.tokenExchange"`)
cannot be attributed to a namespace by the scanner, so every key whose
relative path appears verbatim as a string literal anywhere in `src` is
rescued from the dead list.

The scope names declared by a file are removed from that file's literal set.
`useTranslations("common")` itself contributes the literal "common", and left
in place it would rescue any key whose path repeats its own namespace, such as
`common.common.disable`, whether or not anything reads it.
"""

import json
import re
import subprocess
import pathlib

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


en = json.load(open(ROOT / "src/messages/en.json", encoding="utf-8"))
CATALOG = flat(en)

files = [
    f
    for f in subprocess.run(
        ["git", "ls-files", "src", "vendor/lens-ui/src"], cwd=ROOT, capture_output=True, text=True
    ).stdout.split()
    if f.endswith((".ts", ".tsx"))
]

translator_src = (ROOT / "src/lib/i18n/translators.ts").read_text(encoding="utf-8")
TYPE_TO_NS = {
    f"{fn[3].upper()}{fn[4:]}": namespace
    for fn, namespace in re.findall(
        r"function (use\w+Translator)\(\)\s*\{\s*return useTranslations\(\"([A-Za-z0-9_.-]+)\"\);\s*\}",
        translator_src,
    )
}

# Some modules define their own translator type next to the component, as
# `type XTranslator = ReturnType<typeof useTranslations<"ns">>`. Those types
# name their namespace in the type argument, so it is read from there.
LOCAL_TRANSLATOR_RE = re.compile(
    r"type\s+([A-Z]\w*Translator)\s*=\s*ReturnType<\s*typeof\s+useTranslations<\s*\"([A-Za-z0-9_.-]+)\""
)

SCOPE_RE = re.compile(r'useTranslations\(\s*"([A-Za-z0-9_.-]+)"')
TEMPLATE_RE = re.compile(r"`([^`\\\n]{1,160})`")
PROP_TRANSLATOR_RE = re.compile(r"\b([A-Za-z_$][\w$]*)\s*:\s*([A-Z][A-Za-z]*Translator)\b")
TOAST_MESSAGE_RE = re.compile(r'toastMessage\(\s*"([^"]+)"\s*\)')


def string_literals(source: str) -> set[str]:
    """Every double-quoted literal in the file.

    A regex pair of quotes would mis-pair whenever a literal contains an
    escaped quote, which silently swallows the keys after it, so the file is
    scanned quote by quote instead.
    """
    out: set[str] = set()
    index = 0
    length = len(source)
    while index < length:
        start = source.find('"', index)
        if start < 0:
            break
        cursor = start + 1
        buffer: list[str] = []
        while cursor < length:
            char = source[cursor]
            if char == "\\":
                cursor += 2
                continue
            if char == '"':
                break
            if char == "\n":
                break
            buffer.append(char)
            cursor += 1
        if cursor < length and source[cursor] == '"':
            text = "".join(buffer)
            if text and len(text) <= 160:
                out.add(text)
            index = cursor + 1
        else:
            index = start + 1
    return out

by_scope: dict[str, set[str]] = {}
dyn_by_scope: dict[str, set[str]] = {}
all_literals: set[str] = set()

# A translator type may be defined in one module and used as a prop in
# another, so the local definitions are collected across the whole tree first.
local_type_ns: dict[str, str] = {}
for rel in files:
    try:
        source = (ROOT / rel).read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    for type_name, namespace in LOCAL_TRANSLATOR_RE.findall(source):
        local_type_ns.setdefault(type_name, namespace)

for rel in files:
    try:
        source = (ROOT / rel).read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    scopes = set(SCOPE_RE.findall(source))
    for _, type_name in PROP_TRANSLATOR_RE.findall(source):
        namespace = TYPE_TO_NS.get(type_name) or local_type_ns.get(type_name)
        if namespace:
            scopes.add(namespace)
    literals = string_literals(source) - scopes
    all_literals |= literals
    for scope in scopes:
        by_scope.setdefault(scope, set()).update(literals)
        dyn = dyn_by_scope.setdefault(scope, set())
        for tpl in TEMPLATE_RE.findall(source):
            if "$" in tpl:
                prefix = tpl.split("${")[0].split("$")[0]
                if prefix:
                    dyn.add(prefix)
    for key in TOAST_MESSAGE_RE.findall(source):
        by_scope.setdefault("toast", set()).add(key)


def depth(scope: str) -> int:
    return len(scope.split(".")) if scope else 0


def scope_chain(parts: list[str]) -> list[str]:
    return ["", *[".".join(parts[:i]) for i in range(1, len(parts) + 1)]]


def referenced_by_literal(key: str) -> bool:
    parts = key.split(".")
    for scope in scope_chain(parts):
        if scope not in by_scope:
            continue
        rest = ".".join(parts[depth(scope) :])
        if not rest:
            if parts[-1] in by_scope[scope]:
                return True
            continue
        hits = by_scope[scope]
        segs = rest.split(".")
        for length in range(len(segs), 0, -1):
            if ".".join(segs[:length]) in hits:
                return True
    return False


def referenced_by_dynamic(key: str) -> bool:
    parts = key.split(".")
    for scope in scope_chain(parts):
        if scope not in dyn_by_scope:
            continue
        rest = ".".join(parts[depth(scope) :])
        for prefix in dyn_by_scope[scope]:
            trimmed = prefix.rstrip(".")
            if trimmed and (rest == trimmed or rest.startswith(trimmed + ".")):
                return True
    return False


def referenced_verbatim(key: str) -> bool:
    """A table constant names the key by its relative path; the scanner cannot
    tell which namespace renders it, so any verbatim hit keeps the key alive."""
    parts = key.split(".")
    return any(".".join(parts[i:]) in all_literals for i in range(len(parts)))


dead = [
    key
    for key in CATALOG
    if not referenced_by_literal(key)
    and not referenced_by_dynamic(key)
    and not referenced_verbatim(key)
]

print(f"catalog={len(CATALOG)} dead={len(dead)}")
by_ns: dict[str, list[str]] = {}
for key in dead:
    by_ns.setdefault(key.split(".")[0], []).append(key)
for ns in sorted(by_ns, key=lambda n: -len(by_ns[n])):
    print(f"\n## {ns}  ({len(by_ns[ns])})")
    for key in by_ns[ns]:
        print(f"   {key}  => {CATALOG[key]!r}")
