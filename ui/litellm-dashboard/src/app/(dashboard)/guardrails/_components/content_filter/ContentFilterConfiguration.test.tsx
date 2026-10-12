import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import ContentFilterConfiguration from "./ContentFilterConfiguration";

vi.mock("@/components/networking", () => ({
  validateBlockedWordsFile: vi.fn(),
  getCategoryYaml: vi.fn(),
}));

const PREBUILT = [
  { name: "us_ssn", display_name: "US Social Security Number", category: "PII Patterns", description: "d" },
];

describe("ContentFilterConfiguration", () => {
  const handlers = {
    onPatternAdd: vi.fn(),
    onPatternRemove: vi.fn(),
    onPatternActionChange: vi.fn(),
    onBlockedWordAdd: vi.fn(),
    onBlockedWordRemove: vi.fn(),
    onBlockedWordUpdate: vi.fn(),
  };

  const renderConfig = (overrides = {}) =>
    renderWithProviders(
      <ContentFilterConfiguration
        prebuiltPatterns={PREBUILT}
        categories={["PII Patterns"]}
        selectedPatterns={[]}
        blockedWords={[]}
        accessToken="test-token"
        {...handlers}
        {...overrides}
      />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the pattern and keyword sections", () => {
    renderConfig();

    expect(screen.getByText("模式检测")).toBeInTheDocument();
    expect(
      screen.getByText("用正则模式检测敏感信息（SSN、信用卡、API 密钥等）"),
    ).toBeInTheDocument();
    expect(screen.getByText("屏蔽关键词")).toBeInTheDocument();
    expect(screen.getByText("屏蔽或脱敏特定敏感词句")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /添加预置模式/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /添加自定义正则/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /添加关键词/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /上传 YAML 文件/ })).toBeInTheDocument();
  });

  it("should show the empty states for patterns and keywords", () => {
    renderConfig();

    expect(screen.getByText("尚未添加模式。")).toBeInTheDocument();
    expect(screen.getByText("尚未添加关键词。")).toBeInTheDocument();
  });

  it("should open the prebuilt pattern modal", async () => {
    const user = userEvent.setup();
    renderConfig();

    expect(screen.queryByText("模式类型")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /添加预置模式/ }));

    expect(await screen.findByText("模式类型")).toBeInTheDocument();
  });

  it("should open the custom regex modal", async () => {
    const user = userEvent.setup();
    renderConfig();

    expect(screen.queryByText("添加自定义正则模式")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /添加自定义正则/ }));

    expect(await screen.findByText("添加自定义正则模式")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., ID-[0-9]{6}")).toBeInTheDocument();
  });

  it("should open the keyword modal", async () => {
    const user = userEvent.setup();
    renderConfig();

    expect(screen.queryByText("添加屏蔽关键词")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /添加关键词/ }));

    expect(await screen.findByText("添加屏蔽关键词")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("输入敏感关键词或短语")).toBeInTheDocument();
  });

  it("should list already selected patterns and keywords", () => {
    renderConfig({
      selectedPatterns: [
        {
          id: "pattern-1",
          type: "prebuilt" as const,
          name: "us_ssn",
          display_name: "US Social Security Number",
          action: "BLOCK" as const,
        },
      ],
      blockedWords: [{ id: "word-1", keyword: "secret", action: "MASK" as const, description: "Sensitive" }],
    });

    expect(screen.getByText("US Social Security Number")).toBeInTheDocument();
    expect(screen.getByText("secret")).toBeInTheDocument();
    expect(screen.queryByText("尚未添加模式。")).not.toBeInTheDocument();
    expect(screen.queryByText("尚未添加关键词。")).not.toBeInTheDocument();
  });

  it("should show only the keyword section when the keywords step is requested", () => {
    renderConfig({ showStep: "keywords" });

    expect(screen.getByText("屏蔽关键词")).toBeInTheDocument();
    expect(screen.queryByText("模式检测")).not.toBeInTheDocument();
  });

  it("should show only the pattern section when the patterns step is requested", () => {
    renderConfig({ showStep: "patterns" });

    expect(screen.getByText("模式检测")).toBeInTheDocument();
    expect(screen.queryByText("屏蔽关键词")).not.toBeInTheDocument();
  });
});
