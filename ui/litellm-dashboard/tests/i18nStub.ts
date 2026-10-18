import en from "@/messages/en.json";

type Catalog = { [key: string]: string | Catalog };

/**
 * A stand-in for next-intl's `t` for code paths that need it outside a React
 * tree, such as a column-definition factory or a validation helper called
 * directly from a test. Keys are resolved against en.json so assertions stay on
 * the real English copy, and a miss throws rather than silently returning the
 * key. `namespace` mirrors the `useTranslations("<ns>")` the production call site
 * uses, so relative keys such as "toolsets.edit" resolve the same way.
 */
export const enMessagesFor =
  (namespace: string) =>
  (key: string, values?: Record<string, string | number>): string => {
    const segments = (key.startsWith(`${namespace}.`) ? key.slice(namespace.length + 1) : key).split(".");
    const resolved = segments.reduce<Catalog | string | undefined>(
      (node, segment) => (typeof node === "object" ? node[segment] : undefined),
      namespace
        .split(".")
        .reduce<
          Catalog | string | undefined
        >((node, segment) => (typeof node === "object" ? node[segment] : undefined), en as unknown as Catalog) as Catalog,
    );

    if (typeof resolved !== "string") {
      throw new Error(`No en.json message for "${namespace}.${key}"`);
    }

    return values
      ? resolved.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole))
      : resolved;
  };

const NAMESPACE = "mcpServers";

export const enMessages = enMessagesFor(NAMESPACE);
