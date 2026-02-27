import type { FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";

interface OutcomesByTypeChartProps {
  data: { type: string; positive: number; warning: number; critical: number }[];
}

const useChartStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: "24px",
    paddingTop: "8px",
    paddingBottom: "4px",
  },
  group: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: "4px",
    height: "120px",
  },
  barCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  barValue: {
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    marginBottom: "2px",
  },
  bar: {
    width: "24px",
    borderRadius: "3px 3px 0 0",
    transition: "height 0.4s ease",
  },
  groupLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
    lineHeight: "14px",
    maxWidth: "90px",
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    paddingTop: "8px",
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

const BAR_COLORS = {
  positive: "#498205",
  warning: "#CA5010",
  critical: "#D13438",
} as const;

export const OutcomesByTypeChart: FC<OutcomesByTypeChartProps> = ({ data }) => {
  const styles = useChartStyles();
  const ds = useDashboardStyles();

  const maxVal = Math.max(
    ...data.flatMap((d) => [d.positive, d.warning, d.critical]),
    1,
  );

  const barHeight = (value: number) =>
    `${Math.max((value / maxVal) * 100, 2)}%`;

  return (
    <div className={ds.chartWrapper}>
      <div className={styles.container}>
        {data.map((group) => (
          <div key={group.type} className={styles.group}>
            <div className={styles.bars}>
              {(
                [
                  { key: "positive", value: group.positive },
                  { key: "warning", value: group.warning },
                  { key: "critical", value: group.critical },
                ] as const
              ).map(({ key, value }) => (
                <div key={key} className={styles.barCol}>
                  <span className={styles.barValue}>{value}</span>
                  <div
                    className={styles.bar}
                    style={{
                      height: barHeight(value),
                      backgroundColor: BAR_COLORS[key],
                    }}
                    role="img"
                    aria-label={`${group.type} ${key}: ${value}`}
                  />
                </div>
              ))}
            </div>
            <span className={styles.groupLabel}>{group.type}</span>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        {(
          [
            { label: "Positive", color: BAR_COLORS.positive },
            { label: "Warning", color: BAR_COLORS.warning },
            { label: "Critical", color: BAR_COLORS.critical },
          ] as const
        ).map(({ label, color }) => (
          <span key={label} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: color }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
