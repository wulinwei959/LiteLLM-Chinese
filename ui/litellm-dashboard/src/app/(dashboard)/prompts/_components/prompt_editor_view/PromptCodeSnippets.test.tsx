import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../../tests/test-utils";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PromptCodeSnippets from "./PromptCodeSnippets";

describe("PromptCodeSnippets", () => {
  it("opens generated code for the selected prompt", async () => {
    renderWithProviders(
      <PromptCodeSnippets
        promptId="welcome"
        model="gpt-4o"
        promptVariables={{ name: "Ada" }}
        accessToken="token"
        version="2"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /获取代码/ }));
    expect(await screen.findByText("生成的代码")).toBeInTheDocument();
    expect(screen.getByText(/welcome/)).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: "生成代码类型" })).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toHaveClass("max-h-[calc(100dvh-2rem)]", "overflow-y-auto");
  });

  it("shows the selected language by its human label on the trigger", async () => {
    const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
    renderWithProviders(
      <PromptCodeSnippets
        promptId="welcome"
        model="gpt-4o"
        promptVariables={{ name: "Ada" }}
        accessToken="token"
        version="2"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /获取代码/ }));

    const trigger = await screen.findByRole("combobox", { name: "语言" });
    expect(trigger).toHaveTextContent("cURL");

    await user.click(trigger);
    const python = await screen.findByRole("option", { name: "Python (OpenAI SDK)" });
    await user.click(python);

    expect(screen.getByRole("combobox", { name: "语言" })).toHaveTextContent("Python (OpenAI SDK)");
  });

  it("shows a key placeholder when there is no access token", async () => {
    const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
    renderWithProviders(<PromptCodeSnippets promptId="welcome" model="gpt-4o" accessToken={null} version="2" />);
    await user.click(screen.getByRole("button", { name: /获取代码/ }));
    await screen.findByText("生成的代码");

    await user.click(screen.getByRole("button", { name: /复制到剪贴板/ }));
    expect(await navigator.clipboard.readText()).toContain("'Authorization: Bearer <your-master-key>'");
  });

  it("includes the viewed environment in every generated request", async () => {
    const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
    renderWithProviders(
      <PromptCodeSnippets
        promptId="welcome"
        model="gpt-4o"
        accessToken="token"
        version="2"
        environment="development"
      />,
    );
    await user.click(screen.getByRole("button", { name: /获取代码/ }));
    await screen.findByText("生成的代码");

    await user.click(screen.getByRole("button", { name: /复制到剪贴板/ }));
    expect(await navigator.clipboard.readText()).toContain('"prompt_environment": "development"');

    await user.click(screen.getByRole("tab", { name: "带版本" }));
    await user.click(screen.getByRole("button", { name: /复制到剪贴板/ }));
    const versionSnippet = await navigator.clipboard.readText();
    expect(versionSnippet).toContain('"prompt_environment": "development"');
    expect(versionSnippet).toContain('"prompt_version": 2');
  });
});
