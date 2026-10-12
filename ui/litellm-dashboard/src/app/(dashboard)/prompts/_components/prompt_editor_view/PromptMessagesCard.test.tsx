import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../../tests/test-utils";
import { describe, expect, it, vi } from "vitest";
import PromptMessagesCard from "./PromptMessagesCard";

vi.mock("../variable_textarea", () => ({
  default: (props: any) => <textarea value={props.value} onChange={(event) => props.onChange(event.target.value)} />,
}));

describe("PromptMessagesCard", () => {
  it("renders messages and adds another message", () => {
    const onAddMessage = vi.fn();
    renderWithProviders(
      <PromptMessagesCard
        messages={[{ role: "user", content: "Hello" }]}
        onAddMessage={onAddMessage}
        onUpdateMessage={vi.fn()}
        onRemoveMessage={vi.fn()}
        onMoveMessage={vi.fn()}
      />,
    );
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /添加消息/ }));
    expect(onAddMessage).toHaveBeenCalledOnce();
  });

  it.each([
    ["user", "用户"],
    ["assistant", "助手"],
    ["system", "系统"],
  ])("shows the %s role by its human label", (role, label) => {
    renderWithProviders(
      <PromptMessagesCard
        messages={[{ role, content: "Hello" }]}
        onAddMessage={vi.fn()}
        onUpdateMessage={vi.fn()}
        onRemoveMessage={vi.fn()}
        onMoveMessage={vi.fn()}
      />,
    );

    expect(screen.getByRole("combobox", { name: "消息 1 的角色" })).toHaveTextContent(label);
  });
});
