import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, ChevronRight, Code, ExternalLink, PlayCircle, Save, Users, XCircle } from "lucide-react";
import { createGuardrailCall, updateGuardrailCall, testCustomCodeGuardrail } from "@/components/networking";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";

// Code templates
const CODE_TEMPLATES = {
  empty: {
    nameKey: "custom.tplEmpty",
    code: `async def apply_guardrail(inputs, request_data, input_type):
    # inputs: {texts, images, tools, tool_calls, structured_messages, model}
    # request_data: {model, user_id, team_id, end_user_id, metadata}
    # input_type: "request" or "response"
    return allow()`,
  },
  blockSSN: {
    nameKey: "custom.tplSSN",
    code: `def apply_guardrail(inputs, request_data, input_type):
    for text in inputs["texts"]:
        if regex_match(text, r"\\d{3}-\\d{2}-\\d{4}"):
            return block("SSN detected")
    return allow()`,
  },
  redactEmail: {
    nameKey: "custom.tplEmail",
    code: `def apply_guardrail(inputs, request_data, input_type):
    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
    modified = []
    for text in inputs["texts"]:
        modified.append(regex_replace(text, pattern, "[EMAIL REDACTED]"))
    return modify(texts=modified)`,
  },
  blockSQL: {
    nameKey: "custom.tplSQL",
    code: `def apply_guardrail(inputs, request_data, input_type):
    if input_type != "request":
        return allow()
    for text in inputs["texts"]:
        if contains_code_language(text, ["sql"]):
            return block("SQL code not allowed")
    return allow()`,
  },
  validateJSON: {
    nameKey: "custom.tplJSON",
    code: `def apply_guardrail(inputs, request_data, input_type):
    if input_type != "response":
        return allow()
    
    schema = {"type": "object", "required": ["name", "value"]}
    
    for text in inputs["texts"]:
        obj = json_parse(text)
        if obj is None:
            return block("Invalid JSON response")
        if not json_schema_valid(obj, schema):
            return block("Response missing required fields")
    return allow()`,
  },
  externalAPI: {
    nameKey: "custom.tplAPI",
    code: `async def apply_guardrail(inputs, request_data, input_type):
    # Call an external moderation API (async for non-blocking)
    for text in inputs["texts"]:
        response = await http_post(
            "https://api.example.com/moderate",
            body={"text": text, "user_id": request_data["user_id"]},
            headers={"Authorization": "Bearer YOUR_API_KEY"},
            timeout=10
        )
        
        if not response["success"]:
            # API call failed, allow by default or block
            return allow()
        
        if response["body"].get("flagged"):
            return block(response["body"].get("reason", "Content flagged"))

    return allow()`,
  },
} as const;

// Available primitives organized by category
const PRIMITIVES = {
  returnValues: {
    labelKey: "custom.primReturn",
    items: [
      { name: "allow()", descKey: "custom.descAllow" },
      { name: "block(reason)", descKey: "custom.descBlock" },
      { name: "flag(reason, metadata={})", descKey: "custom.descFlag" },
      { name: "modify(texts=[], images=[], tool_calls=[])", descKey: "custom.descModify" },
    ],
  },
  httpRequests: {
    labelKey: "custom.primHttp",
    items: [
      { name: "await http_request(url, method, headers, body)", descKey: "custom.descHttpRequest" },
      { name: "await http_get(url, headers)", descKey: "custom.descHttpGet" },
      { name: "await http_post(url, body, headers)", descKey: "custom.descHttpPost" },
    ],
  },
  regexFunctions: {
    labelKey: "custom.primRegex",
    items: [
      { name: "regex_match(text, pattern)", descKey: "custom.descRegexMatch" },
      { name: "regex_replace(text, pattern, replacement)", descKey: "custom.descRegexReplace" },
      { name: "regex_find_all(text, pattern)", descKey: "custom.descRegexFindAll" },
    ],
  },
  jsonFunctions: {
    labelKey: "custom.primJson",
    items: [
      { name: "json_parse(text)", descKey: "custom.descJsonParse" },
      { name: "json_stringify(obj)", descKey: "custom.descJsonStringify" },
      { name: "json_schema_valid(obj, schema)", descKey: "custom.descJsonSchema" },
    ],
  },
  urlFunctions: {
    labelKey: "custom.primUrl",
    items: [
      { name: "extract_urls(text)", descKey: "custom.descExtractUrls" },
      { name: "is_valid_url(url)", descKey: "custom.descValidUrl" },
      { name: "all_urls_valid(text)", descKey: "custom.descAllUrlsValid" },
    ],
  },
  codeDetection: {
    labelKey: "custom.primCode",
    items: [
      { name: "detect_code(text)", descKey: "custom.descDetectCode" },
      { name: "detect_code_languages(text)", descKey: "custom.descDetectLangs" },
      { name: 'contains_code_language(text, ["sql"])', descKey: "custom.descContainsLang" },
    ],
  },
  textUtilities: {
    labelKey: "custom.primText",
    items: [
      { name: "contains(text, substring)", descKey: "custom.descContains" },
      { name: "contains_any(text, [substr1, substr2])", descKey: "custom.descContainsAny" },
      { name: "word_count(text)", descKey: "custom.descWordCount" },
      { name: "char_count(text)", descKey: "custom.descCharCount" },
      { name: "lower(text) / upper(text) / trim(text)", descKey: "custom.descCase" },
    ],
  },
} as const;

const MODE_OPTIONS = [
  { value: "pre_call", labelKey: "custom.modePre" },
  { value: "post_call", labelKey: "custom.modePost" },
  { value: "during_call", labelKey: "custom.modeDuring" },
  { value: "logging_only", labelKey: "custom.modeLogging" },
  { value: "pre_mcp_call", labelKey: "custom.modePreMcp" },
  { value: "post_mcp_call", labelKey: "custom.modePostMcp" },
  { value: "during_mcp_call", labelKey: "custom.modeDuringMcp" },
] as const;

const TEMPLATE_ITEMS = Object.entries(CODE_TEMPLATES).map(([key, template]) => ({
  value: key,
  labelKey: template.nameKey,
}));

type ModeOption = (typeof MODE_OPTIONS)[number];

const MODE_OPTION_BY_VALUE: Record<string, ModeOption> = Object.fromEntries(
  MODE_OPTIONS.map((option) => [option.value, option]),
);

// Data for editing an existing guardrail
export interface EditGuardrailData {
  guardrail_id: string;
  guardrail_name: string;
  litellm_params: {
    mode?: string | string[];
    default_on?: boolean;
    custom_code?: string;
    [key: string]: any;
  };
}

interface CustomCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string | null;
  /** If provided, the modal will be in edit mode */
  editData?: EditGuardrailData | null;
}

const CustomCodeModal: React.FC<CustomCodeModalProps> = ({ visible, onClose, onSuccess, accessToken, editData }) => {
  const t = useTranslations("guardrails");
  const anchor = useComboboxAnchor();
  const isEditMode = !!editData;
  const [guardrailName, setGuardrailName] = useState("");
  const [mode, setMode] = useState<string[]>(["pre_call"]);
  const [defaultOn, setDefaultOn] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("empty");
  const [code, setCode] = useState<string>(CODE_TEMPLATES.empty.code);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testExpanded, setTestExpanded] = useState(false);

  // Test input examples for pre_call and post_call
  const TEST_INPUT_EXAMPLES = {
    pre_call: {
      name: "Pre-call (Request)",
      data: {
        texts: ["Hello, my SSN is 123-45-6789"],
        images: [],
        tools: [
          {
            type: "function",
            function: {
              name: "get_weather",
              description: "Get the current weather in a location",
              parameters: {
                type: "object",
                properties: {
                  location: { type: "string", description: "City name" },
                },
                required: ["location"],
              },
            },
          },
        ],
        tool_calls: [],
        structured_messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Hello, my SSN is 123-45-6789" },
        ],
        model: "gpt-4",
      },
    },
    post_call: {
      name: "Post-call (Response)",
      data: {
        texts: ["The weather in San Francisco is 72°F and sunny."],
        images: [],
        tools: [],
        tool_calls: [
          {
            id: "call_abc123",
            type: "function",
            function: {
              name: "get_weather",
              arguments: '{"location": "San Francisco"}',
            },
          },
        ],
        structured_messages: [],
        model: "gpt-4",
      },
    },
    pre_mcp_call: {
      name: "Pre MCP (MCP tool as OpenAI tool)",
      data: {
        texts: ['Tool: read_wiki_structure\nArguments: {"repoName": "BerriAI/litellm"}'],
        images: [],
        tools: [
          {
            type: "function",
            function: {
              name: "read_wiki_structure",
              description: "Read the structure of a GitHub repository (MCP tool passed as OpenAI tool)",
              parameters: {
                type: "object",
                properties: {
                  repoName: { type: "string", description: "Repository name, e.g. BerriAI/litellm" },
                },
                required: ["repoName"],
              },
            },
          },
        ],
        tool_calls: [
          {
            id: "call_mcp_001",
            type: "function",
            function: {
              name: "read_wiki_structure",
              arguments: '{"repoName": "BerriAI/litellm"}',
            },
          },
        ],
        structured_messages: [
          { role: "user", content: 'Tool: read_wiki_structure\nArguments: {"repoName": "BerriAI/litellm"}' },
        ],
        model: "mcp-tool-call",
      },
    },
  };

  const [testInput, setTestInput] = useState(JSON.stringify(TEST_INPUT_EXAMPLES.pre_call.data, null, 2));
  const [testResult, setTestResult] = useState<any>(null);
  const [copiedPrimitive, setCopiedPrimitive] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle template change
  const handleTemplateChange = (templateKey: string) => {
    setSelectedTemplate(templateKey);

    // Check if it's a standard template
    setCode(CODE_TEMPLATES[templateKey as keyof typeof CODE_TEMPLATES].code);
  };

  // Normalize mode from API (string or string[]) to string[]
  const normalizeMode = (m: string | string[] | undefined): string[] => {
    if (m === undefined || m === null) return ["pre_call"];
    if (Array.isArray(m)) return m.length ? m : ["pre_call"];
    return [m];
  };

  // Reset form when modal opens or editData changes
  useEffect(() => {
    if (visible) {
      if (editData) {
        // Edit mode: populate with existing data
        setGuardrailName(editData.guardrail_name || "");
        setMode(normalizeMode(editData.litellm_params?.mode));
        setDefaultOn(editData.litellm_params?.default_on || false);
        setCode(editData.litellm_params?.custom_code || CODE_TEMPLATES.empty.code);
        setSelectedTemplate(""); // No template selected in edit mode
      } else {
        // Create mode: reset to defaults
        setGuardrailName("");
        setMode(["pre_call"]);
        setDefaultOn(false);
        setSelectedTemplate("empty");
        setCode(CODE_TEMPLATES.empty.code);
      }
      setTestResult(null);
      setTestExpanded(false);
    }
  }, [visible, editData]);

  // Copy primitive to clipboard
  const copyPrimitive = async (primitive: string) => {
    try {
      await navigator.clipboard.writeText(primitive);
      setCopiedPrimitive(primitive);
      setTimeout(() => setCopiedPrimitive(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + "    " + code.substring(end);
      setCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Save guardrail (create or update)
  const handleSave = async () => {
    if (!guardrailName.trim()) {
      toast.fromError(t("form.nameRequired"));
      return;
    }
    if (!code.trim()) {
      toast.fromError(t("custom.enterCode"));
      return;
    }
    if (!accessToken) {
      toast.fromError(t("form.noToken"));
      return;
    }

    setIsSaving(true);
    try {
      if (isEditMode && editData) {
        // Update existing guardrail
        const updateData: any = {
          litellm_params: {
            custom_code: code,
          },
        };

        // Only include changed fields
        if (guardrailName !== editData.guardrail_name) {
          updateData.guardrail_name = guardrailName;
        }
        const existingMode = normalizeMode(editData.litellm_params?.mode);
        const modeChanged = mode.length !== existingMode.length || mode.some((m, i) => m !== existingMode[i]);
        if (modeChanged) {
          updateData.litellm_params.mode = mode;
        }
        if (defaultOn !== editData.litellm_params?.default_on) {
          updateData.litellm_params.default_on = defaultOn;
        }

        await updateGuardrailCall(accessToken, editData.guardrail_id, updateData);
        toast.success(t("custom.updated"));
      } else {
        // Create new guardrail
        const guardrailData = {
          guardrail_name: guardrailName,
          litellm_params: {
            guardrail: "custom_code",
            mode: mode,
            default_on: defaultOn,
            custom_code: code,
          },
          guardrail_info: {},
        };

        await createGuardrailCall(accessToken, guardrailData);
        toast.success(t("custom.created"));
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to save guardrail:", error);
      const message = error instanceof Error ? error.message : String(error);
      toast.fromError(
        isEditMode ? t("custom.updateFailed", { error: message }) : t("custom.createFailed", { error: message }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Test guardrail using backend endpoint
  const handleTest = async () => {
    if (!accessToken) {
      setTestResult({ error: t("form.noToken") });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Parse test input JSON
      let parsedInput;
      try {
        parsedInput = JSON.parse(testInput);
      } catch (e) {
        setTestResult({ error: t("custom.invalidJson") });
        setIsTesting(false);
        return;
      }

      // Ensure texts array exists
      if (!parsedInput.texts) {
        parsedInput.texts = [];
      }

      // Use first request-like or response-like mode for test input_type
      const requestModes = ["pre_call", "pre_mcp_call"];
      const responseModes = ["post_call", "post_mcp_call"];
      const testInputType: "request" | "response" = mode.some((m) => requestModes.includes(m))
        ? "request"
        : mode.some((m) => responseModes.includes(m))
          ? "response"
          : "request";

      const response = await testCustomCodeGuardrail(accessToken, {
        custom_code: code,
        test_input: parsedInput,
        input_type: testInputType,
        request_data: {
          model: "test-model",
          metadata: {},
        },
      });

      if (response.success && response.result) {
        setTestResult(response.result);
      } else if (response.error) {
        setTestResult({
          error: response.error,
          error_type: response.error_type,
        });
      } else {
        setTestResult({ error: t("custom.unknownError") });
      }
    } catch (error) {
      console.error("Failed to test custom code:", error);
      setTestResult({
        error: error instanceof Error ? error.message : t("custom.testFailed"),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const lineCount = code.split("\n").length;
  const selectedModeOptions = mode.map((value) => MODE_OPTION_BY_VALUE[value]).filter(Boolean);

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEditMode ? t("custom.editTitle") : t("custom.createTitle")}
          </DialogTitle>
          <DialogDescription>{t("custom.desc")}</DialogDescription>
        </DialogHeader>

        {/* Top Controls */}
        <div className="flex items-center gap-4 border-b border-border py-4">
          <div className="max-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("form.nameLabel")}</label>
            <Input
              value={guardrailName}
              onChange={(e) => setGuardrailName(e.target.value)}
              placeholder="e.g., block-pii-custom"
            />
          </div>
          <div className="w-[280px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("custom.modeLabel")}</label>
            <Combobox
              items={MODE_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
              value={selectedModeOptions}
              onValueChange={(options: ModeOption[]) => setMode(options.map((option) => option.value))}
              multiple
            >
              <ComboboxChips render={<div ref={anchor} />} className="w-full">
                {selectedModeOptions.map((option) => (
                  <ComboboxChip key={option.value} aria-label={t(option.labelKey)}>
                    {t(option.labelKey)}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={mode.length === 0 ? t("custom.selectModes") : undefined} />
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>{t("custom.noModes")}</ComboboxEmpty>
                <ComboboxList>
                  {(option: { value: string; label: string }) => (
                    <ComboboxItem key={option.value} value={option}>
                      {option.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <div className="w-[180px]">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("custom.template")}</label>
            <Select
              items={TEMPLATE_ITEMS.map((template) => ({ value: template.value, label: t(template.labelKey) }))}
              value={selectedTemplate}
              onValueChange={(value: string | null) => value && handleTemplateChange(value)}
            >
              <SelectTrigger className="w-full" aria-label={t("custom.template")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("custom.standard")}</SelectLabel>
                  {TEMPLATE_ITEMS.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {t(template.labelKey)}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <button
                  type="button"
                  onClick={() => window.open("https://models.litellm.ai/guardrails", "_blank")}
                  className="flex w-full items-center gap-1 rounded-sm px-2 py-1.5 text-xs text-primary hover:bg-accent"
                >
                  <Users className="size-3.5" />
                  <span>{t("custom.browse")}</span>
                  <ExternalLink className="size-2.5" />
                </button>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <span className="text-sm text-muted-foreground">{t("info.defaultOnLabel")}</span>
            <Switch checked={defaultOn} onCheckedChange={setDefaultOn} aria-label={t("info.defaultOnLabel")} />
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-4 flex gap-6">
          {/* Code Editor */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{t("custom.pythonTitle")}</span>
              <span className="text-xs text-muted-foreground">{t("custom.restricted")}</span>
            </div>
            <div
              className="relative rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e] shrink-0"
              style={{ minHeight: "300px", maxHeight: "400px" }}
            >
              {/* Line numbers */}
              <div
                className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-gray-700 text-right pr-3 pt-3 select-none overflow-hidden"
                style={{
                  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
                  <div key={i + 1} className="text-muted-foreground h-[22.4px]">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code textarea */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="w-full h-full pl-14 pr-4 pt-3 pb-3 resize-none focus:outline-hidden bg-transparent text-gray-200"
                style={{
                  fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  tabSize: 4,
                }}
              />
            </div>

            {/* Test Section */}
            <Collapsible
              open={testExpanded}
              onOpenChange={setTestExpanded}
              className="mt-3 shrink-0 rounded-lg border border-border"
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 p-3 text-sm font-medium">
                <ChevronRight className={`size-4 transition-transform ${testExpanded ? "rotate-90" : ""}`} />
                <PlayCircle className="size-4 text-muted-foreground" />
                {t("custom.testTitle")}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-muted-foreground">{t("custom.testInput")}</label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t("custom.loadExample")}</span>
                        <button
                          type="button"
                          onClick={() => setTestInput(JSON.stringify(TEST_INPUT_EXAMPLES.pre_call.data, null, 2))}
                          className="px-2 py-1 text-xs rounded-sm border border-warning/20 bg-warning/10 text-warning hover:bg-warning/15 transition-colors"
                        >
                          {t("custom.exPre")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTestInput(JSON.stringify(TEST_INPUT_EXAMPLES.pre_mcp_call.data, null, 2))}
                          className="px-2 py-1 text-xs rounded-sm border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900"
                        >
                          {t("custom.exMcp")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTestInput(JSON.stringify(TEST_INPUT_EXAMPLES.post_call.data, null, 2))}
                          className="px-2 py-1 text-xs rounded-sm border border-success/20 bg-success/10 text-success hover:bg-success/15 transition-colors"
                        >
                          {t("custom.exPost")}
                        </button>
                      </div>
                    </div>
                    <div className="mb-2 rounded-sm border border-border bg-muted/40 p-2 text-xs text-muted-foreground">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div>
                          <strong>texts</strong>: {t("custom.guideTexts")}
                        </div>
                        <div>
                          <strong>images</strong>: {t("custom.guideImages")}
                        </div>
                        <div>
                          <strong>tools</strong>: {t("custom.guideTools")} <span className="text-warning">(pre_call)</span>, {t("custom.guideToolsMcp")}{" "}
                          <span className="text-purple-600">(pre_mcp_call)</span>
                        </div>
                        <div>
                          <strong>tool_calls</strong>: {t("custom.guideCalls")} <span className="text-success">(post_call)</span>
                        </div>
                        <div>
                          <strong>structured_messages</strong>: {t("custom.guideStruct")}{" "}
                          <span className="text-warning">(pre_call)</span>
                        </div>
                        <div>
                          <strong>model</strong>: {t("custom.guideModel")}
                        </div>
                      </div>
                    </div>
                    <Textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      rows={8}
                      className="font-mono text-xs field-sizing-fixed"
                      placeholder='{"texts": ["test message"], ...}'
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={handleTest} disabled={isTesting} aria-busy={isTesting}>
                      {isTesting ? <UiLoadingSpinner className="size-4" /> : <PlayCircle />}
                      {isTesting ? t("custom.running") : t("custom.runTest")}
                    </Button>
                    {testResult && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          testResult.error
                            ? "text-destructive"
                            : testResult.action === "allow"
                              ? "text-success"
                              : testResult.action === "block"
                                ? "text-warning"
                                : "text-info"
                        }`}
                      >
                        {testResult.error ? (
                          <>
                            <XCircle className="size-4" />
                            <span>
                              {testResult.error_type && <span className="font-medium">[{testResult.error_type}] </span>}
                              {testResult.error}
                            </span>
                          </>
                        ) : testResult.action === "allow" ? (
                          <>
                            <CheckCircle2 className="size-4" /> {t("custom.allowed")}
                          </>
                        ) : testResult.action === "block" ? (
                          <>
                            <XCircle className="size-4" /> {t("custom.blocked", { reason: testResult.reason })}
                          </>
                        ) : testResult.action === "modify" ? (
                          <>
                            <CheckCircle2 className="size-4" /> {t("custom.modified")}
                            {testResult.texts && testResult.texts.length > 0 && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                -&gt; {testResult.texts[0].substring(0, 50)}
                                {testResult.texts[0].length > 50 ? "..." : ""}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-4" /> {testResult.action || t("custom.unknown")}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            {/* Contribution CTA Banner */}
            <div className="mt-3 flex shrink-0 items-center justify-between rounded-lg border border-info/20 bg-linear-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950 dark:to-indigo-950">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-info/15 p-2">
                  <Users className="size-5 text-info" />
                </div>
                <div>
                  <div className="text-sm font-medium">{t("custom.builtQ")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("custom.shareHint")}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => window.open("https://github.com/BerriAI/litellm-guardrails", "_blank")}>
                <ExternalLink />
                {t("custom.contribute")}
              </Button>
            </div>
          </div>

          {/* Primitives Panel */}
          <div className="w-[300px] shrink-0 overflow-auto border-l border-border pl-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="size-4 text-muted-foreground" />
              <span className="font-semibold">{t("custom.primTitle")}</span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">{t("custom.primHint")}</p>

            <div className="space-y-2">
              {Object.entries(PRIMITIVES).map(([category, group]) => (
                <Collapsible
                  key={category}
                  defaultOpen={category === "returnValues"}
                  className="rounded-lg border border-border"
                >
                  <CollapsibleTrigger className="group flex w-full items-center justify-between px-3 py-2 text-sm font-medium">
                    {t(group.labelKey)}
                    <ChevronRight className="size-4 transition-transform group-data-panel-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {group.items.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => copyPrimitive(p.name)}
                          className={`w-full rounded-sm px-2 py-2 text-left transition-colors ${
                            copiedPrimitive === p.name ? "bg-accent" : "bg-muted/40 hover:bg-accent"
                          }`}
                        >
                          {copiedPrimitive === p.name ? (
                            <span className="flex items-center gap-1 font-mono text-xs">
                              <CheckCircle2 className="size-3.5" /> {t("custom.copied")}
                            </span>
                          ) : (
                            <>
                              <div className="font-mono text-xs">{p.name}</div>
                              <div className="mt-0.5 text-[10px] text-muted-foreground">{t(p.descKey)}</div>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">{t("custom.autosaved")}</span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              {t("form.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !guardrailName.trim()} aria-busy={isSaving}>
              {isSaving ? <UiLoadingSpinner className="size-4" /> : <Save />}
              {isEditMode ? t("custom.update") : t("custom.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomCodeModal;
