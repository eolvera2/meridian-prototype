import type { FC } from "react";
import { tokens } from "@fluentui/react-components";
import { CC_COLORS } from "../careCoordination.constants";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";

interface MedAdherenceTrendChartProps {
  data: { label: string; adherenceRate: number; refillRate: number }[];
}

export const MedAdherenceTrendChart: FC<MedAdherenceTrendChartProps> = ({ data }) => {
  const ds = useDashboardStyles();

  const W = 400, H = 200;
  const pad = { top: 16, right: 16, bottom: 28, left: 36 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const maxVal = 100;
  const minVal = Math.min(...data.map(d => Math.min(d.adherenceRate, d.refillRate))) - 10;
  const range = maxVal - minVal;

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * cw;
  const toY = (v: number) => pad.top + ((maxVal - v) / range) * ch;

  const adherenceLine = data.map((d, i) => `${toX(i)},${toY(d.adherenceRate)}`).join(" ");
  const refillLine = data.map((d, i) => `${toX(i)},${toY(d.refillRate)}`).join(" ");

  // Grid lines
  const gridSteps = [minVal, minVal + range * 0.25, minVal + range * 0.5, minVal + range * 0.75, maxVal]
    .map(v => Math.round(v));

  return (
    <div className={ds.chartWrapper}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img"
        aria-label="Medication adherence trend chart"
        style={{ overflow: "visible" }}
      >
        <title>Medication Adherence Trend</title>

        {/* Grid lines */}
        {gridSteps.map(v => (
          <g key={v}>
            <line x1={pad.left} y1={toY(v)} x2={W - pad.right} y2={toY(v)}
              stroke={tokens.colorNeutralStroke2} strokeWidth="0.5" />
            <text x={pad.left - 4} y={toY(v) + 3} textAnchor="end"
              fontSize="9" fill={tokens.colorNeutralForeground3}>{v}%</text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={d.label} x={toX(i)} y={H - 4} textAnchor="middle"
            fontSize="9" fill={tokens.colorNeutralForeground3}>{d.label}</text>
        ))}

        {/* Refill rate line (behind, dashed) */}
        <polyline points={refillLine} fill="none"
          stroke={CC_COLORS.chartTeal} strokeWidth="2" strokeDasharray="5 3" />
        {data.map((d, i) => (
          <g key={`r-${i}`}>
            <circle cx={toX(i)} cy={toY(d.refillRate)} r="3" fill={CC_COLORS.chartTeal} />
            <title>{`${d.label}: ${d.refillRate}% refill rate`}</title>
          </g>
        ))}

        {/* Adherence rate line (solid, on top) */}
        <polyline points={adherenceLine} fill="none"
          stroke={CC_COLORS.positive} strokeWidth="2.5" />
        {data.map((d, i) => (
          <g key={`a-${i}`}>
            <circle cx={toX(i)} cy={toY(d.adherenceRate)} r="3.5" fill={CC_COLORS.positive} />
            <title>{`${d.label}: ${d.adherenceRate}% adherence`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
};
