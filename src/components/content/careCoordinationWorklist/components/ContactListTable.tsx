import type { FC } from "react";
import {
  mergeClasses,
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
} from "@fluentui/react-icons";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import type { CallRecordStatus, ContactRecord } from "../CareCoordinationWorklistContext";
import type { CallType } from "../CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "../CareCoordinationWorklist.types";
import type { SortColumn, SortDirection, TableRow } from "../careCoordination.constants";
import { PAGE_SIZE } from "../careCoordination.constants";
import {
  OutcomeIndicator,
  NeutralOutcomeIndicator,
  PainLevelIndicator,
  NeutralPainIndicator,
  SortIcon,
} from "./OutcomeIndicators";

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

  // ── Render outcomes for a record ──

  const renderOutcomes = (item: TableRow) => {
    if (item.type === "active") {
      const record = item.record;
      if (record.status === "in-progress" || record.status === "scheduled-for-retry" || record.status === "scheduled") {
        return (
          <>
            <NeutralOutcomeIndicator label="Picked up meds" />
            <NeutralOutcomeIndicator label="Taking as Rx" />
            <NeutralOutcomeIndicator label="Side effects" />
            <NeutralPainIndicator />
          </>
        );
      }
    }

    const record = item.record;

    // History rows with no prior call show pending
    if (item.type === "history" && record.contactDate === "--") {
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

  const renderHistoryStatus = (record: ContactRecord) => (
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
              Patient Name <SortIcon column="name" sortColumn={sortColumn} sortDirection={sortDirection} />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("mrn")}>
              MRN <SortIcon column="mrn" sortColumn={sortColumn} sortDirection={sortDirection} />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("callType")}>
              Call Type <SortIcon column="callType" sortColumn={sortColumn} sortDirection={sortDirection} />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("contactDate")}>
              Contact Date <SortIcon column="contactDate" sortColumn={sortColumn} sortDirection={sortDirection} />
            </th>
            <th className={styles.tableHeader}>Outcomes</th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("followUp")}>
              Follow-up <SortIcon column="followUp" sortColumn={sortColumn} sortDirection={sortDirection} />
            </th>
            <th className={mergeClasses(styles.tableHeader, styles.sortableHeader)} onClick={() => handleSort("status")}>
              Status <SortIcon column="status" sortColumn={sortColumn} sortDirection={sortDirection} />
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedRecords.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyState}>
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
                  {(record.mrn || "—").replace(/^MRN/i, "")}
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
                    <span className={getStatusPillClass(item.record.status)}>
                      {item.record.status === "in-progress" && <Timer16Regular />}
                      {item.record.status === "needs-review" && <Checkmark16Regular />}
                      {item.record.status === "completed" && <Checkmark16Regular />}
                      {item.record.status === "scheduled-for-retry" && <HourglassRegular />}
                      {item.record.status === "reviewed" && <Checkmark16Regular />}
                      {item.record.status === "scheduled" && <HourglassRegular />}
                      {getStatusLabel(item.record.status)}
                    </span>
                  ) : (
                    renderHistoryStatus(item.record)
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
