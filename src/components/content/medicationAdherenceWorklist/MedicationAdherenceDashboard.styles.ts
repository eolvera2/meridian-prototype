import { makeStyles, tokens, shorthands } from "@fluentui/react-components";

export const useDashboardStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    backgroundColor: tokens.colorNeutralBackground2,
    padding: "20px 32px",
    gap: "20px",
  },

  // Header row: title left, filters right
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  dashboardHeader: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: "32px",
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },

  // Filter popover
  filterPopoverTrigger: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    padding: "0 5px",
    fontSize: "11px",
    fontWeight: 700,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  filterPopoverContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "8px",
    minWidth: "280px",
  },
  filterPopoverRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
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
    flex: "1 1 120px",
  },
  filterLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
  },

  // Stats cards row
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "16px 20px",
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
  },
  statCardGood: {
    ...shorthands.borderLeft("4px", "solid", "#107C10"),
  },
  statCardWarning: {
    ...shorthands.borderLeft("4px", "solid", "#CA5010"),
  },
  statCardCritical: {
    ...shorthands.borderLeft("4px", "solid", "#D13438"),
  },
  statCardNeutral: {
    ...shorthands.borderLeft("4px", "solid", tokens.colorBrandBackground),
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
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
    fontSize: "28px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: "34px",
  },
  statTrendUp: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    color: "#107C10",
  },
  statTrendDown: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    color: "#D13438",
  },
  statBreakdown: {
    display: "flex",
    gap: "8px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  // Section card (shared wrapper for chart sections)
  sectionCard: {
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
  },
  // Chart toggle section
  chartToggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartToggleLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  chartsCollapsible: {
    // Styles applied via inline style to avoid Griffel atomic-CSS conflicts
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
    justifyContent: "center",
    gap: "12px",
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
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

  // Three-column row
  threeColumnRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
    "@media (max-width: 1200px)": {
      gridTemplateColumns: "1fr 1fr",
    },
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr",
    },
  },

  // Horizontal bar chart rows (shared)
  barChartList: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "10px",
    flex: 1,
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  barLabel: {
    fontSize: tokens.fontSizeBase300,
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
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
    minWidth: "32px",
    textAlign: "right",
  },

  // Drivers section (vertical bars)
  driversRow: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "center",
    paddingTop: "8px",
  },
  driverCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    flex: 1,
  },
  driverBarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100px",
    width: "100%",
  },
  driverBar: {
    width: "50px",
    borderRadius: "4px 4px 0 0",
    transition: "height 0.4s ease",
  },
  driverValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  driverLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    textAlign: "center",
    lineHeight: "16px",
    minHeight: "28px",
  },

  // Contact History table
  historySection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "16px 20px",
  },
  historyHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  historyTitle: {
    fontSize: tokens.fontSizeBase400,
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
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    marginLeft: "4px",
  },
  countBadgeReview: {
    backgroundColor: "#FFF4CE",
    color: "#6E4B00",
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
    padding: "10px 16px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    whiteSpace: "nowrap",
    fontSize: tokens.fontSizeBase200,
  },
  tableRow: {
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  tableCell: {
    padding: "12px 16px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    verticalAlign: "middle",
    fontSize: tokens.fontSizeBase300,
  },
  // Consolidated outcomes cell
  outcomesCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  outcomeIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    fontSize: "14px",
  },
  outcomeGood: {
    backgroundColor: "#DFF6DD",
    color: "#107C10",
  },
  outcomeBad: {
    backgroundColor: "#FDE7E9",
    color: "#D13438",
  },
  outcomeNeutralIcon: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
  },
  // Pagination
  paginationRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "8px",
  },
  paginationInfo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  paginationControls: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  // Empty state
  emptyState: {
    textAlign: "center",
    padding: "32px 16px",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
  // Screen reader only
  srOnly: {
    position: "absolute" as const,
    width: "1px",
    height: "1px",
    padding: "0",
    ...shorthands.margin("-1px"),
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    ...shorthands.borderWidth("0"),
  },
  // Export button alignment
  headerActionsRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  statusPillInProgress: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: 700,
    whiteSpace: "nowrap",
    backgroundColor: "#E8F4FD",
    color: "#0F548C",
  },
  statusPillNeedsReview: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: 700,
    whiteSpace: "nowrap",
    backgroundColor: "#FFF4CE",
    color: "#6E4B00",
  },
  statusPillCompleted: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    borderRadius: "16px",
    padding: "4px 12px",
    fontSize: tokens.fontSizeBase200,
    fontWeight: 700,
    whiteSpace: "nowrap",
    backgroundColor: "#DFF6DD",
    color: "#0E700E",
  },
});
