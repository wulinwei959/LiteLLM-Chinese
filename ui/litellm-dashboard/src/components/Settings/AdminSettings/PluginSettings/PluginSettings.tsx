"use client";

import { useTranslations } from "next-intl";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { getConfigFieldSetting, updateConfigFieldSetting } from "@/components/networking";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { useZodForm } from "@/lib/forms/useZodForm";
import { buildPluginSchema, type PluginFormValues } from "./schema";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const INLINE_CODE_CLASS = "rounded-sm bg-muted px-1 py-0.5 font-mono text-xs";

interface Plugin {
  name: string;
  display_name: string;
  url: string;
  plugin_key?: string;
}

const BLANK_PLUGIN: PluginFormValues = { name: "", display_name: "", url: "", plugin_key: undefined };

export default function PluginSettings() {
  const t = useTranslations("adminPanel");
  const tc = useTranslations("common");
  const { accessToken } = useAuthorized();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [keyVisible, setKeyVisible] = useState(false);
  const form = useZodForm(buildPluginSchema(t), { defaultValues: BLANK_PLUGIN });

  useEffect(() => {
    if (!accessToken) return;
    getConfigFieldSetting(accessToken, "plugins")
      .then((data) => {
        const val = data?.field_value;
        setPlugins(Array.isArray(val) ? val : []);
      })
      .catch(() => setPlugins([]))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const save = async (updated: Plugin[]) => {
    if (!accessToken) return;
    setSaving(true);
    try {
      await updateConfigFieldSetting(accessToken, "plugins", updated);
      setPlugins(updated);
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setEditingIndex(null);
    setKeyVisible(false);
    form.reset(BLANK_PLUGIN);
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    setEditingIndex(idx);
    setKeyVisible(false);
    // plugin_key arrives redacted ("***"); start it blank so an untouched save
    // keeps the stored credential instead of overwriting it with the placeholder.
    form.reset({ ...plugins[idx], plugin_key: "" });
    setModalOpen(true);
  };

  const handleDelete = (idx: number) => {
    const updated = plugins.filter((_, i) => i !== idx);
    save(updated);
  };

  const handleOk = async (values: PluginFormValues) => {
    const updated =
      editingIndex !== null ? plugins.map((p, i) => (i === editingIndex ? values : p)) : [...plugins, values];
    await save(updated);
    setModalOpen(false);
  };

  const renderRows = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="py-6 text-center">
            <UiLoadingSpinner className="mx-auto size-6 text-muted-foreground" />
          </TableCell>
        </TableRow>
      );
    }

    if (plugins.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="py-6 text-center text-sm text-muted-foreground">
            {tc("noDataShort")}
          </TableCell>
        </TableRow>
      );
    }

    return plugins.map((plugin, idx) => (
      <TableRow key={plugin.name}>
        <TableCell>
          <code className={INLINE_CODE_CLASS}>{plugin.name}</code>
        </TableCell>
        <TableCell>{plugin.display_name}</TableCell>
        <TableCell>
          <a href={plugin.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            {plugin.url}
          </a>
        </TableCell>
        <TableCell>
          {plugin.plugin_key ? (
            <code className={INLINE_CODE_CLASS}>{"•".repeat(8)}</code>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("pluginSettings.editAria", { name: plugin.name })}
              onClick={() => openEdit(idx)}
            >
              <Pencil />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              aria-label={t("pluginSettings.deleteAria", { name: plugin.name })}
              onClick={() => handleDelete(idx)}
            >
              <Trash2 />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <h4 className="text-base font-semibold text-foreground">{t("pluginSettings.title")}</h4>
        <p className="text-sm text-foreground">{t("pluginSettings.description")}</p>
        <p className="text-xs text-muted-foreground">
          {t.rich("pluginSettings.manifestHint", {
            code: (chunks) => <code className={INLINE_CODE_CLASS}>{chunks}</code>,
          })}
        </p>
      </CardHeader>
      <CardContent>
        <Button className="mb-4" onClick={openAdd}>
          <Plus />
          {t("pluginSettings.addPlugin")}
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tc("name")}</TableHead>
              <TableHead>{t("pluginSettings.displayName")}</TableHead>
              <TableHead>{t("pluginSettings.url")}</TableHead>
              <TableHead>{t("pluginSettings.pluginKey")}</TableHead>
              <TableHead>{tc("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </CardContent>

      <Dialog open={modalOpen} onOpenChange={(open) => !open && setModalOpen(false)}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? t("pluginSettings.editPlugin") : t("pluginSettings.addPlugin")}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(event) => event.preventDefault()} noValidate style={{ marginTop: 16 }}>
            <FieldGroup>
              <FormField
                control={form.control}
                name="name"
                label={t("pluginSettings.nameLabel")}
                description={t("pluginSettings.nameDesc")}
              >
                {({ ref, ...field }) => (
                  <Input {...field} ref={ref} placeholder={t("pluginSettings.namePlaceholder")} />
                )}
              </FormField>
              <FormField control={form.control} name="display_name" label={t("pluginSettings.displayName")}>
                {({ ref, ...field }) => (
                  <Input {...field} ref={ref} placeholder={t("pluginSettings.displayNamePlaceholder")} />
                )}
              </FormField>
              <FormField
                control={form.control}
                name="url"
                label={t("pluginSettings.url")}
                description={t("pluginSettings.urlDesc")}
              >
                {({ ref, ...field }) => <Input {...field} ref={ref} placeholder={t("pluginSettings.urlPlaceholder")} />}
              </FormField>
              <FormField
                control={form.control}
                name="plugin_key"
                label={t("pluginSettings.pluginKey")}
                description={t("pluginSettings.pluginKeyDesc")}
              >
                {({ ref, ...field }) => (
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      ref={ref}
                      type={keyVisible ? "text" : "password"}
                      value={field.value ?? ""}
                      placeholder={
                        editingIndex !== null
                          ? t("pluginSettings.pluginKeyPlaceholderKeep")
                          : t("pluginSettings.pluginKeyPlaceholderOptional")
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="icon-xs"
                        onClick={() => setKeyVisible(!keyVisible)}
                        aria-label={keyVisible ? t("pluginSettings.hideKey") : t("pluginSettings.showKey")}
                      >
                        {keyVisible ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              </FormField>
            </FieldGroup>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              {tc("cancel")}
            </Button>
            <Button onClick={form.handleSubmit(handleOk)} disabled={saving} aria-busy={saving}>
              {tc("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
