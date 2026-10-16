import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders as render } from "../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import QueryParamInput from "./query_param_input";
import type { KeyValuePair } from "./key_value_input";

const ControlledQueryParamInput = ({ onChange }: { onChange?: (value: readonly KeyValuePair[]) => void }) => {
  const [value, setValue] = useState<readonly KeyValuePair[]>([]);
  return (
    <QueryParamInput
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

describe("QueryParamInput", () => {
  it("renders existing query parameter pairs", () => {
    render(<QueryParamInput value={[["version", "v1"]]} />);

    expect(screen.getByPlaceholderText("参数名（例如 version）")).toHaveValue("version");
    expect(screen.getByPlaceholderText("参数值（例如 v1）")).toHaveValue("v1");
  });

  it("adds a query parameter row and emits edits", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledQueryParamInput onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /添加查询参数$/ }));
    fireEvent.change(screen.getByPlaceholderText("参数名（例如 version）"), { target: { value: "region" } });
    fireEvent.change(screen.getByPlaceholderText("参数值（例如 v1）"), { target: { value: "us-west" } });

    expect(onChange).toHaveBeenLastCalledWith([["region", "us-west"]]);
  });

  it("renders no rows once the value prop goes back to empty", () => {
    const { rerender } = render(<QueryParamInput value={[["version", "v1"]]} />);
    expect(screen.getByPlaceholderText("参数名（例如 version）")).toHaveValue("version");

    rerender(<QueryParamInput value={[]} />);

    expect(screen.queryByPlaceholderText("参数名（例如 version）")).not.toBeInTheDocument();
  });

  it("keeps a half-typed row editable while its name is still empty", async () => {
    const user = userEvent.setup();
    render(<ControlledQueryParamInput />);

    await user.click(screen.getByRole("button", { name: /添加查询参数$/ }));
    await user.click(screen.getByRole("button", { name: /添加查询参数$/ }));

    expect(screen.getAllByPlaceholderText("参数名（例如 version）")).toHaveLength(2);
  });
});
