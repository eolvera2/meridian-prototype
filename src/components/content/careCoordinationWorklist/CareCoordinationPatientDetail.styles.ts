import { makeStyles, tokens } from "@fluentui/react-components";

export const usePatientDetailStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },

  // ── Header bar ──
  header: {
    minHeight: "88px",
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.14), 0px 0px 2px 0px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    padding: "16px",
    gap: "12px",
    flexShrink: 0,
  },
  backButton: {
    backgroundColor: "transparent !important",
    border: "none !important",
    boxShadow: "none !important",
    color: `${tokens.colorNeutralForeground1} !important`,
    padding: "0",
    "&:hover": {
      backgroundColor: "transparent",
      color: `${tokens.colorBrandForeground1} !important`,
    },
  },
  patientInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
    flex: 1,
  },
  patientName: {
    fontFamily: "'Segoe UI', sans-serif",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase500,
    lineHeight: "28px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  subtitle: {
    fontFamily: "'Segoe UI', sans-serif",
    color: tokens.colorNeutralForeground1,
    fontSize: "10px",
    lineHeight: "14px",
    fontWeight: 400,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  reasonRow: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  reasonLabel: {
    fontWeight: 600,
  },
  detailsRow: {
    color: tokens.colorNeutralForeground1,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
    marginLeft: "auto",
  },
  iconButton: {
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      color: tokens.colorBrandForeground1,
    },
  },
  icon: {
    color: "currentColor",
    width: "20px",
    height: "20px",
  },

  // ── Accent bar below header ──
  accentBar: {
    height: "3px",
    backgroundColor: tokens.colorNeutralStroke2,
    flexShrink: 0,
  },

  // ── Scrollable content area ──
  content: {
    flex: 1,
    overflow: "auto",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    backgroundColor: tokens.colorNeutralBackground2,
  },

  // ── Section card ──
  sectionCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionIcon: {
    color: tokens.colorNeutralForeground3,
    width: "18px",
    height: "18px",
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },

  // ── Two-column patient info grid ──
  infoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 32px",
  },
  infoColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  infoItemRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  infoItemIcon: {
    color: tokens.colorNeutralForeground3,
    width: "16px",
    height: "16px",
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "13px",
    fontWeight: 400,
    color: tokens.colorNeutralForeground1,
    lineHeight: "18px",
  },

  // ── Contact history ──
  contactEntry: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "12px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:last-child": {
      borderBottom: "none",
    },
  },
  contactHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  contactDate: {
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  transcriptLink: {
    fontSize: "12px",
    fontWeight: 600,
    color: tokens.colorBrandForeground1,
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  contactActions: {
    display: "flex",
    gap: "8px",
    marginLeft: "auto",
  },
  callButton: {
    backgroundColor: `${tokens.colorBrandBackground} !important`,
    color: "#FFFFFF !important",
    fontSize: "12px !important",
    minWidth: "auto !important",
    padding: "4px 12px !important",
    "&:hover": {
      backgroundColor: `${tokens.colorBrandBackgroundHover} !important`,
    },
  },
  contactSummary: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    lineHeight: "18px",
    backgroundColor: tokens.colorNeutralBackground3,
    padding: "8px 12px",
    borderRadius: "6px",
  },

  // ── Outcome grid (2x2) ──
  outcomeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 24px",
  },
  outcomeItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground1,
  },
  outcomeLabel: {
    fontWeight: 400,
    color: tokens.colorNeutralForeground3,
    fontSize: "11px",
    minWidth: "140px",
    flexShrink: 0,
  },
  outcomeValue: {
    fontWeight: 600,
    fontSize: "12px",
  },
  outcomePositive: {
    color: "#107C10",
  },
  outcomeNegative: {
    color: "#D13438",
  },
  outcomeNeutral: {
    color: tokens.colorNeutralForeground1,
  },
  outcomeIcon: {
    width: "14px",
    height: "14px",
    flexShrink: 0,
  },

  // ── Notes ──
  notesBox: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    lineHeight: "18px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  notesLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },

  // ── Medication grid ──
  medicationGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  medicationCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "6px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  medicationInfo: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    flexWrap: "wrap",
    flex: 1,
    minWidth: 0,
  },
  medicationRefill: {
    flexShrink: 0,
  },
  medicationName: {
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  medicationDose: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground3,
  },
  frequencyPill: {
    fontSize: "10px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "10px",
    backgroundColor: "#E8F5E9",
    color: "#107C10",
    whiteSpace: "nowrap",
  },
  prescribedDate: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },
});
