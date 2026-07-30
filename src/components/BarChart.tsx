"use client";

import { useState } from "react";

type PointDonnee = { label: string; value: number };

function arrondiPropre(valeur: number): number {
  if (valeur <= 5) return 5;
  if (valeur <= 10) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(valeur)));
  return Math.ceil(valeur / magnitude) * magnitude;
}

export default function BarChart({
  data,
  color = "#3B82F6",
}: {
  data: PointDonnee[];
  color?: string;
}) {
  const [survol, setSurvol] = useState<number | null>(null);
  const max = arrondiPropre(Math.max(...data.map((d) => d.value), 1));
  const hauteurZone = 140;

  return (
    <div className="viz-root relative">
      <div className="flex" style={{ height: hauteurZone }}>
        {/* axe Y */}
        <div className="flex flex-col justify-between pr-2 text-[11px] text-[#898781] shrink-0">
          <span>{max}</span>
          <span>{Math.round(max / 2)}</span>
          <span>0</span>
        </div>

        {/* zone des barres */}
        <div className="relative flex-1 flex items-end gap-[2px] border-l border-b border-[#e1e0d9]">
          {/* gridlines */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-[#e1e0d9]" />
            <div className="border-t border-[#e1e0d9]" />
            <div />
          </div>

          {data.map((d, i) => {
            const hauteur = Math.max((d.value / max) * (hauteurZone - 4), d.value > 0 ? 3 : 0);
            const survole = survol === i;
            return (
              <div
                key={d.label + i}
                className="relative flex-1 flex justify-center items-end h-full"
                onPointerEnter={() => setSurvol(i)}
                onPointerLeave={() => setSurvol(null)}
                onFocus={() => setSurvol(i)}
                onBlur={() => setSurvol(null)}
                tabIndex={0}
                role="img"
                aria-label={`${d.label} : ${d.value}`}
              >
                {survole && (
                  <div className="absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-1 text-xs text-white shadow-md">
                    <span className="font-semibold">{d.value}</span>{" "}
                    <span className="text-zinc-300">· {d.label}</span>
                  </div>
                )}
                <div
                  style={{
                    height: hauteur,
                    maxWidth: 24,
                    width: "100%",
                    backgroundColor: color,
                    opacity: survole ? 1 : 0.85,
                  }}
                  className="rounded-t-[4px] transition-opacity"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-1 flex gap-[2px] pl-[26px]">
        {data.map((d, i) => (
          <div key={d.label + i} className="flex-1 text-center">
            {(i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) && (
              <span className="text-[10px] text-[#898781]">{d.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
