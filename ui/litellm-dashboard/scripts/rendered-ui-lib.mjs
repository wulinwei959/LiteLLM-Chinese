/**
 * The judgement the rendered-UI scan makes, kept apart from the browser work
 * so it can be unit tested.
 */

/**
 * The English word groups a page still shows.
 *
 * A group is a run of words separated by spaces. Single words that are all
 * lowercase and short are data the interface shows rather than copy it wrote
 * (a key alias, a model name), so they are left out; a group of two or more
 * words, or a word with capitals, is prose.
 */
export const englishPhrases = (text, allowed) => {
  const found = new Set();
  for (const match of text.matchAll(/[A-Za-z][A-Za-z'.-]*(?: [A-Za-z][A-Za-z'.-]*)*/g)) {
    const phrase = match[0].trim();
    if (phrase.length < 2 || !/[A-Za-z]{3,}/.test(phrase)) continue;
    if (allowed.has(phrase)) continue;
    // A group of allowed words sitting next to each other is still allowed
    // ("LiteLLM RPM"), even though the group itself is not on the list.
    if (phrase.split(" ").every((word) => allowed.has(word))) continue;
    found.add(phrase);
  }
  return [...found].sort();
};

/**
 * The response a request path gets from the stub table.
 *
 * The table is matched on a path fragment, longest fragment first, so that
 * "/v2/team/list" does not get the answer registered for "/team/list".
 */
export const stubFor = (stubs, path) => {
  const match = [...stubs]
    .sort((left, right) => right[0].length - left[0].length)
    .find(([fragment]) => path.includes(fragment));
  return match ? match[1] : undefined;
};

/** A finding key, used to compare a run against the baseline. */
export const findingKey = (finding) => `${finding.page}|${finding.kind}|${finding.text}`;
