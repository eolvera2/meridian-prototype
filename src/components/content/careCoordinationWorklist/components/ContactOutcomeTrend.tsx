import type { FC } from "react";
import { tokens } from "@fluentui/react-components";
import { CC_COLORS } from "../careCoordination.constants";

interface ContactOutcomeTrendProps {
  data: { label: string; successRate: number; escalationRate: number }[];
}

export const ContactOutcomeTrend: FC<ContactOutcomeTrendProps> = ({ data }) => {
  const width = 400;
  const height = 200;
  const padX = 54;
  const padY = 14;
  const padBottom = 28;
  const chartW = width - padX * 2;
  const chartH = height - padY - padBottom;
  const minY = 0;
  const maxY = 100;

  const toX = (i: number) =>
    padX + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
  const toY = (v: number) => padY + ((maxY - v) / (maxY - minY)) * chartH;

  const successLine = data
    .map((d, i) => `${toX(i)},${toY(d.successRate)}`)
    .join(" ");
  const escalationLine = data
    .map((d, i) => `${toX(i)},${toY(d.escalationRate)}`)
    .join(" ");

  const gridLines = [100, 75, 50, 25];

  const ariaDescription = data
    .map(
      (d) =>
        `${d.label}: ${d.successRate}% success, ${d.escalationRate}% escalation`,
    )
    .join("; ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Contact outcome trend chart. ${ariaDescription}`}
    >
      <title>Contact Outcome Trend</title>
      {/* Grid lines */}
      {gridLines.map((v) => (
        <g key={v}>
          <line
            x1={padX}
            y1={toY(v)}
            x2={width - padX}
            y2={toY(v)}
            stroke={tokens.colorNeutralStroke2}
            strokeDasharray="3 3"
          />
          <text
            x={padX - 6}
            y={toY(v) + 5}
            textAnchor="end"
            fontSize="11"
            fill={tokens.colorNeutralForeground3}
          >
            {v}%
          </text>
        </g>
      ))}
      {/* X axis labels */}
      {data.map((d, i) => (
        <text
          key={d.label}
          x={toX(i)}
          y={height - 6}
          textAnchor="middle"
          fontSize="11"
          fill={tokens.colorNeutralForeground3}
        >
          {d.label}
        </text>
      ))}
      {/* Escalation rate line (dashed, behind) */}
      <polyline
        points={escalationLine}
        fill="none"
        stroke={CC_COLORS.negative}
        strokeWidth="2"
        strokeDasharray="5 3"
      />
      {data.map((d, i) => (
        <g key={`e-${i}`}>
          <circle
            cx={toX(i)}
            cy={toY(d.escalationRate)}
            r="3"
            fill={CC_COLORS.negative}
          />
          <title>{`${d.label}: ${d.escalationRate}% escalation`}</title>
        </g>
      ))}
      {/* Success rate line (solid, on top) */}
      <polyline
        points={successLine}
        fill="none"
        stroke={CC_COLORS.chartBlue}
        strokeWidth="2.5"
      />
      {data.map((d, i) => (
        <g key={`s-${i}`}>
          <circle
            cx={toX(i)}
            cy={toY(d.successRate)}
            r="3.5"
            fill={CC_COLORS.chartBlue}
          />
          <title>{`${d.label}: ${d.successRate}% success`}</title>
        </g>
      ))}
    </svg>
  );
};
