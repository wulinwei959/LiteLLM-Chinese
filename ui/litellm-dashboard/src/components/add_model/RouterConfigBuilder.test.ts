import { describe, expect, it } from "vitest";
import { createTranslator } from "next-intl";
import zh from "@/messages/zh-CN.json";
import { serializeRouterConfig } from "./RouterConfigBuilder";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "models.addModel" });

describe("serializeRouterConfig", () => {
  it("rejects a cleared route model and preserves selected route settings", () => {
    expect(() => serializeRouterConfig(t, { routes: [{ name: null }] })).toThrow("请为每条路由选择模型");
    const config = { routes: [{ name: "model-silver", utterances: [], description: "", score_threshold: 0 }] };
    expect(JSON.parse(serializeRouterConfig(t, config))).toEqual(config);
  });
});
