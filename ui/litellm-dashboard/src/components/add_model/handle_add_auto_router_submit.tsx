import type { useTranslations } from "next-intl";
import { modelCreateCall } from "../networking";
import { toast } from "@/lib/toast";
import type { ComplexityRouterConfigPayload } from "./build_complexity_router_config";
import type { AutoRouterCompressionLitellmParams } from "./buildAutoRouterCompression";

type AddModelTranslator = ReturnType<typeof useTranslations<"models.addModel">>;

export interface AddAutoRouterValues extends AutoRouterCompressionLitellmParams {
  auto_router_name: string;
  auto_router_default_model: string | undefined;
  model_type: "complexity_router";
  complexity_router_config: ComplexityRouterConfigPayload;
  team_id?: string;
  model_access_group?: string[];
}

export interface AddAutoRouterCallbacks {
  resetForm: () => void;
  onSuccess?: () => void;
}

export const handleAddAutoRouterSubmit = async (
  values: AddAutoRouterValues,
  accessToken: string,
  callbacks: AddAutoRouterCallbacks,
  t: AddModelTranslator,
) => {
  try {
    const autoRouterConfig = {
      model_name: values.auto_router_name,
      litellm_params: {
        model: "auto_router/complexity_router",
        complexity_router_config: values.complexity_router_config,
        complexity_router_default_model: values.auto_router_default_model,
        ...(values.auto_router_routing_compression === undefined
          ? {}
          : {
              auto_router_routing_compression: values.auto_router_routing_compression,
            }),
        ...(values.auto_router_model_compression === undefined
          ? {}
          : {
              auto_router_model_compression: values.auto_router_model_compression,
            }),
      },
      model_info: {
        ...(values.team_id ? { team_id: values.team_id } : {}),
        ...(values.model_access_group?.length ? { access_groups: values.model_access_group } : {}),
      },
    };

    await modelCreateCall(accessToken, autoRouterConfig);

    toast.success(t("autoRouterCreateSuccess", { name: values.auto_router_name }));

    callbacks.resetForm();

    if (callbacks.onSuccess) {
      callbacks.onSuccess();
    }
  } catch (error) {
    console.error("Failed to add auto router:", error);
    toast.fromError(t("autoRouterCreateFailed", { error: String(error) }));
  }
};
