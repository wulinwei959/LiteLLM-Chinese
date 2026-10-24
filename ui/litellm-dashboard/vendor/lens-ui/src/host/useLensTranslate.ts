import { useLensHost } from "./LensHost";
import type { LensTranslate } from "./lensTranslate";

/**
 * The translator the host supplies.
 *
 * A host that renders the package without one gets an error rather than the
 * message keys themselves: keys reaching the screen read as a missing
 * translation, and the page looks half-localized instead of broken.
 */
export function useLensTranslate(): LensTranslate {
  const host = useLensHost();
  if (!host.t) {
    throw new Error("@litellm/lens-ui needs a translator: pass t through LensHostProvider");
  }
  return host.t;
}
