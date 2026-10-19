import { useMutation } from "@tanstack/react-query";
import { deletePolicyAttachmentCall } from "@/components/networking";
import { toast } from "@/lib/toast";
import type { PoliciesTranslator } from "@/lib/i18n/translators";

interface UseDeletePolicyAttachmentProps {
  accessToken: string | null;
  t: PoliciesTranslator;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useDeletePolicyAttachment = ({ accessToken, t, onSuccess, onError }: UseDeletePolicyAttachmentProps) => {
  return useMutation({
    mutationFn: async (attachmentId: string) => {
      if (!accessToken) {
        throw new Error("Access token is required");
      }
      return deletePolicyAttachmentCall(accessToken, attachmentId);
    },
    onSuccess: () => {
      toast.success(t("attach.deletedToast"));
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error deleting attachment:", error);
      toast.error(t("attach.deleteFailedToast"));
      if (onError) {
        onError(error);
      }
    },
  });
};
