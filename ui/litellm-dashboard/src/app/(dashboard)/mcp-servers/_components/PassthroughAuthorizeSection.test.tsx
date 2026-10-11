import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../../../../tests/test-utils";
import PassthroughAuthorizeSection from "./PassthroughAuthorizeSection";
import { McpFormHarness } from "./McpFormTestHarness";

const WithForm = McpFormHarness;

const noopFlow = { startOAuthFlow: () => {}, status: "idle", error: null, tokenResponse: null };

describe("PassthroughAuthorizeSection credential-class-aware copy", () => {
  it("shows keep-existing copy when the credential class is unchanged (true_passthrough <-> oauth_delegate)", () => {
    renderWithProviders(
      <WithForm>
        <PassthroughAuthorizeSection
          authType="oauth_delegate"
          oauthFlow={noopFlow}
          isEditing
          savedAuthType="true_passthrough"
        />
      </WithForm>,
    );
    expect(screen.getAllByPlaceholderText(/留空则保留当前已保存/)[0]).toBeInTheDocument();
    expect(screen.getByPlaceholderText("留空则保留当前已保存的密钥（若有）")).toBeInTheDocument();
  });

  it("shows the discard warning copy when switching from a different class (oauth2 -> true_passthrough)", () => {
    renderWithProviders(
      <WithForm>
        <PassthroughAuthorizeSection
          authType="true_passthrough"
          oauthFlow={noopFlow}
          isEditing
          savedAuthType="oauth2"
        />
      </WithForm>,
    );
    expect(screen.getByPlaceholderText(/留空则使用动态客户端注册/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/公开客户端或 PKCE 请留空/)).toBeInTheDocument();
    expect(screen.getByText(/切换认证方式会丢弃之前保存的应用/)).toBeInTheDocument();
  });

  it("shows the keep+warn banner when the upstream may no longer match", () => {
    renderWithProviders(
      <WithForm>
        <PassthroughAuthorizeSection authType="true_passthrough" oauthFlow={noopFlow} appMayNotMatchUpstream />
      </WithForm>,
    );
    expect(screen.getByText(/为上一个上游注册/)).toBeInTheDocument();
  });
});
