import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithProviders as render } from "../../../../../tests/test-utils";
import { VectorStoreTester } from "./VectorStoreTester";

const { searchMock } = vi.hoisted(() => ({ searchMock: vi.fn() }));

vi.mock("@/components/networking", () => ({ vectorStoreSearchCall: searchMock }));
vi.mock("@/lib/toast", () => ({
  toast: { warning: vi.fn(), fromError: vi.fn(), success: vi.fn() },
}));

const response = {
  object: "vector_store.search_results",
  search_query: "refund policy",
  data: [{ score: 0.98765, content: [{ type: "text", text: "Refunds take five days." }] }],
};

describe("VectorStoreTester", () => {
  it("renders the result count, rank, score and content labels in Chinese", async () => {
    searchMock.mockResolvedValue(response);
    const user = userEvent.setup();
    render(<VectorStoreTester vectorStoreId="vs_1" accessToken="token" />);

    await user.type(screen.getByRole("textbox"), "refund policy");
    await user.click(screen.getByRole("button", { name: "搜索" }));

    expect(await screen.findByText("结果 1")).toBeInTheDocument();
    expect(screen.getByText("1 个结果")).toBeInTheDocument();
    expect(screen.getByText("得分：0.9877")).toBeInTheDocument();

    await user.click(screen.getByText("结果 1"));

    expect(screen.getByText("内容（text）")).toBeInTheDocument();
  });
});
