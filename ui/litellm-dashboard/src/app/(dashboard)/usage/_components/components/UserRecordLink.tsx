import { useTranslations } from "next-intl";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

import { userRecordHref } from "../usageUrlState";

export default function UserRecordLink({ userId }: { userId: string }) {
  const t = useTranslations("usage.overview");
  return (
    <Link
      href={userRecordHref(userId)}
      className="inline-flex shrink-0 items-center gap-1 text-sm text-primary underline underline-offset-2"
    >
      {t("userRecord.view")}
      <SquareArrowOutUpRight className="size-3.5" />
    </Link>
  );
}
