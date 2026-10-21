import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "@/components/shared/DataTable";
import { renderWithProviders } from "../../../tests/test-utils";
import { getModelHubTableColumns, ModelHubData } from "./ModelHubTableColumns";

const mockModel: ModelHubData = {
  model_group: "gpt-4o",
  providers: ["openai", "azure", "bedrock"],
  max_input_tokens: 128000,
  max_output_tokens: 16384,
  input_cost_per_token: 0.0000025,
  output_cost_per_token: 0.00001,
  mode: "chat",
  supports_parallel_function_calling: false,
  supports_vision: true,
  supports_function_calling: true,
  is_public_model_group: true,
};

function ModelHubTableHarness({
  data,
  onModelClick,
}: {
  data: ModelHubData[];
  onModelClick: (m: ModelHubData) => void;
}) {
  const t = useTranslations("modelHub");
  const commonT = useTranslations("common");
  const columns = useMemo(() => getModelHubTableColumns({ onModelClick, t, commonT }), [onModelClick, t, commonT]);
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(model, index) => model.model_group || String(index)}
      sortingMode="client"
      size="compact"
    />
  );
}

function renderTable(data: ModelHubData[], onModelClick = vi.fn()) {
  renderWithProviders(<ModelHubTableHarness data={data} onModelClick={onModelClick} />);
  return onModelClick;
}

describe("getModelHubTableColumns", () => {
  it("renders the model row", () => {
    renderTable([mockModel]);
    expect(screen.getByText("gpt-4o")).toBeInTheDocument();
    expect(screen.getByText("公共模型名称")).toBeInTheDocument();
    expect(screen.getByText("提供商")).toBeInTheDocument();
    expect(screen.getByText("模式")).toBeInTheDocument();
    expect(screen.getByText("Token 数")).toBeInTheDocument();
    expect(screen.getByText("成本/1M")).toBeInTheDocument();
    expect(screen.getByText("公开")).toBeInTheDocument();
    expect(screen.queryByText("URL")).not.toBeInTheDocument();
  });

  it("shows the legacy evaluation mode as decisions", () => {
    renderTable([{ ...mockModel, mode: "evaluation" }]);
    expect(screen.getByText("decisions")).toBeInTheDocument();
    expect(screen.queryByText("evaluation")).not.toBeInTheDocument();
  });

  it("shows the first two providers and '+1' for overflow", () => {
    renderTable([mockModel]);
    expect(screen.getByText("openai")).toBeInTheDocument();
    expect(screen.getByText("azure")).toBeInTheDocument();
    expect(screen.queryByText("bedrock")).not.toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("formats token limits and per-million costs", () => {
    renderTable([mockModel]);
    expect(screen.getByText("128.0K / 16.4K")).toBeInTheDocument();
    expect(screen.getByText("$2.50")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "128.0K / 16.4K" })).toHaveClass("text-right");
    expect(screen.getByRole("cell", { name: /\$2\.50/ })).toHaveClass("text-right");
    expect(screen.getByRole("cell", { name: "gpt-4o" })).not.toHaveClass("text-right");
  });

  it("shows capability badges only for supported features", () => {
    renderTable([mockModel]);
    expect(screen.getByText("功能")).toBeInTheDocument();
    expect(screen.getByText("Vision")).toBeInTheDocument();
    expect(screen.getByText("Function Calling")).toBeInTheDocument();
    expect(screen.queryByText("Parallel Function Calling")).not.toBeInTheDocument();
  });

  it("shows the public status badge", () => {
    renderTable([mockModel]);
    expect(screen.getByText("是")).toBeInTheDocument();
    renderTable([{ ...mockModel, model_group: "private-model", is_public_model_group: false }]);
    expect(screen.getByText("否")).toBeInTheDocument();
  });

  it("opens the model details when the name is clicked", async () => {
    const user = userEvent.setup();
    const onModelClick = renderTable([mockModel]);
    await user.click(screen.getByRole("button", { name: "gpt-4o" }));
    expect(onModelClick).toHaveBeenCalledWith(mockModel);
  });

  it("opens the model details from the actions menu", async () => {
    const user = userEvent.setup();
    const onModelClick = renderTable([mockModel]);
    await user.click(screen.getByRole("button", { name: "打开模型操作菜单" }));
    const detailsItem = await screen.findByTestId("model-hub-action-details");
    expect(detailsItem).toHaveTextContent("查看详情");
    await user.click(detailsItem);
    expect(onModelClick).toHaveBeenCalledWith(mockModel);
  });

  it("copies the model name from the actions menu", async () => {
    const user = userEvent.setup();
    renderTable([mockModel]);
    await user.click(screen.getByTestId("model-hub-actions-gpt-4o"));
    const copyItem = await screen.findByTestId("model-hub-action-copy");
    expect(copyItem).toHaveTextContent("复制模型名称");
    await user.click(copyItem);
    expect(await window.navigator.clipboard.readText()).toBe("gpt-4o");
  });
});
