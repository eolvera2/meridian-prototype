import React from "react";
import { Button } from "@fluentui/react-components";
import {
  Script24Regular,
  ClipboardCheckmark20Regular,
} from "@fluentui/react-icons";
import { usePatientDetailStyles } from "../CareCoordinationPatientDetail.styles";
import type { ContactHistoryEntry as ContactHistoryEntryType, CallType } from "../CareCoordinationWorklist.types";
import type { TooltipHandlers } from "../../tooltip/TooltipContext";
import { OutcomeGrid } from "./OutcomeGrid";

/** Durations that cycle per contact-history index. */
const CALL_DURATIONS = [7, 5, 4, 6, 3];

export interface ContactHistoryEntryProps {
  entry: ContactHistoryEntryType;
  index: number;
  callType: CallType;
  needsReview: boolean;
  editedNote: string | undefined;
  onNoteChange: (index: number, value: string) => void;
  onTranscriptOpen: () => void;
  onMarkReviewed: () => void;
  tooltipHandlers?: TooltipHandlers;
}

export const ContactHistoryEntryRow: React.FC<ContactHistoryEntryProps> = ({
  entry,
  index,
  callType,
  needsReview,
  editedNote,
  onNoteChange,
  onTranscriptOpen,
  onMarkReviewed,
  tooltipHandlers,
}) => {
  const styles = usePatientDetailStyles();
  const isFirst = index === 0;
  const showReview = isFirst && needsReview;

  return (
    <div
      className={`${styles.contactEntry}${showReview ? ` ${styles.needsReviewHighlight}` : ""}`}
      key={index}
    >
      {/* Date + call info + transcript link + Mark as Reviewed — single row */}
      <div className={styles.contactHeaderRow}>
        <span className={`${styles.contactDate} ${styles.contactDateSpacing}`}>{entry.date}</span>
        <span className={styles.contactMetaText}>
          Call date/time: {entry.date} · Duration: {CALL_DURATIONS[index % CALL_DURATIONS.length]} min
        </span>
        {entry.transcriptLink && (
          <span className={`${styles.transcriptLink} ${styles.transcriptLinkSpacing}`} onClick={onTranscriptOpen}>
            <Script24Regular className={styles.transcriptSmallIcon} />
            View AI Call Transcript
          </span>
        )}
        {showReview && (
          <Button
            appearance="primary"
            size="small"
            icon={<ClipboardCheckmark20Regular />}
            className={styles.reviewButtonAuto}
            onClick={onMarkReviewed}
          >
            Mark as Reviewed
          </Button>
        )}
      </div>

      {/* Transcript summary */}
      {entry.transcriptSummary && (
        <div className={styles.contactSummary}>
          {entry.transcriptSummary}
          <div className={styles.aiDisclaimer}>
            AI-generated content may be incorrect
          </div>
        </div>
      )}

      {/* Outcome grid — branched by call type */}
      <OutcomeGrid entry={entry} callType={callType} />

      {/* Notes — editable */}
      <div>
        <div className={styles.notesLabel}>NOTES</div>
        <textarea
          value={editedNote ?? entry.notes ?? ""}
          onChange={(e) => onNoteChange(index, e.target.value)}
          className={styles.notesTextarea}
          onFocus={(e) => tooltipHandlers?.onFocus(e as unknown as React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onBlur={(e) => tooltipHandlers?.onBlur(e as unknown as React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onMouseEnter={(e) => tooltipHandlers?.onMouseEnter(e as unknown as React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onMouseMove={(e) => tooltipHandlers?.onMouseMove(e as unknown as React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onMouseLeave={(e) => tooltipHandlers?.onMouseLeave(e as unknown as React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onClick={(e) => tooltipHandlers?.onClick(e as unknown as React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onKeyDown={(e) => tooltipHandlers?.onKeyDown(e as unknown as React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>)}
          onKeyUp={(e) => tooltipHandlers?.onKeyUp(e as unknown as React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>)}
        />
      </div>
    </div>
  );
};
