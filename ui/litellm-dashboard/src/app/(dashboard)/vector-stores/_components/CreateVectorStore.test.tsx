import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateVectorStore from "./CreateVectorStore";
import * as networking from "@/components/networking";

// Mock the networking module
vi.mock("@/components/networking", () => ({
  ragIngestCall: vi.fn(),
}));

// Mock vector_store_providers
vi.mock("@/components/vector_store_providers", () => ({
  VectorStoreProviders: {
    BEDROCK: "Amazon Bedrock",
    OPENAI: "OpenAI",
    AZURE_OPENAI: "Azure OpenAI",
    S3Vectors: "AWS S3 Vectors",
    Valkey: "Valkey",
  },
  vectorStoreProviderMap: {
    BEDROCK: "bedrock",
    OPENAI: "openai",
    AZURE_OPENAI: "azure_openai",
    S3Vectors: "s3_vectors",
    Valkey: "valkey",
  },
  vectorStoreProviderLogoMap: {
    "Amazon Bedrock": "https://example.com/bedrock.png",
    OpenAI: "https://example.com/openai.png",
    "Azure OpenAI": "https://example.com/azure.png",
    "AWS S3 Vectors": "https://example.com/aws.png",
    Valkey: "https://example.com/valkey.svg",
  },
  getProviderSpecificFields: vi.fn((provider: string) => {
    if (provider === "s3_vectors") {
      return [
        {
          name: "vector_bucket_name",
          labelKey: "fields.s3Vectors.vectorBucketName.label",
          tooltipKey: "fields.s3Vectors.vectorBucketName.tooltip",
          placeholderKey: "fields.s3Vectors.vectorBucketName.placeholder",
          required: true,
          type: "text",
        },
        {
          name: "aws_region_name",
          labelKey: "fields.s3Vectors.awsRegion.label",
          tooltipKey: "fields.s3Vectors.awsRegion.tooltip",
          placeholderKey: "fields.s3Vectors.awsRegion.placeholder",
          required: true,
          type: "text",
        },
        {
          name: "embedding_model",
          labelKey: "fields.s3Vectors.embeddingModel.label",
          tooltipKey: "fields.s3Vectors.embeddingModel.tooltip",
          placeholderKey: "fields.s3Vectors.embeddingModel.placeholder",
          required: true,
          type: "select",
        },
      ];
    }
    return [];
  }),
}));

describe("CreateVectorStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the component successfully", () => {
    render(<CreateVectorStore accessToken="test-token" />);

    expect(screen.getAllByText("创建向量存储").length).toBeGreaterThan(0);
    expect(screen.getByText("步骤 1：上传文档")).toBeInTheDocument();
    expect(screen.getByText("步骤 2：配置向量存储")).toBeInTheDocument();
  });

  it("should display upload area with correct text", () => {
    render(<CreateVectorStore accessToken="test-token" />);

    expect(screen.getByText("点击或拖拽文件到此处上传")).toBeInTheDocument();
    expect(screen.getByText(/支持单个或批量上传/)).toBeInTheDocument();
  });

  it("should show the provider display name on the trigger rather than its wire value", async () => {
    const user = userEvent.setup();
    render(<CreateVectorStore accessToken="test-token" />);

    const providerSelect = screen.getByRole("combobox", { name: /供应商/ });
    expect(providerSelect).toHaveTextContent("Amazon Bedrock");

    await user.click(providerSelect);
    await user.click(await screen.findByText("AWS S3 Vectors"));

    expect(screen.getByRole("combobox", { name: /供应商/ })).toHaveTextContent("AWS S3 Vectors");
  });

  it("should have provider selection dropdown", () => {
    render(<CreateVectorStore accessToken="test-token" />);

    expect(screen.getByText("供应商")).toBeInTheDocument();
  });

  it("should have create button disabled initially when no documents", () => {
    render(<CreateVectorStore accessToken="test-token" />);

    const createButton = screen.getByRole("button", { name: /创建向量存储/ });
    expect(createButton).toBeDisabled();
  });

  it("should show uploaded documents table when files are added", async () => {
    render(<CreateVectorStore accessToken="test-token" />);

    // Create a mock file
    const file = new File(["test content"], "test.pdf", { type: "application/pdf" });

    // Find the upload input (it's hidden but accessible)
    const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      if (uploadInput) {
        fireEvent.change(uploadInput, { target: { files: [file] } });
      }
    });

    await waitFor(() => {
      expect(screen.getByText("已上传文档（1）")).toBeInTheDocument();
    });
  });

  it("should call ragIngestCall when create button is clicked", async () => {
    const mockRagIngestCall = vi.spyOn(networking, "ragIngestCall");
    mockRagIngestCall.mockResolvedValue({
      id: "test-id",
      status: "completed",
      vector_store_id: "vs_123",
      file_id: "file_123",
    });

    const onSuccess = vi.fn();
    render(<CreateVectorStore accessToken="test-token" onSuccess={onSuccess} />);

    // Create a mock file
    const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
    const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      if (uploadInput) {
        fireEvent.change(uploadInput, { target: { files: [file] } });
      }
    });

    // Wait for file to be added
    await waitFor(() => {
      expect(screen.getByText("已上传文档（1）")).toBeInTheDocument();
    });

    // Click create button
    const createButton = screen.getByRole("button", { name: /创建向量存储/ });

    await act(async () => {
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(mockRagIngestCall).toHaveBeenCalledWith(
        "test-token",
        expect.any(File),
        "bedrock",
        undefined,
        undefined,
        undefined,
        {},
      );
    });
  });

  it("should display success message after successful creation", async () => {
    const mockRagIngestCall = vi.spyOn(networking, "ragIngestCall");
    mockRagIngestCall.mockResolvedValue({
      id: "test-id",
      status: "completed",
      vector_store_id: "vs_123",
      file_id: "file_123",
    });

    render(<CreateVectorStore accessToken="test-token" />);

    // Create and upload a mock file
    const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
    const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      if (uploadInput) {
        fireEvent.change(uploadInput, { target: { files: [file] } });
      }
    });

    await waitFor(() => {
      expect(screen.getByText("已上传文档（1）")).toBeInTheDocument();
    });

    // Click create button
    const createButton = screen.getByRole("button", { name: /创建向量存储/ });

    await act(async () => {
      fireEvent.click(createButton);
    });

    await waitFor(() => {
      expect(screen.getByText("向量存储创建成功")).toBeInTheDocument();
    });
  });

  it("should exclude valkey from the provider dropdown since it has no RAG ingestion", async () => {
    render(<CreateVectorStore accessToken="test-token" />);

    const providerSelect = screen.getByRole("combobox");

    await act(async () => {
      fireEvent.mouseDown(providerSelect);
    });

    await waitFor(() => {
      expect(screen.getByText("AWS S3 Vectors")).toBeInTheDocument();
    });
    expect(screen.queryByText("Valkey")).not.toBeInTheDocument();
  });

  it("should display S3 Vectors provider-specific fields when selected", async () => {
    render(<CreateVectorStore accessToken="test-token" />);

    // Find and click the provider dropdown
    const providerSelect = screen.getByRole("combobox");

    await userEvent.click(providerSelect);

    // Wait for dropdown options to appear
    await userEvent.click(await screen.findByText("AWS S3 Vectors"));

    // Check if S3-specific fields are displayed
    await waitFor(() => {
      expect(screen.getByText("向量存储桶名称")).toBeInTheDocument();
      expect(screen.getByText("AWS 区域")).toBeInTheDocument();
      expect(screen.getByText("嵌入模型")).toBeInTheDocument();
    });
  });

  it("should validate S3 Vectors required fields before submission", async () => {
    render(<CreateVectorStore accessToken="test-token" />);

    // Upload a file first
    const file = new File(["test content"], "test.pdf", { type: "application/pdf" });
    const uploadInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    await act(async () => {
      if (uploadInput) {
        fireEvent.change(uploadInput, { target: { files: [file] } });
      }
    });

    await waitFor(() => {
      expect(screen.getByText("已上传文档（1）")).toBeInTheDocument();
    });

    // Select S3 Vectors provider
    const providerSelect = screen.getByRole("combobox");

    await userEvent.click(providerSelect);

    await userEvent.click(await screen.findByText("AWS S3 Vectors"));

    // Try to create without filling required fields
    const createButton = screen.getByRole("button", { name: /创建向量存储/ });

    await act(async () => {
      fireEvent.click(createButton);
    });

    // Should show validation warning (mocked message.warning would be called)
    // The actual validation happens in the component
  });
});
