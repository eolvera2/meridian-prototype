/**
 * DocumentComponent Styles
 *
 * All styles for DocumentComponent and its sub-components.
 * Uses Fluent UI v2 tokens for consistency.
 */

import { makeStyles, tokens } from "@fluentui/react-components";

// ============================================================================
// Main Document Styles
// ============================================================================

export const useDocumentStyles = makeStyles({
  documentComponent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} 0`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    width: "100%",
    minWidth: "300px",
    marginTop: "2px",

    // Only constrain width on large screens (desktop)
    "@media (min-width: 769px)": {
      maxWidth: "1000px",
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalXL}`,
    },

    "@media (max-width: 769px)": {
      borderRadius: tokens.borderRadiusNone,
      backgroundColor: tokens.colorNeutralBackground1,
      gap: tokens.spacingHorizontalM,
    },
  },

  documentStack: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    minWidth: "300px",
  },
});

// ============================================================================
// Document Header Styles
// ============================================================================

export const useHeaderStyles = makeStyles({
  documentHeader: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 769px)": {
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
    },
  },

  activityBanner: {
    margin: `${tokens.spacingVerticalXS} 0 ${tokens.spacingVerticalM}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorBrandStroke2}`,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },

  headerTop: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalL,
    rowGap: "0",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    justifyContent: "flex-end",
  },

  headerDivider: {
    width: "100%",
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },

  headerButton: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground1,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  title: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase500,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    flex: "0 1 auto",
    minWidth: 0,
  },

  settingsButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    minHeight: "20px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

// ============================================================================
// Table/Grid Styles
// ============================================================================

export const useTableStyles = makeStyles({
  table: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalMNudge,
    width: "100%",
    minWidth: "300px",

    // Override DataGrid default styles to match design
    "& .fui-DataGrid": {
      backgroundColor: "transparent",
      border: "none",
    },

    "& .fui-DataGridHeader": {
      backgroundColor: "transparent",
    },

    "& .fui-DataGridHeaderCell": {
      fontSize: tokens.fontSizeBase200,
      fontWeight: tokens.fontWeightSemibold,
      color: tokens.colorNeutralForeground1,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },

    "& .fui-DataGridCell": {
      fontSize: tokens.fontSizeBase200,
    },
  },

  tableWrapper: {
    width: "100%",
    overflowX: "hidden",
  },

  recentGrid: {
    width: "100%",
    tableLayout: "fixed",
    borderCollapse: "collapse",
    "& tr": {
      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    "& td": {
      paddingTop: tokens.spacingVerticalMNudge,
      paddingBottom: tokens.spacingVerticalMNudge,
    },
  },

  divider: {
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
    width: "100%",
  },

  documentLink: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorBrandForeground1,
    textDecoration: "none",
    cursor: "pointer",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  timestampText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
    whiteSpace: "normal",
    wordBreak: "break-word",
  },

  addDocumentRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    // margin: `${tokens.spacingVerticalXL} 0`,
  },

  addDocumentButton: {
    display: "flex",
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    justifyContent: "center",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    background: tokens.colorNeutralBackground1,
    fontSize: tokens.fontSizeBase200,
    fontFamily: "'Segoe UI', sans-serif",
  },

  addDocumentHelperText: {
    marginBottom: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
  },
});

// ============================================================================
// Document Card Styles
// ============================================================================

export const useCardStyles = makeStyles({
  documentCard: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingHorizontalL,
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
    flexWrap: "nowrap",
  },

  expandButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    minHeight: "20px",
  },

  cardTitle: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    minWidth: 0,
  },

  cardTitleText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },

  ordersBadge: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
  },

  dividerVertical: {
    width: "1px",
    height: "16px",
    backgroundColor: tokens.colorNeutralStroke2,
  },

  ordersText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
  },

  cardMenuButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalXS,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

// ============================================================================
// Toolbar Styles
// ============================================================================

export const useToolbarStyles = makeStyles({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalXS,
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },

  leftActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
  },

  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },

  toolbarButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
    minHeight: "24px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  toolbarIcon: {
    width: "20px",
    height: "20px",
    color: tokens.colorNeutralForeground2,
  },

  starButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalSNudge,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

// ============================================================================
// Section Styles
// ============================================================================

export const useSectionStyles = makeStyles({
  documentSections: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalMNudge,
    minWidth: "300px",
  },

  sectionDivider: {
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
    width: "100%",
    marginBottom: tokens.spacingVerticalXS,
  },

  documentSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    minWidth: "300px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalMNudge,
  },

  sectionTitle: {
    flex: 1,
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
    textTransform: "capitalize",
    minWidth: 0,
  },

  sectionCheckbox: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    flexShrink: 0,
  },

  sectionContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: tokens.shadow2,
    padding: tokens.spacingHorizontalMNudge,
    minHeight: "40px",
    minWidth: "300px",
    "@media (max-width: 769px)": {
      backgroundColor: tokens.colorNeutralBackground3,
      border: "none",
      borderRadius: tokens.borderRadiusSmall,
      boxShadow: "none",
      padding: 0,
      minWidth: "0",
      minHeight: "52px",
    },
  },

  sectionTextarea: {
    width: "100%",
    minHeight: "80px",
    maxHeight: "none",
    fontSize: tokens.fontSizeBase200,
    fontFamily: "'Segoe UI', sans-serif",
    lineHeight: tokens.lineHeightBase200,
    border: "none",
    outline: "none",
    resize: "none",
    backgroundColor: "transparent",
    // Target the inner textarea for auto-grow
    "& textarea": {
      fieldSizing: "content",
      minHeight: "80px",
      maxHeight: "none",
      overflow: "hidden",
      border: "none !important",
      outline: "none !important",
    },
    // Remove border on hover
    "&:hover": {
      border: "none",
      outline: "none",
    },
    "&:hover textarea": {
      border: "none !important",
      outline: "none !important",
    },
    // Remove border on active/click-down
    "&:active": {
      border: "none",
      outline: "none",
    },
    "&:active textarea": {
      border: "none !important",
      outline: "none !important",
    },
    // Remove border on focus
    "&:focus": {
      border: "none",
      outline: "none",
    },
    "&:focus textarea": {
      border: "none !important",
      outline: "none !important",
    },
    "&:focus-within": {
      border: "none",
      outline: "none",
    },
    "&:focus-within textarea": {
      border: "none !important",
      outline: "none !important",
    },
    "@media (max-width: 769px)": {
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
      minHeight: "52px",
      padding: `${tokens.spacingVerticalSNudge} 2px`,
      "& textarea": {
        minHeight: "52px",
      },
    },
  },

  sectionTextareaDictationFocus: {
    outline: "none !important",
    border: "none !important",
    boxShadow: "none !important",
    padding: `${tokens.spacingVerticalMNudge} !important`,
    backgroundColor: tokens.colorNeutralBackground1,
  },

  highlightedWord: {
    color: "#0078D4",
    backgroundColor: "transparent",
    fontWeight: 600,
  },

  sectionContentDictationFocus: {
    border: "3px solid transparent !important",
    borderRadius: tokens.borderRadiusSmall,
    backgroundImage:
      "linear-gradient(90deg, #0D91E1 0%, #5E62C6 25%, #D2007E 50%, #E94B3C 75%, #FF5F3D 100%)",
    padding: "0 !important",
    boxShadow: "none !important",
  },

  // Blue border for regular focus state (when not dictating)
  sectionContentFocus: {
    border: `2px solid ${tokens.colorBrandForeground1} !important`,
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: "none !important",
  },
});

// ============================================================================
// Reference Styles
// ============================================================================

export const useReferenceStyles = makeStyles({
  referencesSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalM,
    height: "48px",
    minWidth: "300px",
  },

  referencesHeader: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
  },

  referencesRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
    "@media (max-width: 769px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },

  referenceItem: {
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: `2px ${tokens.spacingHorizontalS}`,
    height: "24px",
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },

  referenceNumber: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    color: tokens.colorNeutralForeground2,
    textAlign: "center",
  },

  referenceDivider: {
    width: "9px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  referenceTitle: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorBrandForeground2,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
  },

  referenceIcon: {
    width: "16px",
    height: "16px",
    color: tokens.colorBrandForeground1,
  },
});

// ============================================================================
// Order Styles
// ============================================================================

export const useOrderStyles = makeStyles({
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalM,
    width: "100%",
  },

  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    width: "100%",
  },

  orderBadge: {
    backgroundColor: tokens.colorNeutralBackground5,
    borderRadius: tokens.borderRadiusCircular,
    minWidth: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${tokens.spacingHorizontalXS}`,
    flexShrink: 0,
  },

  orderBadgeText: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    color: tokens.colorNeutralForeground1,
    fontFamily: "'Segoe UI', sans-serif",
  },

  orderInputContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    borderRadius: tokens.borderRadiusSmall,
    overflow: "hidden",
    minWidth: 0,
  },

  orderInput: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
    fontFamily: "'Segoe UI', sans-serif",
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalMNudge}`,
    backgroundColor: "transparent",
    border: "1px solid transparent",
    borderRadius: tokens.borderRadiusSmall,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "32px",
    resize: "none",
    overflow: "hidden",
    "@media (max-width: 769px)": {
      fontSize: tokens.fontSizeBase300,
    },
  },

  orderInputFocused: {
    backgroundColor: tokens.colorNeutralBackground1,
  },

  orderFocusIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: tokens.colorCompoundBrandStroke,
    borderBottomLeftRadius: tokens.borderRadiusSmall,
    borderBottomRightRadius: tokens.borderRadiusSmall,
  },

  orderCodeButton: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalM}`,
    cursor: "pointer",
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  orderCodeIcon: {
    width: "20px",
    height: "20px",
  },

  orderCodeText: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    fontFamily: "'Segoe UI', sans-serif",
    color: tokens.colorNeutralForeground2,
  },

  orderDeleteButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalSNudge,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  addOrderButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalSNudge,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalM}`,
    cursor: "pointer",
    color: tokens.colorNeutralForeground2,
    width: "100%",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

// ============================================================================
// Skeleton/Loading Styles
// ============================================================================

export const useSkeletonStyles = makeStyles({
  skeletonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalMNudge,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: "none",
    minHeight: "120px",
  },

  skeletonItem: {
    height: "16px",
    borderRadius: tokens.borderRadiusSmall,
    background:
      "linear-gradient(90deg, rgba(13, 145, 225, 0.20) 0%, rgba(80, 108, 240, 0.20) 10%, rgba(140, 72, 255, 0.20) 20%, rgba(200, 84, 158, 0.20) 30%, rgba(255, 95, 61, 0.20) 40%, rgba(255, 200, 180, 0.15) 50%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 200, 180, 0.15) 70%, rgba(255, 95, 61, 0.20) 80%, rgba(140, 72, 255, 0.20) 90%, rgba(13, 145, 225, 0.20) 100%)",
    animationName: "shimmer",
    animationDuration: "3s",
    animationIterationCount: "infinite",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundSize: "200% 100%",
    width: "100%",
  },
});

// ============================================================================
// Combined Styles Hook (for backwards compatibility)
// ============================================================================

/**
 * Combined styles hook that merges all style categories.
 * Use this for backwards compatibility with existing code.
 */
export const useStyles = makeStyles({
  // Main container
  documentComponent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} 0`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    width: "100%",
    minWidth: "300px",
    marginTop: "2px",

    "@media (min-width: 769px)": {
      maxWidth: "1000px",
      padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalXL}`,
    },

    "@media (max-width: 769px)": {
      borderRadius: tokens.borderRadiusNone,
      backgroundColor: tokens.colorNeutralBackground1,
      gap: tokens.spacingHorizontalM,
    },
  },

  // Document Header
  documentHeader: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 769px)": {
      padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
    },
  },

  activityBanner: {
    margin: `${tokens.spacingVerticalXS} 0 ${tokens.spacingVerticalM}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorBrandStroke2}`,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },

  headerTop: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalL,
    rowGap: "0",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    justifyContent: "flex-end",
  },

  headerDivider: {
    width: "100%",
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },

  headerButton: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    cursor: "pointer",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    color: tokens.colorNeutralForeground1,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  title: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase500,
    color: tokens.colorNeutralForeground1,
    margin: 0,
    flex: "0 1 auto",
    minWidth: 0,
  },

  settingsButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    minHeight: "20px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  // DataGrid container
  table: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalMNudge,
    width: "100%",
    minWidth: "300px",

    "& .fui-DataGrid": {
      backgroundColor: "transparent",
      border: "none",
    },

    "& .fui-DataGridHeader": {
      backgroundColor: "transparent",
    },

    "& .fui-DataGridHeaderCell": {
      fontSize: tokens.fontSizeBase200,
      fontWeight: tokens.fontWeightSemibold,
      color: tokens.colorNeutralForeground1,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },

    "& .fui-DataGridCell": {
      fontSize: tokens.fontSizeBase200,
    },
  },

  tableWrapper: {
    width: "100%",
    overflowX: "hidden",
  },

  recentGrid: {
    width: "100%",
    tableLayout: "fixed",
    borderCollapse: "collapse",
    "& tr": {
      borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    },
    "& td": {
      paddingTop: tokens.spacingVerticalMNudge,
      paddingBottom: tokens.spacingVerticalMNudge,
    },
  },

  divider: {
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
    width: "100%",
  },

  documentLink: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorBrandForeground1,
    textDecoration: "none",
    cursor: "pointer",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  timestampText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
    whiteSpace: "normal",
    wordBreak: "break-word",
  },

  addDocumentRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXL,
    // margin: `${tokens.spacingVerticalXL} 0`,
  },

  addDocumentButton: {
    display: "flex",
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    justifyContent: "center",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    borderRadius: tokens.borderRadiusSmall,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    background: tokens.colorNeutralBackground1,
    fontSize: tokens.fontSizeBase200,
    fontFamily: "'Segoe UI', sans-serif",
  },

  addDocumentHelperText: {
    // marginTop: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
  },

  // Document Stack
  documentStack: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    minWidth: "300px",
  },

  documentCard: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: tokens.shadow4,
    padding: tokens.spacingHorizontalL,
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalM,
    flexWrap: "nowrap",
  },

  expandButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20px",
    minHeight: "20px",
  },

  cardTitle: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    minWidth: 0,
  },

  cardTitleText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },

  ordersBadge: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
  },

  dividerVertical: {
    width: "1px",
    height: "16px",
    backgroundColor: tokens.colorNeutralStroke2,
  },

  ordersText: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
  },

  cardMenuButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalXS,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  // Toolbar
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: tokens.spacingVerticalXS,
    gap: tokens.spacingHorizontalS,
    flexWrap: "wrap",
  },

  leftActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
  },

  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
  },

  toolbarButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: "2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
    minHeight: "24px",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  toolbarIcon: {
    width: "20px",
    height: "20px",
    color: tokens.colorNeutralForeground2,
  },

  starButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalSNudge,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  // Document sections
  documentSections: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalMNudge,
    minWidth: "300px",
  },

  sectionDivider: {
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
    width: "100%",
    marginBottom: tokens.spacingVerticalXS,
  },

  documentSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    minWidth: "300px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalMNudge,
  },

  sectionTitle: {
    flex: 1,
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase400,
    color: tokens.colorNeutralForeground1,
    textTransform: "capitalize",
    minWidth: 0,
  },

  sectionCheckbox: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    flexShrink: 0,
  },

  sectionContent: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: tokens.shadow2,
    padding: tokens.spacingHorizontalMNudge,
    minHeight: "40px",
    minWidth: "300px",
    "@media (max-width: 769px)": {
      backgroundColor: tokens.colorNeutralBackground3,
      border: "none",
      borderRadius: tokens.borderRadiusSmall,
      boxShadow: "none",
      padding: 0,
      minWidth: "0",
      minHeight: "52px",
    },
  },

  sectionTextarea: {
    width: "100%",
    minHeight: "80px",
    maxHeight: "none",
    fontSize: tokens.fontSizeBase200,
    fontFamily: "'Segoe UI', sans-serif",
    lineHeight: tokens.lineHeightBase200,
    border: "none",
    outline: "none",
    resize: "none",
    backgroundColor: "transparent",
    "& textarea": {
      fieldSizing: "content",
      minHeight: "80px",
      maxHeight: "none",
      overflow: "hidden",
      border: "none !important",
      outline: "none !important",
    },
    "&:hover": {
      border: "none",
      outline: "none",
    },
    "&:hover textarea": {
      border: "none !important",
      outline: "none !important",
    },
    "&:active": {
      border: "none",
      outline: "none",
    },
    "&:active textarea": {
      border: "none !important",
      outline: "none !important",
    },
    "&:focus": {
      border: "none",
      outline: "none",
    },
    "&:focus textarea": {
      border: "none !important",
      outline: "none !important",
    },
    "&:focus-within": {
      border: "none",
      outline: "none",
    },
    "&:focus-within textarea": {
      border: "none !important",
      outline: "none !important",
    },
    "@media (max-width: 769px)": {
      fontSize: tokens.fontSizeBase400,
      lineHeight: tokens.lineHeightBase400,
      minHeight: "52px",
      padding: `${tokens.spacingVerticalSNudge} 2px`,
      "& textarea": {
        minHeight: "52px",
      },
    },
  },

  sectionTextareaDictationFocus: {
    outline: "none !important",
    border: "none !important",
    boxShadow: "none !important",
    padding: `${tokens.spacingVerticalMNudge} !important`,
    backgroundColor: tokens.colorNeutralBackground1,
  },

  sectionContentDictationFocus: {
    border: "3px solid transparent !important",
    borderRadius: tokens.borderRadiusSmall,
    backgroundImage:
      "linear-gradient(90deg, #0D91E1 0%, #5E62C6 25%, #D2007E 50%, #E94B3C 75%, #FF5F3D 100%)",
    padding: "0 !important",
    boxShadow: "none !important",
  },

  sectionContentFocus: {
    border: `2px solid ${tokens.colorBrandForeground1} !important`,
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: "none !important",
  },

  // References
  referencesSection: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalM,
    height: "48px",
    minWidth: "300px",
  },

  referencesHeader: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
  },

  referencesRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    flexWrap: "wrap",
    "@media (max-width: 769px)": {
      flexDirection: "column",
      alignItems: "flex-start",
    },
  },

  referenceItem: {
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: `2px ${tokens.spacingHorizontalS}`,
    height: "24px",
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },

  referenceNumber: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    color: tokens.colorNeutralForeground2,
    textAlign: "center",
  },

  referenceDivider: {
    width: "9px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  referenceTitle: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorBrandForeground2,
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
  },

  referenceIcon: {
    width: "16px",
    height: "16px",
    color: tokens.colorBrandForeground1,
  },

  // Order items
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalM,
    width: "100%",
  },

  orderItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    width: "100%",
  },

  orderBadge: {
    backgroundColor: tokens.colorNeutralBackground5,
    borderRadius: tokens.borderRadiusCircular,
    minWidth: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0 ${tokens.spacingHorizontalXS}`,
    flexShrink: 0,
  },

  orderBadgeText: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase100,
    color: tokens.colorNeutralForeground1,
    fontFamily: "'Segoe UI', sans-serif",
  },

  orderInputContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    borderRadius: tokens.borderRadiusSmall,
    overflow: "hidden",
    minWidth: 0,
  },

  orderInput: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightRegular,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground1,
    fontFamily: "'Segoe UI', sans-serif",
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalMNudge}`,
    backgroundColor: "transparent",
    border: "1px solid transparent",
    borderRadius: tokens.borderRadiusSmall,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "32px",
    resize: "none",
    overflow: "hidden",
    "@media (max-width: 769px)": {
      fontSize: tokens.fontSizeBase300,
    },
  },

  orderInputFocused: {
    backgroundColor: tokens.colorNeutralBackground1,
  },

  orderFocusIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: tokens.colorCompoundBrandStroke,
    borderBottomLeftRadius: tokens.borderRadiusSmall,
    borderBottomRightRadius: tokens.borderRadiusSmall,
  },

  orderCodeButton: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalSNudge,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalM}`,
    cursor: "pointer",
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  orderCodeIcon: {
    width: "20px",
    height: "20px",
  },

  orderCodeText: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    fontFamily: "'Segoe UI', sans-serif",
    color: tokens.colorNeutralForeground2,
  },

  orderDeleteButton: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingHorizontalSNudge,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: tokens.colorNeutralForeground2,
    flexShrink: 0,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  addOrderButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: tokens.spacingHorizontalSNudge,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    padding: `${tokens.spacingVerticalSNudge} ${tokens.spacingHorizontalM}`,
    cursor: "pointer",
    color: tokens.colorNeutralForeground2,
    width: "100%",
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: tokens.lineHeightBase200,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },

  skeletonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingHorizontalMNudge,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: "none",
    minHeight: "120px",
  },

  skeletonItem: {
    height: "16px",
    borderRadius: tokens.borderRadiusSmall,
    background:
      "linear-gradient(90deg, rgba(13, 145, 225, 0.20) 0%, rgba(80, 108, 240, 0.20) 10%, rgba(140, 72, 255, 0.20) 20%, rgba(200, 84, 158, 0.20) 30%, rgba(255, 95, 61, 0.20) 40%, rgba(255, 200, 180, 0.15) 50%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 200, 180, 0.15) 70%, rgba(255, 95, 61, 0.20) 80%, rgba(140, 72, 255, 0.20) 90%, rgba(13, 145, 225, 0.20) 100%)",
    animationName: "shimmer",
    animationDuration: "3s",
    animationIterationCount: "infinite",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundSize: "200% 100%",
    width: "100%",
  },
});
