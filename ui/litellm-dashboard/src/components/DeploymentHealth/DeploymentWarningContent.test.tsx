import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import zh from "@/messages/zh-CN.json";
import { deploymentWarningContent } from "./DeploymentWarningContent";

const NOW = new Date("2026-10-14T12:00:00Z");
const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "deploymentHealth" });

describe("deploymentWarningContent", () => {
  it.each([
    { expiry: "2026-10-14", title: "你的 LiteLLM 企业版许可今天到期（Oct 14, 2026）" },
    { expiry: "2026-10-15", title: "你的 LiteLLM 企业版许可1 天后到期（Oct 15, 2026）" },
    { expiry: "2026-11-13", title: "你的 LiteLLM 企业版许可30 天后到期（Nov 13, 2026）" },
    { expiry: "2026-10-13", title: "你的 LiteLLM 企业版许可已于 Oct 13, 2026 过期" },
  ])("should title a license expiring on $expiry by its distance from today", ({ expiry, title }) => {
    expect(deploymentWarningContent(`license_expiry:${expiry}`, t, NOW).title).toBe(title);
  });

  it.each(["2026-10-20", "2026-10-01"])("should point a license expiring %s at sales", (expiry) => {
    render(<p>{deploymentWarningContent(`license_expiry:${expiry}`, t, NOW).fix}</p>);

    expect(screen.getByRole("link", { name: "sales@berri.ai" })).toHaveAttribute("href", "mailto:sales@berri.ai");
  });

  it("should tell admins which setting turns env credential login off", () => {
    render(<p>{deploymentWarningContent("env_credential_login", t, NOW).fix}</p>);

    expect(screen.getByText("general_settings.disable_env_credential_login: true")).toBeInTheDocument();
  });

  it.each(["env_credential_login", "no_redis", "detailed_debug", "license_expiry:2026-10-20"])(
    "should link %s to the LiteLLM docs",
    (warningId) => {
      expect(deploymentWarningContent(warningId, t, NOW).docsUrl).toMatch(/^https:\/\/docs\.litellm\.ai\/docs\//);
    },
  );

  it("should fall back to the raw id for a warning the dashboard does not know yet", () => {
    expect(deploymentWarningContent("future_warning", t, NOW)).toEqual({ title: "future_warning" });
  });
});
