import { describe, expect, it } from "vitest";
import { requiredFederationValue, validateMaskedValueUntouched } from "./federation_field";
import type { ModelAddTranslator } from "@/lib/i18n/translators";
import { enMessagesFor } from "@/../tests/i18nStub";

const t = enMessagesFor("modelAdd") as unknown as ModelAddTranslator;

describe("federation field validation", () => {
  it("refuses a hidden stored value that was only partly edited", () => {
    const rule = validateMaskedValueUntouched(t, "os.e****");
    expect(rule("os.e****")).toBe(true);
    expect(rule("os.environ/NEW_REF")).toBe(true);
    expect(rule("os.e****_NEW")).toEqual(expect.stringContaining("Replace the whole value"));
  });

  it.each(["", "  ", "\n", undefined, null])("refuses the blank required value %j", (value) => {
    expect(requiredFederationValue(t)(value)).toBe("Required");
  });

  it("accepts a required value with text in it", () => {
    expect(requiredFederationValue(t)(" svc_1 ")).toBe(true);
  });
});
