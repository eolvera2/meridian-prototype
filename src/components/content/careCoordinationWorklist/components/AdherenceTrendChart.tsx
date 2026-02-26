import type { FC } from "react";
import { tokens } from "@fluentui/react-components";
import { CC_COLORS } from "../careCoordination.constants";

interface AdherenceTrendChartProps {
  data: { label: string; adherence: number; missedDoses: number }[];
}

export const AdherenceTrendChart: FC<AdherenceTrendChartProps> = ({ data }) => {
  const width = 500;
  const height = 180;
  const padX = 54;
  const padY = 14;
  const padBottom = 28;
  const chartW = width - padX * 2;
  const chartH = height - padY - padBottom;
  const minY = 50;
  const maxY = 100;
  const maxMissed = Math.max(...data.map((d) => d.missedDoses), 1);

  const toX = (i: number) => padX + (i / (data.length - 1)) * chartW;
  const toYAdherence = (v: number) => padY + ((maxY - v) / (maxY - minY)) * chartH;
  const toYMissed = (v: number) => padY + ((maxMissed - v) / maxMissed) * chartH;

  const adherenceLine = data.map((d, i) => `${toX(i)},${toYAdherence(d.adherence)}`).join(" ");
  const missedLine = data.map((d, i) => `${toX(i)},${toYMissed(d.missedDoses)}`).join(" ");

  const gridLines = [100, 75, 50];

  const ariaDescription = data
    .map((d) => `${d.label}: ${d.adherence}% adherence, ${d.missedDoses} missed`)
    .join("; ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Adherence trend chart. ${ariaDescription}`}
    >
      <title>Adherence Trend Chart</title>
      {/* Grid lines */}
      {gridLines.map((v) => (
        <g key={v}>
          <line
            x1={padX} y1={toYAdherence(v)}
            x2={width - padX} y2={toYAdherence(v)}
            stroke={tokens.colorNeutralStroke2} strokeDasharray="3 3"
          />
          <text
            x={padX - 6} y={toYAdherence(v) + 5}
            textAnchor="end" fontSize="16" fill={tokens.colorNeutralForeground3}
          >
            {v}%
          </text>
        </g>
      ))}
      {/* X axis labels */}
      {data.map((d, i) => (
        <text
          key={d.label} x={toX(i)} y={height - 6}
          textAnchor="middle" fontSize="16" fill={tokens.colorNeutralForeground3}
        >
          {d.label}
        </text>
      ))}
      {/* Missed doses line */}
      <polyline
        points={missedLine} fill="none"
        stroke={CC_COLORS.missedDoses} strokeWidth="2" strokeDasharray="5 3"
      />
      {data.map((d, i) => (
        <g key={`m-${i}`}>
          <circle cx={toX(i)} cy={toYMissed(d.missedDoses)} r="3" fill={CC_COLORS.missedDoses} />
          <title>{`${d.label}: ${d.missedDoses} missed doses`}</title>
        </g>
      ))}
      {/* Adherence line */}
      <polyline
        points={adherenceLine} fill="none"
        stroke={CC_COLORS.chartBlue} strokeWidth="2.5"
      />
      {data.map((d, i) => (
        <g key={`a-${i}`}>
          <circle
            cx={toX(i)} cy={toYAdherence(d.adherence)}
            r="3.5" fill={CC_COLORS.chartBlue}
          />
          <title>{`${d.label}: ${d.adherence}% adherence`}</title>
        </g>
      ))}
    </svg>
  );
};
