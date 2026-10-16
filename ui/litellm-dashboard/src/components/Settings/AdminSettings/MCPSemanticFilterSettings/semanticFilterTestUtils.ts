import { toast } from "@/lib/toast";
import { testMCPSemanticFilter } from "@/components/networking";
import type { AdminPanelTranslator } from "@/lib/i18n/translators";

export interface TestResult {
  totalTools: number;
  selectedTools: number;
  tools: string[];
}

interface FilterHeaders {
  filter: string | null;
  tools: string | null;
}

const parseFilterHeaders = (headers: FilterHeaders): TestResult | null => {
  if (!headers.filter) {
    return null;
  }

  const [total, selected] = headers.filter.split("->").map(Number);
  const tools = headers.tools ? headers.tools.split(",").map((name) => name.trim()) : [];

  return { totalTools: total, selectedTools: selected, tools };
};

export const runSemanticFilterTest = async ({
  accessToken,
  testModel,
  testQuery,
  setIsTesting,
  setTestResult,
  setTestError,
  t,
}: {
  accessToken: string;
  testModel: string | null;
  testQuery: string;
  setIsTesting: (value: boolean) => void;
  setTestResult: (result: TestResult | null) => void;
  setTestError: (error: string | null) => void;
  t: AdminPanelTranslator;
}) => {
  if (!testQuery || !testModel || !accessToken) {
    toast.error(t("mcpSemanticFilter.toast.testQueryAndModelRequired"));
    return;
  }

  setIsTesting(true);
  setTestResult(null);
  setTestError(null);

  try {
    const { headers } = await testMCPSemanticFilter(accessToken, testModel, testQuery);
    const parsedResult = parseFilterHeaders(headers);

    if (!parsedResult) {
      toast.warning(t("mcpSemanticFilter.toast.notEnabledOrNoTools"));
      return;
    }

    setTestResult(parsedResult);
    toast.success(t("mcpSemanticFilter.toast.testCompleted"));
  } catch (error) {
    console.error("Test failed:", error);
    const message = error instanceof Error && error.message ? error.message : t("mcpSemanticFilter.toast.testFailed");
    setTestError(message);
    toast.error(t("mcpSemanticFilter.toast.testFailed"));
  } finally {
    setIsTesting(false);
  }
};

export const getCurlCommand = (testModel: string | null, testQuery: string) =>
  `curl --location 'http://localhost:4000/v1/responses' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer <your-master-key>' \\
--data '{
    "model": "${testModel ?? "YOUR_MODEL"}",
    "input": [
    {
      "role": "user",
      "content": "${testQuery || "Your query here"}",
      "type": "message"
    }
  ],
    "tools": [
        {
            "type": "mcp",
            "server_url": "litellm_proxy",
            "require_approval": "never"
        }
    ],
    "tool_choice": "required"
}'`;
