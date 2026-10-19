import { describe, it, expect } from "vitest";
import type React from "react";
import { render, screen } from "@testing-library/react";
import { LocaleProvider } from "@/contexts/LocaleContext";

const wrap = (ui: React.ReactElement) => render(<LocaleProvider locale="zh-CN">{ui}</LocaleProvider>);
import userEvent from "@testing-library/user-event";
import { SimpleTooltip } from "./tooltip";

describe("SimpleTooltip", () => {
  it("should render", () => {
    wrap(<SimpleTooltip content="Help text" />);
    expect(screen.getByLabelText("帮助")).toBeInTheDocument();
  });

  it("should render children instead of the default icon when provided", () => {
    wrap(
      <SimpleTooltip content="Help text">
        <button>Info</button>
      </SimpleTooltip>,
    );
    expect(screen.getByRole("button", { name: /info/i })).toBeInTheDocument();
    expect(screen.queryByLabelText("帮助")).not.toBeInTheDocument();
  });

  it("should show tooltip content on mouse enter", async () => {
    const user = userEvent.setup();
    wrap(<SimpleTooltip content="Help text" />);

    await user.hover(screen.getByLabelText("帮助"));

    expect(screen.getByText("Help text")).toBeInTheDocument();
  });

  it("should hide tooltip content on mouse leave", async () => {
    const user = userEvent.setup();
    wrap(<SimpleTooltip content="Help text" />);

    await user.hover(screen.getByLabelText("帮助"));
    expect(screen.getByText("Help text")).toBeInTheDocument();

    await user.unhover(screen.getByLabelText("帮助"));
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });

  it("should not show tooltip content before hovering", () => {
    wrap(<SimpleTooltip content="Help text" />);
    expect(screen.queryByText("Help text")).not.toBeInTheDocument();
  });

  it("should keep rendering children when there is no content to show", async () => {
    const user = userEvent.setup();
    wrap(
      <SimpleTooltip content={undefined}>
        <button>Pick a rubric</button>
      </SimpleTooltip>,
    );

    const trigger = screen.getByRole("button", { name: /pick a rubric/i });
    await user.hover(trigger);

    expect(trigger).toBeInTheDocument();
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
  });

  it("should place the tooltip on the requested side", async () => {
    const user = userEvent.setup();
    wrap(<SimpleTooltip content="Help text" side="right" />);

    await user.hover(screen.getByLabelText("帮助"));

    expect(await screen.findByText("Help text")).toHaveAttribute("data-side", "right");
  });
});
