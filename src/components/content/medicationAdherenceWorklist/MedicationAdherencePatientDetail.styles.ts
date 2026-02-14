import { makeStyles, tokens } from "@fluentui/react-components";

export const usePatientDetailStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
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
    backgroundColor: tokens.colorBrandBackground,
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
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  sectionSubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },

  // ── Info grid (key-value pairs) ──
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 24px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
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
  },

  // ── Status pill ──
  statusPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    width: "fit-content",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  // ── Contact history entry ──
  contactEntry: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "10px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:last-child": {
      borderBottom: "none",
    },
  },
  contactHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactMethod: {
    fontSize: "12px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  contactDate: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
  },
  contactSummary: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
    lineHeight: "18px",
  },

  // ── Medication list ──
  medicationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    "&:last-child": {
      borderBottom: "none",
    },
  },
  medicationName: {
    fontSize: "13px",
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  medicationDose: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
  },
  medicationAdherenceBadge: {
    fontSize: "11px",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "10px",
  },
  adherenceGood: {
    backgroundColor: "#DFF6DD",
    color: "#107C10",
  },
  adherenceWarning: {
    backgroundColor: "#FFF4CE",
    color: "#797673",
  },
  adherencePoor: {
    backgroundColor: "#FDE7E9",
    color: "#D13438",
  },

  // ── Action buttons row ──
  actionsRow: {
    display: "flex",
    gap: "8px",
    paddingTop: "4px",
  },
});
