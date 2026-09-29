import en from "@/messages/en.json";

type Catalog = { [key: string]: string | Catalog };

/**
 * A stand-in for next-intl's `t` for code paths that need it outside a React
 * tree, such as a column-definition factory called directly from a test. Keys are
 * resolved against en.json so assertions stay on the real English copy, and a
 * miss throws rather than silently returning the key.
 *
 * NAMESPACE mirrors the `useTranslations("mcpServers")` the production call site
 * uses, so relative keys such as "toolsets.edit" resolve the same way.
 */
const NAMESPACE = "mcpServers";

export const enMessages = (key: string, values?: Record<string, string | number>): string => {
  const segments = (key.startsWith(`${NAMESPACE}.`) ? key.slice(NAMESPACE.length + 1) : key).split(".");
  const resolved = segments.reduce<Catalog | string | undefined>(
    (node, segment) => (typeof node === "object" ? node[segment] : undefined),
    (en as Catalog)[NAMESPACE] as Catalog,
  );

  if (typeof resolved !== "string") {
    throw new Error(`No en.json message for "${NAMESPACE}.${key}"`);
  }

  return values
    ? resolved.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole))
    : resolved;
};
