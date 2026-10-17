"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CacheMessageKey, REDIS_TYPE_LABEL_KEYS, type RedisType } from "./cacheSettingsFields";

interface RedisTypeSelectorProps {
  redisType: RedisType;
  redisTypeDescriptions: Readonly<Record<RedisType, CacheMessageKey>>;
  onTypeChange: (type: RedisType) => void;
}

const RedisTypeSelector: React.FC<RedisTypeSelectorProps> = ({ redisType, redisTypeDescriptions, onTypeChange }) => {
  const t = useTranslations("caching");
  const cacheT = useTranslations("cacheSettings");
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("redisType")}</label>
      <Select value={redisType} onValueChange={(value) => value !== null && onTypeChange(value as RedisType)}>
        <SelectTrigger className="w-full">
          <SelectValue>{cacheT(REDIS_TYPE_LABEL_KEYS[redisType])}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(REDIS_TYPE_LABEL_KEYS).map(([value, labelKey]) => (
            <SelectItem key={value} value={value}>
              {cacheT(labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{cacheT(redisTypeDescriptions[redisType])}</p>
    </div>
  );
};

export default RedisTypeSelector;
