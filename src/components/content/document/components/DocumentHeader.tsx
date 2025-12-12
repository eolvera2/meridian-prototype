/**
 * DocumentHeader Component
 *
 * Renders the header section of the DocumentComponent, including
 * the title, settings/add buttons, and the recents table.
 */

import React from "react";
import {
  DocumentSettingsRegular,
  AddCircleRegular,
} from "@fluentui/react-icons";
import { RecentsTable } from "./RecentsTable";
import type { DocumentGridItem } from "../DocumentComponent.types";

export interface DocumentHeaderProps {
  /** Styles object from useStyles */
  styles: Record<string, string>;
  /** Grid items to display in the recents table */
  gridItems: DocumentGridItem[];
  /** Order counts per document */
  orderCounts: Record<string, number>;
  /** Handler for document click in recents table */
  onDocumentClick: (documentId: string) => void;
  /** Handler for navigating to document settings */
  onNavigateToDocumentSettings?: () => void;
  /** Handler to open add note dialog */
  onOpenAddNoteDialog: () => void;
  /** Whether ambient recording has stopped (triggers timestamp update) */
  ambientRecordingStopped?: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  styles,
  gridItems,
  orderCounts,
  onDocumentClick,
  onNavigateToDocumentSettings,
  onOpenAddNoteDialog,
  ambientRecordingStopped,
}) => {
  return (
    <div className={`${styles.documentHeader} document-header`}>
      <div className={styles.headerTop}>
        <h2 className={styles.title}>Recents</h2>
        <div className={styles.headerActions}>
          <button
            className={styles.headerButton}
            aria-label="Document settings"
            onClick={() => onNavigateToDocumentSettings?.()}
            disabled={!onNavigateToDocumentSettings}
            style={{
              opacity: onNavigateToDocumentSettings ? 1 : 0.5,
              cursor: onNavigateToDocumentSettings ? "pointer" : "not-allowed",
            }}
          >
            <DocumentSettingsRegular
              style={{ width: "20px", height: "20px", color: "#424242" }}
            />
            Settings
          </button>
          <button
            className={styles.headerButton}
            onClick={() => {
              console.log("Add button clicked, opening dialog");
              onOpenAddNoteDialog();
            }}
            aria-label="Add document"
          >
            <AddCircleRegular
              style={{ width: "20px", height: "20px", color: "#424242" }}
            />
            Add
          </button>
        </div>
      </div>
      {/* <div className={styles.headerDivider} /> */}

      {/* Recents Table */}
      <RecentsTable
        gridItems={gridItems}
        orderCounts={orderCounts}
        onDocumentClick={onDocumentClick}
        ambientRecordingStopped={ambientRecordingStopped}
      />
    </div>
  );
};

export default DocumentHeader;
