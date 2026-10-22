import { NextIntlClientProvider } from "next-intl";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import zh from "@/messages/zh-CN.json";

import { RequestTagMapping, RequestTagMappingsEditor, requestTagMappingsAreValid } from "./RequestTagMappings";

const exact: RequestTagMapping = { header: "baggage", key: "entrypoint", value: "a", tag: "support" };
const variable: RequestTagMapping = { header: "baggage", key: "entrypoint", tag_prefix: "usecase:" };

const t = (key: string, values?: Record<string, string | number>) => {
  const path = `routerSettings.requestTagMappings.${key}`.split(".");
  let node: unknown = zh;
  for (const part of path) {
    node = (node as Record<string, unknown>)[part];
  }
  let text = String(node);
  for (const [name, value] of Object.entries(values ?? {})) {
    text = text.replace(`{${name}}`, String(value));
  }
  return text;
};

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <NextIntlClientProvider locale="zh-CN" messages={zh}>
      {ui}
    </NextIntlClientProvider>,
  );

function Editor({
  initial,
  changed,
  saved = vi.fn(),
}: {
  initial: RequestTagMapping[];
  changed: (rules: RequestTagMapping[]) => void;
  saved?: (rules: RequestTagMapping[]) => void;
}) {
  const [rules, setRules] = useState(initial);
  return (
    <>
      <RequestTagMappingsEditor
        value={rules}
        onChange={(next) => {
          setRules(next);
          changed(next);
        }}
      />
      <button type="button" disabled={!requestTagMappingsAreValid(rules, t as never)} onClick={() => saved(rules)}>
        Update
      </button>
    </>
  );
}

describe("RequestTagMappingsEditor", () => {
  it("shows YAML-owned rules without allowing edits", () => {
    renderWithIntl(<RequestTagMappingsEditor value={[exact]} onChange={vi.fn()} disabled />);
    expect(screen.getByLabelText(t("aria.matchValue", { label: t("label.mapping", { index: 1 }) }))).toBeDisabled();
    expect(screen.getByRole("button", { name: t("action.addMapping") })).toBeDisabled();
    expect(screen.getByText(/config\.yaml/)).toBeInTheDocument();
  });
  it("shows one-by-one mappings alongside variable prefix mappings", () => {
    renderWithIntl(<Editor initial={[exact, variable]} changed={vi.fn()} />);
    expect(
      screen.getByRole("combobox", { name: t("aria.mode", { label: t("label.mapping", { index: 1 }) }) }),
    ).toHaveTextContent(t("mode.exact"));
    expect(
      screen.getByRole("combobox", { name: t("aria.mode", { label: t("label.mapping", { index: 2 }) }) }),
    ).toHaveTextContent(t("mode.any"));
    expect(screen.getByLabelText(t("aria.matchValue", { label: t("label.mapping", { index: 1 }) }))).toHaveValue("a");
    expect(screen.getByLabelText(t("aria.tag", { label: t("label.mapping", { index: 1 }) }))).toHaveValue("support");
    expect(screen.getByLabelText(t("aria.tagPrefix", { label: t("label.mapping", { index: 2 }) }))).toHaveValue(
      "usecase:",
    );
    expect(screen.getByText("entrypoint=a → support")).toBeInTheDocument();
    expect(screen.getByText("entrypoint=x → usecase:x")).toBeInTheDocument();
  });

  it("adds and edits a new exact value mapping", async () => {
    const changed = vi.fn();
    renderWithIntl(<Editor initial={[]} changed={changed} />);
    await userEvent.click(screen.getByRole("button", { name: t("action.addMapping") }));
    fireEvent.change(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "entrypoint" },
    });
    fireEvent.change(screen.getByLabelText(t("aria.matchValue", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "b" },
    });
    fireEvent.change(screen.getByLabelText(t("aria.tag", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "sales" },
    });
    expect(screen.getByText("entrypoint=b → sales")).toBeInTheDocument();
    expect(changed).toHaveBeenLastCalledWith([{ header: "baggage", key: "entrypoint", value: "b", tag: "sales" }]);
  });

  it("changes an exact mapping to any-value mode and removes its exact match fields", async () => {
    const changed = vi.fn();
    renderWithIntl(<Editor initial={[exact]} changed={changed} />);
    await userEvent.click(
      screen.getByRole("combobox", { name: t("aria.mode", { label: t("label.mapping", { index: 1 }) }) }),
    );
    await userEvent.click(await screen.findByRole("option", { name: t("mode.any") }));
    expect(
      screen.queryByLabelText(t("aria.matchValue", { label: t("label.mapping", { index: 1 }) })),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText(t("aria.tagPrefix", { label: t("label.mapping", { index: 1 }) }))).toHaveValue("");
    expect(screen.getByLabelText(t("aria.tagPrefix", { label: t("label.mapping", { index: 1 }) }))).toHaveAttribute(
      "placeholder",
      "usecase:",
    );
    expect(changed).toHaveBeenLastCalledWith([
      expect.objectContaining({ value: undefined, tag: undefined, tag_prefix: "" }),
    ]);
  });

  it("blocks saving a new mapping until its match value and tag are filled in", async () => {
    const saved = vi.fn();
    renderWithIntl(<Editor initial={[]} changed={vi.fn()} saved={saved} />);
    await userEvent.click(screen.getByRole("button", { name: t("action.addMapping") }));
    expect(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) }))).toHaveValue("");
    expect(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) }))).toHaveAttribute(
      "placeholder",
      "entrypoint",
    );
    expect(screen.getByText(t("problem.enterBaggageKey"))).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "entrypoint" },
    });
    expect(screen.getByText(t("problem.enterMatchValue"))).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Update" }));
    fireEvent.change(screen.getByLabelText(t("aria.matchValue", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "b" },
    });
    expect(screen.getByText(t("problem.enterTag"))).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Update" }));
    expect(saved).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(t("aria.tag", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "sales" },
    });
    expect(screen.queryByText(/^请填写/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Update" }));
    expect(saved).toHaveBeenCalledWith([{ header: "baggage", key: "entrypoint", value: "b", tag: "sales" }]);
  });

  it("blocks saving an any-value mapping until the admin types a tag prefix", async () => {
    const saved = vi.fn();
    renderWithIntl(<Editor initial={[exact]} changed={vi.fn()} saved={saved} />);
    await userEvent.click(
      screen.getByRole("combobox", { name: t("aria.mode", { label: t("label.mapping", { index: 1 }) }) }),
    );
    await userEvent.click(await screen.findByRole("option", { name: t("mode.any") }));
    expect(screen.getByText(t("problem.enterTagPrefix"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(t("aria.tagPrefix", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "team:" },
    });
    await userEvent.click(screen.getByRole("button", { name: "Update" }));
    expect(saved).toHaveBeenCalledWith([expect.objectContaining({ key: "entrypoint", tag_prefix: "team:" })]);
  });

  it("blocks saving a baggage key that is empty or not a header token", async () => {
    renderWithIntl(<Editor initial={[exact]} changed={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "" },
    });
    expect(screen.getByText(t("problem.enterBaggageKey"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "entry point" },
    });
    expect(screen.getByText(/baggage 键里只能用/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(t("aria.baggageKey", { label: t("label.mapping", { index: 1 }) })), {
      target: { value: "entry.point" },
    });
    expect(screen.getByRole("button", { name: "Update" })).toBeEnabled();
  });

  it("blocks saving a second mapping for the same key and value until it differs", () => {
    renderWithIntl(<Editor initial={[exact, { ...exact, tag: "sales" }, variable]} changed={vi.fn()} />);
    expect(screen.getByText(t("problem.duplicateMapping"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(t("aria.matchValue", { label: t("label.mapping", { index: 2 }) })), {
      target: { value: "b" },
    });
    expect(screen.queryByText(t("problem.duplicateMapping"))).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeEnabled();
  });

  it("blocks saving a second any-value mapping for the same key", () => {
    renderWithIntl(<Editor initial={[variable, { ...variable, tag_prefix: "team:" }]} changed={vi.fn()} />);
    expect(screen.getByText(t("problem.duplicateMapping"))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  it("deletes one rule while keeping the other mode intact", async () => {
    const changed = vi.fn();
    renderWithIntl(<Editor initial={[exact, variable]} changed={changed} />);
    await userEvent.click(
      screen.getByRole("button", { name: t("aria.delete", { label: t("label.mapping", { index: 1 }) }) }),
    );
    expect(screen.getByLabelText(t("aria.tagPrefix", { label: t("label.mapping", { index: 1 }) }))).toHaveValue(
      "usecase:",
    );
    expect(changed).toHaveBeenLastCalledWith([variable]);
  });
});
