import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../tests/test-utils";

import { SimpleTable, type SimpleTableColumn } from "./simple_table";

interface Row {
  name: string;
  spend: number;
}

const columns: SimpleTableColumn<Row>[] = [
  { header: "Name", accessor: "name" },
  { header: "Spend", accessor: "spend", numeric: true },
];

describe("SimpleTable numeric columns", () => {
  it("right-aligns the header and cells of a numeric column only", () => {
    renderWithProviders(<SimpleTable data={[{ name: "Alice", spend: 42 }]} columns={columns} />);

    expect(screen.getByRole("columnheader", { name: "Spend" })).toHaveClass("text-right", "tabular-nums");
    expect(screen.getByRole("cell", { name: "42" })).toHaveClass("text-right", "tabular-nums");
    expect(screen.getByRole("columnheader", { name: "Name" })).not.toHaveClass("text-right");
    expect(screen.getByRole("cell", { name: "Alice" })).not.toHaveClass("text-right");
  });
});

describe("SimpleTable fallback messages", () => {
  it("falls back to the translated loading and empty messages", () => {
    renderWithProviders(<SimpleTable data={[]} columns={columns} isLoading />);
    expect(screen.getByText("加载中...")).toBeInTheDocument();
  });

  it("shows the translated no-data message when the rows are empty", () => {
    renderWithProviders(<SimpleTable data={[]} columns={columns} />);
    expect(screen.getByText("暂无数据")).toBeInTheDocument();
  });
});
