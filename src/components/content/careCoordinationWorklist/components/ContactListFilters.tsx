import type { FC } from "react";
import {
  Dropdown,
  Option,
  Combobox,
  Button,
} from "@fluentui/react-components";
import { ArrowSync16Regular } from "@fluentui/react-icons";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import type { CallType } from "../CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "../CareCoordinationWorklist.types";

interface ContactListFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  callTypeFilter: "all" | CallType;
  setCallTypeFilter: (value: "all" | CallType) => void;
  patientSearch: string;
  setPatientSearch: (value: string) => void;
  allPatientNames: string[];
  setCurrentPage: (value: number) => void;
}

export const ContactListFilters: FC<ContactListFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  callTypeFilter,
  setCallTypeFilter,
  patientSearch,
  setPatientSearch,
  allPatientNames,
  setCurrentPage,
}) => {
  const styles = useDashboardStyles();

  return (
    <div className={styles.filtersRow}>
      <div className={styles.historyFilterGroup}>
        <span className={styles.filterLabel}>Contact Status</span>
        <Dropdown
          value={statusFilter === "all-active" ? "All Active Statuses" : statusFilter === "all" ? "All Statuses" : statusFilter === "in-progress" ? "In Progress" : statusFilter === "needs-review" ? "Ready for Review" : statusFilter === "scheduled" ? "Scheduled" : statusFilter === "scheduled-for-retry" ? "Scheduled for Retry" : statusFilter === "reviewed" ? "Reviewed" : "All Active Statuses"}
          selectedOptions={[statusFilter]}
          onOptionSelect={(_, data) => setStatusFilter(data.optionValue ?? "all-active")}
        >
          <Option value="all-active" text="All Active Statuses"><strong>All Active Statuses</strong></Option>
          <Option value="all">All Statuses</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="needs-review">Ready for Review</Option>
          <Option value="scheduled">Scheduled</Option>
          <Option value="scheduled-for-retry">Scheduled for Retry</Option>
          <Option value="reviewed">Reviewed</Option>
        </Dropdown>
      </div>
      <div className={styles.historyFilterGroup}>
        <span className={styles.filterLabel}>Call Type</span>
        <Dropdown
          value={callTypeFilter === "all" ? "All Types" : CALL_TYPE_LABELS[callTypeFilter]}
          selectedOptions={[callTypeFilter]}
          onOptionSelect={(_, data) => {
            setCallTypeFilter((data.optionValue ?? "all") as "all" | CallType);
            setCurrentPage(1);
          }}
        >
          <Option value="all">All Types</Option>
          <Option value="medication-adherence">{CALL_TYPE_LABELS["medication-adherence"]}</Option>
          <Option value="patient-intake">{CALL_TYPE_LABELS["patient-intake"]}</Option>
          <Option value="hypertension-management">{CALL_TYPE_LABELS["hypertension-management"]}</Option>
        </Dropdown>
      </div>
      <div className={styles.historyFilterGroup}>
        <span className={styles.filterLabel}>Patient Search</span>
        <Combobox
          placeholder="Search by name..."
          freeform
          value={patientSearch}
          onInput={(e) => { setPatientSearch((e.target as HTMLInputElement).value); }}
          onOptionSelect={(_, data) => { setPatientSearch(data.optionText ?? ""); }}
          style={{ minWidth: "180px" }}
        >
          {allPatientNames
            .filter((name) => !patientSearch || name.toLowerCase().includes(patientSearch.toLowerCase()))
            .map((name) => (
              <Option key={name} value={name}>{name}</Option>
            ))}
        </Combobox>
      </div>
      <div className={styles.filterActions}>
        <Button
          appearance="subtle"
          icon={<ArrowSync16Regular />}
          aria-label="Refresh contact history"
        />
      </div>
    </div>
  );
};
