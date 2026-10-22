import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../../tests/test-utils";
import { describe, expect, it, vi } from "vitest";
import ObjectPermissionsView from "./object_permissions_view";

vi.mock("./permissions/VectorStorePermissions", () => ({ default: () => <div data-testid="vector-stores" /> }));
vi.mock("./permissions/MCPServerPermissions", () => ({ default: () => <div data-testid="mcp-servers" /> }));
vi.mock("./permissions/AgentPermissions", () => ({ default: () => <div data-testid="agents" /> }));

const objectPermission = { object_permission_id: "perm-1", skills: [] as string[] };

describe("ObjectPermissionsView skills card", () => {
  it("shows plugin names granted only through access groups with their source", () => {
    render(
      <ObjectPermissionsView
        objectPermission={objectPermission}
        inheritedSkills={[{ id: "private-plugin", accessGroupNames: ["skills-group"] }]}
        variant="inline"
      />,
    );

    expect(screen.getByText(/private-plugin/)).toBeInTheDocument();
    expect(screen.getByTitle(/skills-group/)).toHaveTextContent("private-plugin （访问组）");
    expect(screen.queryByText(/未授予私有技能/)).not.toBeInTheDocument();
  });

  it("lists direct grants once even when an access group grants the same plugin", () => {
    render(
      <ObjectPermissionsView
        objectPermission={{ ...objectPermission, skills: ["private-plugin"] }}
        inheritedSkills={[
          { id: "private-plugin", accessGroupNames: ["skills-group"] },
          { id: "team-plugin", accessGroupNames: ["skills-group"] },
        ]}
        variant="inline"
      />,
    );

    expect(screen.getAllByText(/private-plugin/)).toHaveLength(1);
    expect(screen.getByTitle(/skills-group/)).toHaveTextContent("team-plugin （访问组）");
  });

  it("keeps the empty state when nothing grants a private plugin", () => {
    render(<ObjectPermissionsView objectPermission={objectPermission} inheritedSkills={[]} variant="inline" />);

    expect(
      screen.getByText("未授予私有技能。仅显示已启用的（公开）Claude Code 插件。"),
    ).toBeInTheDocument();
  });

  it("says access-group grants are not listed when the view resolves none (key page)", () => {
    render(<ObjectPermissionsView objectPermission={objectPermission} variant="inline" />);

    expect(screen.getByText(/来自访问组的授权不会在此页面列出/)).toBeInTheDocument();
  });

  it("treats the API null for unresolved group ids as no missing groups", () => {
    render(
      <ObjectPermissionsView
        objectPermission={{ ...objectPermission, skills: ["private-plugin"] }}
        inheritedSkills={[]}
        unresolvedAccessGroupIds={null}
        variant="inline"
      />,
    );

    expect(screen.getByText("private-plugin")).toBeInTheDocument();
    expect(screen.queryByText(/已暂停/)).not.toBeInTheDocument();
  });

  it("reports suspended private access instead of grants while a listed group has no row", () => {
    render(
      <ObjectPermissionsView
        objectPermission={{ ...objectPermission, skills: ["private-plugin"] }}
        inheritedSkills={[{ id: "team-plugin", accessGroupNames: ["skills-group"] }]}
        unresolvedAccessGroupIds={["deleted-group"]}
        variant="inline"
      />,
    );

    expect(screen.getByText(/未找到访问组 deleted-group/)).toBeInTheDocument();
    expect(screen.queryByText(/private-plugin/)).not.toBeInTheDocument();
    expect(screen.queryByText(/team-plugin/)).not.toBeInTheDocument();
  });
});
