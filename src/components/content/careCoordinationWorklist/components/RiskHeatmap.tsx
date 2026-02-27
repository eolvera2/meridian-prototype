import type { FC } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";

interface RiskHeatmapProps {
  data: {
    type: string;
    low: number;
    medium: number;
    high: number;
    urgent: number;
  }[];
}

const CELL_COLORS = {
  low: { bg: "#DFF6DD", text: "#0E700E" },
  medium: { bg: "#FFF4CE", text: "#6E4B00" },
  high: { bg: "#FFF0E0", text: "#C45100" },
  urgent: { bg: "#FDE7E9", text: "#A4262C" },
} as const;

const COLUMNS: { key: keyof typeof CELL_COLORS; label: string }[] = [
  { key: "low", label: "Low" },
  { key: "medium", label: "Medium" },
  { key: "high", label: "High" },
  { key: "urgent", label: "Urgent" },
];

const useChartStyles = makeStyles({
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "4px",
  },
  headerCell: {
    padding: "6px 12px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase" as const,
    letterSpacing: "0.3px",
  },
  rowLabel: {
    padding: "8px 12px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    whiteSpace: "nowrap",
  },
  cell: {
    padding: "8px 12px",
    textAlign: "center",
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "13px",
  },
});

export const RiskHeatmap: FC<RiskHeatmapProps> = ({ data }) => {
  const styles = useChartStyles();
  const ds = useDashboardStyles();

  const ariaLabel = data
    .map(
      (row) =>
        `${row.type}: Low ${row.low}, Medium ${row.medium}, High ${row.high}, Urgent ${row.urgent}`,
    )
    .join("; ");

  return (
    <div className={ds.chartWrapper}>
      <table
        className={styles.table}
        role="table"
        aria-label={`Risk heatmap. ${ariaLabel}`}
      >
        <thead>
          <tr>
            <th className={styles.headerCell} />
            {COLUMNS.map((col) => (
              <th key={col.key} className={styles.headerCell}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.type}>
              <td className={styles.rowLabel}>{row.type}</td>
              {COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={styles.cell}
                  style={{
                    backgroundColor: CELL_COLORS[col.key].bg,
                    color: CELL_COLORS[col.key].text,
                  }}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
