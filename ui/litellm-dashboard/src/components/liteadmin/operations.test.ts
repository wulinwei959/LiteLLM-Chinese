import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import { createLiteAdminOperations, type OperationContext } from "./operations";

const context: OperationContext = {
  accessToken: "test-access-token",
  signal: new AbortController().signal,
  assertCurrent: () => undefined,
  beforeTool: () => undefined,
  confirm: async () => false,
  onResult: () => undefined,
};

describe("LiteAdmin operation labels", () => {
  it("labels every operation and only operations", () => {
    const toolNames = createLiteAdminOperations(context).map((tool) => tool.function.name);
    expect([...toolNames].sort()).toEqual(Object.keys(en.liteAdmin.operations).sort());
  });
});
