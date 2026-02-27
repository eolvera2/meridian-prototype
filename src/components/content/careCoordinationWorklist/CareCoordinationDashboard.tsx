import { useState, useMemo, useEffect, type FC } from "react";
import { Switch } from "@fluentui/react-components";
import { useDashboardStyles } from "./CareCoordinationDashboard.styles";
import { useCareCoordinationWorklistContext } from "./CareCoordinationWorklistContext";
import type { TimeRange, SortColumn, SortDirection, TableRow } from "./careCoordination.constants";
import { PAGE_SIZE } from "./careCoordination.constants";
import { AdminDashboard } from "./components/AdminDashboard";
import { SummaryCounters } from "./components/SummaryCounters";
import { ContactListFilters } from "./components/ContactListFilters";
import { ContactListTable } from "./components/ContactListTable";

// ── Component ───────────────────────────────────────────────────────

export const CareCoordinationDashboard: FC = () => {
  const styles = useDashboardStyles();

  // ── State ──
  const [timeRange, setTimeRange] = useState<TimeRange>("30");
  const [statusFilter, setStatusFilter] = useState<string>("all-active");
  const [adminView, setAdminView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientSearch, setPatientSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn | null>("contactDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const {
    activeCallRecords,
    setSelectedPatientId,
    contactRecords,
    callTypeFilter,
    setCallTypeFilter,
  } = useCareCoordinationWorklistContext();

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(col);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // ── Derived data ──

  // Contact history — scheduled records (daysAgo === 0) are always included regardless of time range
  const filteredByTime = useMemo(
    () => contactRecords
      .filter((r) => (r.scheduled || r.daysAgo <= Number(timeRange)) && (callTypeFilter === "all" || r.callType === callTypeFilter))
      .sort((a, b) => a.daysAgo - b.daysAgo),
    [timeRange, contactRecords, callTypeFilter],
  );

  const needsReviewCount = filteredByTime.filter((r) => !r.reviewed && !r.scheduledForRetry && !r.scheduled).length;
  const inProgressCount = activeCallRecords.filter((r) => r.status === "in-progress").length;
  const retryCount = filteredByTime.filter((r) => r.scheduledForRetry).length;
  const scheduledCount = filteredByTime.filter((r) => r.scheduled).length;
  const reviewedCount =
    filteredByTime.filter((r) => r.reviewed).length +
    activeCallRecords.filter((r) => r.status === "reviewed").length;

  const displayedRecords = statusFilter === "needs-review"
    ? filteredByTime.filter((r) => !r.reviewed && !r.scheduledForRetry && !r.scheduled)
    : statusFilter === "scheduled-for-retry"
    ? filteredByTime.filter((r) => r.scheduledForRetry)
    : statusFilter === "scheduled"
    ? filteredByTime.filter((r) => r.scheduled)
    : statusFilter === "reviewed"
    ? filteredByTime.filter((r) => r.reviewed)
    : statusFilter === "all-active"
    ? filteredByTime.filter((r) => !r.reviewed)
    : filteredByTime;

  // Unique patient names for search dropdown
  const allPatientNames = useMemo(() => {
    const nameSet = new Set<string>();
    contactRecords.forEach((r) => nameSet.add(r.name));
    activeCallRecords.forEach((r) => nameSet.add(r.name));
    return Array.from(nameSet).sort();
  }, [contactRecords, activeCallRecords]);

  // Combine active call records with displayed records for pagination
  const allTableRecords: TableRow[] = useMemo(() => {
    const typeFiltered =
      callTypeFilter === "all"
        ? activeCallRecords
        : activeCallRecords.filter((r) => r.callType === callTypeFilter);

    const filteredActive = statusFilter === "needs-review"
      ? typeFiltered.filter((r) => r.status === "needs-review")
      : statusFilter === "in-progress"
        ? typeFiltered.filter((r) => r.status === "in-progress")
        : statusFilter === "scheduled-for-retry"
        ? []
        : statusFilter === "scheduled"
        ? typeFiltered.filter((r) => r.status === "scheduled")
        : statusFilter === "reviewed"
        ? typeFiltered.filter((r) => r.status === "reviewed")
        : statusFilter === "all-active"
        ? typeFiltered.filter((r) => r.status !== "reviewed")
        : typeFiltered;

    const activeRows: TableRow[] = filteredActive.map((r) => ({ type: "active", record: r }));
    const historyRows: TableRow[] = statusFilter === "in-progress"
      ? []
      : displayedRecords.map((r) => ({ type: "history", record: r }));

    const combined = [...activeRows, ...historyRows];
    let filtered = combined;
    if (patientSearch.trim()) {
      const searchLower = patientSearch.trim().toLowerCase();
      filtered = combined.filter((item) => item.record.name.toLowerCase().includes(searchLower));
    }

    // Apply sorting
    if (sortColumn) {
      const dir = sortDirection === "asc" ? 1 : -1;
      filtered.sort((a, b) => {
        const ra = a.record;
        const rb = b.record;
        let cmp = 0;
        if (sortColumn === "name") {
          cmp = ra.name.localeCompare(rb.name);
        } else if (sortColumn === "callType") {
          cmp = (ra.callType || "").localeCompare(rb.callType || "");
        } else if (sortColumn === "contactDate") {
          const aEmpty = ra.contactDate === "--" || !ra.contactDate;
          const bEmpty = rb.contactDate === "--" || !rb.contactDate;
          if (aEmpty && !bEmpty) return 1;
          if (!aEmpty && bEmpty) return -1;
          if (aEmpty && bEmpty) return 0;
          const aDays = "daysAgo" in ra ? ra.daysAgo : 0;
          const bDays = "daysAgo" in rb ? rb.daysAgo : 0;
          cmp = (bDays as number) - (aDays as number);
        } else if (sortColumn === "followUp") {
          cmp = ra.followUp.value.localeCompare(rb.followUp.value);
        } else if (sortColumn === "status") {
          const sa = "status" in ra ? String(ra.status) : "";
          const sb = "status" in rb ? String(rb.status) : "";
          cmp = sa.localeCompare(sb);
        }
        return cmp * dir;
      });
    }
    return filtered;
  }, [activeCallRecords, displayedRecords, statusFilter, callTypeFilter, patientSearch, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(allTableRecords.length / PAGE_SIZE));
  const paginatedRecords = allTableRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, patientSearch]);

  // ── Render ──

  return (
    <div className={styles.root}>
      <div className={styles.adminToggleRow}>
        <Switch
          checked={adminView}
          onChange={(_, data) => setAdminView(data.checked)}
          label="Admin view"
          labelPosition="before"
        />
      </div>

      {adminView && (
        <AdminDashboard
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          callTypeFilter={callTypeFilter}
          setCallTypeFilter={setCallTypeFilter}
          setCurrentPage={setCurrentPage}
        />
      )}

      {!adminView && (
        <div className={styles.historySection}>
          <div className={styles.historyHeaderRow}>
            <div>
              <div className={styles.historyTitle}>Patient Contact List</div>
              <div className={styles.historySubtitle}>
                Review ongoing patient contacts and work on those ready to be reviewed
              </div>
            </div>
            <div className={styles.headerActionsRight}>
              <SummaryCounters
                total={filteredByTime.length}
                needsReviewCount={needsReviewCount}
                inProgressCount={inProgressCount}
                reviewedCount={reviewedCount}
                scheduledCount={scheduledCount}
                retryCount={retryCount}
              />
            </div>
          </div>

          <ContactListFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            callTypeFilter={callTypeFilter}
            setCallTypeFilter={setCallTypeFilter}
            patientSearch={patientSearch}
            setPatientSearch={setPatientSearch}
            allPatientNames={allPatientNames}
            setCurrentPage={setCurrentPage}
          />

          <ContactListTable
            paginatedRecords={paginatedRecords}
            totalRecordCount={allTableRecords.length}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSort={handleSort}
            setSelectedPatientId={setSelectedPatientId}
          />
        </div>
      )}
    </div>
  );
};

