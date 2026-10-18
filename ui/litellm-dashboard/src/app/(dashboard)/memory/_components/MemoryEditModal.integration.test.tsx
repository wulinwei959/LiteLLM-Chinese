import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MemoryRow } from "@/components/networking";

import { MemoryEditModal } from "./MemoryEditModal";

const onSave = vi.fn<(key: string, value: string, metadataText: string, isCreate: boolean) => Promise<boolean>>();
const onClose = vi.fn();

const existingRow: MemoryRow = {
  memory_id: "mem-1",
  key: "user:profile",
  value: "The user prefers concise answers.",
  metadata: { tags: ["example"] },
};

const renderModal = (props: Partial<React.ComponentProps<typeof MemoryEditModal>> = {}) =>
  render(<MemoryEditModal open mode="create" onClose={onClose} onSave={onSave} {...props} />);

const fill = async (user: ReturnType<typeof userEvent.setup>, label: RegExp, text: string) => {
  await user.click(screen.getByLabelText(label));
  await user.paste(text);
};

describe("MemoryEditModal payload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onSave.mockResolvedValue(true);
  });

  it("sends the trimmed key, the value and the raw metadata text on create", async () => {
    const user = userEvent.setup();
    renderModal();

    await fill(user, /^键/, "  user_role  ");
    await fill(user, /^内容/, "Remembers the user is an admin");
    await fill(user, /^元数据/, '{"tags": ["example"]}');
    await user.click(screen.getByRole("button", { name: "创建" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("user_role", "Remembers the user is an admin", '{"tags": ["example"]}', true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sends an empty string for metadata the user never typed into", async () => {
    const user = userEvent.setup();
    renderModal();

    await fill(user, /^键/, "user_role");
    await fill(user, /^内容/, "Remembers the user is an admin");
    await user.click(screen.getByRole("button", { name: "创建" }));

    expect(onSave).toHaveBeenCalledWith("user_role", "Remembers the user is an admin", "", true);
  });

  it("prefills from the row and sends the edited value with isCreate false", async () => {
    const user = userEvent.setup();
    renderModal({ mode: "edit", initialRow: existingRow });

    expect(await screen.findByLabelText(/^键/)).toHaveValue("user:profile");
    expect(screen.getByLabelText(/^键/)).toBeDisabled();
    expect(screen.getByLabelText(/^内容/)).toHaveValue("The user prefers concise answers.");
    expect(screen.getByLabelText(/^元数据/)).toHaveValue('{\n  "tags": [\n    "example"\n  ]\n}');

    await user.clear(screen.getByLabelText(/^内容/));
    await fill(user, /^内容/, "The user prefers long answers.");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(onSave).toHaveBeenCalledWith(
      "user:profile",
      "The user prefers long answers.",
      '{\n  "tags": [\n    "example"\n  ]\n}',
      false,
    );
  });

  it("sends an empty metadata string for a row that has none", async () => {
    const user = userEvent.setup();
    renderModal({ mode: "edit", initialRow: { ...existingRow, metadata: null } });

    expect(await screen.findByLabelText(/^元数据/)).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(onSave).toHaveBeenCalledWith("user:profile", "The user prefers concise answers.", "", false);
  });

  it("keeps the modal open when the save is rejected by the caller", async () => {
    const user = userEvent.setup();
    onSave.mockResolvedValue(false);
    renderModal();

    await fill(user, /^键/, "user_role");
    await fill(user, /^内容/, "Remembers the user is an admin");
    await user.click(screen.getByRole("button", { name: "创建" }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("reports each required field as soon as it is emptied", async () => {
    const user = userEvent.setup();
    renderModal();

    await fill(user, /^键/, "user_role");
    await fill(user, /^内容/, "Remembers the user is an admin");
    expect(screen.queryByText("请输入键名")).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText(/^键/));
    expect(await screen.findByText("请输入键名")).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/^内容/));
    expect(await screen.findByText("请输入内容")).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
