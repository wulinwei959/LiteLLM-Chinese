import React from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  COORDINATION_REDIS_TYPES,
  COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS,
  COORDINATION_REDIS_TYPE_LABEL_KEYS,
  CoordinationRedisType,
} from "./coordinationRedisFields";

interface CoordinationRedisTypeSelectorProps {
  redisType: CoordinationRedisType;
  onTypeChange: (type: CoordinationRedisType) => void;
}

const CoordinationRedisTypeSelector: React.FC<CoordinationRedisTypeSelectorProps> = ({ redisType, onTypeChange }) => {
  const t = useTranslations("caching");
  const cacheT = useTranslations("cacheSettings");
  return (
    <div className="space-y-2">
      <label htmlFor="coordination-redis-type" className="text-sm font-medium">
        {t("redisType")}
      </label>
      <Select value={redisType} onValueChange={(value) => value !== null && onTypeChange(value)}>
        <SelectTrigger id="coordination-redis-type" className="w-full">
          <SelectValue>{cacheT(COORDINATION_REDIS_TYPE_LABEL_KEYS[redisType])}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COORDINATION_REDIS_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {cacheT(COORDINATION_REDIS_TYPE_LABEL_KEYS[type])}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{cacheT(COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS[redisType])}</p>
    </div>
  );
};

export default CoordinationRedisTypeSelector;
