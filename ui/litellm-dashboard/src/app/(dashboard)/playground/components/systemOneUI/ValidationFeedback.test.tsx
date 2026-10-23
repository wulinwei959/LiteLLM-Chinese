import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../../../../../tests/test-utils";
import { IssueList, ValidationStatus, ValidationSummary } from "./ValidationFeedback";
import type { PayloadValidation } from "./lib/validatePayload";

const validation = (issues: PayloadValidation<unknown>["issues"]): PayloadValidation<unknown> => ({
  isValid: issues.every((issue) => issue.severity !== "error"),
  issues,
});

describe("ValidationStatus", () => {
  it("counts only errors as issues", () => {
    renderWithProviders(
      <ValidationStatus
        validation={validation([
          { path: "state", label: "Input", message: "Required", severity: "error" },
          { path: "model", label: "Model", message: "Required", severity: "error" },
          { path: "questions.a", label: "questions.a", message: "Long question", severity: "warning" },
        ])}
      />,
    );
    expect(screen.getByText("2 个问题")).toBeInTheDocument();
  });

  it("reports a valid payload when only warnings remain", () => {
    renderWithProviders(
      <ValidationStatus validation={validation([{ path: "q", label: "q", message: "Long", severity: "warning" }])} />,
    );
    expect(screen.getByText("请求内容有效")).toBeInTheDocument();
  });
});

describe("IssueList", () => {
  it("lists every issue under its field label and renders nothing when there are none", () => {
    const { rerender } = renderWithProviders(
      <IssueList
        id="issues"
        validation={validation([{ path: "state", label: "Input", message: "Required", severity: "error" }])}
      />,
    );
    expect(screen.getByRole("list", { name: "请求内容校验问题" })).toHaveTextContent("InputRequired");
    rerender(<IssueList id="issues" validation={validation([])} />);
    expect(screen.queryByRole("list", { name: "请求内容校验问题" })).not.toBeInTheDocument();
  });
});

describe("ValidationSummary", () => {
  it("says ready when nothing blocks the request and counts the errors otherwise", () => {
    const { rerender } = renderWithProviders(<ValidationSummary validation={validation([])} />);
    expect(screen.getByRole("status")).toHaveTextContent("可以发送");
    rerender(
      <ValidationSummary
        validation={validation([
          { path: "state", label: "Input", message: "Required", severity: "error" },
          { path: "q", label: "q", message: "Long", severity: "warning" },
        ])}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("1 个问题待修正");
  });
});
