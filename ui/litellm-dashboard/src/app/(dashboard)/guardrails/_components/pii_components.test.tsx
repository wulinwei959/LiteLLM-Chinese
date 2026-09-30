import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import { describe, it, expect } from "vitest";
import { CategoryFilter, QuickActions, PiiEntityList } from "./pii_components";
import type { PiiEntityCategory } from "@/components/guardrails/types";

describe("CategoryFilter", () => {
  it("should render", () => {
    const emptyCategories: PiiEntityCategory[] = [];
    renderWithProviders(<CategoryFilter categories={emptyCategories} selectedCategories={[]} onChange={() => {}} />);
    expect(screen.getByText("Filter by category")).toBeInTheDocument();
  });
});

describe("QuickActions", () => {
  it("should render", () => {
    renderWithProviders(<QuickActions onSelectAll={() => {}} onUnselectAll={() => {}} hasSelectedEntities={false} />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });
});

describe("PiiEntityList", () => {
  it("should render", () => {
    renderWithProviders(
      <PiiEntityList
        entities={[]}
        selectedEntities={[]}
        selectedActions={{}}
        actions={[]}
        onEntitySelect={() => {}}
        onActionSelect={() => {}}
        entityToCategoryMap={new Map()}
      />,
    );
    expect(screen.getByText("No PII types match your filter criteria")).toBeInTheDocument();
  });
});
