"use client";

import {
  CategoryIcon,
  type ComplianceCategory,
  type ComplianceFramework,
  type CompliancePrompt,
} from "./ComplianceUIShared";
import { ChevronDown, ChevronRight, Download, Plus, Search, Trash2, Upload } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";

interface CompliancePromptLibraryProps {
  readonly frameworks: ComplianceFramework[];
  readonly allFrameworks: ComplianceFramework[];
  readonly selectedPromptIds: Set<string>;
  readonly setSelectedPromptIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  readonly expandedFrameworks: Set<string>;
  readonly setExpandedFrameworks: React.Dispatch<React.SetStateAction<Set<string>>>;
  readonly expandedCategories: Set<string>;
  readonly setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  readonly searchPrompt: string;
  readonly setSearchPrompt: React.Dispatch<React.SetStateAction<string>>;
  readonly customPrompts: CompliancePrompt[];
  readonly setCustomPrompts: React.Dispatch<React.SetStateAction<CompliancePrompt[]>>;
  readonly showAddPrompt: boolean;
  readonly setShowAddPrompt: React.Dispatch<React.SetStateAction<boolean>>;
  readonly newPromptText: string;
  readonly setNewPromptText: React.Dispatch<React.SetStateAction<string>>;
  readonly newPromptExpected: "fail" | "pass";
  readonly setNewPromptExpected: React.Dispatch<React.SetStateAction<"fail" | "pass">>;
  readonly addCustomPrompt: () => void;
  readonly deleteCustomPrompt: (id: string) => void;
  readonly showCsvUpload: boolean;
  readonly setShowCsvUpload: React.Dispatch<React.SetStateAction<boolean>>;
  readonly csvError: string | null;
  readonly setCsvError: React.Dispatch<React.SetStateAction<string | null>>;
  readonly downloadCsvTemplate: () => void;
  readonly handleCsvUpload: (file: File) => void;
}

export function CompliancePromptLibrary({
  frameworks,
  allFrameworks,
  selectedPromptIds,
  setSelectedPromptIds,
  expandedFrameworks,
  setExpandedFrameworks,
  expandedCategories,
  setExpandedCategories,
  searchPrompt,
  setSearchPrompt,
  customPrompts,
  setCustomPrompts,
  showAddPrompt,
  setShowAddPrompt,
  newPromptText,
  setNewPromptText,
  newPromptExpected,
  setNewPromptExpected,
  addCustomPrompt,
  deleteCustomPrompt,
  showCsvUpload,
  setShowCsvUpload,
  csvError,
  setCsvError,
  downloadCsvTemplate,
  handleCsvUpload,
}: CompliancePromptLibraryProps) {
  const t = useTranslations("playground");
  const commonT = useTranslations("common");
  const csvInputRef = useRef<HTMLInputElement>(null);

  const totalPromptCount = allFrameworks.reduce(
    (sum, fw) => sum + fw.categories.reduce((s, c) => s + c.prompts.length, 0),
    0,
  );

  const toggleFramework = (name: string) => {
    setExpandedFrameworks((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const togglePrompt = (id: string) => {
    setSelectedPromptIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategoryPrompts = (category: ComplianceCategory) => {
    const allSelected = category.prompts.every((p) => selectedPromptIds.has(p.id));
    setSelectedPromptIds((prev) => {
      const next = new Set(prev);
      category.prompts.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  };

  const toggleFrameworkPrompts = (fw: ComplianceFramework) => {
    const allIds = fw.categories.flatMap((c) => c.prompts.map((p) => p.id));
    const allSelected = allIds.every((id) => selectedPromptIds.has(id));
    setSelectedPromptIds((prev) => {
      const next = new Set(prev);
      allIds.forEach((id) => (allSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const selectAll = () => {
    const allIds = allFrameworks.flatMap((fw) => fw.categories.flatMap((c) => c.prompts.map((p) => p.id)));
    setSelectedPromptIds(new Set(allIds));
  };

  const deselectAll = () => setSelectedPromptIds(new Set());

  const filteredFrameworks = allFrameworks
    .map((fw) => ({
      ...fw,
      categories: fw.categories
        .map((cat) => ({
          ...cat,
          prompts: cat.prompts.filter(
            (p) => searchPrompt === "" || p.prompt.toLowerCase().includes(searchPrompt.toLowerCase()),
          ),
        }))
        .filter((cat) => cat.prompts.length > 0),
    }))
    .filter((fw) => fw.categories.length > 0);

  const builtInFrameworkNames = new Set(frameworks.map((f) => f.name));

  const handleDeleteCustomPrompt = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteCustomPrompt(id);
  };

  return (
    <div className="w-[400px] shrink-0 border-r border-border flex flex-col bg-card overflow-hidden">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-foreground">{t("compliance.testPrompts")}</h3>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {t("compliance.promptsSelected", { selected: selectedPromptIds.size, total: totalPromptCount })}
            </span>
          </div>

          <div className="relative mb-2.5">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              placeholder={t("compliance.searchPrompts")}
              className="w-full border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-info"
            />
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={selectAll}
                className="text-[11px] font-medium text-info hover:text-info/80"
              >
                {t("compliance.selectAll")}
              </button>
              <span className="text-muted-foreground text-[10px]">·</span>
              <button
                type="button"
                onClick={deselectAll}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                {t("compliance.clear")}
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowAddPrompt(!showAddPrompt);
                  setShowCsvUpload(false);
                }}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-sm transition-colors ${showAddPrompt ? "bg-info/10 text-info" : "text-muted-foreground hover:bg-accent"}`}
              >
                <Plus className="w-3 h-3" /> {t("compliance.add")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCsvUpload(!showCsvUpload);
                  setShowAddPrompt(false);
                }}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-sm transition-colors ${showCsvUpload ? "bg-info/10 text-info" : "text-muted-foreground hover:bg-accent"}`}
              >
                <Upload className="w-3 h-3" /> {t("compliance.csv")}
              </button>
            </div>
          </div>
        </div>

        {showAddPrompt && (
          <div className="mx-4 mb-2 border border-info/20 bg-info/5 rounded-lg p-3">
            <textarea
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              placeholder={t("compliance.promptText")}
              rows={2}
              className="w-full border border-border rounded-sm px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-info resize-none bg-card"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewPromptExpected("fail")}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${newPromptExpected === "fail" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}
                >
                  {t("compliance.expectBlock")}
                </button>
                <button
                  type="button"
                  onClick={() => setNewPromptExpected("pass")}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${newPromptExpected === "pass" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  {t("compliance.expectAllow")}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPrompt(false);
                    setNewPromptText("");
                  }}
                  className="text-[11px] text-muted-foreground px-2 py-1"
                >
                  {commonT("cancel")}
                </button>
                <button
                  type="button"
                  onClick={addCustomPrompt}
                  disabled={!newPromptText.trim()}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-sm ${newPromptText.trim() ? "bg-info text-info-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {t("compliance.add")}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCsvUpload && (
          <div className="mx-4 mb-2 border border-info/20 bg-info/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-foreground">{t("compliance.uploadCsv")}</span>
              <button
                type="button"
                onClick={downloadCsvTemplate}
                className="flex items-center gap-1 text-[10px] font-medium text-info hover:text-info/80"
              >
                <Download className="w-3 h-3" /> {t("compliance.downloadTemplate")}
              </button>
            </div>

            <div className="mb-2 p-2 bg-card rounded-sm border border-border">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-muted-foreground">{t("compliance.requiredColumns")}</span>{" "}
                <code className="bg-muted px-1 rounded-sm text-[10px]">prompt</code>,{" "}
                <code className="bg-muted px-1 rounded-sm text-[10px]">expected_result</code>{" "}
                <span className="text-muted-foreground">{t("compliance.failOrPass")}</span>
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                <span className="font-semibold text-muted-foreground">{t("compliance.optionalColumns")}</span>{" "}
                <code className="bg-muted px-1 rounded-sm text-[10px]">framework</code>,{" "}
                <code className="bg-muted px-1 rounded-sm text-[10px]">category</code>
              </p>
            </div>

            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCsvUpload(file);
              }}
            />
            <button
              type="button"
              onClick={() => csvInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-border rounded-lg text-xs text-muted-foreground hover:border-info hover:text-info transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> {t("compliance.chooseCsvFile")}
            </button>

            {csvError && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-sm text-[10px] text-destructive whitespace-pre-line">
                {csvError}
              </div>
            )}

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCsvUpload(false);
                  setCsvError(null);
                }}
                className="text-[11px] text-muted-foreground px-2 py-1"
              >
                {commonT("cancel")}
              </button>
            </div>
          </div>
        )}

        <div className="px-4 pb-4 space-y-1.5">
          {filteredFrameworks.map((fw) => {
            const isExpanded = expandedFrameworks.has(fw.name);
            const fwPromptCount = fw.categories.reduce((s, c) => s + c.prompts.length, 0);
            const fwSelectedCount = fw.categories.reduce(
              (s, c) => s + c.prompts.filter((p) => selectedPromptIds.has(p.id)).length,
              0,
            );
            const isCustom = !builtInFrameworkNames.has(fw.name);
            return (
              <div key={fw.name} className="rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFramework(fw.name)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-left bg-muted hover:bg-accent transition-colors rounded-lg border border-border"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <CategoryIcon iconKey={fw.icon} className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-foreground">{fw.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-1.5">
                      {t("compliance.promptsCount", { count: fwPromptCount })}
                    </span>
                  </div>
                  {fwSelectedCount > 0 && (
                    <span className="text-[10px] font-medium bg-info/15 text-info px-1.5 py-0.5 rounded-full">
                      {fwSelectedCount}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFrameworkPrompts(fw);
                    }}
                    className="text-[10px] font-medium text-info px-1.5 py-0.5 rounded-sm hover:bg-info/10 shrink-0"
                  >
                    {fwSelectedCount === fwPromptCount ? t("compliance.clear") : t("compliance.selectAll")}
                  </button>
                </button>

                {isExpanded && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                    {fw.categories.map((category) => {
                      const isCatExpanded = expandedCategories.has(category.name);
                      const selectedInCat = category.prompts.filter((p) => selectedPromptIds.has(p.id)).length;
                      const allCatSelected = selectedInCat === category.prompts.length && category.prompts.length > 0;
                      return (
                        <div key={category.name} className="rounded-md overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleCategory(category.name)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-2 text-left hover:bg-accent transition-colors"
                          >
                            {isCatExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-sm shrink-0">
                              <CategoryIcon iconKey={category.icon} className="w-3.5 h-3.5 text-muted-foreground" />
                            </span>
                            <span className="text-[11px] font-medium text-foreground flex-1 min-w-0 truncate">
                              {category.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {category.prompts.length}
                            </span>
                            {selectedInCat > 0 && (
                              <span className="text-[9px] font-medium bg-info/15 text-info px-1 py-0.5 rounded-full shrink-0">
                                {selectedInCat}
                              </span>
                            )}
                          </button>

                          {isCatExpanded && (
                            <div>
                              <div className="px-2.5 py-1 flex items-center justify-between">
                                <p className="text-[10px] text-muted-foreground leading-relaxed flex-1 mr-2 line-clamp-2">
                                  {category.description}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryPrompts(category)}
                                  className="text-[10px] font-medium text-info hover:text-info/80 shrink-0 whitespace-nowrap"
                                >
                                  {allCatSelected ? t("compliance.clear") : t("compliance.selectCategory")}
                                </button>
                              </div>
                              {category.prompts.map((prompt) => (
                                <label
                                  key={prompt.id}
                                  className="flex items-start gap-2 px-2.5 py-1.5 hover:bg-accent cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedPromptIds.has(prompt.id)}
                                    onChange={() => togglePrompt(prompt.id)}
                                    className="mt-0.5 w-3.5 h-3.5 rounded-sm border-border text-info focus:ring-blue-500/20 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] text-foreground leading-relaxed">{prompt.prompt}</p>
                                    <span
                                      className={`inline-block mt-0.5 text-[9px] font-semibold px-1 py-0.5 rounded-sm ${prompt.expectedResult === "fail" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}
                                    >
                                      {prompt.expectedResult === "fail"
                                        ? t("compliance.expectBlock")
                                        : t("compliance.expectAllow")}
                                    </span>
                                  </div>
                                  {isCustom && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteCustomPrompt(e, prompt.id)}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-all shrink-0"
                                      aria-label={commonT("delete")}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
