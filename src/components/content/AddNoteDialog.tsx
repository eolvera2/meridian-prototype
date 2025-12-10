import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { Dismiss24Regular, Checkmark12Regular } from "@fluentui/react-icons";

// Note type options
const NOTE_TYPES = [
  { id: "note", label: "Well visit" },
  { id: "orders", label: "Annual" },
  { id: "referral-letter", label: "Referral letter" },
  { id: "after-visit-summary", label: "After Visit Summary" },
];

const useStyles = makeStyles({
  dialogSurface: {
    width: "320px",
    maxWidth: "calc(100% - 32px)",
    padding: tokens.spacingHorizontalXXL,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    paddingRight: 0,
    flexShrink: 0,
  },
  titleText: {
    flex: 1,
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "28px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalL,
    overflowY: "auto",
    flexShrink: 1,
  },
  pill: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "20px",
    border: `1px solid #e0e0e0`,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "background-color 0.15s ease",
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  pillSelected: {
    backgroundColor: "#ebf3fc",
  },
  pillLabel: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    color: tokens.colorBrandForeground1,
    fontFamily: "'Segoe UI', sans-serif",
  },
  checkIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  dialogActions: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalM,
    flexShrink: 0,
  },
  actionButton: {
    width: "100%",
  },
});

export interface AddNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (selectedNoteTypes: string[]) => void;
}

export const AddNoteDialog: React.FC<AddNoteDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const styles = useStyles();
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());

  const handlePillClick = (noteId: string) => {
    setSelectedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const handleAdd = () => {
    if (selectedNotes.size > 0) {
      const selectedLabels = NOTE_TYPES.filter((note) =>
        selectedNotes.has(note.id)
      ).map((note) => note.label);
      onAdd(selectedLabels);
      setSelectedNotes(new Set());
    }
  };

  const handleClose = () => {
    setSelectedNotes(new Set());
    onClose();
  };

  const handleOpenChange = (_event: unknown, data: { open: boolean }) => {
    if (!data.open) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogSurface className={styles.dialogSurface}>
        <DialogBody>
          <DialogTitle
            className={styles.dialogTitle}
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={handleClose}
              />
            }
          >
            <span className={styles.titleText}>Select</span>
          </DialogTitle>

          <DialogContent className={styles.dialogContent}>
            {NOTE_TYPES.map((noteType) => {
              const isSelected = selectedNotes.has(noteType.id);
              return (
                <button
                  key={noteType.id}
                  className={`${styles.pill} ${
                    isSelected ? styles.pillSelected : ""
                  }`}
                  onClick={() => handlePillClick(noteType.id)}
                  type="button"
                >
                  <span className={styles.pillLabel}>{noteType.label}</span>
                  {isSelected && (
                    <Checkmark12Regular className={styles.checkIcon} />
                  )}
                </button>
              );
            })}
          </DialogContent>

          <DialogActions className={styles.dialogActions}>
            <Button
              appearance="primary"
              className={styles.actionButton}
              onClick={handleAdd}
              disabled={selectedNotes.size === 0}
            >
              Add
            </Button>
            <Button
              appearance="secondary"
              className={styles.actionButton}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default AddNoteDialog;
