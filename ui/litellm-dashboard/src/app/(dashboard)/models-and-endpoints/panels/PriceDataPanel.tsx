"use client";

import { useTranslations } from "next-intl";
import PriceDataManagementTab from "@/app/(dashboard)/models-and-endpoints/components/PriceDataManagementTab";

export default function PriceDataPanel() {
  const t = useTranslations("models");
  return <PriceDataManagementTab />;
}
