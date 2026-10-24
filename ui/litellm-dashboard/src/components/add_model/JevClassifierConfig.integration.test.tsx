import React, { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, renderWithProviders, screen } from "../../../tests/test-utils";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import ClassificationMethodConfig from "./ClassificationMethodConfig";
import AutoRouterClassifierTabs from "./AutoRouterClassifierTabs";
import JevEditor from "./JevClassifierConfig";
import { type ComplexityRouterConfigValue } from "./ComplexityRouterConfig";
import {
  buildUpdatedComplexityRouterConfig,
  hydrateComplexityRouterConfig,
} from "../edit_auto_router/edit_auto_router_modal";
import { applyTierSetAction } from "./tier_set_actions";
import { testAutoRouterRouting } from "../networking";
import { JEV_CONNECTION_TEST_PROMPT } from "./build_auto_router_routing_test_request";

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: vi.fn(() => ({
    isLoading: false,
    isAuthorized: true,
    token: "token",
    accessToken: "token",
    userId: "user",
    userEmail: "user@example.com",
    userRole: "Admin",
    userRoleLabel: "Admin",
    isViewOnly: false,
    premiumUser: false,
    disabledPersonalKeyCreation: false,
    showSSOBanner: false,
  })),
}));

vi.mock("@/components/networking", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/components/networking")>()),
  getComplexityScorerDefaults: vi.fn(async () => ({
    tier_boundaries: {},
    token_thresholds: {},
    dimension_weights: {},
  })),
  testAutoRouterRouting: vi.fn(async () => ({ status: "error", error: "fixture" })),
}));

const initial: ComplexityRouterConfigValue = {
  classifier_type: "llm",
  classifier_llm_config: { model: "judge", timeout_ms: 1000 },
  tiers: { SIMPLE: ["fast"], MEDIUM: ["mid"], COMPLEX: ["strong"], REASONING: ["reasoner"] },
};

function Form() {
  const [value, setValue] = useState(initial);
  return (
    <AutoRouterClassifierTabs value={value} onChange={setValue}>
      <ClassificationMethodConfig
        value={value}
        onChange={setValue}
        modelOptions={[{ value: "judge", label: "judge" }]}
        effortOptionsByModel={{ judge: ["low"] }}
        customTechnicalKeywords={[]}
        onCustomTechnicalKeywordsChange={() => {}}
      />
      <button
        onClick={() =>
          setValue(
            applyTierSetAction(value, [], {
              kind: "patch",
              id: "SIMPLE",
              patch: { name: "QUICK", definition: "Quick tasks" },
            }).value,
          )
        }
      >
        Customize tiers
      </button>
      <button
        onClick={() =>
          setValue(hydrateComplexityRouterConfig(buildUpdatedComplexityRouterConfig({}, value), undefined))
        }
      >
        Save and reload
      </button>
      <button
        onClick={() => {
          const request = {
            prompt: JEV_CONNECTION_TEST_PROMPT,
            complexity_router_config: buildUpdatedComplexityRouterConfig({}, value),
          };
          void testAutoRouterRouting("token", request);
        }}
      >
        Probe current config
      </button>
    </AutoRouterClassifierTabs>
  );
}

describe("JEV classifier editor", () => {
  afterEach(() => vi.mocked(useAuthorized).mockReset());
  it("uses built-in JEV without a license and preserves custom tiers and context through reload", () => {
    renderWithProviders(<Form />);
    expect(screen.getByLabelText("评审模型")).toBeInTheDocument();
    expect(screen.getByText("推理强度")).toBeInTheDocument();
    expect(screen.getByText("分类器提示词")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "使用图片进行分类" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /决策模型/ }));
    expect(screen.getByRole("radio", { name: /^决策模型/ })).toBeChecked();
    expect(screen.getByLabelText("分类器模型")).toHaveValue("jev-latest");
    expect(screen.getByLabelText("分类器指令")).toBeEnabled();
    expect(screen.queryByLabelText("评审模型")).not.toBeInTheDocument();
    expect(screen.queryByText("推理强度")).not.toBeInTheDocument();
    expect(screen.queryByText("分类器提示词")).not.toBeInTheDocument();
    expect(screen.queryByRole("switch", { name: "使用图片进行分类" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("分类器模型"), { target: { value: "jev-test" } });
    fireEvent.change(screen.getByLabelText("分类器超时（毫秒）"), { target: { value: "4200" } });
    fireEvent.change(screen.getByLabelText("上下文窗口大小"), { target: { value: "6" } });
    fireEvent.change(screen.getByLabelText("熔断器冷却时间（秒）"), { target: { value: "50" } });
    fireEvent.click(screen.getByRole("switch", { name: "分类器熔断器" }));
    fireEvent.click(screen.getByRole("button", { name: "Customize tiers" }));
    fireEvent.click(screen.getByRole("button", { name: "Save and reload" }));
    expect(screen.getByRole("radio", { name: /决策模型/ })).toBeChecked();
    expect(screen.getByLabelText("分类器模型")).toHaveValue("jev-test");
    expect(screen.getByLabelText("分类器超时（毫秒）")).toHaveValue(4200);
    expect(screen.getByLabelText("上下文窗口大小")).toHaveValue("6");
    expect(screen.getByRole("switch", { name: "分类器熔断器" })).not.toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Probe current config" }));
    const opensourceExpected = {
      model: "jev-test",
      timeout_ms: 4200,
      circuit_breaker_enabled: false,
      circuit_breaker_cooldown_seconds: 50,
    };
    expect(testAutoRouterRouting).toHaveBeenCalledWith(
      "token",
      expect.objectContaining({
        complexity_router_config: expect.objectContaining({
          classifier_type: "oss_classifier",
          opensource_classifier_config: expect.objectContaining(opensourceExpected),
          tiers: expect.objectContaining({ QUICK: ["fast"] }),
        }),
      }),
    );
    },
  );

  it("allows licensed instructions and can restore built-in instructions", () => {
    const authorized = useAuthorized();
    vi.mocked(useAuthorized).mockReturnValue({ ...authorized, premiumUser: true });
    const LicensedForm = () => {
      const [value, setValue] = useState<ComplexityRouterConfigValue>({
        ...initial,
        classifier_type: "jev",
        jev_classifier_config: { model: "jev-latest", timeout_ms: 3000, instructions: "Existing instructions" },
      });
      return <JevEditor value={value} onChange={setValue} />;
    };
    renderWithProviders(<LicensedForm />);
    expect(screen.getByLabelText("分类器指令")).toBeEnabled();
    fireEvent.change(screen.getByLabelText("分类器指令"), { target: { value: "New instructions" } });
    expect(screen.getByLabelText("分类器指令")).toHaveValue("New instructions");
    fireEvent.click(screen.getByRole("button", { name: "恢复内置指令" }));
    expect(screen.getByLabelText("分类器指令")).toHaveValue("");
  });
});
