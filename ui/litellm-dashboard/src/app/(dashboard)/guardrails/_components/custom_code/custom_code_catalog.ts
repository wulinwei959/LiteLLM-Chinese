export const CODE_TEMPLATES = {
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
};

export const PRIMITIVES = {
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


export const MODE_OPTIONS = [
  { value: "pre_call", labelKey: "custom.modePre" },
  { value: "post_call", labelKey: "custom.modePost" },
  { value: "during_call", labelKey: "custom.modeDuring" },
  { value: "logging_only", labelKey: "custom.modeLogging" },
  { value: "pre_mcp_call", labelKey: "custom.modePreMcp" },
  { value: "post_mcp_call", labelKey: "custom.modePostMcp" },
  { value: "during_mcp_call", labelKey: "custom.modeDuringMcp" },
];

export const TEMPLATE_ITEMS = Object.entries(CODE_TEMPLATES).map(([key, template]) => ({
  value: key,
  labelKey: template.nameKey,
}));

export type ModeOption = (typeof MODE_OPTIONS)[number];

export const MODE_OPTION_BY_VALUE: Record<string, ModeOption> = Object.fromEntries(
  MODE_OPTIONS.map((option) => [option.value, option]),
);
