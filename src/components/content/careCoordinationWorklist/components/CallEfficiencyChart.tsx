import type { FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import { CC_COLORS } from "../careCoordination.constants";

interface CallEfficiencyChartProps {
  data: { firstAttempt: number; afterRetry: number; unresolved: number };
}

const SEGMENT_COLORS = {
  firstAttempt: CC_COLORS.positive,
  afterRetry: CC_COLORS.chartBlue,
  unresolved: CC_COLORS.negative,
} as const;

const SEGMENT_LABELS: Record<keyof typeof SEGMENT_COLORS, string> = {
  firstAttempt: "FCR",
  afterRetry: "Retry",
  unresolved: "Unresolved",
};

const useChartStyles = makeStyles({
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingTop: "4px",
    width: "100%",
  },
  barArea: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  stackedBar: {
    display: "flex",
    width: "100%",
    height: "32px",
    borderRadius: "6px",
    overflow: "hidden",
  },
  segment: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    transition: "flex 0.4s ease",
  },
  legend: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flexShrink: 0,
    width: "76px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
});

export const CallEfficiencyChart: FC<CallEfficiencyChartProps> = ({ data }) => {
  const styles = useChartStyles();
  const ds = useDashboardStyles();

  const total = data.firstAttempt + data.afterRetry + data.unresolved;
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const segments = [
    { key: "firstAttempt" as const, value: data.firstAttempt },
    { key: "afterRetry" as const, value: data.afterRetry },
    { key: "unresolved" as const, value: data.unresolved },
  ];

  const ariaLabel = segments
    .map((s) => `${SEGMENT_LABELS[s.key]}: ${pct(s.value)}%`)
    .join(", ");

  return (
    <div className={ds.chartWrapper}>
      <div
        className={styles.wrapper}
        role="img"
        aria-label={`Call efficiency chart. ${ariaLabel}`}
      >
        <div className={styles.barArea}>
          <div className={styles.stackedBar}>
            {segments.map(({ key, value }) => {
              const percentage = pct(value);
              return (
                <div
                  key={key}
                  className={styles.segment}
                  style={{
                    flex: percentage,
                    backgroundColor: SEGMENT_COLORS[key],
                  }}
                >
                  {percentage >= 8 ? `${percentage}%` : ""}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.legend}>
          {segments.map(({ key }) => (
            <span key={key} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: SEGMENT_COLORS[key] }}
              />
              {SEGMENT_LABELS[key]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
