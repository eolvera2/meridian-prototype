/**
 * Task 9 Styles
 *
 * Styles for the EHR Fame layout (Contoso EHR) - no blue background
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useTask9Styles = makeStyles({
  // EHR Fame - main card container filling viewport
  ehrFame: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.14), 0px 0px 2px rgba(0,0,0,0.12)",
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: "border-box",
  },

  // Contoso Title Bar
  contosoTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    height: "36px",
    backgroundColor: tokens.colorNeutralBackground1,
    flexShrink: 0,
  },

  contosoBadge: {
    width: "20px",
    height: "20px",
    borderRadius: "9999px",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 600,
  },

  contosoAppTitle: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    color: tokens.colorNeutralForeground1,
  },

  contosoTitleRight: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "4px",
  },

  // Header with patient info
  ehrHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px",
    height: "58px",
    boxSizing: "border-box",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#d6e6f5",
    borderBottom: "1px solid #a0a0a0",
  },

  patientAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#d9d9d9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flex: 1,
    fontSize: "14px",
    letterSpacing: "0.56px",
  },

  patientName: {
    fontWeight: 700,
    color: "#242424",
  },

  patientDetails: {
    color: "#242424",
    fontWeight: 300,
  },

  // Divider
  divider: {
    height: "1px",
    backgroundColor: "#e0e0e0",
    width: "100%",
    flexShrink: 0,
  },

  // EHR Body - main content area
  ehrBody: {
    flex: 1,
    display: "flex",
    gap: "0",
    padding: "0",
    paddingTop: "10px",
    paddingBottom: "10px",
    overflow: "hidden",
    minHeight: 0,
    backgroundColor: "#d6e6f5",
  },

  // Left Navigation
  leftNav: {
    display: "flex",
    flexDirection: "column",
    width: "146px",
    flexShrink: 0,
    backgroundColor: "#d6e6f5",
    gap: "0",
    paddingTop: "0",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "0",
  },

  leftNavItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
  },

  leftNavItemBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "9999px",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  leftNavItemBadgeGeneric: {
    width: "32px",
    height: "32px",
    borderRadius: "9999px",
    backgroundColor: tokens.colorBrandBackground,
    flexShrink: 0,
  },

  leftNavItemText: {
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "22px",
    color: tokens.colorNeutralForeground1,
  },

  leftNavItemPlaceholder: {
    flex: 1,
    height: "26px",
    backgroundColor: "#d9d9d9",
  },

  // Epic Note container (main content)
  epicNote: {
    flex: 1,
    padding: "10px",
    overflow: "auto",
    minHeight: 0,
    backgroundColor: "#ffffff",
  },

  noteContainer: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    borderRadius: "4px",
  },

  noteHeader: {
    display: "flex",
    flexDirection: "column",
    padding: "0 8px 8px 8px",
  },

  noteHeaderActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "11px",
    height: "18px",
    overflow: "hidden",
    padding: "1px 0",
  },

  noteTitle: {
    fontSize: "20px",
    fontWeight: 600,
    letterSpacing: "0.8px",
    height: "24px",
    lineHeight: "normal",
  },

  noteBody: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "auto",
  },

  // Right Column
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "274px",
    flexShrink: 0,
    backgroundColor: "#d6e6f5",
    paddingTop: "0",
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingBottom: "0",
  },

  // Level of Service
  levelOfService: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    overflow: "hidden",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.14), 0px 0px 2px rgba(0,0,0,0.12)",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
  },

  losHeader: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#5b5fc7",
  },

  losSearchBar: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    height: "56px",
  },

  losSearchInput: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    borderBottom: "1px solid #616161",
    padding: "6px 10px",
  },

  losSearchText: {
    fontSize: "12px",
    lineHeight: "16px",
    color: "#707070",
  },

  losAddButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    border: "1px solid #d1d1d1",
    borderRadius: "4px",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },

  losButtonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  losCodeButton: {
    width: "63px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    border: "1px solid #d1d1d1",
    borderRadius: "4px",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
  },

  // EHR Component placeholder
  ehrComponent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "4px",
    border: "1px solid #d1d1d1",
    borderRadius: "4px",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },

  ehrComponentAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#d9d9d9",
  },

  ehrComponentLine: {
    height: "12px",
    backgroundColor: "#d9d9d9",
    width: "100%",
  },

  // Footer
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    height: "29px",
    padding: "0 16px",
    flexShrink: 0,
    backgroundColor: "#f0f0f0",
  },

  footerBadge: {
    width: "20px",
    height: "20px",
    borderRadius: "9999px",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 600,
  },

  footerText: {
    fontSize: "12px",
    lineHeight: "16px",
    color: tokens.colorNeutralForeground1,
  },

  // Taskbar image at the bottom
  taskbarImage: {
    width: "100%",
    height: "auto",
    flexShrink: 0,
  },

  // Window control buttons
  windowControl: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },

  // Floating mic bar (to be implemented later)
  floatingMicBar: {
    position: "absolute",
    top: "49px",
    right: "20px",
    width: "250px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #b7b7b7",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.14), 0px 0px 2px rgba(0,0,0,0.12)",
    zIndex: 100,
  },
});
