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
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

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
  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) {
          onCancel();
        }
      }}
    >
      <DialogSurface style={{ maxWidth: "320px", padding: "24px" }}>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={onCancel}
                style={{
                  minWidth: "auto",
                  padding: "4px",
                }}
              />
            }
            style={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "28px",
              fontFamily: "'Segoe UI', sans-serif",
              marginBottom: "12px",
            }}
          >
            Delete document
          </DialogTitle>
          <DialogContent
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              fontFamily: "'Segoe UI', sans-serif",
              marginBottom: "24px",
            }}
          >
            Are you sure you want to delete "{documentName}"? This action cannot
            be undone.
          </DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <Button appearance="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button appearance="primary" onClick={onConfirm}>
              Delete
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
