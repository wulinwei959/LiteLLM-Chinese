import React from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/../tests/test-utils";
import CoordinationRedisTypeSelector from "./CoordinationRedisTypeSelector";
import {
  COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS,
  COORDINATION_REDIS_TYPE_LABEL_KEYS,
} from "./coordinationRedisFields";
import zhCN from "@/messages/zh-CN.json";
import { chooseSelectOption } from "../../../../../../tests/test-utils";

const zh = (key: string) =>
  key.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], zhCN.cacheSettings) as string;

describe("CoordinationRedisTypeSelector", () => {
  it("labels the control and shows the current selection", () => {
    renderWithProviders(<CoordinationRedisTypeSelector redisType="node" onTypeChange={vi.fn()} />);

    expect(screen.getByText("Redis 类型")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(zh(COORDINATION_REDIS_TYPE_LABEL_KEYS.node))).toBeInTheDocument();
  });

  it("shows the description for the selected type", () => {
    renderWithProviders(<CoordinationRedisTypeSelector redisType="cluster" onTypeChange={vi.fn()} />);

    expect(screen.getByText(zh(COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS.cluster))).toBeInTheDocument();
  });

  it("switches the description when the selected type changes", () => {
    const { rerender } = renderWithProviders(<CoordinationRedisTypeSelector redisType="node" onTypeChange={vi.fn()} />);
    expect(screen.getByText(zh(COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS.node))).toBeInTheDocument();

    rerender(<CoordinationRedisTypeSelector redisType="sentinel" onTypeChange={vi.fn()} />);

    expect(screen.getByText(zh(COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS.sentinel))).toBeInTheDocument();
    expect(screen.queryByText(zh(COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS.node))).not.toBeInTheDocument();
  });

  it("reports the newly picked type to the caller", async () => {
    const onTypeChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<CoordinationRedisTypeSelector redisType="node" onTypeChange={onTypeChange} />);

    await chooseSelectOption(user, screen.getByRole("combobox"), zh(COORDINATION_REDIS_TYPE_LABEL_KEYS.cluster));

    expect(onTypeChange).toHaveBeenCalledTimes(1);
    expect(onTypeChange.mock.calls[0][0]).toBe("cluster");
  });

  it("offers every supported coordination redis type", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CoordinationRedisTypeSelector redisType="node" onTypeChange={vi.fn()} />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByText(zh(COORDINATION_REDIS_TYPE_LABEL_KEYS.cluster))).toBeInTheDocument();
    expect(screen.getByText(zh(COORDINATION_REDIS_TYPE_LABEL_KEYS.sentinel))).toBeInTheDocument();
    expect(screen.getAllByText(zh(COORDINATION_REDIS_TYPE_LABEL_KEYS.node)).length).toBeGreaterThan(0);
  });
});
