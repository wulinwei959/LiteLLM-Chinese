import { useState } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import CacheAwareRoutingConfig from "./CacheAwareRoutingConfig";
import type { ComplexityRouterConfigValue } from "./ComplexityRouterConfig";
import { renderWithProviders } from "../../../tests/test-utils";

const initial: ComplexityRouterConfigValue = {
  classifier_type: "heuristic",
  tiers: { SIMPLE: ["small"], MEDIUM: [], COMPLEX: ["large"], REASONING: [] },
};

const Harness = ({ value = initial }: { value?: ComplexityRouterConfigValue }) => {
  const [config, setConfig] = useState(value);
  return <CacheAwareRoutingConfig value={config} onChange={setConfig} />;
};

describe("CacheAwareRoutingConfig", () => {
  it("starts off and reveals optional cost settings only after opting in", () => {
    renderWithProviders(<Harness />);
    expect(screen.getByRole("switch", { name: "缓存感知路由" })).not.toBeChecked();
    expect(screen.queryByLabelText("预计输出 token 数")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("switch", { name: "缓存感知路由" }));
    expect(screen.getByRole("switch", { name: "缓存感知路由" })).toBeChecked();
    expect(screen.getByLabelText("预计输出 token 数")).toHaveValue(null);
    expect(screen.getByLabelText("预测超时（毫秒）")).toHaveValue(null);
  });

  it("accepts zero output, clamps invalid bounds, and lets blank fields return to defaults", () => {
    renderWithProviders(<Harness value={{ ...initial, cache_aware_routing: true }} />);
    const output = screen.getByLabelText("预计输出 token 数");
    const timeout = screen.getByLabelText("预测超时（毫秒）");
    fireEvent.change(output, { target: { value: "-1" } });
    fireEvent.change(timeout, { target: { value: "0" } });
    expect(output).toHaveValue(0);
    expect(timeout).toHaveValue(1);
    fireEvent.change(output, { target: { value: "512.5" } });
    fireEvent.change(timeout, { target: { value: "750.5" } });
    expect(output).toHaveValue(512);
    expect(timeout).toHaveValue(750);
    fireEvent.change(output, { target: { value: "" } });
    fireEvent.change(timeout, { target: { value: "" } });
    expect(output).toHaveValue(null);
    expect(timeout).toHaveValue(null);
  });

  it("keeps the cost settings when temporarily turning routing off", () => {
    renderWithProviders(
      <Harness
        value={{
          ...initial,
          cache_aware_routing: true,
          cache_aware_routing_output_tokens: 0,
          cache_aware_routing_timeout_ms: 500,
        }}
      />,
    );
    fireEvent.click(screen.getByRole("switch", { name: "缓存感知路由" }));
    expect(screen.queryByLabelText("预计输出 token 数")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("switch", { name: "缓存感知路由" }));
    expect(screen.getByLabelText("预计输出 token 数")).toHaveValue(0);
    expect(screen.getByLabelText("预测超时（毫秒）")).toHaveValue(500);
  });

  it.each<{ patch: Partial<ComplexityRouterConfigValue>; reason: string }>([
    { patch: { adaptive: true }, reason: "请关闭自适应路由" },
    { patch: { session_affinity: true }, reason: "请将「分类频率」" },
    { patch: { classification_mode: "user_turn" }, reason: "请将「分类频率」" },
    { patch: { tiers: { ...initial.tiers, SIMPLE: ["small", "other"] } }, reason: "每个层级只选一个模型" },
    {
      patch: { tier_model_params: { SIMPLE: { small: { reasoning_effort: "high" } } } },
      reason: "请移除按模型的参数覆盖",
    },
    { patch: { custom_tier_set: { tiers: [], fallback_tier_id: "custom" } }, reason: "请使用内置层级" },
  ])(
    "explains an incompatible setting and still allows an existing opt-in to be disabled: $reason",
    ({ patch, reason }) => {
      const view = renderWithProviders(<Harness value={{ ...initial, ...patch }} />);
      expect(screen.getByRole("switch", { name: "缓存感知路由" })).toHaveAttribute("aria-disabled", "true");
      fireEvent.click(screen.getByRole("switch", { name: "缓存感知路由" }));
      expect(screen.getByRole("switch", { name: "缓存感知路由" })).not.toBeChecked();
      expect(screen.getByRole("status")).toHaveTextContent(reason);
      view.unmount();
      renderWithProviders(<Harness value={{ ...initial, ...patch, cache_aware_routing: true }} />);
      fireEvent.click(screen.getByRole("switch", { name: "缓存感知路由" }));
      expect(screen.getByRole("switch", { name: "缓存感知路由" })).not.toBeChecked();
    },
  );
});
