import { render } from "@testing-library/react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { TeamMetadataField } from "@/app/(dashboard)/hooks/teams/useTeamMetadataSchema";
import { useZodForm } from "@/lib/forms/useZodForm";
import { renderWithProviders } from "../../../tests/test-utils";
import MetadataKeyValueFields, {
  buildMetadataPairsSchema,
  MetadataPair,
  metadataObjectToPairs,
  metadataPairsToObject,
} from "./MetadataKeyValueFields";

describe("metadataObjectToPairs", () => {
  it("returns an empty list for null or undefined metadata", () => {
    expect(metadataObjectToPairs(null)).toEqual([]);
    expect(metadataObjectToPairs(undefined)).toEqual([]);
  });

  it("keeps plain string values as-is", () => {
    expect(metadataObjectToPairs({ department: "research" })).toEqual([{ key: "department", value: "research" }]);
  });

  it("serializes non-string values as JSON", () => {
    expect(
      metadataObjectToPairs({
        tier: 3,
        beta: true,
        config: { region: "us" },
        tags: ["a", "b"],
        empty: null,
      }),
    ).toEqual([
      { key: "tier", value: "3" },
      { key: "beta", value: "true" },
      { key: "config", value: '{"region":"us"}' },
      { key: "tags", value: '["a","b"]' },
      { key: "empty", value: "null" },
    ]);
  });

  it("quotes string values that would otherwise parse as JSON, so types round-trip", () => {
    expect(metadataObjectToPairs({ code: "42", flag: "true" })).toEqual([
      { key: "code", value: '"42"' },
      { key: "flag", value: '"true"' },
    ]);
  });

  it("filters out excluded keys", () => {
    expect(
      metadataObjectToPairs({ department: "research", logging: [{ callback_name: "langfuse" }] }, new Set(["logging"])),
    ).toEqual([{ key: "department", value: "research" }]);
  });

  it("drops an empty key, which the form can never submit, so an API-written one does not block saving", () => {
    expect(metadataObjectToPairs({ "": { displayName: "okta-push-group" }, scim_managed: true })).toEqual([
      { key: "scim_managed", value: "true" },
    ]);
  });
});

describe("metadataPairsToObject", () => {
  it("returns an empty object for undefined pairs", () => {
    expect(metadataPairsToObject(undefined)).toEqual({});
  });

  it("keeps plain text values as strings", () => {
    expect(metadataPairsToObject([{ key: "department", value: "research" }])).toEqual({ department: "research" });
  });

  it("parses JSON values into their typed form", () => {
    expect(
      metadataPairsToObject([
        { key: "tier", value: "3" },
        { key: "beta", value: "true" },
        { key: "config", value: '{"region":"us"}' },
        { key: "code", value: '"42"' },
      ]),
    ).toEqual({ tier: 3, beta: true, config: { region: "us" }, code: "42" });
  });

  it("skips rows without a key and defaults a missing value to an empty string", () => {
    expect(metadataPairsToObject([{ key: "", value: "orphan" }, undefined, { key: "kept" }])).toEqual({ kept: "" });
  });

  it("round-trips a mixed-type metadata object losslessly", () => {
    const metadata = {
      department: "research",
      code: "42",
      tier: 3,
      beta: true,
      config: { region: "us", replicas: 2 },
    };
    expect(metadataPairsToObject(metadataObjectToPairs(metadata))).toEqual(metadata);
  });
});

interface HarnessProps {
  onFinish: (values: { metadata?: MetadataPair[] }) => void;
  initialMetadata?: MetadataPair[];
  schemaFields?: TeamMetadataField[];
  schemaLoading?: boolean;
  fieldsHidden?: boolean;
}

const Harness: React.FC<HarnessProps> = ({ onFinish, initialMetadata, schemaFields, schemaLoading, fieldsHidden }) => {
  const t = useTranslations("teams");
  const harnessSchema = useMemo(() => z.object({ metadata: buildMetadataPairsSchema(t) }), [t]);
  const form = useZodForm(harnessSchema, { defaultValues: { metadata: initialMetadata ?? [] } });
  return (
    <form onSubmit={form.handleSubmit((values) => onFinish(values))}>
      {!fieldsHidden && (
        <MetadataKeyValueFields
          control={form.control}
          getValues={form.getValues}
          name="metadata"
          schemaFields={schemaFields}
          schemaLoading={schemaLoading}
        />
      )}
      <button type="submit">Save</button>
    </form>
  );
};

describe("MetadataKeyValueFields", () => {
  it("renders one row per existing pair", () => {
    renderWithProviders(
      <Harness
        onFinish={vi.fn()}
        initialMetadata={[
          { key: "department", value: "research" },
          { key: "tier", value: "3" },
        ]}
      />,
    );

    const keyInputs = screen.getAllByPlaceholderText("键");
    const valueInputs = screen.getAllByPlaceholderText("值");
    expect(keyInputs.map((input) => (input as HTMLInputElement).value)).toEqual(["department", "tier"]);
    expect(valueInputs.map((input) => (input as HTMLInputElement).value)).toEqual(["research", "3"]);
  });

  it("adds a row and submits the entered pair", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    renderWithProviders(<Harness onFinish={onFinish} />);

    await user.click(screen.getByRole("button", { name: "添加键值对" }));
    fireEvent.change(screen.getByPlaceholderText("键"), { target: { value: "cost_center" } });
    fireEvent.change(screen.getByPlaceholderText("值"), { target: { value: "eng-1" } });
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ metadata: [{ key: "cost_center", value: "eng-1" }] });
    });
  });

  it("removes a row when its remove icon is clicked", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    renderWithProviders(
      <Harness
        onFinish={onFinish}
        initialMetadata={[
          { key: "department", value: "research" },
          { key: "tier", value: "3" },
        ]}
      />,
    );

    await user.click(screen.getAllByLabelText("删除键值对")[0]);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ metadata: [{ key: "tier", value: "3" }] });
    });
  });

  it("blocks submission on duplicate keys", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    renderWithProviders(
      <Harness
        onFinish={onFinish}
        initialMetadata={[
          { key: "department", value: "research" },
          { key: "department", value: "sales" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getAllByText("键名重复").length).toBeGreaterThan(0);
    });
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("blocks submission when a row is missing its key", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    renderWithProviders(<Harness onFinish={onFinish} />);

    await user.click(screen.getByRole("button", { name: "添加键值对" }));
    fireEvent.change(screen.getByPlaceholderText("值"), { target: { value: "orphan" } });
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByText("缺少键名")).toBeInTheDocument();
    });
    expect(onFinish).not.toHaveBeenCalled();
  });
});

describe("MetadataKeyValueFields with a declared schema", () => {
  const schema: TeamMetadataField[] = [
    { key: "cost_center", label: "Cost Center" },
    { key: "app_name", label: "Application Name" },
  ];

  it("should prepopulate one ordinary editable pair row per declared key", async () => {
    renderWithProviders(<Harness onFinish={vi.fn()} schemaFields={schema} />);

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("键").map((input) => (input as HTMLInputElement).value)).toEqual([
        "cost_center",
        "app_name",
      ]);
    });
    screen.getAllByPlaceholderText("键").forEach((input) => expect(input).toBeEnabled());
    expect(screen.getAllByLabelText("删除键值对")).toHaveLength(2);
  });

  it("should submit a prepopulated key with its typed value", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    renderWithProviders(<Harness onFinish={onFinish} schemaFields={[{ key: "cost_center", label: "Cost Center" }]} />);

    fireEvent.change(await screen.findByPlaceholderText("值"), { target: { value: "CC-1001" } });
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalledWith({ metadata: [{ key: "cost_center", value: "CC-1001" }] });
    });
  });

  it("should not add a second row for keys already present in the form", async () => {
    renderWithProviders(
      <Harness onFinish={vi.fn()} schemaFields={schema} initialMetadata={[{ key: "cost_center", value: "CC-1001" }]} />,
    );

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("键").map((input) => (input as HTMLInputElement).value)).toEqual([
        "cost_center",
        "app_name",
      ]);
    });
    expect(screen.getAllByPlaceholderText("值").map((input) => (input as HTMLInputElement).value)).toEqual([
      "CC-1001",
      "",
    ]);
  });

  it("should still let the user add and remove free-form pairs below the declared keys", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Harness onFinish={vi.fn()} schemaFields={schema} />);

    await screen.findAllByPlaceholderText("键");
    await user.click(screen.getAllByLabelText("删除键值对")[0]);

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("键").map((input) => (input as HTMLInputElement).value)).toEqual([
        "app_name",
      ]);
    });

    const keyInput = screen.getByPlaceholderText("Key");
    await user.clear(keyInput);
    await user.type(keyInput, "cost_center");

    expect(keyInput).toHaveValue("cost_center");
    expect(keyInput).toHaveFocus();

    await user.click(screen.getByRole("button", { name: /add key-value pair/i }));
    expect(screen.getAllByPlaceholderText("Key").map((input) => (input as HTMLInputElement).value)).toEqual([
      "cost_center",
      "",
    ]);
    await user.click(screen.getAllByLabelText("Remove key-value pair")[1]);

    expect(screen.getAllByPlaceholderText("Key").map((input) => (input as HTMLInputElement).value)).toEqual([
      "cost_center",
    ]);
    expect(screen.getAllByLabelText("Remove key-value pair")).toHaveLength(1);
    expect(screen.getAllByTestId("metadata-schema-label").map((label) => label.textContent)).toEqual([
      "Cost",
      "Cost Center",
    ]);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Duplicate key")).toBeInTheDocument();
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("should keep one editable row per duplicated declared key when the editor remounts", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn();
    const schemaFields = [{ key: "cost_center", label: "Cost Center" }];
    const initialMetadata = [{ key: "region", value: "us" }];
    const { rerender } = renderWithProviders(
      <Harness onFinish={onFinish} initialMetadata={initialMetadata} schemaFields={schemaFields} />,
    );
    expect(await screen.findByTestId("metadata-schema-label")).toHaveTextContent("Cost Center");
    fireEvent.change(screen.getByPlaceholderText("Key"), { target: { value: "cost_center" } });

    rerender(
      <Harness onFinish={onFinish} initialMetadata={initialMetadata} schemaFields={schemaFields} fieldsHidden />,
    );
    rerender(<Harness onFinish={onFinish} initialMetadata={initialMetadata} schemaFields={schemaFields} />);

    expect(screen.getAllByTestId("metadata-schema-label")).toHaveLength(1);
    expect(screen.getByPlaceholderText("Key")).toHaveValue("cost_center");
    expect(screen.getAllByLabelText("Remove key-value pair")).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Duplicate key")).toBeInTheDocument();
    expect(onFinish).not.toHaveBeenCalled();
  });

  it("should label only rows whose current key is declared when the schema arrives after an edit", () => {
    const onFinish = vi.fn();
    const initialMetadata = [{ key: "cost_center", value: "1" }];
    const { rerender } = renderWithProviders(
      <Harness onFinish={onFinish} initialMetadata={initialMetadata} schemaFields={[]} />,
    );
    fireEvent.change(screen.getByPlaceholderText("Key"), { target: { value: "region" } });

    rerender(
      <Harness
        onFinish={onFinish}
        initialMetadata={initialMetadata}
        schemaFields={[{ key: "cost_center", label: "Cost Center" }]}
      />,
    );

    expect(screen.getByPlaceholderText("Key")).toHaveValue("region");
    expect(screen.getAllByTestId("metadata-schema-label").map((label) => label.textContent)).toEqual(["Cost Center"]);
  });

  it("should show a skeleton instead of the editor while the schema is loading", () => {
    renderWithProviders(<Harness onFinish={vi.fn()} schemaLoading />);

    expect(screen.getByTestId("metadata-schema-skeleton")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "添加键值对" })).not.toBeInTheDocument();
  });

  it("should seed rows when the schema arrives after an initial loading state", async () => {
    const onFinish = vi.fn();
    const { rerender } = renderWithProviders(<Harness onFinish={onFinish} schemaLoading />);

    rerender(<Harness onFinish={onFinish} schemaFields={schema} schemaLoading={false} />);

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText("键").map((input) => (input as HTMLInputElement).value)).toEqual([
        "cost_center",
        "app_name",
      ]);
    });
  });
});
