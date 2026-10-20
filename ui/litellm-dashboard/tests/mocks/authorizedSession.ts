import type useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";

/** The value the `useAuthorized` hook resolves to. */
export type AuthorizedSession = ReturnType<typeof useAuthorized>;

/**
 * The fields a test may override. `null` is allowed everywhere because a mock
 * routinely stands for "no token", "no user" or "no role", which the hook's own
 * types spell as a plain string.
 */
export type SessionOverride = { [K in keyof AuthorizedSession]?: AuthorizedSession[K] | null };

const BASE = {
  isLoading: false,
  isAuthorized: true,
  token: "test-token",
  accessToken: "test-access-token",
  userId: "test-user-id",
  userEmail: "test@example.com",
  userRole: "Admin",
  userRoleLabel: "Admin",
  isViewOnly: false,
  premiumUser: false,
  disabledPersonalKeyCreation: null,
  loginMethod: null,
  showSSOBanner: false,
  passwordResetRequired: false,
};

/**
 * A session mock for tests that stub the auth hook.
 *
 * The shape is the hook's full return value, so `mockReturnValue` type-checks
 * instead of leaving a TS2345 behind for every test that stubs it. Callers
 * override only the fields they care about; the rest keep the values below.
 */
export const authorizedSession = (overrides: SessionOverride = {}): AuthorizedSession =>
  ({ ...BASE, ...overrides }) as AuthorizedSession;

/** The session of a caller that has neither a token nor a user behind it. */
export const anonymousSession = (overrides: SessionOverride = {}): AuthorizedSession =>
  authorizedSession({
    token: null,
    accessToken: null,
    userId: null,
    userRole: null,
    userRoleLabel: "",
    ...overrides,
  });
