import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PassThroughEndpointsTable } from "./PassThroughEndpointsTable";
import type { passThroughItem } from "./PassThroughSettings";

const endpoints: passThroughItem[] = [
  {
    id: "ep-1",
    path: "/v1/rerank",
    target: "https://api.cohere.com/v1/rerank",
    headers: { Authorization: "Bearer secret-value" },
    auth: true,
    methods: ["POST"],
  },
  {
    id: "ep-2",
    path: "/bria",
    target: "https://engine.prod.bria-api.com",
    headers: {},
    auth: false,
  },
];

const defaultProps = {
  endpoints,
  isLoading: false,
  onEndpointClick: vi.fn(),
  onDeleteClick: vi.fn(),
};

describe("PassThroughEndpointsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a row per endpoint with path and target", () => {
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} />);
    expect(screen.getByText("/v1/rerank")).toBeInTheDocument();
    expect(screen.getByText("https://api.cohere.com/v1/rerank")).toBeInTheDocument();
    expect(screen.getByText("/bria")).toBeInTheDocument();
  });

  it("should open the endpoint when its ID is clicked", async () => {
    const user = userEvent.setup();
    const onEndpointClick = vi.fn();
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} onEndpointClick={onEndpointClick} />);
    await user.click(screen.getByRole("button", { name: "ep-1" }));
    expect(onEndpointClick).toHaveBeenCalledWith("ep-1");
  });

  it("should show method chips, or ALL when no methods are set", () => {
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} />);
    expect(screen.getByText("POST")).toBeInTheDocument();
    expect(screen.getByText("全部")).toBeInTheDocument();
  });

  it("should show authentication as Yes or No", () => {
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} />);
    expect(screen.getByText("是")).toBeInTheDocument();
    expect(screen.getByText("否")).toBeInTheDocument();
  });

  it("should mask headers until the visibility toggle is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} />);

    expect(screen.queryByText(/secret-value/)).not.toBeInTheDocument();
    const toggles = screen.getAllByRole("button", { name: "显示请求头" });
    await user.click(toggles[0]);
    expect(screen.getByText(/secret-value/)).toBeInTheDocument();
  });

  it("should edit and delete an endpoint through the actions menu", async () => {
    const user = userEvent.setup();
    const onEndpointClick = vi.fn();
    const onDeleteClick = vi.fn();
    renderWithProviders(
      <PassThroughEndpointsTable {...defaultProps} onEndpointClick={onEndpointClick} onDeleteClick={onDeleteClick} />,
    );

    await user.click(screen.getByTestId("endpoint-actions-ep-1"));
    await user.click(await screen.findByTestId("endpoint-action-edit"));
    expect(onEndpointClick).toHaveBeenCalledWith("ep-1");

    await user.click(screen.getByTestId("endpoint-actions-ep-1"));
    await user.click(await screen.findByTestId("endpoint-action-delete"));
    expect(onDeleteClick).toHaveBeenCalledWith("ep-1");
  });

  it("should disable edit and delete for config-defined endpoints", async () => {
    const user = userEvent.setup();
    const onEndpointClick = vi.fn();
    const onDeleteClick = vi.fn();
    const configEndpoint: passThroughItem = {
      id: "ep-config",
      path: "/from-config",
      target: "https://config.example.com",
      headers: {},
      is_from_config: true,
    };
    renderWithProviders(
      <PassThroughEndpointsTable
        {...defaultProps}
        endpoints={[configEndpoint]}
        onEndpointClick={onEndpointClick}
        onDeleteClick={onDeleteClick}
      />,
    );

    await user.click(screen.getByTestId("endpoint-actions-ep-config"));
    const editItem = await screen.findByTestId("endpoint-action-edit");
    const deleteItem = await screen.findByTestId("endpoint-action-delete");

    expect(editItem).toHaveAttribute("data-disabled");
    expect(deleteItem).toHaveAttribute("data-disabled");
    expect(screen.getByTestId("endpoint-config-hint")).toHaveTextContent(
      "该端点在配置文件中定义，无法在控制面板上编辑或删除。",
    );

    await user.click(editItem);
    await user.click(deleteItem);

    expect(onEndpointClick).not.toHaveBeenCalled();
    expect(onDeleteClick).not.toHaveBeenCalled();
  });

  it("should not show the config hint for DB endpoints", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} />);

    await user.click(screen.getByTestId("endpoint-actions-ep-1"));
    await screen.findByTestId("endpoint-action-delete");
    expect(screen.queryByTestId("endpoint-config-hint")).not.toBeInTheDocument();
  });

  it("should label endpoint source as Config or DB", () => {
    const configEndpoint: passThroughItem = {
      id: "ep-config",
      path: "/from-config",
      target: "https://config.example.com",
      headers: {},
      is_from_config: true,
    };
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} endpoints={[...endpoints, configEndpoint]} />);
    expect(screen.getByText("配置文件")).toBeInTheDocument();
    expect(screen.getAllByText("DB")).toHaveLength(2);
  });

  it("should disable edit and delete for endpoints without an id", async () => {
    const user = userEvent.setup();
    const onEndpointClick = vi.fn();
    const onDeleteClick = vi.fn();
    const endpointWithoutId: passThroughItem = { path: "/legacy", target: "https://legacy.example.com", headers: {} };
    renderWithProviders(
      <PassThroughEndpointsTable
        {...defaultProps}
        endpoints={[endpointWithoutId]}
        onEndpointClick={onEndpointClick}
        onDeleteClick={onDeleteClick}
      />,
    );

    await user.click(screen.getByTestId("endpoint-actions-/legacy"));
    const editItem = await screen.findByTestId("endpoint-action-edit");
    const deleteItem = await screen.findByTestId("endpoint-action-delete");

    expect(editItem).toHaveAttribute("data-disabled");
    expect(deleteItem).toHaveAttribute("data-disabled");

    await user.click(editItem);
    await user.click(deleteItem);

    expect(onEndpointClick).not.toHaveBeenCalled();
    expect(onDeleteClick).not.toHaveBeenCalled();
  });

  it("should show the empty state when there are no endpoints", () => {
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} endpoints={[]} />);
    expect(screen.getByText("尚未配置直通端点")).toBeInTheDocument();
  });

  it("should show skeleton rows while loading", () => {
    renderWithProviders(<PassThroughEndpointsTable {...defaultProps} endpoints={[]} isLoading />);
    expect(screen.getAllByTestId("skeleton-row").length).toBeGreaterThan(0);
    expect(screen.queryByText("尚未配置直通端点")).not.toBeInTheDocument();
  });
});
