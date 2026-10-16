import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import zh from "@/messages/zh-CN.json";
import { groupNameByModel, modelConflictError } from "./modelOwnership";
import type { RoutingGroup } from "./types";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "routingGroups" });

const groups: RoutingGroup[] = [
  { group_name: "cheap", models: ["m1", "m2"], routing_strategy: "latency-based-routing" },
  { group_name: "security", models: ["m3"], routing_strategy: "least-busy" },
];

describe("groupNameByModel", () => {
  it("maps every claimed model to its owning group", () => {
    expect(groupNameByModel(groups)).toEqual({ m1: "cheap", m2: "cheap", m3: "security" });
  });

  it("excludes the group being edited so its own models stay selectable", () => {
    expect(groupNameByModel(groups, "cheap")).toEqual({ m3: "security" });
  });

  it("allows overlapping priority groups while retaining the legacy owner", () => {
    expect(
      groupNameByModel([
        ...groups,
        { group_name: "primary", models: ["m1", "m4"], routing_strategy: "priority" },
        { group_name: "backup", models: ["m1", "m4"], routing_strategy: "priority" },
      ]),
    ).toStrictEqual({ m1: "cheap", m2: "cheap", m3: "security" });
  });
});

describe("modelConflictError", () => {
  it("passes models that no other group claims", () => {
    expect(modelConflictError(t, ["m4"], groupNameByModel(groups, "cheap"))).toBeNull();
    expect(modelConflictError(t, undefined, groupNameByModel(groups))).toBeNull();
  });

  it("names every model already claimed by another group", () => {
    const error = modelConflictError(t, ["m1", "m3", "m4"], groupNameByModel(groups));
    expect(error).toBe("每个模型最多只能属于一个非优先级组。已被占用：m1（属于“cheap”）, m3（属于“security”）");
  });

  it("only treats own model-name keys as ownership", () => {
    expect(modelConflictError(t, ["constructor", "__proto__"], {})).toBeNull();
    expect(modelConflictError(t, ["constructor"], { constructor: "legacy" })).toContain("constructor（属于“legacy”）");
  });
});
