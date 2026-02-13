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
    boxShadow: "var(--shadow-small)",
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
    borderRadius: "var(--border-radius-circular)",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--colorBrandForeground)",
    fontSize: "10px",
    fontWeight: 600,
  },

  contosoAppTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    lineHeight: "20px",
    color: tokens.colorNeutralForeground1,
  },

  contosoTitleRight: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "var(--gap-small)",
  },

  // Header with patient info
  ehrHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    padding: "var(--spacing-xlarge)",
    height: "58px",
    boxSizing: "border-box",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "var(--palette-blue-d6e6f5)",
    borderBottom: "1px solid #a0a0a0",
  },

  patientAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--palette-gray-d9d9d9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  patientInfo: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    flex: 1,
    fontSize: tokens.fontSizeBase300,
    letterSpacing: "0.56px",
  },

  patientName: {
    fontWeight: 700,
    color: "var(--palette-gray-242424)",
  },

  patientDetails: {
    color: "var(--palette-gray-242424)",
    fontWeight: 300,
  },

  // Divider
  divider: {
    height: "1px",
    backgroundColor: "var(--palette-gray-e0e0e0)",
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
    paddingBottom: "var(--spacing-xlarge)",
    overflow: "hidden",
    minHeight: 0,
    backgroundColor: "var(--palette-blue-d6e6f5)",
  },

  // Left Navigation
  leftNav: {
    display: "flex",
    flexDirection: "column",
    width: "146px",
    flexShrink: 0,
    backgroundColor: "var(--palette-blue-d6e6f5)",
    gap: "0",
    paddingTop: "0",
    paddingLeft: "10px",
    paddingRight: "var(--spacing-xlarge)",
    paddingBottom: "0",
  },

  leftNavItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-xlarge)",
    padding: "var(--spacing-xlarge)",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--colorNeutralBackground1)",
    borderBottom: "1px solid #e0e0e0",
  },

  leftNavItemBadge: {
    width: "32px",
    height: "32px",
    borderRadius: "var(--border-radius-circular)",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  leftNavItemBadgeGeneric: {
    width: "32px",
    height: "32px",
    borderRadius: "var(--border-radius-circular)",
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
    backgroundColor: "var(--palette-gray-d9d9d9)",
  },

  // Epic Note container (main content)
  epicNote: {
    flex: 1,
    padding: "var(--spacing-xlarge)",
    overflow: "auto",
    minHeight: 0,
    backgroundColor: "var(--colorNeutralBackground1)",
  },

  noteContainer: {
    backgroundColor: "var(--colorNeutralBackground1)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    borderRadius: "var(--border-radius-medium)",
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
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    letterSpacing: "0.8px",
    height: "24px",
    lineHeight: "normal",
  },

  noteBody: {
    flex: 1,
    backgroundColor: "var(--colorNeutralBackground1)",
    overflow: "auto",
  },

  // Right Column
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xlarge)",
    width: "274px",
    flexShrink: 0,
    backgroundColor: "var(--palette-blue-d6e6f5)",
    paddingTop: "0",
    paddingLeft: "10px",
    paddingRight: "var(--spacing-xlarge)",
    paddingBottom: "0",
  },

  // Level of Service
  levelOfService: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-xlarge)",
    padding: "var(--spacing-xlarge)",
    overflow: "hidden",
    boxShadow: "var(--shadow-small)",
    borderRadius: "var(--border-radius-medium)",
    backgroundColor: "var(--colorNeutralBackground3)",
  },

  losHeader: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--palette-purple-5b5fc7)",
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
    gap: "var(--gap-small)",
    borderBottom: "1px solid var(--palette-gray-616161)",
    padding: "6px 10px",
  },

  losSearchText: {
    fontSize: tokens.fontSizeBase200,
    lineHeight: "16px",
    color: "var(--palette-gray-707070)",
  },

  losAddButton: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-medium)",
    padding: "6px 12px",
    border: "1px solid var(--palette-gray-d1d1d1)",
    borderRadius: "var(--border-radius-medium)",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: tokens.fontSizeBase300,
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
    border: "1px solid var(--palette-gray-d1d1d1)",
    borderRadius: "var(--border-radius-medium)",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    lineHeight: "20px",
  },

  // EHR Component placeholder
  ehrComponent: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--gap-large)",
    padding: "var(--spacing-small-4)",
    border: "1px solid var(--palette-gray-d1d1d1)",
    borderRadius: "var(--border-radius-medium)",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "var(--colorNeutralBackground1)",
  },

  ehrComponentAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "var(--palette-gray-d9d9d9)",
  },

  ehrComponentLine: {
    height: "12px",
    backgroundColor: "var(--palette-gray-d9d9d9)",
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
    backgroundColor: "var(--palette-gray-f0f0f0)",
  },

  footerBadge: {
    width: "20px",
    height: "20px",
    borderRadius: "var(--border-radius-circular)",
    backgroundColor: tokens.colorBrandBackground,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--colorBrandForeground)",
    fontSize: "10px",
    fontWeight: 600,
  },

  footerText: {
    fontSize: tokens.fontSizeBase200,
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
    borderRadius: "var(--border-radius-medium)",
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
    backgroundColor: "var(--colorNeutralBackground1)",
    borderRadius: "var(--border-radius-xlarge)",
    border: "1px solid var(--palette-gray-b7b7b7)",
    boxShadow: "var(--shadow-small)",
    zIndex: "var(--z-index-header)",
  },
});
