import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import DefaultProxyAdminTag from "./DefaultProxyAdminTag";

describe("DefaultProxyAdminTag", () => {
  it("should render", () => {
    renderWithProviders(<DefaultProxyAdminTag userId="some-user" />);
    expect(screen.getByText("some-user")).toBeInTheDocument();
  });

  it("should render a blue tag when userId is default_user_id", () => {
    renderWithProviders(<DefaultProxyAdminTag userId="default_user_id" />);
    expect(screen.getByText("默认代理管理员")).toBeInTheDocument();
  });

  it("should render plain text when userId is a regular value", () => {
    renderWithProviders(<DefaultProxyAdminTag userId="alice@example.com" />);
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.queryByText("默认代理管理员")).not.toBeInTheDocument();
  });

  it("should render empty text when userId is null", () => {
    const { container } = renderWithProviders(<DefaultProxyAdminTag userId={null} />);
    expect(screen.queryByText("默认代理管理员")).not.toBeInTheDocument();
    expect(container).toHaveTextContent("");
  });
});
