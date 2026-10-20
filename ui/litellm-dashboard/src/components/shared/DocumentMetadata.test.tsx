import { waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../tests/test-utils";
import DocumentMetadata from "./DocumentMetadata";

describe("DocumentMetadata", () => {
  it("writes the localized title and description onto the document", async () => {
    renderWithProviders(<DocumentMetadata />);

    await waitFor(() => {
      expect(document.title).toBe("LiteLLM 控制台");
    });

    const description = document.querySelector('meta[name="description"]');
    expect(description?.getAttribute("content")).toBe("LiteLLM 代理管理界面");
  });

  it("renders nothing into the page", () => {
    const { container } = renderWithProviders(<DocumentMetadata />);
    expect(container).toBeEmptyDOMElement();
  });
});
