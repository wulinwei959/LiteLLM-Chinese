import { renderWithProviders as render, screen } from "../../tests/test-utils";
import { describe, expect, it, vi } from "vitest";

import RoutePreview from "./route_preview";

vi.mock("./networking", () => ({ getProxyBaseUrl: () => "http://proxy.test" }));

describe("RoutePreview", () => {
  it("stays hidden until both route values are provided", () => {
    render(<RoutePreview pathValue="/images" targetValue="" includeSubpath={false} />);

    expect(screen.queryByText("Route Preview")).not.toBeInTheDocument();
  });

  it("shows the proxy route and forwarding target", () => {
    render(<RoutePreview pathValue="/images" targetValue="https://upstream.test" includeSubpath={false} />);

    expect(screen.getByText("http://proxy.test/images")).toBeInTheDocument();
    expect(screen.getByText("https://upstream.test")).toBeInTheDocument();
    expect(screen.getByText(/没有看到预期的路由？/)).toBeInTheDocument();
  });

  it("previews appended subpaths when enabled", () => {
    render(<RoutePreview pathValue="/images" targetValue="https://upstream.test" includeSubpath />);

    expect(screen.getByText("带子路径时：")).toBeInTheDocument();
    expect(screen.getAllByText("/v1/text-to-image/base/model")).toHaveLength(2);
    expect(screen.getByText(/\/images 之后的任何路径都会追加到目标 URL/)).toBeInTheDocument();
  });
});
