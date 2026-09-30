import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import { describe, it, expect } from "vitest";
import PiiConfiguration from "./pii_configuration";

describe("PiiConfiguration", () => {
  it("should render", () => {
    renderWithProviders(
      <PiiConfiguration
        entities={[]}
        actions={[]}
        selectedEntities={[]}
        selectedActions={{}}
        onEntitySelect={() => {}}
        onActionSelect={() => {}}
        entityCategories={[]}
      />,
    );
    expect(screen.getByText("Configure PII Protection")).toBeInTheDocument();
  });
});
