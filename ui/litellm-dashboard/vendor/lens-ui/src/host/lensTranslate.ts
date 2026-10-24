/**
 * The translator the host hands to the package.
 *
 * Keys are relative to whatever namespace the host resolves them in, so a
 * package that renders `lensTranslate("sidebar.openNavigation")` reads the
 * host's `lens.sidebar.openNavigation` entry. Values are plain ICU arguments,
 * which keeps the package free of any message-formatting dependency. A value
 * that is missing reaches the host as it is, because how a gap reads is the
 * host's decision.
 *
 * The seam sits here rather than in the component tree for the same reason
 * the HTTP seam does: a helper and a module-level table both read copy, and
 * neither can call a hook. The host registers what it has, the package asks
 * for it. A component asks through `useLensTranslate`, because a component
 * has to re-render when the host switches language.
 */
export type LensTranslate = (
  key: string,
  values?: Record<string, string | number | null | undefined>,
) => string;

let translator: LensTranslate | undefined;

/** Registers the translator the package reads its copy through. */
export const registerLensTranslator = (next: LensTranslate): void => {
  translator = next;
};

/** The copy of the key, in the language the host last registered. */
export const lensTranslate: LensTranslate = (key, values) => {
  if (!translator) {
    throw new Error("@litellm/lens-ui needs a translator: register one before the package renders");
  }
  return translator(key, values);
};
