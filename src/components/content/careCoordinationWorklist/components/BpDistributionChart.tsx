import type { FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";

interface BpDistributionChartProps {
  data: {
    atGoal: number;
    borderline: number;
    uncontrolled: number;
    urgent: number;
  };
}

const SEGMENTS = [
  { key: "atGoal" as const, label: "At Goal", color: "#498205" },
  { key: "borderline" as const, label: "Borderline", color: "#CA5010" },
  { key: "uncontrolled" as const, label: "Uncontrolled", color: "#D13438" },
  { key: "urgent" as const, label: "Urgent", color: "#A4262C" },
];

const useChartStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "center",
    paddingTop: "4px",
  },
  donutWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
    flexShrink: 0,
  },
  centerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  centerValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: "24px",
  },
  centerLabel: {
    fontSize: "10px",
    color: tokens.colorNeutralForeground3,
  },
  legend: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendCount: {
    fontWeight: 600,
    marginLeft: "auto",
    paddingLeft: "8px",
    color: tokens.colorNeutralForeground1,
  },
});

export const BpDistributionChart: FC<BpDistributionChartProps> = ({ data }) => {
  const styles = useChartStyles();
  const ds = useDashboardStyles();

  const total = data.atGoal + data.borderline + data.uncontrolled + data.urgent;

  // Donut geometry — all values in SVG viewBox units (200×200)
  const r = 75; // ring radius within the 200×200 viewBox
  const circumference = 2 * Math.PI * r;

  // Build cumulative offsets for each segment
  let cumOffset = 0;
  const rings = SEGMENTS.map((seg) => {
    const value = data[seg.key];
    const segLen = total > 0 ? (value / total) * circumference : 0;
    const offset = cumOffset;
    cumOffset += segLen;
    return {
      ...seg,
      value,
      dasharray: `${segLen} ${circumference - segLen}`,
      dashoffset: -offset,
    };
  });

  const ariaLabel = rings
    .map((ring) => `${ring.label}: ${ring.value}`)
    .join(", ");

  return (
    <div className={ds.chartWrapper}>
      <div className={styles.container}>
        {/* Donut */}
        <div className={styles.donutWrapper}>
          <svg
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
            role="img"
            aria-label={`BP distribution chart. Total: ${total}. ${ariaLabel}`}
          >
            <title>BP Distribution</title>
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={tokens.colorNeutralBackground3}
              strokeWidth="24"
            />
            {/* Data segments */}
            {rings.map((ring) => (
              <circle
                key={ring.key}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke={ring.color}
                strokeWidth="24"
                strokeDasharray={ring.dasharray}
                strokeDashoffset={ring.dashoffset}
                transform="rotate(-90 100 100)"
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className={styles.centerText}>
            <span className={styles.centerValue}>{total}</span>
            <span className={styles.centerLabel}>Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {rings.map((ring) => (
            <div key={ring.key} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: ring.color }}
              />
              {ring.label}
              <span className={styles.legendCount}>{ring.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
