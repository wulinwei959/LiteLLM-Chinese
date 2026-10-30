import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import type { Policy } from "@/components/policies/types";

const VERSION_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  draft: { bg: "var(--color-muted)", color: "var(--color-muted-foreground)" },
  published: { bg: "color-mix(in oklab, var(--color-info) 10%, transparent)", color: "var(--color-info)" },
  production: { bg: "color-mix(in oklab, var(--color-success) 10%, transparent)", color: "var(--color-success)" },
};

interface PolicyVersionsSidebarProps {
  policyName: string;
  editingPolicyId: string | null;
  editingVersionStatus?: "draft" | "published" | "production";
  accessToken: string | null;
  versions: Policy[];
  isLoading: boolean;
  isCreatingVersion?: boolean;
  isUpdatingStatus?: boolean;
  onNewVersion: () => void;
  onSelectVersion: (policy: Policy) => void;
  onPublish?: () => void;
  onPromoteToProduction?: () => void;
}

const PolicyVersionsSidebar: React.FC<PolicyVersionsSidebarProps> = ({
  policyName,
  editingPolicyId,
  editingVersionStatus,
  accessToken,
  versions,
  isLoading,
  isCreatingVersion = false,
  isUpdatingStatus = false,
  onNewVersion,
  onSelectVersion,
  onPublish,
  onPromoteToProduction,
}) => {
  const canPublish = editingVersionStatus === "draft" && onPublish;
  const canPromote = editingVersionStatus === "published" && onPromoteToProduction;
  const t = useTranslations("policies");

  return (
    <div
      style={{
        width: 260,
        flexShrink: 0,
        backgroundColor: "var(--color-card)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 16, overflowY: "auto", flex: 1 }}>
        {/* Versions section */}
        <div style={{ marginBottom: 24 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--color-muted-foreground)",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 4,
            }}
          >
            {t("flow.versions")}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--color-muted-foreground)",
              lineHeight: 1.4,
              display: "block",
              marginBottom: 12,
            }}
          >
            {t("flow.versionsHint")}
          </span>
          <Button
            onClick={onNewVersion}
            disabled={!accessToken || isCreatingVersion}
            style={{ width: "100%", marginBottom: 12 }}
          >
            {t("flow.newVersion")}
          </Button>
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
              <UiLoadingSpinner className="size-4" />
            </div>
          )}
          {!isLoading && versions.length === 0 && (
            <span style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{t("flow.noVersions")}</span>
          )}
          {!isLoading && versions.length > 0 && (
            <div className="flex flex-col gap-1">
              {versions.map((v) => {
                const statusStyle = VERSION_STATUS_STYLES[v.version_status ?? "draft"] ?? VERSION_STATUS_STYLES.draft;
                const isActive = v.policy_id === editingPolicyId;
                return (
                  <button
                    key={v.policy_id}
                    type="button"
                    onClick={() => onSelectVersion(v)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 8,
                      border: isActive ? "1px solid var(--color-info)" : "1px solid var(--color-border)",
                      backgroundColor: isActive
                        ? "color-mix(in oklab, var(--color-info) 10%, transparent)"
                        : "var(--color-card)",
                      cursor: "pointer",
                    }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-foreground)" }}>
                        v{v.version_number ?? 1}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {v.version_status ?? "draft"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Publish / Promote to production for selected version */}
          {(canPublish || canPromote) && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--color-border)" }}>
              {canPublish && (
                <>
                  <Button
                    variant="secondary"
                    onClick={onPublish}
                    disabled={!accessToken || isUpdatingStatus}
                    style={{ width: "100%", marginBottom: 8 }}
                  >
                    {t("flow.publish")}
                  </Button>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-muted-foreground)",
                      lineHeight: 1.4,
                      display: "block",
                      marginBottom: canPromote ? 8 : 0,
                    }}
                  >
                    {t("flow.publishHint")}
                  </span>
                </>
              )}
              {canPromote && (
                <>
                  <Button
                    onClick={onPromoteToProduction}
                    disabled={!accessToken || isUpdatingStatus}
                    style={{ width: "100%", marginBottom: 8 }}
                  >
                    {t("flow.promote")}
                  </Button>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--color-muted-foreground)",
                      lineHeight: 1.4,
                      display: "block",
                    }}
                  >
                    {t("flow.promoteHint")}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Silent Mirroring section */}
        <div>
          <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-muted-foreground)",
                letterSpacing: "0.06em",
              }}
            >
              {t("flow.mirror")}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                backgroundColor: "color-mix(in oklab, var(--color-info) 10%, transparent)",
                color: "var(--color-info)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {t("flow.soon")}
            </span>
          </div>
          <span
            style={{
              fontSize: 12,
              color: "var(--color-muted-foreground)",
              lineHeight: 1.5,
              display: "block",
            }}
          >
            {t("flow.mirrorDesc")}
          </span>
        </div>
      </div>
    </div>
  );
};

export { PolicyVersionsSidebar };
