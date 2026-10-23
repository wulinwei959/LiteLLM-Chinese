import { describe, expect, it } from "vitest";
import RedisTypeSelector from "./RedisTypeSelector";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";

describe("RedisTypeSelector", () => {
  it("should render the component", () => {
    render(
      <RedisTypeSelector
        redisType="node"
        redisTypeDescriptions={{
          node: "redisTypes.node",
          cluster: "redisTypes.cluster",
          sentinel: "redisTypes.sentinel",
          semantic: "redisTypes.semantic",
        }}
        onTypeChange={() => {}}
      />,
    );
    expect(screen.getAllByText(/Redis/i).length).toBeGreaterThan(0);
  });
});
