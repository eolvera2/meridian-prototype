import { makeStyles, tokens } from "@fluentui/react-components";

export const useDashboardStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflowY: "auto",
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "16px 24px",
    gap: "12px",
  },

  // Header row: title left, filters right
  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
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

  // Filters bar (inline with header)
  filtersBar: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  filterLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
  },

  // Stats cards row
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  statLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  statValueRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: "30px",
  },
  statTrendUp: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#107C10",
  },
  statTrendDown: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#D13438",
  },
  statBreakdown: {
    display: "flex",
    gap: "8px",
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },

  // Section card (shared wrapper for chart sections)
  sectionCard: {
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  // Adherence Trend: chart + legend stacked
  trendRow: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  trendChartArea: {
    flex: 1,
    minWidth: 0,
  },
  trendLegendSide: {
    display: "flex",
    gap: "12px",
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },

  // Adherence Trend line chart
  chartWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  chartLegend: {
    display: "flex",
    gap: "16px",
    fontSize: "11px",
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

  // Three-column row
  threeColumnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
  },

  // Horizontal bar chart rows (shared)
  barChartList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  barLabel: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    minWidth: "90px",
    whiteSpace: "nowrap",
  },
  barTrack: {
    flex: 1,
    height: "20px",
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  },
  barValue: {
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    minWidth: "32px",
    textAlign: "right",
  },

  // Drivers section (vertical bars)
  driversRow: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    height: "110px",
    paddingTop: "4px",
  },
  driverCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    flex: 1,
  },
  driverBarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "70px",
    width: "100%",
    position: "relative",
  },
  driverBar: {
    width: "40px",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.4s ease",
  },
  driverValue: {
    fontSize: "12px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  driverLabel: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground2,
    textAlign: "center",
  },

  // Contact History table
  historySection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "12px 16px",
  },
  historyTitle: {
    fontSize: "14px",
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
  historyFilterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: "1 1 200px",
    minWidth: "150px",
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
