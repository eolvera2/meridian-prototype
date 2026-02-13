/**
 * DeleteDocumentDialog Component
 *
 * A confirmation dialog for deleting documents.
 */

import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  tokens,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import { useI18n } from "../../../../i18n/I18nContext";

export interface DeleteDocumentDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Name of the document to delete */
  documentName: string | undefined;
  /** Called when the dialog is cancelled */
  onCancel: () => void;
  /** Called when delete is confirmed */
  onConfirm: () => void;
}

export const DeleteDocumentDialog: React.FC<DeleteDocumentDialogProps> = ({
  open,
  documentName,
  onCancel,
  onConfirm,
}) => {
  const { t } = useI18n();
  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) {
          onCancel();
        }
      }}
    >
      <DialogSurface className="dialog-surface-standard">
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                aria-label={t("common.close")}
                icon={<Dismiss24Regular />}
                onClick={onCancel}
                style={{
                  minWidth: "auto",
                  padding: "var(--spacing-small-4)",
                }}
              />
            }
            style={{
              fontSize: tokens.fontSizeBase500,
              fontWeight: 600,
              lineHeight: "28px",
              fontFamily: "'Segoe UI', sans-serif",
              marginBottom: "var(--spacing-xxlarge)",
            }}
          >
            {t("document.deleteDialog.title")}
          </DialogTitle>
          <DialogContent
            style={{
              fontSize: tokens.fontSizeBase300,
              fontWeight: 400,
              lineHeight: "20px",
              fontFamily: "'Segoe UI', sans-serif",
              marginBottom: "var(--spacing-huge)",
            }}
          >
            {t("document.deleteDialog.bodyPrefix")} "{documentName}"
            {t("document.deleteDialog.bodySuffix")}
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--gap-large)",
            }}
          >
            <Button appearance="secondary" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
            <Button appearance="primary" onClick={onConfirm}>
              {t("common.delete")}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
