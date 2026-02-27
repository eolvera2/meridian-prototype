import type { FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    justifyContent: "center",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    width: "110px",
    flexShrink: 0,
    textAlign: "right" as const,
  },
  track: {
    flex: 1,
    height: "16px",
    backgroundColor: tokens.colorNeutralBackground4,
    borderRadius: "4px",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  value: {
    fontSize: "12px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    width: "50px",
    flexShrink: 0,
  },
  trend: {
    fontSize: "11px",
    width: "30px",
    flexShrink: 0,
    textAlign: "center" as const,
  },
});

interface BarriersChartProps {
  data: { label: string; count: number; trend: number; color: string }[];
}

export const BarriersChart: FC<BarriersChartProps> = ({ data }) => {
  const styles = useStyles();
  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className={styles.container}>
      {data.map((d) => (
        <div className={styles.row} key={d.label}>
          <span className={styles.label}>{d.label}</span>
          <div className={styles.track}>
            <div
              className={styles.fill}
              style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: d.color }}
            />
          </div>
          <span className={styles.value}>{d.count}</span>
          <span
            className={styles.trend}
            style={{ color: d.trend > 0 ? "#C42B1C" : d.trend < 0 ? "#0E8A3E" : tokens.colorNeutralForeground3 }}
          >
            {d.trend > 0 ? `↑${d.trend}` : d.trend < 0 ? `↓${Math.abs(d.trend)}` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
};
