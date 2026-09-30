import { createRef } from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../../../tests/test-utils";
import { describe, expect, it } from "vitest";
import MessageList from "./MessageList";

describe("MessageList", () => {
  it("renders conversation messages", () => {
    renderWithProviders(
      <MessageList
        messages={[{ role: "user", content: "Hello" }]}
        isLoading={false}
        hasVariables={false}
        messagesEndRef={createRef<HTMLDivElement>()}
      />,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
