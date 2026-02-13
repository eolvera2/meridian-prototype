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
import { Tooltip } from "@fluentui/react-components";
import { RecentsTable } from "./RecentsTable";
import type { DocumentGridItem } from "../DocumentComponent.types";
import { useI18n } from "../../../../i18n/I18nContext";

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
  const { t } = useI18n();
  return (
    <div className={`${styles.documentHeader} document-header`}>
      <div className={styles.headerTop}>
        <h2 className={styles.title}>{t("recents.title")}</h2>
        <div className={styles.headerActions}>
          <Tooltip content={t("document.header.settingsTooltip")} relationship="label">
            <span className="inline-flex">
              <button
                className={styles.headerButton}
                aria-label={t("document.header.settingsAria")}
                onClick={() => onNavigateToDocumentSettings?.()}
                disabled={!onNavigateToDocumentSettings}
                style={{
                  opacity: onNavigateToDocumentSettings ? 1 : 0.5,
                  cursor: onNavigateToDocumentSettings
                    ? "pointer"
                    : "not-allowed",
                }}
              >
                <DocumentSettingsRegular className={styles.headerButtonIcon} />
                {t("document.header.settings")}
              </button>
            </span>
          </Tooltip>

          <Tooltip content={t("document.header.addTooltip")} relationship="label">
            <span className="inline-flex">
              <button
                className={styles.headerButton}
                onClick={() => {
                  onOpenAddNoteDialog();
                }}
                aria-label={t("document.header.addAria")}
              >
                <AddCircleRegular className={styles.headerButtonIcon} />
                {t("document.header.add")}
              </button>
            </span>
          </Tooltip>
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
