import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SearchConnectionTest from "./SearchConnectionTest";
import * as networking from "@/components/networking";
import { toast } from "@/lib/toast";

vi.mock("@/components/networking", () => ({
  testSearchToolConnection: vi.fn(),
}));

const defaultProps = {
  litellmParams: { search_provider: "tavily" },
  accessToken: "test-token",
};

describe("SearchConnectionTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("passes the access token and params to the connection test", async () => {
    vi.mocked(networking.testSearchToolConnection).mockResolvedValue({
      status: "success",
      message: "ok",
    });

    render(<SearchConnectionTest {...defaultProps} />);

    await waitFor(() => {
      expect(networking.testSearchToolConnection).toHaveBeenCalledWith(
        defaultProps.accessToken,
        defaultProps.litellmParams,
      );
    });
  });

  it("shows a loading state naming the provider while the test is pending", () => {
    vi.mocked(networking.testSearchToolConnection).mockReturnValue(new Promise(() => {}));

    render(<SearchConnectionTest {...defaultProps} />);

    expect(screen.getByText(/正在测试到 tavily 的连接/)).toBeInTheDocument();
  });

  it("renders a success state with the test query and result count", async () => {
    vi.mocked(networking.testSearchToolConnection).mockResolvedValue({
      status: "success",
      message: "ok",
      test_query: "hello world",
      results_count: 3,
    });

    render(<SearchConnectionTest {...defaultProps} />);

    expect(await screen.findByText(/到 tavily 的连接成功/)).toBeInTheDocument();
    expect(screen.getByText("hello world")).toBeInTheDocument();
    expect(screen.getByText(/取回结果：3 条/)).toBeInTheDocument();
  });

  it("fires a success notification and completion callback on a successful test", async () => {
    const onTestComplete = vi.fn();
    vi.mocked(networking.testSearchToolConnection).mockResolvedValue({
      status: "success",
      message: "ok",
    });

    render(<SearchConnectionTest {...defaultProps} onTestComplete={onTestComplete} />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("连接测试成功！");
    });
    expect(onTestComplete).toHaveBeenCalledTimes(1);
  });

  it("renders a failure state with a cleaned error message and error type", async () => {
    vi.mocked(networking.testSearchToolConnection).mockResolvedValue({
      status: "error",
      message: "litellm.AuthenticationError: Invalid API key\nstack trace: deep internals",
      error_type: "AuthenticationError",
    });

    render(<SearchConnectionTest {...defaultProps} />);

    expect(await screen.findByText(/到 tavily 的连接失败/)).toBeInTheDocument();
    expect(screen.getByText("Invalid API key")).toBeInTheDocument();
    expect(screen.getByText("AuthenticationError")).toBeInTheDocument();
    expect(screen.getByText("确认 API 密钥正确且有效")).toBeInTheDocument();
  });

  it("reveals the raw error details when Show Details is toggled", async () => {
    const user = userEvent.setup();
    vi.mocked(networking.testSearchToolConnection).mockResolvedValue({
      status: "error",
      message: "litellm.AuthenticationError: Invalid API key\nstack trace: deep internals",
      error_type: "AuthenticationError",
    });

    render(<SearchConnectionTest {...defaultProps} />);

    const toggle = await screen.findByRole("button", { name: /查看详情/ });
    expect(screen.queryByText("完整错误详情")).not.toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByText("完整错误详情")).toBeInTheDocument();
    expect(screen.getByText(/stack trace: deep internals/i)).toBeInTheDocument();
  });

  it("treats a rejected request as a connection failure", async () => {
    vi.mocked(networking.testSearchToolConnection).mockRejectedValue(new Error("network down"));

    render(<SearchConnectionTest {...defaultProps} />);

    expect(await screen.findByText(/到 tavily 的连接失败/)).toBeInTheDocument();
    expect(screen.getByText("network down")).toBeInTheDocument();
  });

  it("links out to the search documentation", async () => {
    vi.mocked(networking.testSearchToolConnection).mockResolvedValue({
      status: "success",
      message: "ok",
    });

    render(<SearchConnectionTest {...defaultProps} />);

    const docLink = await screen.findByRole("link", { name: /查看搜索文档/ });
    expect(docLink).toHaveAttribute("href", "https://docs.litellm.ai/docs/search");
  });
});
