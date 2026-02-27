import type { FC } from "react";
import {
  mergeClasses,
  Tooltip,
  Button,
} from "@fluentui/react-components";
import {
  Checkmark16Regular,
  Timer16Regular,
  HourglassRegular,
  Warning16Regular,
  Warning16Filled,
  ArrowLeft16Regular,
  ArrowRight16Regular,
  ShoppingBagCheckmark20Regular,
  ShoppingBagDismiss20Filled,
  ClipboardCheckmark20Regular,
  ClipboardError20Filled,
  ChatMultipleCheckmark20Regular,
  ChatMultipleMinus20Filled,
  ShoppingBag20Regular,
  Clipboard20Regular,
  ChatMultiple20Regular,
  NumberCircle020Regular,
  DocumentCheckmark20Regular,
  DocumentDismiss20Filled,
  LeafOne20Regular,
  LeafThree20Filled,
  HeartPulseCheckmark20Regular,
  HeartPulseWarning20Filled,
  BookPulse20Regular,
  BookDismiss20Filled,
  FlagCheckered20Regular,
  FlagOff20Filled,
  ArrowSort16Regular,
  ArrowSortUp16Filled,
  ArrowSortDown16Filled,
  History20Regular,
  HistoryDismiss20Filled,
  Emoji20Regular,
  EmojiAngry20Filled,
} from "@fluentui/react-icons";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import type { CallRecordStatus } from "../CareCoordinationWorklistContext";
import type { CallType } from "../CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "../CareCoordinationWorklist.types";
import type { SortColumn, SortDirection, TableRow } from "../careCoordination.constants";
import { CC_COLORS, PAGE_SIZE } from "../careCoordination.constants";

// ── Props ───────────────────────────────────────────────────────────

interface ContactListTableProps {
  paginatedRecords: TableRow[];
  totalRecordCount: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  handleSort: (col: SortColumn) => void;
  setSelectedPatientId: (id: string) => void;
}

// ── Outcome icon helpers ────────────────────────────────────────────

const getOutcomeIcon = (label: string, isWarning: boolean) => {
  switch (label) {
    case "Picked up meds":
      return isWarning ? <ShoppingBagDismiss20Filled aria-hidden="true" /> : <ShoppingBagCheckmark20Regular aria-hidden="true" />;
    case "Taking as Rx":
      return isWarning ? <ClipboardError20Filled aria-hidden="true" /> : <ClipboardCheckmark20Regular aria-hidden="true" />;
    case "Side effects":
      return isWarning ? <ChatMultipleMinus20Filled aria-hidden="true" /> : <ChatMultipleCheckmark20Regular aria-hidden="true" />;
    case "Intake Complete":
      return isWarning ? <DocumentDismiss20Filled aria-hidden="true" /> : <DocumentCheckmark20Regular aria-hidden="true" />;
    case "Allergies Confirmed":
      return isWarning ? <LeafThree20Filled aria-hidden="true" /> : <LeafOne20Regular aria-hidden="true" />;
    case "Red Flag":
      return isWarning ? <BookDismiss20Filled aria-hidden="true" /> : <BookPulse20Regular aria-hidden="true" />;
    case "BP Reading":
      return isWarning ? <HeartPulseWarning20Filled aria-hidden="true" /> : <HeartPulseCheckmark20Regular aria-hidden="true" />;
    case "BP at Goal":
      return isWarning ? <FlagOff20Filled aria-hidden="true" /> : <FlagCheckered20Regular aria-hidden="true" />;
    case "Med Adherence":
      return isWarning ? <HistoryDismiss20Filled aria-hidden="true" /> : <History20Regular aria-hidden="true" />;
    case "Escalated":
      return isWarning ? <EmojiAngry20Filled aria-hidden="true" /> : <Emoji20Regular aria-hidden="true" />;
    default:
      return isWarning ? <ShoppingBagDismiss20Filled aria-hidden="true" /> : <ShoppingBagCheckmark20Regular aria-hidden="true" />;
  }
};

const getNeutralIcon = (label: string) => {
  switch (label) {
    case "Picked up meds": return <ShoppingBag20Regular aria-hidden="true" />;
    case "Taking as Rx": return <Clipboard20Regular aria-hidden="true" />;
    case "Side effects": return <ChatMultiple20Regular aria-hidden="true" />;
    default: return <ShoppingBag20Regular aria-hidden="true" />;
  }
};

const getStatusLabel = (status: CallRecordStatus) => {
  switch (status) {
    case "in-progress": return "In Progress";
    case "needs-review": return "Ready for Review";
    case "completed": return "Completed";
    case "scheduled-for-retry": return "Scheduled for Retry";
    case "reviewed": return "Reviewed";
    case "scheduled": return "Scheduled";
  }
};

// ── Component ───────────────────────────────────────────────────────

export const ContactListTable: FC<ContactListTableProps> = ({
  paginatedRecords,
  totalRecordCount,
  currentPage,
  totalPages,
  setCurrentPage,
  sortColumn,
  sortDirection,
  handleSort,
  setSelectedPatientId,
}) => {
  const styles = useDashboardStyles();

  // ── Status / outcome sub-components (closures over styles) ──

  const getStatusPillClass = (status: CallRecordStatus) => {
    switch (status) {
      case "in-progress": return styles.statusPillInProgress;
      case "needs-review": return styles.statusPillNeedsReview;
      case "completed": return styles.statusPillCompleted;
      case "scheduled-for-retry": return styles.statusPillRetry;
      case "reviewed": return styles.statusPillReviewed;
      case "scheduled": return styles.statusPillScheduled;
    }
  };

  const getPainClass = (level: number) => {
    if (level === 0) return styles.outcomeGood;
    if (level <= 3) return styles.outcomeYellow;
    if (level <= 6) return styles.outcomeOrange;
    return level >= 7 ? styles.outcomeBadFilled : styles.outcomeBad;
  };

  const SortIcon: FC<{ column: SortColumn }> = ({ column }) => {
    if (sortColumn === column) {
      return sortDirection === "asc"
        ? <ArrowSortUp16Filled className={styles.sortIcon} />
        : <ArrowSortDown16Filled className={styles.sortIcon} />;
    }
    return <ArrowSort16Regular className={styles.sortIconInactive} />;
  };

  const OutcomeIndicator: FC<{ label: string; value: string; isWarning: boolean }> = ({ label, value, isWarning }) => (
    <Tooltip content={`${label}: ${value}`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, isWarning ? styles.outcomeBad : styles.outcomeGood)}>
        {getOutcomeIcon(label, isWarning)}
      </span>
    </Tooltip>
  );

  const NeutralOutcomeIndicator: FC<{ label: string }> = ({ label }) => (
    <Tooltip content={`${label}: Pending`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, styles.outcomeNeutralIcon)}>
        {getNeutralIcon(label)}
      </span>
    </Tooltip>
  );

  const PainLevelIndicator: FC<{ level: number }> = ({ level }) => {
    const clamped = Math.max(0, Math.min(10, level));
    return (
      <Tooltip content={`Pain level: ${clamped}/10`} relationship="label">
        <span className={mergeClasses(styles.outcomeIcon, getPainClass(clamped))}>
          {clamped}
        </span>
      </Tooltip>
    );
  };

  const NeutralPainIndicator: FC = () => (
    <Tooltip content="Pain level: Pending" relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, styles.outcomeNeutralIcon)}>
        <NumberCircle020Regular aria-hidden="true" />
      </span>
    </Tooltip>
  );

  // ── Render outcomes for a record ──

  const renderOutcomes = (item: TableRow) => {
    const record = item.record;
    const isPending = item.type === "active"
      ? (record.status === "in-progress" || record.status === "scheduled-for-retry" || record.status === "scheduled")
      : (record.contactDate === "--");

    if (isPending) {
      return (
        <>
          <NeutralOutcomeIndicator label="Picked up meds" />
          <NeutralOutcomeIndicator label="Taking as Rx" />
          <NeutralOutcomeIndicator label="Side effects" />
          <NeutralPainIndicator />
        </>
      );
    }

    if (record.callType === "patient-intake") {
      return (
        <>
          <OutcomeIndicator label="Intake Complete" value={record.intakeCompleted?.value ?? "No"} isWarning={record.intakeCompleted?.warning ?? true} />
          <OutcomeIndicator label="Allergies Confirmed" value={record.allergiesConfirmed ?? "No"} isWarning={!record.allergiesConfirmed} />
          {record.redFlag && <OutcomeIndicator label="Red Flag" value={record.redFlag.value} isWarning={record.redFlag.warning} />}
        </>
      );
    }

    if (record.callType === "hypertension-management") {
      return (
        <>
          {record.bpReading && <OutcomeIndicator label="BP Reading" value={typeof record.bpReading === "string" ? record.bpReading : `${record.bpReading.systolic}/${record.bpReading.diastolic}`} isWarning={record.bpAtGoal?.warning ?? false} />}
          <OutcomeIndicator label="BP at Goal" value={record.bpAtGoal?.value ?? "No"} isWarning={record.bpAtGoal?.warning ?? true} />
          <OutcomeIndicator label="Med Adherence" value={record.medAdherence?.value ?? "No"} isWarning={record.medAdherence?.warning ?? true} />
          {record.escalated && <OutcomeIndicator label="Escalated" value={record.escalated.value} isWarning={record.escalated.warning} />}
        </>
      );
    }

    // Default: medication adherence
    return (
      <>
        <OutcomeIndicator label="Picked up meds" value={record.pickedUpMeds} isWarning={record.pickedUpMeds !== "Yes"} />
        <OutcomeIndicator label="Taking as Rx" value={record.takingAsRx.value} isWarning={record.takingAsRx.warning} />
        <OutcomeIndicator label="Side effects" value={record.sideEffects.value} isWarning={record.sideEffects.warning} />
        <PainLevelIndicator level={record.painLevel} />
      </>
    );
  };

  // ── Render status cell for history rows ──

  const renderHistoryStatus = (record: TableRow extends { type: "history"; record: infer R } ? R : never) => (
    <div>
      <div className={styles.statusCellInner}>
        {record.scheduled ? (
          <span className={styles.statusPillScheduled}>
            <HourglassRegular /> Scheduled
          </span>
        ) : record.scheduledForRetry ? (
          <span className={styles.statusPillRetry}>
            <HourglassRegular /> Scheduled for Retry
          </span>
        ) : record.reviewed ? (
          <span className={styles.statusPillReviewed}>
            <Checkmark16Regular /> Reviewed
          </span>
        ) : (
          <span className={styles.statusPillNeedsReview}>
            <Checkmark16Regular /> Ready for Review
          </span>
        )}
      </div>
      {record.statusUrgencyNote && (
        <div className={styles.urgencyNoteText}>
          <Warning16Filled className={styles.urgencyNoteIcon} aria-hidden="true" />
          {record.statusUrgencyNote}
        </div>
      )}
    </div>
  );

  return (
    <>
      <table className={styles.table} aria-label="Patient contact history">
        <thead>
          <tr>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("name")}>
              Patient Name <SortIcon column="name" />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("callType")}>
              Call Type <SortIcon column="callType" />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("contactDate")}>
              Contact Date <SortIcon column="contactDate" />
            </th>
            <th className={styles.tableHeader}>Outcomes</th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("followUp")}>
              Follow-up <SortIcon column="followUp" />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("status")}>
              Status <SortIcon column="status" />
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedRecords.length === 0 && (
            <tr>
              <td colSpan={6} className={styles.emptyState}>
                No contact records found for the selected time range.
              </td>
            </tr>
          )}
          {paginatedRecords.map((item) => {
            const record = item.record;
            const isUrgencyRow = item.type === "history" && "statusUrgencyNote" in record && record.statusUrgencyNote;
            return (
              <tr
                key={record.id}
                className={mergeClasses(styles.tableRow, isUrgencyRow ? styles.urgencyRowBg : undefined)}
              >
                <td className={styles.tableCell}>
                  <span
                    className={styles.patientLink}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedPatientId(record.patientId)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedPatientId(record.patientId); }}
                  >
                    {record.name}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.callTypePillSmall} ${styles[`callType_${(record.callType || "medication-adherence").replace(/-/g, "_")}` as keyof typeof styles] || ""}`}>
                    {CALL_TYPE_LABELS[(record.callType || "medication-adherence") as CallType]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {record.contactDate}
                  {record.contactTime && (
                    <>
                      <br />
                      <span className={styles.contactTimeSubtext}>
                        {record.contactTime}
                      </span>
                    </>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.outcomesCell}>
                    {renderOutcomes(item)}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  {record.followUp.warning ? (
                    <span className={styles.warningText} role="alert">
                      <Warning16Regular aria-hidden="true" /> {record.followUp.value}
                    </span>
                  ) : (
                    <span className={styles.normalText}>
                      {record.followUp.value}
                    </span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {item.type === "active" ? (
                    <span className={getStatusPillClass(record.status)}>
                      {record.status === "in-progress" && <Timer16Regular />}
                      {record.status === "needs-review" && <Checkmark16Regular />}
                      {record.status === "completed" && <Checkmark16Regular />}
                      {record.status === "scheduled-for-retry" && <HourglassRegular />}
                      {record.status === "reviewed" && <Checkmark16Regular />}
                      {record.status === "scheduled" && <HourglassRegular />}
                      {getStatusLabel(record.status)}
                    </span>
                  ) : (
                    renderHistoryStatus(record as Parameters<typeof renderHistoryStatus>[0])
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {totalRecordCount > PAGE_SIZE && (
        <div className={styles.paginationRow}>
          <span className={styles.paginationInfo}>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalRecordCount)} of {totalRecordCount}
          </span>
          <div className={styles.paginationControls}>
            <Button
              appearance="subtle"
              size="small"
              icon={<ArrowLeft16Regular />}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            />
            <span className={styles.paginationInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              appearance="subtle"
              size="small"
              icon={<ArrowRight16Regular />}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            />
          </div>
        </div>
      )}
    </>
  );
};
