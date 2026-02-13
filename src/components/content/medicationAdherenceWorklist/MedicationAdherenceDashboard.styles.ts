import { makeStyles, tokens } from "@fluentui/react-components";

export const useDashboardStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "24px 32px",
    gap: "32px",
  },

  dashboardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: "32px",
  },

  subtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  timeRangeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
  },

  timeRangeLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  statCard: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "16px",
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },

  statCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },

  statIcon: {
    color: tokens.colorBrandForeground1,
    fontSize: "20px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: "36px",
  },

  statDescription: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },

  // Patient Contact History section
  historySection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "24px",
  },

  historyHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  historyTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },

  historySubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  summaryCounts: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },

  countBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    height: "20px",
    borderRadius: "4px",
    padding: "0 6px",
    fontSize: "11px",
    fontWeight: 600,
    marginLeft: "4px",
  },

  countBadgeReview: {
    backgroundColor: "#FDE300",
    color: tokens.colorNeutralForeground1,
  },

  countBadgeCompleted: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },

  filtersRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: "1 1 200px",
    minWidth: "150px",
  },

  filterLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },

  filterActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginLeft: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: tokens.fontSizeBase200,
  },

  tableHeader: {
    textAlign: "left",
    padding: "8px 12px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    whiteSpace: "nowrap",
    fontSize: "12px",
  },

  tableCell: {
    padding: "10px 12px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    verticalAlign: "middle",
    fontSize: "12px",
  },

  patientLink: {
    color: tokens.colorBrandForeground1,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  warningText: {
    color: "#D13438",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },

  normalText: {
    color: tokens.colorNeutralForeground2,
  },

  reviewedBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
});
