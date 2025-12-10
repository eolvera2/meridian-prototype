/**
 * Settings Styles
 *
 * Fluent UI makeStyles definitions for the Settings component.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  settingsContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
    overflow: "hidden",
  },

  content: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxSizing: "border-box",
    width: "100%",

    "@media (max-width: 768px)": {
      padding: "12px",
    },
  },

  settingSection: {
    padding: "16px",
    cursor: "pointer",
    transition: "background-color 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)",
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: "8px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },

    "@media (max-width: 768px)": {
      padding: "12px",
    },
  },

  settingSectionExpanded: {
    backgroundColor: tokens.colorNeutralBackground1,

    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1,
    },
  },

  settingHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minWidth: 0,
    gap: "8px",
  },

  settingLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },

  settingIcon: {
    color: tokens.colorNeutralForeground2,
    fontSize: "20px",
    flexShrink: 0,
  },

  settingContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },

  settingTitle: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    color: tokens.colorNeutralForeground1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  settingDescription: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    color: tokens.colorNeutralForeground3,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  chevronIcon: {
    color: tokens.colorNeutralForeground3,
    fontSize: "20px",
    flexShrink: 0,
  },

  expandedContent: {
    marginTop: "16px",
  },

  languageTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    width: "100%",
    boxSizing: "border-box",
  },

  languageTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    backgroundColor: tokens.colorNeutralBackground5,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    borderRadius: "9999px",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: "14px",
    color: tokens.colorNeutralForeground3,
  },

  removeBadge: {
    cursor: "pointer",
    display: "flex",
    height: "20px",
    minWidth: "20px",
    padding: `${tokens.spacingVerticalNone} ${tokens.spacingHorizontalXS}`,
    justifyContent: "center",
    alignItems: "center",
    gap: tokens.spacingHorizontalNone,
    borderRadius: "9999px",
    backgroundColor: tokens.colorNeutralBackground5,
    "& svg": {
      width: "12px",
      height: "12px",
    },
  },

  badgeContent: {
    display: "flex",
    height: "14px",
    padding: `0 ${tokens.spacingHorizontalXXS} 0.5px ${tokens.spacingHorizontalXXS}`,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    color: tokens.colorNeutralForeground3,
  },

  // Sub-page styles
  subPageContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground2,
  },

  subPageHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },

  backIcon: {
    color: tokens.colorNeutralForeground2,
    fontSize: "20px",
  },

  backText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    color: tokens.colorNeutralForeground2,
  },

  subPageTitle: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: "32px",
    color: tokens.colorNeutralForeground1,
    padding: "0 16px 16px 16px",
  },

  subPageBody: {
    flex: 1,
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderMessage: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    color: tokens.colorNeutralForeground3,
  },
});

export type SettingsStyles = ReturnType<typeof useStyles>;
