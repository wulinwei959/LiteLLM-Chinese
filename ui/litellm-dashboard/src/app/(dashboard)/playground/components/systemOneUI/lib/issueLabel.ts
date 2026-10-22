import type { SystemOneTranslator } from "@/lib/i18n/translators";

const topLevel = (t: SystemOneTranslator, key: string): string | undefined => {
  switch (key) {
    case "state":
    case "input":
      return t("field.input");
    case "model":
      return t("field.model");
    case "questions":
      return t("field.questions");
    case "safety_identifier":
      return t("field.safetyIdentifier");
    case "root":
    case "syntax":
      return t("field.request");
    default:
      return undefined;
  }
};

const questionField = (t: SystemOneTranslator, key: string): string | undefined => {
  switch (key) {
    case "name":
      return t("field.questionName");
    case "type":
      return t("field.answerType");
    case "instructions":
      return t("field.instructions");
    case "criteria":
      return t("field.options");
    default:
      return undefined;
  }
};

const humanize = (segment: PropertyKey): string => String(segment).replace(/_/g, " ");

export function issueLabel(path: readonly PropertyKey[], t: SystemOneTranslator): string {
  const [head = "root", question, field] = path;
  if (head !== "questions" || question === undefined) {
    return topLevel(t, String(head)) ?? humanize(head);
  }
  const title =
    typeof question === "number"
      ? t("field.questionByIndexAria", { index: question + 1 })
      : t("field.questionByName", { name: String(question) });
  if (field === undefined) {
    return title;
  }
  return `${title} ${questionField(t, String(field)) ?? humanize(field)}`;
}
