import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "@/components/shared/DataTable";
import { Plugin } from "@/components/claude_code_plugins/types";
import { renderWithProviders } from "../../../tests/test-utils";
import { getSkillHubTableColumns } from "./SkillHubTableColumns";

const mockSkill: Plugin = {
  id: "skill-1",
  name: "pdf-tools",
  description: "Work with PDF files",
  source: { source: "github", repo: "org/pdf-tools" },
  category: "documents",
  domain: "Productivity",
  enabled: true,
};

function SkillHubTableHarness({ data, onSkillClick }: { data: Plugin[]; onSkillClick: (skill: Plugin) => void }) {
  const t = useTranslations("skills");
  const commonT = useTranslations("common");
  const columns = useMemo(() => getSkillHubTableColumns({ onSkillClick, t, commonT }), [onSkillClick, t, commonT]);
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(skill, index) => skill.id || String(index)}
      sortingMode="client"
      size="compact"
    />
  );
}

function renderTable(data: Plugin[], onSkillClick = vi.fn()) {
  renderWithProviders(<SkillHubTableHarness data={data} onSkillClick={onSkillClick} />);
  return onSkillClick;
}

describe("getSkillHubTableColumns", () => {
  it("renders the skill row with category and domain", () => {
    renderTable([mockSkill]);
    expect(screen.getByText("pdf-tools")).toBeInTheDocument();
    expect(screen.getByText("documents")).toBeInTheDocument();
    expect(screen.getByText("Productivity")).toBeInTheDocument();
  });

  it("links to the github source", () => {
    renderTable([mockSkill]);
    const link = screen.getByRole("link", { name: /org\/pdf-tools/ });
    expect(link).toHaveAttribute("href", "https://github.com/org/pdf-tools");
  });

  it("shows Public for enabled skills and Draft for disabled ones", () => {
    renderTable([mockSkill, { ...mockSkill, id: "skill-2", name: "draft-skill", enabled: false }]);
    expect(screen.getByText("公开")).toBeInTheDocument();
    expect(screen.getByText("草稿")).toBeInTheDocument();
  });

  it("opens the skill detail when the name is clicked", async () => {
    const user = userEvent.setup();
    const onSkillClick = renderTable([mockSkill]);
    await user.click(screen.getByRole("button", { name: "pdf-tools" }));
    expect(onSkillClick).toHaveBeenCalledWith(mockSkill);
  });

  it("opens the skill detail from the actions menu", async () => {
    const user = userEvent.setup();
    const onSkillClick = renderTable([mockSkill]);
    await user.click(screen.getByTestId("skill-hub-actions-skill-1"));
    const detailsItem = await screen.findByTestId("skill-hub-action-details");
    expect(detailsItem).toHaveTextContent("查看详情");
    await user.click(detailsItem);
    expect(onSkillClick).toHaveBeenCalledWith(mockSkill);
  });

  it("copies the skill name from the actions menu", async () => {
    const user = userEvent.setup();
    renderTable([mockSkill]);
    await user.click(screen.getByTestId("skill-hub-actions-skill-1"));
    const copyItem = await screen.findByTestId("skill-hub-action-copy");
    expect(copyItem).toHaveTextContent("复制技能名称");
    await user.click(copyItem);
    expect(await window.navigator.clipboard.readText()).toBe("pdf-tools");
  });
});
