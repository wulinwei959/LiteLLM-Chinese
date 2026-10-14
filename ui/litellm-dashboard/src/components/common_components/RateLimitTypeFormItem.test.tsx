import { renderWithProviders, screen } from "../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { RateLimitTypeFormItem } from "./RateLimitTypeFormItem";

describe("RateLimitTypeFormItem", () => {
  it("should render", () => {
    renderWithProviders(<RateLimitTypeFormItem type="tpm" name="tpm_type" />);
    expect(screen.getByText(/TPM 速率限制类型/)).toBeInTheDocument();
  });

  it("should display TPM label for tpm type", () => {
    renderWithProviders(<RateLimitTypeFormItem type="tpm" name="tpm_type" />);
    expect(screen.getByText(/TPM 速率限制类型/)).toBeInTheDocument();
  });

  it("should display RPM label for rpm type", () => {
    renderWithProviders(<RateLimitTypeFormItem type="rpm" name="rpm_type" />);
    expect(screen.getByText(/RPM 速率限制类型/)).toBeInTheDocument();
  });

  it("should show the select placeholder by default", () => {
    renderWithProviders(<RateLimitTypeFormItem type="tpm" name="tpm_type" />);
    expect(screen.getByText("选择速率限制类型")).toBeInTheDocument();
  });

  it("should call onChange when provided", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<RateLimitTypeFormItem type="tpm" name="tpm_type" onChange={onChange} />);
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("保证吞吐"));
    expect(onChange).toHaveBeenCalledWith("guaranteed_throughput");
  });
});
