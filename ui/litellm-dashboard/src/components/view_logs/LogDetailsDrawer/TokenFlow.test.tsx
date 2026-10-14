import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../../tests/test-utils";
import { describe, expect, it } from "vitest";
import { TokenFlow } from "./TokenFlow";

const localised = (count: number) => count.toLocaleString();

describe("TokenFlow", () => {
  it("should render the total followed by its prompt and completion breakdown", () => {
    renderWithProviders(<TokenFlow prompt={9} completion={3} total={12} />);

    expect(screen.getByText("12（9 个输入令牌 + 3 个输出令牌）")).toBeInTheDocument();
  });

  it("should group large counts the way the reader's locale does", () => {
    renderWithProviders(<TokenFlow prompt={1234567} completion={89012} total={1323579} />);

    expect(
      screen.getByText(`${localised(1323579)}（${localised(1234567)} 个输入令牌 + ${localised(89012)} 个输出令牌）`),
    ).toBeInTheDocument();
  });

  it("should fall back to zero for counts the log entry does not carry", () => {
    renderWithProviders(<TokenFlow total={12} />);

    expect(screen.getByText("12（0 个输入令牌 + 0 个输出令牌）")).toBeInTheDocument();
  });
});
