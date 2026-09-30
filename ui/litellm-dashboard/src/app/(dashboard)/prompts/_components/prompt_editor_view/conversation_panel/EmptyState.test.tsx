import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../../../tests/test-utils";
import { describe, expect, it } from "vitest";
import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("explains when variables must be filled", () => {
    renderWithProviders(<EmptyState hasVariables />);
    expect(screen.getByText(/fill in the variables/i)).toBeInTheDocument();
  });
});
