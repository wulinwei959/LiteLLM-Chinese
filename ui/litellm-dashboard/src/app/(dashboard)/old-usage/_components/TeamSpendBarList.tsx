import React from "react";
import { Meter, MeterIndicator, MeterTrack } from "@/components/shared/Meter";
import { formatNumberWithCommas } from "@/utils/dataUtils";

export type TeamSpendTotal = { name: string; value: number };

const TeamSpendBarList: React.FC<{ data: TeamSpendTotal[] }> = ({ data }) => {
  const max = Math.max(0, ...data.map((team) => team.value));

  return (
    <div className="flex flex-col gap-3">
      {data.map((team) => (
        <div key={team.name} className="flex items-center gap-4">
          <p className="w-1/3 truncate text-sm text-foreground">{team.name}</p>
          <Meter value={team.value} max={max === 0 ? 1 : max} className="flex-1">
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
          <p className="w-24 shrink-0 text-right text-sm tabular-nums text-foreground">
            {formatNumberWithCommas(team.value, 2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TeamSpendBarList;
