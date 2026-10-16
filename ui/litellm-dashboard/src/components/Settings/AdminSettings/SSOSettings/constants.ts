import googleLogo from "../../../../../public/assets/logos/google.svg";
import microsoftAzureLogo from "../../../../../public/assets/logos/microsoft_azure.svg";

// SSO Provider logos
export const ssoProviderLogoMap: Record<string, string> = {
  google: googleLogo.src,
  microsoft: microsoftAzureLogo.src,
  okta: "https://www.okta.com/sites/default/files/Okta_Logo_BrightBlue_Medium.png",
  generic: "",
  saml: "",
};

type SSOProviderNameKey =
  | "ssoSettings.providerNameGoogle"
  | "ssoSettings.providerNameMicrosoft"
  | "ssoSettings.providerNameOkta"
  | "ssoSettings.providerNameGeneric"
  | "ssoSettings.providerNameSaml";

// SSO Provider display names (consistent between select dropdown and table)
export const ssoProviderNameKeys: Record<string, SSOProviderNameKey> = {
  google: "ssoSettings.providerNameGoogle",
  microsoft: "ssoSettings.providerNameMicrosoft",
  okta: "ssoSettings.providerNameOkta",
  generic: "ssoSettings.providerNameGeneric",
  saml: "ssoSettings.providerNameSaml",
};

type DefaultRoleNameKey =
  | "ssoSettings.roleInternalViewer"
  | "ssoSettings.roleInternalUser"
  | "ssoSettings.roleProxyAdminViewer"
  | "ssoSettings.roleProxyAdmin";

export const defaultRoleNameKeys: Record<string, DefaultRoleNameKey> = {
  internal_user_viewer: "ssoSettings.roleInternalViewer",
  internal_user: "ssoSettings.roleInternalUser",
  proxy_admin_viewer: "ssoSettings.roleProxyAdminViewer",
  proxy_admin: "ssoSettings.roleProxyAdmin",
};
