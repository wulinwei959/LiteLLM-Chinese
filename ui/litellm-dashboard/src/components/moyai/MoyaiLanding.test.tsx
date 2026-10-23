import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import MoyaiLanding, { MOYAI_GITHUB_URL, MOYAI_LAUNCH_POST_URL, MOYAI_WALKTHROUGH_URL } from "./MoyaiLanding";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("./moyaiSky", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./moyaiSky")>();
  return {
    ...actual,
    prefersReducedMotion: () => true,
    startStarfield: () => () => {},
    startPlanetrise: () => () => {},
  };
});

describe("MoyaiLanding", () => {
  it("shows the admin quick-connect line and validates the dialog input", async () => {
    const onQuickConnect = vi.fn(async () => {});
    renderWithProviders(<MoyaiLanding canQuickConnect onQuickConnect={onQuickConnect} />);

    fireEvent.click(screen.getByRole("button", { name: "快速连接" }));

    const input = await screen.findByLabelText("Moyai 地址");
    fireEvent.change(input, { target: { value: "javascript:alert(1)" } });
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("http or https");
    expect(onQuickConnect).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "  https://moyai.example.com/  " } });
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(onQuickConnect).toHaveBeenCalledWith("https://moyai.example.com");
  });

  it("shows the non-admin copy when quick connect is unavailable", () => {
    renderWithProviders(<MoyaiLanding />);

    expect(screen.getByText(/让代理管理员来连接它/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "快速连接" })).not.toBeInTheDocument();
  });

  it("links the GitHub, demo, and launch post CTAs to the exported URLs", () => {
    renderWithProviders(<MoyaiLanding />);

    expect(screen.getByRole("link", { name: /Star Moyai on GitHub/ })).toHaveAttribute("href", MOYAI_GITHUB_URL);
    expect(screen.getByRole("link", { name: /在 GitHub 上看完整教程/ })).toHaveAttribute("href", MOYAI_WALKTHROUGH_URL);
    expect(screen.getByRole("link", { name: /读发布文章/ })).toHaveAttribute("href", MOYAI_LAUNCH_POST_URL);
  });

  it("shows the GitHub fallback when the demo image fails to load", () => {
    renderWithProviders(<MoyaiLanding />);

    const demoImg = screen.getByAltText(/Moyai 演示：/);
    fireEvent.error(demoImg);

    expect(screen.getByText("在 GitHub 上观看演示")).toBeInTheDocument();
  });
});
