import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import { ChartLoader } from "./chart_loader";

describe("ChartLoader", () => {
  it("should render", () => {
    renderWithProviders(<ChartLoader />);
    expect(screen.getByText("正在加载图表数据...")).toBeInTheDocument();
  });

  it("should show loading text by default", () => {
    renderWithProviders(<ChartLoader />);
    expect(screen.getByText("正在获取你的数据")).toBeInTheDocument();
  });

  it("should show date-changing text when isDateChanging is true", () => {
    renderWithProviders(<ChartLoader isDateChanging />);
    expect(screen.getByText("正在处理日期选择...")).toBeInTheDocument();
    expect(screen.getByText("稍等片刻即可完成")).toBeInTheDocument();
  });

  it("should not show default loading text when isDateChanging is true", () => {
    renderWithProviders(<ChartLoader isDateChanging />);
    expect(screen.queryByText("正在加载图表数据...")).not.toBeInTheDocument();
    expect(screen.queryByText("正在获取你的数据")).not.toBeInTheDocument();
  });
});
