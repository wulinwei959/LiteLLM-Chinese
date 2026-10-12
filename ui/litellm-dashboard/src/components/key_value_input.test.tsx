import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import KeyValueInput, { type KeyValuePair } from "./key_value_input";

const ControlledKeyValueInput = ({ onChange }: { onChange?: (value: readonly KeyValuePair[]) => void }) => {
  const [value, setValue] = useState<readonly KeyValuePair[]>([]);
  return (
    <KeyValueInput
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

describe("KeyValueInput", () => {
  it("renders existing header pairs", () => {
    renderWithProviders(<KeyValueInput value={[["Authorization", "Bearer token"]]} />);

    expect(screen.getByPlaceholderText("请求头名称")).toHaveValue("Authorization");
    expect(screen.getByPlaceholderText("请求头的值")).toHaveValue("Bearer token");
  });

  it("adds a header row and emits edits", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<ControlledKeyValueInput onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /添加请求头$/ }));
    fireEvent.change(screen.getByPlaceholderText("请求头名称"), { target: { value: "X-Trace" } });
    fireEvent.change(screen.getByPlaceholderText("请求头的值"), { target: { value: "enabled" } });

    expect(onChange).toHaveBeenLastCalledWith([["X-Trace", "enabled"]]);
  });

  it("renders no rows once the value prop goes back to empty", () => {
    const { rerender } = renderWithProviders(<KeyValueInput value={[["Authorization", "Bearer token"]]} />);
    expect(screen.getByPlaceholderText("请求头名称")).toHaveValue("Authorization");

    rerender(<KeyValueInput value={[]} />);

    expect(screen.queryByPlaceholderText("请求头名称")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("请求头的值")).not.toBeInTheDocument();
  });

  it("keeps a half-typed row editable while its name is still empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ControlledKeyValueInput />);

    await user.click(screen.getByRole("button", { name: /添加请求头$/ }));
    await user.click(screen.getByRole("button", { name: /添加请求头$/ }));
    expect(screen.getAllByPlaceholderText("请求头名称")).toHaveLength(2);

    fireEvent.change(screen.getAllByPlaceholderText("请求头的值")[1], { target: { value: "pending" } });

    expect(screen.getAllByPlaceholderText("请求头名称")).toHaveLength(2);
    expect(screen.getAllByPlaceholderText("请求头的值")[1]).toHaveValue("pending");
  });

  it("removes only the row whose remove button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <KeyValueInput
        value={[
          ["a", "1"],
          ["b", "2"],
        ]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "移除请求头 1" }));

    expect(onChange).toHaveBeenLastCalledWith([["b", "2"]]);
  });
});
