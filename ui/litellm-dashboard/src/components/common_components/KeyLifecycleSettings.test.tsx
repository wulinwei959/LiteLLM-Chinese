import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import userEvent, { PointerEventsCheckLevel } from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { chooseSelectOption, fireEvent, renderWithProviders, screen, waitFor } from "../../../tests/test-utils";
import KeyLifecycleSettings from "./KeyLifecycleSettings";

const CREATE_PLACEHOLDER = "例如 30d，或留空表示永不过期";
const EDIT_PLACEHOLDER = "例如 30d";

interface HarnessProps {
  isCreateMode?: boolean;
  onFinish?: (values: Record<string, unknown>) => void;
}

const Harness: React.FC<HarnessProps> = ({ isCreateMode = true, onFinish = () => {} }) => {
  const form = useForm<{ duration: string }>({ defaultValues: { duration: "" } });
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(false);
  const [rotationInterval, setRotationInterval] = useState("");
  const [neverExpire, setNeverExpire] = useState(false);

  return (
    <form onSubmit={form.handleSubmit(onFinish)}>
      <Controller
        control={form.control}
        name="duration"
        render={({ field }) => (
          <KeyLifecycleSettings
            id={field.name}
            value={field.value}
            onChange={field.onChange}
            autoRotationEnabled={autoRotationEnabled}
            onAutoRotationChange={setAutoRotationEnabled}
            rotationInterval={rotationInterval}
            onRotationIntervalChange={setRotationInterval}
            isCreateMode={isCreateMode}
            neverExpire={neverExpire}
            onNeverExpireChange={setNeverExpire}
          />
        )}
      />
      <button type="submit">submit</button>
      <button type="button" onClick={() => form.reset()}>
        reset
      </button>
      <span data-testid="rotation-interval-value">{rotationInterval}</span>
    </form>
  );
};

const getDurationInput = (isCreateMode = true) =>
  screen.getByPlaceholderText(isCreateMode ? CREATE_PLACEHOLDER : EDIT_PLACEHOLDER) as HTMLInputElement;

const isRenderedSelection = (el: HTMLElement): boolean => !el.closest('[role="listbox"]');

describe("KeyLifecycleSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the expiry and auto-rotation sections", () => {
    renderWithProviders(<Harness />);
    expect(screen.getByText("密钥有效期设置")).toBeInTheDocument();
    expect(screen.getByText("自动轮换设置")).toBeInTheDocument();
    expect(getDurationInput()).toBeInTheDocument();
  });

  it("gives the duration input and the Never Expire checkbox their own labels", () => {
    renderWithProviders(<Harness isCreateMode={false} />);
    expect(screen.getByLabelText("密钥过期时间")).toBe(getDurationInput(false));
    expect(screen.getByRole("checkbox", { name: "永不过期" })).toBeInTheDocument();
  });

  it("uses the create-mode placeholder in create mode", () => {
    renderWithProviders(<Harness isCreateMode={true} />);
    expect(screen.getByPlaceholderText(CREATE_PLACEHOLDER)).toBeInTheDocument();
  });

  it("uses the edit-mode placeholder in edit mode", () => {
    renderWithProviders(<Harness isCreateMode={false} />);
    expect(screen.getByPlaceholderText(EDIT_PLACEHOLDER)).toBeInTheDocument();
  });

  describe("duration is a single source of truth (regression for pre-filled value dropped on submit)", () => {
    it("submits the duration the user typed", async () => {
      const user = userEvent.setup();
      const onFinish = vi.fn();
      renderWithProviders(<Harness onFinish={onFinish} />);

      fireEvent.change(getDurationInput(), { target: { value: "1d" } });
      await user.click(screen.getByRole("button", { name: "submit" }));

      await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
      expect(onFinish.mock.calls[0][0]).toMatchObject({ duration: "1d" });
    });

    it("clears the displayed value when the form is reset, so no stale value lingers", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Harness />);

      fireEvent.change(getDurationInput(), { target: { value: "1d" } });
      expect(getDurationInput().value).toBe("1d");

      await user.click(screen.getByRole("button", { name: "reset" }));

      await waitFor(() => expect(getDurationInput().value).toBe(""));
    });

    it("never submits a value that differs from what is displayed after a reset", async () => {
      const user = userEvent.setup();
      const onFinish = vi.fn();
      renderWithProviders(<Harness onFinish={onFinish} />);

      // First create: type "1d" and submit -> "1d" is sent.
      fireEvent.change(getDurationInput(), { target: { value: "1d" } });
      await user.click(screen.getByRole("button", { name: "submit" }));
      await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
      expect(onFinish.mock.calls[0][0]).toMatchObject({ duration: "1d" });

      // Second create: form resets, so the field must show empty AND submit empty.
      // The old bug showed a stale "1d" while submitting null/empty.
      await user.click(screen.getByRole("button", { name: "reset" }));
      await waitFor(() => expect(getDurationInput().value).toBe(""));

      await user.click(screen.getByRole("button", { name: "submit" }));
      await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(2));
      expect(onFinish.mock.calls[1][0].duration).not.toBe("1d");
      expect(getDurationInput().value).toBe(onFinish.mock.calls[1][0].duration ?? "");
    });
  });

  describe("Never Expire", () => {
    it("clears and disables the duration input, then submits an empty duration", async () => {
      const user = userEvent.setup();
      const onFinish = vi.fn();
      renderWithProviders(<Harness isCreateMode={false} onFinish={onFinish} />);

      fireEvent.change(getDurationInput(false), { target: { value: "30d" } });
      expect(getDurationInput(false).value).toBe("30d");

      await user.click(screen.getByRole("checkbox", { name: "永不过期" }));

      await waitFor(() => expect(getDurationInput(false).value).toBe(""));
      expect(getDurationInput(false)).toBeDisabled();

      await user.click(screen.getByRole("button", { name: "submit" }));
      await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
      expect(onFinish.mock.calls[0][0]).toMatchObject({ duration: "" });
    });
  });

  describe("Auto-Rotation", () => {
    it("reveals the rotation interval controls when enabled", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Harness />);

      expect(screen.queryByText("轮换周期")).not.toBeInTheDocument();
      await user.click(screen.getByRole("switch"));

      expect(await screen.findByText("轮换周期")).toBeInTheDocument();
    });

    it("propagates a selected predefined interval", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Harness />);

      await user.click(screen.getByRole("switch"));
      expect(await screen.findByText("轮换周期")).toBeInTheDocument();

      await chooseSelectOption(user, screen.getByRole("combobox"), "90 天");

      await waitFor(() => expect(screen.getAllByTitle("90 天").some(isRenderedSelection)).toBe(true));
      expect(screen.getByTestId("rotation-interval-value")).toHaveTextContent("90d");
    });

    it("shows the custom interval input when Custom interval is selected, without propagating yet", async () => {
      const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
      renderWithProviders(<Harness />);

      await user.click(screen.getByRole("switch"));
      expect(await screen.findByText("轮换周期")).toBeInTheDocument();

      await chooseSelectOption(user, screen.getByRole("combobox"), "自定义周期");

      expect(await screen.findByPlaceholderText("例如 1s、5m、2h、14d")).toBeInTheDocument();
      expect(screen.getByText("支持的单位：秒（s）、分钟（m）、小时（h）、天（d）")).toBeInTheDocument();
      expect(screen.getByTestId("rotation-interval-value")).toHaveTextContent("");
    });

    it("propagates a typed custom interval to the parent", async () => {
      const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
      renderWithProviders(<Harness />);

      await user.click(screen.getByRole("switch"));
      expect(await screen.findByText("轮换周期")).toBeInTheDocument();

      await chooseSelectOption(user, screen.getByRole("combobox"), "自定义周期");

      const customInput = await screen.findByPlaceholderText("例如 1s、5m、2h、14d");
      fireEvent.change(customInput, { target: { value: "14d" } });

      await waitFor(() => expect(screen.getByTestId("rotation-interval-value")).toHaveTextContent("14d"));
      expect((customInput as HTMLInputElement).value).toBe("14d");
    });

    it("hides the custom input and propagates the value when switching back to a predefined interval", async () => {
      const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never });
      renderWithProviders(<Harness />);

      await user.click(screen.getByRole("switch"));
      expect(await screen.findByText("轮换周期")).toBeInTheDocument();

      await chooseSelectOption(user, screen.getByRole("combobox"), "自定义周期");
      const customInput = await screen.findByPlaceholderText("例如 1s、5m、2h、14d");
      fireEvent.change(customInput, { target: { value: "14d" } });
      await waitFor(() => expect(screen.getByTestId("rotation-interval-value")).toHaveTextContent("14d"));

      await chooseSelectOption(user, screen.getByRole("combobox"), "7 天");

      await waitFor(() => expect(screen.getByTestId("rotation-interval-value")).toHaveTextContent("7d"));
      expect(screen.queryByPlaceholderText("例如 1s、5m、2h、14d")).not.toBeInTheDocument();
    });
  });
});
