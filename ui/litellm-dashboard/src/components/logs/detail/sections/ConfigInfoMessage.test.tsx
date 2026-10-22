import { renderWithProviders, screen } from "../../../../../tests/test-utils";
import { describe, expect, it } from "vitest";
import { ConfigInfoMessage } from "./ConfigInfoMessage";

describe("ConfigInfoMessage", () => {
  it("should render the info message when show is true", () => {
    renderWithProviders(<ConfigInfoMessage show={true} />);
    expect(screen.getByText("请求/响应数据不可用")).toBeInTheDocument();
  });

  it("should render nothing when show is false", () => {
    const { container } = renderWithProviders(<ConfigInfoMessage show={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should display the YAML config snippet", () => {
    renderWithProviders(<ConfigInfoMessage show={true} />);
    expect(screen.getByText(/store_prompts_in_spend_logs: true/)).toBeInTheDocument();
  });

  it("should reference Admin Settings \u2192 Logging Settings", () => {
    renderWithProviders(<ConfigInfoMessage show={true} />);
    expect(screen.getByText(/Admin Settings → Logging Settings/)).toBeInTheDocument();
  });
});
