/**
 * Main Document Styles
 */

import { makeStyles, tokens } from "@fluentui/react-components";

export const useDocumentStyles = makeStyles({
  documentComponent: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingHorizontalS,
    padding: `${tokens.spacingVerticalS} 0`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    width: "100%",
    minWidth: "var(--content-min-width)",
    marginTop: "var(--spacing-xs)",

    // Only constrain width on large screens (desktop)
    "@media (min-width: 769px)": {
      maxWidth: "var(--content-max-width)",
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
    minWidth: "var(--content-min-width)",
  },
});
