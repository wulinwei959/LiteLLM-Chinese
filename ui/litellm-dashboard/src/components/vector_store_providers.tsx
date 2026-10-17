import { getProviderLogoAndName, Providers, providerLogoMap } from "@/components/provider_info_helpers";
import milvusLogo from "../../public/assets/logos/milvus.svg";
import mongodbLogo from "../../public/assets/logos/mongodb.svg";
import postgresqlLogo from "../../public/assets/logos/postgresql.svg";
import s3VectorLogo from "../../public/assets/logos/s3_vector.png";
import valkeyLogo from "../../public/assets/logos/valkey.svg";

export enum VectorStoreProviders {
  Bedrock = "Amazon Bedrock",
  S3Vectors = "Amazon S3 Vectors",
  PgVector = "PostgreSQL pgvector (LiteLLM Connector)",
  VertexRagEngine = "Vertex AI RAG Engine",
  VertexAiSearch = "Vertex AI Search",
  OpenAI = "OpenAI",
  Azure = "Azure OpenAI",
  Milvus = "Milvus",
  MongoDB = "MongoDB (BETA)",
  Valkey = "Valkey",
}

export const vectorStoreProviderMap: Record<string, string> = {
  Bedrock: "bedrock",
  PgVector: "pg_vector",
  VertexRagEngine: "vertex_ai",
  VertexAiSearch: "vertex_ai/search_api",
  OpenAI: "openai",
  Azure: "azure",
  Milvus: "milvus",
  MongoDB: "mongodb",
  S3Vectors: "s3_vectors",
  Valkey: "valkey",
};

export const vectorStoreProviderLogoMap: Record<string, string> = {
  [VectorStoreProviders.Bedrock]: providerLogoMap[Providers.Bedrock] ?? "",
  [VectorStoreProviders.PgVector]: postgresqlLogo.src,
  [VectorStoreProviders.VertexRagEngine]: providerLogoMap[Providers.Vertex_AI] ?? "",
  [VectorStoreProviders.VertexAiSearch]: providerLogoMap[Providers.Vertex_AI] ?? "",
  [VectorStoreProviders.OpenAI]: providerLogoMap[Providers.OpenAI] ?? "",
  [VectorStoreProviders.Azure]: providerLogoMap[Providers.Azure] ?? "",
  [VectorStoreProviders.Milvus]: milvusLogo.src,
  [VectorStoreProviders.MongoDB]: mongodbLogo.src,
  [VectorStoreProviders.S3Vectors]: s3VectorLogo.src,
  [VectorStoreProviders.Valkey]: valkeyLogo.src,
};

// Define field types for provider-specific configurations
export interface VectorStoreFieldConfig {
  name: string;
  labelKey: VectorStoreFieldMessageKey;
  tooltipKey: VectorStoreFieldMessageKey;
  placeholderKey?: VectorStoreFieldMessageKey;
  required: boolean;
  type?: "text" | "password" | "select";
  options?: { value: string; label: string }[];
  initialValue?: string;
}

/**
 * Every provider field's copy lives under `vectorStores.fields.<provider>.<field>`, so this
 * module declares the key names instead of carrying a parallel lookup table.
 */
export type VectorStoreFieldMessageKey =
  | "fields.azure.apiBase.label"
  | "fields.azure.apiBase.placeholder"
  | "fields.azure.apiBase.tooltip"
  | "fields.azure.apiKey.label"
  | "fields.azure.apiKey.placeholder"
  | "fields.azure.apiKey.tooltip"
  | "fields.milvus.apiBase.label"
  | "fields.milvus.apiBase.placeholder"
  | "fields.milvus.apiBase.tooltip"
  | "fields.milvus.apiKey.label"
  | "fields.milvus.apiKey.placeholder"
  | "fields.milvus.apiKey.tooltip"
  | "fields.milvus.embeddingModel.label"
  | "fields.milvus.embeddingModel.placeholder"
  | "fields.milvus.embeddingModel.tooltip"
  | "fields.mongodb.apiBase.label"
  | "fields.mongodb.apiBase.placeholder"
  | "fields.mongodb.apiBase.tooltip"
  | "fields.mongodb.apiKey.label"
  | "fields.mongodb.apiKey.placeholder"
  | "fields.mongodb.apiKey.tooltip"
  | "fields.mongodb.candidatesConsidered.label"
  | "fields.mongodb.candidatesConsidered.placeholder"
  | "fields.mongodb.candidatesConsidered.tooltip"
  | "fields.mongodb.collection.label"
  | "fields.mongodb.collection.placeholder"
  | "fields.mongodb.collection.tooltip"
  | "fields.mongodb.database.label"
  | "fields.mongodb.database.placeholder"
  | "fields.mongodb.database.tooltip"
  | "fields.mongodb.embeddingModel.label"
  | "fields.mongodb.embeddingModel.placeholder"
  | "fields.mongodb.embeddingModel.tooltip"
  | "fields.mongodb.textField.label"
  | "fields.mongodb.textField.placeholder"
  | "fields.mongodb.textField.tooltip"
  | "fields.mongodb.vectorFieldName.label"
  | "fields.mongodb.vectorFieldName.placeholder"
  | "fields.mongodb.vectorFieldName.tooltip"
  | "fields.openai.apiKey.label"
  | "fields.openai.apiKey.placeholder"
  | "fields.openai.apiKey.tooltip"
  | "fields.pgVector.apiBase.label"
  | "fields.pgVector.apiBase.placeholder"
  | "fields.pgVector.apiBase.tooltip"
  | "fields.pgVector.apiKey.label"
  | "fields.pgVector.apiKey.placeholder"
  | "fields.pgVector.apiKey.tooltip"
  | "fields.s3Vectors.awsRegion.label"
  | "fields.s3Vectors.awsRegion.placeholder"
  | "fields.s3Vectors.awsRegion.tooltip"
  | "fields.s3Vectors.embeddingModel.label"
  | "fields.s3Vectors.embeddingModel.placeholder"
  | "fields.s3Vectors.embeddingModel.tooltip"
  | "fields.s3Vectors.indexName.label"
  | "fields.s3Vectors.indexName.placeholder"
  | "fields.s3Vectors.indexName.tooltip"
  | "fields.s3Vectors.vectorBucketName.label"
  | "fields.s3Vectors.vectorBucketName.placeholder"
  | "fields.s3Vectors.vectorBucketName.tooltip"
  | "fields.valkey.embeddingModel.label"
  | "fields.valkey.embeddingModel.placeholder"
  | "fields.valkey.embeddingModel.tooltip"
  | "fields.valkey.useTls.label"
  | "fields.valkey.useTls.tooltip"
  | "fields.valkey.valkeyEmbeddingField.label"
  | "fields.valkey.valkeyEmbeddingField.placeholder"
  | "fields.valkey.valkeyEmbeddingField.tooltip"
  | "fields.valkey.valkeyHost.label"
  | "fields.valkey.valkeyHost.placeholder"
  | "fields.valkey.valkeyHost.tooltip"
  | "fields.valkey.valkeyPassword.label"
  | "fields.valkey.valkeyPassword.tooltip"
  | "fields.valkey.valkeyPort.label"
  | "fields.valkey.valkeyPort.placeholder"
  | "fields.valkey.valkeyPort.tooltip"
  | "fields.valkey.valkeyTextField.label"
  | "fields.valkey.valkeyTextField.placeholder"
  | "fields.valkey.valkeyTextField.tooltip"
  | "fields.vertexSearchApi.collectionId.label"
  | "fields.vertexSearchApi.collectionId.placeholder"
  | "fields.vertexSearchApi.collectionId.tooltip"
  | "fields.vertexSearchApi.engineId.label"
  | "fields.vertexSearchApi.engineId.placeholder"
  | "fields.vertexSearchApi.engineId.tooltip"
  | "fields.vertexSearchApi.vertexLocation.label"
  | "fields.vertexSearchApi.vertexLocation.tooltip"
  | "fields.vertexSearchApi.vertexProject.label"
  | "fields.vertexSearchApi.vertexProject.placeholder"
  | "fields.vertexSearchApi.vertexProject.tooltip";

// Provider-specific field configurations
export const vectorStoreProviderFields: Record<string, VectorStoreFieldConfig[]> = {
  bedrock: [],
  pg_vector: [
    {
      name: "api_base",
      labelKey: "fields.pgVector.apiBase.label",
      tooltipKey: "fields.pgVector.apiBase.tooltip",
      placeholderKey: "fields.pgVector.apiBase.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "api_key",
      labelKey: "fields.pgVector.apiKey.label",
      tooltipKey: "fields.pgVector.apiKey.tooltip",
      placeholderKey: "fields.pgVector.apiKey.placeholder",
      required: true,
      type: "password",
    },
  ],
  vertex_rag_engine: [],
  "vertex_ai/search_api": [
    {
      name: "vertex_project",
      labelKey: "fields.vertexSearchApi.vertexProject.label",
      tooltipKey: "fields.vertexSearchApi.vertexProject.tooltip",
      placeholderKey: "fields.vertexSearchApi.vertexProject.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "vertex_location",
      labelKey: "fields.vertexSearchApi.vertexLocation.label",
      tooltipKey: "fields.vertexSearchApi.vertexLocation.tooltip",
      required: true,
      type: "select",
      options: [
        { value: "global", label: "global" },
        { value: "us", label: "us" },
        { value: "eu", label: "eu" },
      ],
      initialValue: "global",
    },
    {
      name: "vertex_collection_id",
      labelKey: "fields.vertexSearchApi.collectionId.label",
      tooltipKey: "fields.vertexSearchApi.collectionId.tooltip",
      placeholderKey: "fields.vertexSearchApi.collectionId.placeholder",
      required: false,
      type: "text",
    },
    {
      name: "vertex_engine_id",
      labelKey: "fields.vertexSearchApi.engineId.label",
      tooltipKey: "fields.vertexSearchApi.engineId.tooltip",
      placeholderKey: "fields.vertexSearchApi.engineId.placeholder",
      required: false,
      type: "text",
    },
  ],
  openai: [
    {
      name: "api_key",
      labelKey: "fields.openai.apiKey.label",
      tooltipKey: "fields.openai.apiKey.tooltip",
      placeholderKey: "fields.openai.apiKey.placeholder",
      required: true,
      type: "password",
    },
  ],
  azure: [
    {
      name: "api_key",
      labelKey: "fields.azure.apiKey.label",
      tooltipKey: "fields.azure.apiKey.tooltip",
      placeholderKey: "fields.azure.apiKey.placeholder",
      required: true,
      type: "password",
    },
    {
      name: "api_base",
      labelKey: "fields.azure.apiBase.label",
      tooltipKey: "fields.azure.apiBase.tooltip",
      placeholderKey: "fields.azure.apiBase.placeholder",
      required: true,
      type: "text",
    },
  ],
  milvus: [
    {
      name: "api_key",
      labelKey: "fields.milvus.apiKey.label",
      tooltipKey: "fields.milvus.apiKey.tooltip",
      placeholderKey: "fields.milvus.apiKey.placeholder",
      required: true,
      type: "password",
    },
    {
      name: "api_base",
      labelKey: "fields.milvus.apiBase.label",
      tooltipKey: "fields.milvus.apiBase.tooltip",
      placeholderKey: "fields.milvus.apiBase.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "embedding_model",
      labelKey: "fields.milvus.embeddingModel.label",
      tooltipKey: "fields.milvus.embeddingModel.tooltip",
      placeholderKey: "fields.milvus.embeddingModel.placeholder",
      required: true,
      type: "select",
    },
  ],
  mongodb: [
    {
      name: "api_base",
      labelKey: "fields.mongodb.apiBase.label",
      tooltipKey: "fields.mongodb.apiBase.tooltip",
      placeholderKey: "fields.mongodb.apiBase.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "api_key",
      labelKey: "fields.mongodb.apiKey.label",
      tooltipKey: "fields.mongodb.apiKey.tooltip",
      placeholderKey: "fields.mongodb.apiKey.placeholder",
      required: true,
      type: "password",
    },
    {
      name: "mongodb_database",
      labelKey: "fields.mongodb.database.label",
      tooltipKey: "fields.mongodb.database.tooltip",
      placeholderKey: "fields.mongodb.database.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "mongodb_collection",
      labelKey: "fields.mongodb.collection.label",
      tooltipKey: "fields.mongodb.collection.tooltip",
      placeholderKey: "fields.mongodb.collection.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "embedding_model",
      labelKey: "fields.mongodb.embeddingModel.label",
      tooltipKey: "fields.mongodb.embeddingModel.tooltip",
      placeholderKey: "fields.mongodb.embeddingModel.placeholder",
      required: true,
      type: "select",
    },
    {
      name: "mongodb_embedding_field",
      labelKey: "fields.mongodb.vectorFieldName.label",
      tooltipKey: "fields.mongodb.vectorFieldName.tooltip",
      placeholderKey: "fields.mongodb.vectorFieldName.placeholder",
      required: false,
      type: "text",
      initialValue: "embedding",
    },
    {
      name: "mongodb_text_field",
      labelKey: "fields.mongodb.textField.label",
      tooltipKey: "fields.mongodb.textField.tooltip",
      placeholderKey: "fields.mongodb.textField.placeholder",
      required: false,
      type: "text",
      initialValue: "text",
    },
    {
      name: "mongodb_num_candidates",
      labelKey: "fields.mongodb.candidatesConsidered.label",
      tooltipKey: "fields.mongodb.candidatesConsidered.tooltip",
      placeholderKey: "fields.mongodb.candidatesConsidered.placeholder",
      required: false,
      type: "text",
    },
  ],
  valkey: [
    {
      name: "valkey_host",
      labelKey: "fields.valkey.valkeyHost.label",
      tooltipKey: "fields.valkey.valkeyHost.tooltip",
      placeholderKey: "fields.valkey.valkeyHost.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "valkey_port",
      labelKey: "fields.valkey.valkeyPort.label",
      tooltipKey: "fields.valkey.valkeyPort.tooltip",
      placeholderKey: "fields.valkey.valkeyPort.placeholder",
      required: false,
      type: "text",
      initialValue: "6379",
    },
    {
      name: "valkey_password",
      labelKey: "fields.valkey.valkeyPassword.label",
      tooltipKey: "fields.valkey.valkeyPassword.tooltip",
      required: false,
      type: "password",
    },
    {
      name: "valkey_ssl",
      labelKey: "fields.valkey.useTls.label",
      tooltipKey: "fields.valkey.useTls.tooltip",
      required: false,
      type: "select",
      options: [
        { value: "false", label: "false" },
        { value: "true", label: "true" },
      ],
      initialValue: "false",
    },
    {
      name: "embedding_model",
      labelKey: "fields.valkey.embeddingModel.label",
      tooltipKey: "fields.valkey.embeddingModel.tooltip",
      placeholderKey: "fields.valkey.embeddingModel.placeholder",
      required: true,
      type: "select",
    },
    {
      name: "valkey_text_field",
      labelKey: "fields.valkey.valkeyTextField.label",
      tooltipKey: "fields.valkey.valkeyTextField.tooltip",
      placeholderKey: "fields.valkey.valkeyTextField.placeholder",
      required: false,
      type: "text",
      initialValue: "text",
    },
    {
      name: "valkey_embedding_field",
      labelKey: "fields.valkey.valkeyEmbeddingField.label",
      tooltipKey: "fields.valkey.valkeyEmbeddingField.tooltip",
      placeholderKey: "fields.valkey.valkeyEmbeddingField.placeholder",
      required: false,
      type: "text",
      initialValue: "embedding",
    },
  ],
  s3_vectors: [
    {
      name: "vector_bucket_name",
      labelKey: "fields.s3Vectors.vectorBucketName.label",
      tooltipKey: "fields.s3Vectors.vectorBucketName.tooltip",
      placeholderKey: "fields.s3Vectors.vectorBucketName.placeholder",
      required: true,
      type: "text",
    },
    {
      name: "index_name",
      labelKey: "fields.s3Vectors.indexName.label",
      tooltipKey: "fields.s3Vectors.indexName.tooltip",
      placeholderKey: "fields.s3Vectors.indexName.placeholder",
      required: false,
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
  ],
};

export const getVectorStoreProviderLogoAndName = (providerValue: string): { logo: string; displayName: string } => {
  const enumKey = Object.keys(vectorStoreProviderMap).find(
    (key) => vectorStoreProviderMap[key].toLowerCase() === providerValue.toLowerCase(),
  );
  if (!enumKey) {
    return getProviderLogoAndName(providerValue);
  }
  const displayName = VectorStoreProviders[enumKey as keyof typeof VectorStoreProviders];
  return { logo: vectorStoreProviderLogoMap[displayName], displayName };
};

export const getProviderSpecificFields = (providerValue: string): VectorStoreFieldConfig[] => {
  return vectorStoreProviderFields[providerValue] || [];
};
