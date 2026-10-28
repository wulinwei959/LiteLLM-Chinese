import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatMessageContent } from "./ChatMessages";
import type { ChatMessage } from "./types";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("@/components/networking", () => ({ getGatewayBaseUrl: () => "https://gateway.example/v1" }));
vi.mock("@/components/chat_ui/ReasoningContent", () => ({ default: () => null }));
vi.mock("@/components/chat_ui/MCPEventsDisplay", () => ({ default: () => null }));
vi.mock("@/components/chat_ui/ResponseMetrics", () => ({ default: () => null }));
vi.mock("@/hooks/useSyntaxTheme", () => ({ useSyntaxTheme: (theme: unknown) => theme }));

const image = { id: "image-1", name: "design.png", url: "data:image/png;base64,aW1hZ2U=" };
const message: ChatMessage = {
  id: "message-1",
  role: "user",
  content: "Describe this design",
  timestamp: 1,
  attachments: [image],
};

describe("ChatMessageContent images", () => {
  it("should render a user message and its image attachment", () => {
    renderWithProviders(<ChatMessageContent message={message} />);
    expect(screen.getByText("Describe this design")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "design.png" })).toHaveAttribute("src", image.url);
    expect(screen.getByRole("link", { name: "打开图片" })).toHaveAttribute("href", image.url);
  });

  it("should display generated images even when assistant text is empty", () => {
    renderWithProviders(
      <ChatMessageContent
        message={{ ...message, role: "assistant", content: "", attachments: undefined, generatedImages: [image] }}
        isStreaming
      />,
    );
    expect(screen.getByRole("img", { name: "design.png" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "复制消息" })).not.toBeInTheDocument();
  });

  it("should show image generation progress", () => {
    renderWithProviders(
      <ChatMessageContent
        message={{
          ...message,
          role: "assistant",
          content: "",
          imageGeneration: { prompt: "A design", model: "image-model" },
        }}
        isStreaming
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("正在生成图片");
    expect(screen.queryByText("正在思考...")).not.toBeInTheDocument();
  });

  it("should respect image suppression for uploaded and generated images", () => {
    renderWithProviders(
      <>
        <ChatMessageContent message={message} allowImages={false} />
        <ChatMessageContent
          message={{ ...message, id: "assistant-1", role: "assistant", content: "", generatedImages: [image] }}
          allowImages={false}
        />
      </>,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "打开图片" })).not.toBeInTheDocument();
    expect(screen.getAllByText("design.png")).toHaveLength(2);
  });

  it("should retain image previews while editing the message text", () => {
    const onEditMessage = vi.fn();
    renderWithProviders(<ChatMessageContent message={message} onEditMessage={onEditMessage} />);
    act(() => {
      fireEvent.mouseEnter(screen.getByText("Describe this design"));
    });
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "编辑消息" }));
    });
    expect(screen.getByRole("img", { name: "design.png" })).toBeInTheDocument();
    act(() => {
      fireEvent.change(screen.getByRole("textbox", { name: "编辑消息" }), { target: { value: "" } });
    });
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "保存并发送" }));
    });
    expect(onEditMessage).toHaveBeenCalledWith(message.id, "");
  });

  it("should show a helpful message when saved image bytes are missing", () => {
    renderWithProviders(<ChatMessageContent message={{ ...message, attachments: [{ ...image, url: "" }] }} />);
    expect(screen.getByText(/design.png —— 图片不可用/)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should show a helpful message when a provider image URL expires", () => {
    renderWithProviders(<ChatMessageContent message={message} />);
    act(() => {
      fireEvent.error(screen.getByRole("img", { name: "design.png" }));
    });
    expect(screen.getByText(/图片不可用/)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
