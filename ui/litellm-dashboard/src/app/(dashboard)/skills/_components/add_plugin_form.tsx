"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CircleHelp } from "lucide-react";
import { z } from "zod";
import { toast } from "@/lib/toast";
import type { SkillsTranslator } from "@/lib/i18n/translators";
import { registerClaudeCodePlugin } from "@/components/networking";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useZodForm } from "@/lib/forms/useZodForm";
import {
  validatePluginName,
  isValidSemanticVersion,
  isValidEmail,
  parseKeywords,
  parseSkillSource,
  isValidSubPath,
  isValidSha256,
  SkillSourcePreview,
} from "@/components/claude_code_plugins/helpers";
import { PluginAuthor, PluginSource, SkillRegisterRequest } from "@/components/claude_code_plugins/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddPluginFormProps {
  visible: boolean;
  onClose: () => void;
  accessToken: string | null;
  onSuccess: () => void;
}

const buildAddPluginShape = (t: SkillsTranslator) => ({
  skillUrl: z.string().min(1, t("urlRequired")),
  subPath: z
    .string()
    .refine(
      (value) => !value || isValidSubPath(value),
      t("subPathInvalid"),
    ),
  sha256: z.string().refine(isValidSha256, t("sha256Invalid")),
  name: z
    .string()
    .min(1, t("nameRequired"))
    .regex(/^[a-z0-9-]+$/, t("nameKebab")),
  domain: z.string(),
  namespace: z.string(),
  description: z.string(),
  category: z.string().nullable(),
  keywords: z.string(),
  version: z.string(),
  authorName: z.string(),
  authorEmail: z
    .string()
    .refine((value) => value === "" || z.email().safeParse(value).success, t("emailInvalid")),
});

const buildAddPluginSchema = (t: SkillsTranslator) => z.object(buildAddPluginShape(t));

type AddPluginFormValues = z.infer<ReturnType<typeof buildAddPluginSchema>>;

const EMPTY_VALUES: AddPluginFormValues = {
  skillUrl: "",
  subPath: "",
  sha256: "",
  name: "",
  domain: "",
  namespace: "",
  description: "",
  category: null,
  keywords: "",
  version: "",
  authorName: "",
  authorEmail: "",
};

const buildAuthor = (values: AddPluginFormValues): PluginAuthor | undefined => {
  const name = values.authorName.trim();
  const email = values.authorEmail.trim();
  if (!name) {
    return undefined;
  }
  return email ? { name, email } : { name };
};

const archiveUrlOf = (preview: SkillSourcePreview | null): string | undefined =>
  preview?.parsed.source === "archive" ? preview.parsed.url : undefined;

const withArchiveDigest = (source: PluginSource, sha256: string): PluginSource => {
  const digest = sha256.trim();
  return source.source === "archive" && digest ? { ...source, sha256: digest.toLowerCase() } : source;
};

const buildRegisterRequest = (values: AddPluginFormValues, source: PluginSource): SkillRegisterRequest => {
  const author = buildAuthor(values);
  return {
    name: values.name.trim(),
    source: withArchiveDigest(source, values.sha256),
    ...(values.version ? { version: values.version.trim() } : {}),
    ...(values.description ? { description: values.description.trim() } : {}),
    ...(author ? { author } : {}),
    ...(values.category ? { category: values.category } : {}),
    ...(values.keywords ? { keywords: parseKeywords(values.keywords) } : {}),
    ...(values.domain ? { domain: values.domain.trim() } : {}),
    ...(values.namespace ? { namespace: values.namespace.trim() } : {}),
  };
};

const PREDEFINED_CATEGORIES = [
  "Development",
  "Productivity",
  "Learning",
  "Security",
  "Data & Analytics",
  "Integration",
  "Testing",
  "Documentation",
];

const SUB_PATH_LOCK_KEY = {
  "git-subdir": "subPathLockGitSubdir",
  archive: "subPathLockArchive",
} as const;

type SubPathLock = keyof typeof SUB_PATH_LOCK_KEY;

const subPathLockFor = (source: PluginSource["source"] | undefined): SubPathLock | null =>
  source === "git-subdir" || source === "archive" ? source : null;

const labelWithHint = (label: string, hint: string): React.ReactNode => (
  <>
    {label}
    <Tooltip>
      <TooltipTrigger render={<CircleHelp className="size-3.5 shrink-0 cursor-help text-muted-foreground" />} />
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  </>
);

const AddPluginForm: React.FC<AddPluginFormProps> = ({ visible, onClose, accessToken, onSuccess }) => {
  const t = useTranslations("skills");
  const form = useZodForm(buildAddPluginSchema(t), { defaultValues: EMPTY_VALUES });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlPreview, setUrlPreview] = useState<SkillSourcePreview | null>(null);
  const [subPathLock, setSubPathLock] = useState<SubPathLock | null>(null);

  const recomputePreview = (skillUrl: string, subPath: string) => {
    const lock = subPathLockFor(parseSkillSource(t, skillUrl)?.parsed.source);
    setSubPathLock(lock);
    if (lock && form.getValues("subPath")) {
      form.setValue("subPath", "");
    }
    const preview = parseSkillSource(t, skillUrl, lock ? undefined : subPath);
    if (archiveUrlOf(preview) !== archiveUrlOf(urlPreview) && form.getValues("sha256")) {
      form.setValue("sha256", "");
    }
    setUrlPreview(preview);
    if (preview && !form.getValues("name")) {
      form.setValue("name", preview.suggestedName);
    }
  };

  const handleSubmit = async (values: AddPluginFormValues) => {
    if (!accessToken) {
      toast.error(t("noAccessToken"));
      return;
    }

    if (!urlPreview) {
      toast.error(t("invalidSourceUrl"));
      return;
    }

    if (!validatePluginName(values.name)) {
      toast.error(t("skillNameKebabToast"));
      return;
    }

    if (values.version && !isValidSemanticVersion(values.version)) {
      toast.error(t("semverToast"));
      return;
    }

    if (values.authorEmail && !isValidEmail(values.authorEmail)) {
      toast.error(t("invalidEmailToast"));
      return;
    }

    setIsSubmitting(true);
    try {
      await registerClaudeCodePlugin(accessToken, buildRegisterRequest(values, urlPreview.parsed));
      toast.success(t("registeredToast"));
      form.reset(EMPTY_VALUES);
      setUrlPreview(null);
      setSubPathLock(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error registering skill:", error);
      toast.error(error instanceof Error && error.message ? error.message : t("registerFailedToast"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset(EMPTY_VALUES);
    setUrlPreview(null);
    setSubPathLock(null);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="top-8 max-h-[calc(100dvh-4rem)] translate-y-0 overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t("addNew")}</DialogTitle>
        </DialogHeader>
        <TooltipProvider>
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="mt-4">
            <FieldGroup>
              <FormField
                control={form.control}
                name="skillUrl"
                label={labelWithHint(t("sourceUrlLabel"), t("sourceUrlHint"))}
              >
                {({ ref, onChange, ...field }) => (
                  <Input
                    {...field}
                    ref={ref}
                    placeholder="https://github.com/org/repo or https://bucket.s3.amazonaws.com/my-skill.zip"
                    className="rounded-lg"
                    onChange={(event) => {
                      onChange(event);
                      recomputePreview(event.target.value, form.getValues("subPath"));
                    }}
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="subPath"
                label={labelWithHint(t("subPathLabel"), t("subPathHint"))}
                description={subPathLock ? t(SUB_PATH_LOCK_KEY[subPathLock]) : undefined}
              >
                {({ ref, onChange, ...field }) => (
                  <Input
                    {...field}
                    ref={ref}
                    placeholder="plugins/my-skill"
                    className="rounded-lg"
                    onChange={(event) => {
                      onChange(event);
                      recomputePreview(form.getValues("skillUrl"), event.target.value);
                    }}
                    disabled={subPathLock !== null}
                  />
                )}
              </FormField>

              {urlPreview?.parsed.source === "archive" && (
                <FormField
                  control={form.control}
                  name="sha256"
                  label={labelWithHint(t("sha256Label"), t("sha256Hint"))}
                >
                  {({ ref, ...field }) => (
                    <Input {...field} ref={ref} placeholder={t("sha256Placeholder")} className="rounded-lg font-mono" />
                  )}
                </FormField>
              )}

              {urlPreview && (
                <div className="rounded-lg border border-info/20 bg-info/10 px-3 py-2 text-sm text-info">
                  {t("detected", { label: urlPreview.label })}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                label={labelWithHint(t("nameLabel"), t("nameHint"))}
              >
                {({ ref, ...field }) => <Input {...field} ref={ref} placeholder="my-skill" className="rounded-lg" />}
              </FormField>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="domain"
                  label={labelWithHint(t("domainLabel"), t("domainHint"))}
                  className="flex-1"
                >
                  {({ ref, ...field }) => (
                    <Input {...field} ref={ref} placeholder="Productivity" className="rounded-lg" />
                  )}
                </FormField>
                <FormField
                  control={form.control}
                  name="namespace"
                  label={labelWithHint(t("namespaceLabel"), t("namespaceHint"))}
                  className="flex-1"
                >
                  {({ ref, ...field }) => <Input {...field} ref={ref} placeholder="workflows" className="rounded-lg" />}
                </FormField>
              </div>

              <FormField
                control={form.control}
                name="description"
                label={labelWithHint(t("descriptionLabel"), t("descriptionHint"))}
              >
                {({ ref, ...field }) => (
                  <Textarea
                    {...field}
                    ref={ref}
                    rows={3}
                    placeholder={t("descriptionPlaceholder")}
                    maxLength={500}
                    className="rounded-lg"
                  />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="category"
                label={labelWithHint(t("categoryLabel"), t("categoryHint"))}
              >
                {({ id, value, onChange, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }) => (
                  <Combobox items={PREDEFINED_CATEGORIES} value={value} onValueChange={onChange}>
                    <ComboboxInput
                      id={id}
                      aria-invalid={ariaInvalid}
                      aria-describedby={ariaDescribedBy}
                      placeholder={t("categoryPlaceholder")}
                      className="w-full rounded-lg"
                      showClear={value != null && value !== ""}
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>{t("noMatchingCategories")}</ComboboxEmpty>
                      <ComboboxList>
                        {(category: string) => (
                          <ComboboxItem key={category} value={category}>
                            {category}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                )}
              </FormField>

              <FormField
                control={form.control}
                name="keywords"
                label={labelWithHint(t("keywordsLabel"), t("keywordsHint"))}
              >
                {({ ref, ...field }) => (
                  <Input {...field} ref={ref} placeholder="search, web, api" className="rounded-lg" />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="version"
                label={labelWithHint(t("versionLabel"), t("versionHint"))}
              >
                {({ ref, ...field }) => <Input {...field} ref={ref} placeholder="1.0.0" className="rounded-lg" />}
              </FormField>

              <FormField
                control={form.control}
                name="authorName"
                label={labelWithHint(t("authorLabel"), t("authorHint"))}
              >
                {({ ref, ...field }) => (
                  <Input {...field} ref={ref} placeholder={t("authorPlaceholder")} className="rounded-lg" />
                )}
              </FormField>

              <FormField
                control={form.control}
                name="authorEmail"
                label={labelWithHint(t("emailLabel"), t("emailHint"))}
              >
                {({ ref, ...field }) => (
                  <Input {...field} ref={ref} type="email" placeholder="author@example.com" className="rounded-lg" />
                )}
              </FormField>
            </FieldGroup>

            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting && <UiLoadingSpinner className="size-4" />}
                {isSubmitting ? t("adding") : t("addSkill")}
              </Button>
            </div>
          </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddPluginForm;
