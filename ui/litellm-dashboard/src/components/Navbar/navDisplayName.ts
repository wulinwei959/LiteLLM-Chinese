/**
 * Primary label for the navbar account control — avoids raw placeholder JWT/user
 * IDs in the UI.
 *
 * The label shown when there is no usable identity comes from the caller, so the
 * interface can render it in the reader's language.
 */
export function navAccountDisplayName(userEmail: string | null, userId: string | null, fallbackLabel: string): string {
  const email = userEmail?.trim();
  if (email) {
    return email;
  }
  const id = userId?.trim();
  if (!id) {
    return fallbackLabel;
  }
  if (/^default[_\s-]?user[_\s-]?id$/i.test(id)) {
    return fallbackLabel;
  }
  return id;
}
