import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

interface CreatedKeyDisplayProps {
  apiKey: string;
}

/**
 * Shared component for displaying a newly-created virtual key.
 * Used on the Virtual Keys page and in the Add Agent wizard.
 */
const CreatedKeyDisplay: React.FC<CreatedKeyDisplayProps> = ({ apiKey }) => {
  const t = useTranslations("createdKeyDisplay");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    toast.success(t("keyCopiedToast"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="mb-2">{t.rich("securityWarning", { b: (chunks) => <b>{chunks}</b> })}</p>

      <p className="text-sm text-muted-foreground mt-3 mb-1">{t("virtualKeyLabel")}</p>
      <div className="bg-muted rounded-md p-2.5 mb-2.5">
        <pre className="m-0 whitespace-normal break-words text-foreground">{apiKey}</pre>
      </div>

      <CopyToClipboard text={apiKey} onCopy={handleCopy}>
        <Button className="mt-3">{copied ? t("copied") : t("copyButton")}</Button>
      </CopyToClipboard>
    </div>
  );
};

export default CreatedKeyDisplay;
