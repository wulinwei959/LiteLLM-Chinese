import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/../tests/test-utils";
import type { ReactElement } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ChatShell from "./ChatShell";

const render = (ui: ReactElement) => renderWithProviders(<ThemeProvider>{ui}</ThemeProvider>);

const { mockPush, mockUsePathname, mockUseChatShell, mockUseMediaQuery } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUsePathname: vi.fn(() => "/ui/chat"),
  mockUseMediaQuery: vi.fn(() => true),
  mockUseChatShell: vi.fn(() => ({
    accessToken: "test-token",
    userEmail: "developer@example.com",
    userId: "test-user",
    conversations: [],
    activeConversationId: null,
    deleteConversation: vi.fn(),
    renameConversation: vi.fn(),
  })),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: mockUsePathname,
}));
// Deterministic hrefs so navigation/active-state assertions don't depend on server_root_path.
vi.mock("@/utils/uiHref", () => ({ uiHref: (seg: string) => `/ui/${seg}`.replace(/\/$/, "") || "/ui" }));
vi.mock("@/contexts/ChatShellContext", () => ({ useChatShell: mockUseChatShell }));
vi.mock("@/app/(dashboard)/hooks/uiSettings/useUISettings", () => ({
  useUISettings: () => ({ data: { values: { enable_chat_ui: true } } }),
}));
vi.mock("@/app/(dashboard)/hooks/useLogout", () => ({ useLogout: () => vi.fn() }));
vi.mock("usehooks-ts", () => ({ useMediaQuery: mockUseMediaQuery }));
vi.mock("./ConversationList", () => ({ default: () => <div data-testid="conversation-list" /> }));

describe("ChatShell", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ values: {} })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    mockPush.mockClear();
    mockUsePathname.mockReturnValue("/ui/chat");
    mockUseMediaQuery.mockReturnValue(true);
  });

  it("should render the workspace and mark Chats active on the base chat route", () => {
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );
    expect(screen.getByRole("button", { name: "对话" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "模型" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "工作区" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "设置" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "退出登录" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "切换工作区，当前：聊天" })).toBeInTheDocument();
    expect(screen.getByTestId("conversation-list")).toBeInTheDocument();
  });

  it("should mark Models active on its route and tolerate a trailing slash", () => {
    mockUsePathname.mockReturnValue("/ui/chat/models/");
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );

    expect(screen.getByRole("button", { name: "模型" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "对话" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "工作区" })).not.toHaveAttribute("aria-current");
  });

  it("should mark API Keys active while still showing the conversation list", () => {
    mockUsePathname.mockReturnValue("/ui/chat/api-keys");
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );
    expect(screen.getByRole("button", { name: "工作区" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "对话" })).not.toHaveAttribute("aria-current");
    expect(screen.getByTestId("conversation-list")).toBeInTheDocument();
  });

  it("should navigate through the workspace menu and retain all chat destinations", async () => {
    const user = userEvent.setup();
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );
    await user.click(screen.getByRole("button", { name: "集成" }));
    expect(mockPush).toHaveBeenCalledWith("/ui/chat/integrations");
    await user.click(screen.getByRole("button", { name: "模型" }));
    expect(mockPush).toHaveBeenCalledWith("/ui/chat/models");
    for (const [label, href] of [
      ["凭证", "/ui/chat/credentials"],
      ["API 密钥", "/ui/chat/api-keys"],
      ["用量", "/ui/chat/usage"],
      ["日志", "/ui/chat/logs"],
    ]) {
      await user.click(screen.getByRole("button", { name: "工作区" }));
      await user.click(await screen.findByRole("menuitem", { name: label }));
      expect(mockPush).toHaveBeenCalledWith(href);
    }
  });

  it("should mark the active workspace destination and tolerate a trailing slash", async () => {
    mockUsePathname.mockReturnValue("/ui/chat/usage/");
    const user = userEvent.setup();
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );
    expect(screen.getByRole("button", { name: "工作区" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "工作区" }));
    expect(await screen.findByRole("menuitem", { name: "用量" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("menuitem", { name: "日志" })).not.toHaveAttribute("aria-current");
  });

  it("should collapse and reopen the desktop rail", async () => {
    const user = userEvent.setup();
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );
    await user.click(screen.getByRole("button", { name: "关闭侧栏" }));
    expect(screen.getByRole("button", { name: "打开侧栏" })).toHaveAttribute("aria-expanded", "false");
    await user.click(screen.getByRole("button", { name: "切换工作区，当前：聊天" }));
    expect(await screen.findByRole("menuitem", { name: "AI 网关" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "打开侧栏" }));
    expect(screen.getByRole("button", { name: "关闭侧栏" })).toHaveAttribute("aria-expanded", "true");
  });

  it("should open mobile navigation and close it after selecting Models", async () => {
    mockUseMediaQuery.mockReturnValue(false);
    const user = userEvent.setup();
    render(
      <ChatShell>
        <div>Conversation content</div>
      </ChatShell>,
    );

    expect(screen.queryByRole("navigation", { name: "聊天工作区" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "切换工作区，当前：聊天" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "打开聊天导航" }));
    expect(await screen.findByRole("dialog", { name: "LiteLLM 聊天" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "模型" }));

    expect(mockPush).toHaveBeenCalledWith("/ui/chat/models");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByText("Conversation content")).toBeInTheDocument();
  });

  it("should close mobile navigation with Escape and restore trigger focus", async () => {
    mockUseMediaQuery.mockReturnValue(false);
    const user = userEvent.setup();
    render(
      <ChatShell>
        <div />
      </ChatShell>,
    );

    const trigger = screen.getByRole("button", { name: "打开聊天导航" });
    await user.click(trigger);
    expect(await screen.findByRole("dialog", { name: "LiteLLM 聊天" })).toBeInTheDocument();
    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
