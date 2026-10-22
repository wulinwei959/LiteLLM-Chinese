import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import zh from "@/messages/zh-CN.json";
import { issueLabel } from "./issueLabel";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "playground.systemOne" });

describe("issueLabel", () => {
  it("names the Input field for both endpoints instead of the JSON key", () => {
    expect(issueLabel(["state"], t)).toBe("输入");
    expect(issueLabel(["input"], t)).toBe("输入");
  });

  it("names top-level fields and the request itself", () => {
    expect(issueLabel(["model"], t)).toBe("模型");
    expect(issueLabel(["questions"], t)).toBe("问题");
    expect(issueLabel(["safety_identifier"], t)).toBe("安全标识");
    expect(issueLabel([], t)).toBe("请求");
    expect(issueLabel(["syntax"], t)).toBe("请求");
  });

  it("names a keyed question by its key, even an all-digit or dotted one, and the field inside it", () => {
    expect(issueLabel(["questions", "urgency"], t)).toBe("问题“urgency”");
    expect(issueLabel(["questions", "urgency", "criteria"], t)).toBe("问题“urgency” 选项");
    expect(issueLabel(["questions", "urgency", "criteria", 1], t)).toBe("问题“urgency” 选项");
    expect(issueLabel(["questions", "category", "instructions"], t)).toBe("问题“category” 指令");
    expect(issueLabel(["questions", "2", "criteria"], t)).toBe("问题“2” 选项");
    expect(issueLabel(["questions", "v1.2", "type"], t)).toBe("问题“v1.2” 回答类型");
  });

  it("names a listed question by its 1-based position", () => {
    expect(issueLabel(["questions", 0, "name"], t)).toBe("问题 1 名称");
    expect(issueLabel(["questions", 2, "type"], t)).toBe("问题 3 回答类型");
  });

  it("falls back to the humanized key for anything unknown", () => {
    expect(issueLabel(["max_tokens"], t)).toBe("max tokens");
    expect(issueLabel(["questions", "a", "max_items"], t)).toBe("问题“a” max items");
  });
});
