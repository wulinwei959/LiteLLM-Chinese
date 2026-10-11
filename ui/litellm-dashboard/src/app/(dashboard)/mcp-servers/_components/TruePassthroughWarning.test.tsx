import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../../../../tests/test-utils";
import { describe, it, expect } from "vitest";
import TruePassthroughWarning from "./TruePassthroughWarning";
import { AUTH_TYPE } from "@/components/mcp_tools/types";

describe("TruePassthroughWarning", () => {
  it("warns when auth type is true_passthrough", () => {
    renderWithProviders(<TruePassthroughWarning authType={AUTH_TYPE.TRUE_PASSTHROUGH} />);

    expect(screen.getByText(/完全直通/)).toBeInTheDocument();
    expect(screen.getByText(/任何能访问到网关的人/)).toBeInTheDocument();
  });

  it("renders nothing for any other auth type", () => {
    const { container } = renderWithProviders(<TruePassthroughWarning authType={AUTH_TYPE.OAUTH2} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when no auth type is set", () => {
    const { container } = renderWithProviders(<TruePassthroughWarning authType={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
