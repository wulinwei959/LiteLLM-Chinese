"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * The root layout's metadata is exported statically, so the browser tab title
 * stays in English under every locale. The locale itself only lives in
 * localStorage, so the title has to be written from the client once the
 * provider resolves it.
 */
const DocumentMetadata: React.FC = () => {
  const t = useTranslations("appMetadata");

  useEffect(() => {
    document.title = t("title");
    const meta = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", t("description"));
    if (!meta.isConnected) {
      document.head.appendChild(meta);
    }
  }, [t]);

  return null;
};

export default DocumentMetadata;
