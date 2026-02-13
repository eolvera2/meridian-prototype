import React, { useState, useMemo } from "react";
import {
  Dropdown,
  Option,
  Checkbox,
  Button,
} from "@fluentui/react-components";
import type { OptionOnSelectData } from "@fluentui/react-components";
import {
  People20Regular,
  Call20Regular,
  Warning20Regular,
  ArrowSync16Regular,
  Checkmark16Regular,
} from "@fluentui/react-icons";
import { useDashboardStyles } from "./MedicationAdherenceDashboard.styles";

interface ContactRecord {
  id: string;
  name: string;
  contactDate: string;
  contactTime: string;
  daysAgo: number;
  phone: string;
  pickedUpMeds: string;
  takingAsRx: { value: string; warning: boolean };
  sideEffects: { value: string; warning: boolean };
  followUp: { value: string; warning: boolean };
  reviewed: boolean;
}

const CONTACT_RECORDS: ContactRecord[] = [
  {
    id: "cr-1",
    name: "Michael Chen",
    contactDate: "Feb 5, 2026",
    contactTime: "6:09 AM",
    daysAgo: 8,
    phone: "(555) 234-5678",
    pickedUpMeds: "Yes",
    takingAsRx: { value: "No", warning: true },
    sideEffects: { value: "Reported", warning: true },
    followUp: { value: "Yes", warning: true },
    reviewed: true,
  },
  {
    id: "cr-2",
    name: "Patricia Martinez",
    contactDate: "Feb 6, 2026",
    contactTime: "7:30 PM",
    daysAgo: 7,
    phone: "(256) 431-7337",
    pickedUpMeds: "Yes",
    takingAsRx: { value: "Yes", warning: false },
    sideEffects: { value: "None", warning: false },
    followUp: { value: "Not needed", warning: false },
    reviewed: true,
  },
  {
    id: "cr-3",
    name: "Sarah Johnson",
    contactDate: "Jan 28, 2026",
    contactTime: "10:15 AM",
    daysAgo: 16,
    phone: "(312) 555-0198",
    pickedUpMeds: "No",
    takingAsRx: { value: "No", warning: true },
    sideEffects: { value: "None", warning: false },
    followUp: { value: "Yes", warning: true },
    reviewed: false,
  },
  {
    id: "cr-4",
    name: "Robert Kim",
    contactDate: "Jan 20, 2026",
    contactTime: "2:45 PM",
    daysAgo: 24,
    phone: "(415) 555-0342",
    pickedUpMeds: "Yes",
    takingAsRx: { value: "Yes", warning: false },
    sideEffects: { value: "Reported", warning: true },
    followUp: { value: "Yes", warning: true },
    reviewed: true,
  },
  {
    id: "cr-5",
    name: "Linda Nguyen",
    contactDate: "Jan 15, 2026",
    contactTime: "9:00 AM",
    daysAgo: 29,
    phone: "(650) 555-0477",
    pickedUpMeds: "Yes",
    takingAsRx: { value: "Yes", warning: false },
    sideEffects: { value: "None", warning: false },
    followUp: { value: "Not needed", warning: false },
    reviewed: true,
  },
  {
    id: "cr-6",
    name: "James Wilson",
    contactDate: "Dec 20, 2025",
    contactTime: "11:30 AM",
    daysAgo: 55,
    phone: "(206) 555-0613",
    pickedUpMeds: "Yes",
    takingAsRx: { value: "No", warning: true },
    sideEffects: { value: "Reported", warning: true },
    followUp: { value: "Yes", warning: true },
    reviewed: true,
  },
  {
    id: "cr-7",
    name: "Maria Garcia",
    contactDate: "Dec 10, 2025",
    contactTime: "4:20 PM",
    daysAgo: 65,
    phone: "(713) 555-0829",
    pickedUpMeds: "No",
    takingAsRx: { value: "No", warning: true },
    sideEffects: { value: "None", warning: false },
    followUp: { value: "Yes", warning: true },
    reviewed: false,
  },
  {
    id: "cr-8",
    name: "David Thompson",
    contactDate: "Nov 25, 2025",
    contactTime: "8:00 AM",
    daysAgo: 80,
    phone: "(503) 555-0156",
    pickedUpMeds: "Yes",
    takingAsRx: { value: "Yes", warning: false },
    sideEffects: { value: "None", warning: false },
    followUp: { value: "Not needed", warning: false },
    reviewed: true,
  },
];

type TimeRange = "7" | "30" | "90";

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
};

export const MedicationAdherenceDashboard: React.FC = () => {
  const styles = useDashboardStyles();
  const [showUnreviewedOnly, setShowUnreviewedOnly] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("30");

  const filteredByTime = useMemo(
    () => CONTACT_RECORDS.filter((r) => r.daysAgo <= Number(timeRange)),
    [timeRange]
  );

  const stats = useMemo(() => {
    const uniquePatients = new Set(filteredByTime.map((r) => r.name)).size;
    const totalContacts = filteredByTime.length;
    const phoneCalls = filteredByTime.length;
    const followUpNeeded = filteredByTime.filter(
      (r) => r.followUp.warning
    ).length;
    return { totalPatients: uniquePatients, totalContacts, phoneCalls, followUpNeeded };
  }, [filteredByTime]);

  const needsReviewCount = filteredByTime.filter((r) => !r.reviewed).length;
  const completedCount = filteredByTime.filter((r) => r.reviewed).length;

  const displayedRecords = showUnreviewedOnly
    ? filteredByTime.filter((r) => !r.reviewed)
    : filteredByTime;

  const handleTimeRangeChange = (_: unknown, data: OptionOnSelectData) => {
    if (data.optionValue) {
      setTimeRange(data.optionValue as TimeRange);
    }
  };

  return (
    <div className={styles.root}>
      {/* Dashboard Header */}
      <div>
        <div className={styles.dashboardHeader}>
          <div className={styles.title}>Medication Adherence Dashboard</div>
          <div className={styles.subtitle}>
            Monitor patient outreach and medication compliance
          </div>
        </div>

        <div className={styles.timeRangeRow}>
          <span className={styles.timeRangeLabel}>Time Range</span>
          <Dropdown
            value={TIME_RANGE_LABELS[timeRange]}
            selectedOptions={[timeRange]}
            onOptionSelect={handleTimeRangeChange}
            style={{ minWidth: "160px" }}
          >
            <Option value="7">Last 7 days</Option>
            <Option value="30">Last 30 days</Option>
            <Option value="90">Last 90 days</Option>
          </Dropdown>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Total Patients</span>
            <People20Regular className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalPatients}</div>
          <div className={styles.statDescription}>
            Unique patients contacted
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Total Contacts</span>
            <Call20Regular className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.totalContacts}</div>
          <div className={styles.statDescription}>All interactions</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Phone Calls</span>
            <Call20Regular className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.phoneCalls}</div>
          <div className={styles.statDescription}>Voice contacts</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Follow-up Needed</span>
            <Warning20Regular className={styles.statIcon} />
          </div>
          <div className={styles.statValue}>{stats.followUpNeeded}</div>
          <div className={styles.statDescription}>
            Patients requiring attention
          </div>
        </div>
      </div>

      {/* Patient Contact History */}
      <div className={styles.historySection}>
        <div className={styles.historyHeader}>
          <div className={styles.historyTitle}>Patient Contact History</div>
          <div className={styles.historySubtitle}>
            Review past patient contacts and mark them as reviewed
          </div>
        </div>

        <div className={styles.summaryCounts}>
          <span>
            Total: <strong>{filteredByTime.length}</strong>
          </span>
          <span>
            Needs Review:
            <span
              className={`${styles.countBadge} ${styles.countBadgeReview}`}
            >
              {needsReviewCount}
            </span>
          </span>
          <span>
            Completed:
            <span
              className={`${styles.countBadge} ${styles.countBadgeCompleted}`}
            >
              {completedCount}
            </span>
          </span>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Contact Status</span>
            <Dropdown defaultValue="All Statuses">
              <Option value="all">All Statuses</Option>
              <Option value="reviewed">Reviewed</Option>
              <Option value="needs-review">Needs Review</Option>
            </Dropdown>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Date Range</span>
            <Dropdown
              value={TIME_RANGE_LABELS[timeRange]}
              selectedOptions={[timeRange]}
              onOptionSelect={handleTimeRangeChange}
              style={{ minWidth: "160px" }}
            >
              <Option value="7">Last 7 Days</Option>
              <Option value="30">Last 30 Days</Option>
              <Option value="90">Last 90 Days</Option>
            </Dropdown>
          </div>
          <div className={styles.filterActions}>
            <Checkbox
              label="Show Unreviewed Only"
              checked={showUnreviewedOnly}
              onChange={(_, data) =>
                setShowUnreviewedOnly(data.checked === true)
              }
            />
            <Button
              appearance="subtle"
              icon={<ArrowSync16Regular />}
              aria-label="Refresh contact history"
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Patient Name</th>
              <th className={styles.tableHeader}>Contact Date</th>
              <th className={styles.tableHeader}>Phone Number</th>
              <th className={styles.tableHeader}>Picked Up Meds</th>
              <th className={styles.tableHeader}>Taking As Rx</th>
              <th className={styles.tableHeader}>Side Effects</th>
              <th className={styles.tableHeader}>Follow-up</th>
              <th className={styles.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {displayedRecords.map((record) => (
              <tr key={record.id}>
                <td className={styles.tableCell}>
                  <span className={styles.patientLink}>{record.name}</span>
                </td>
                <td className={styles.tableCell}>
                  {record.contactDate}
                  <br />
                  <span style={{ color: "var(--colorNeutralForeground3)" }}>
                    {record.contactTime}
                  </span>
                </td>
                <td className={styles.tableCell}>{record.phone}</td>
                <td className={styles.tableCell}>{record.pickedUpMeds}</td>
                <td className={styles.tableCell}>
                  {record.takingAsRx.warning ? (
                    <span className={styles.warningText}>
                      ⚠ {record.takingAsRx.value}
                    </span>
                  ) : (
                    <span className={styles.normalText}>
                      {record.takingAsRx.value}
                    </span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {record.sideEffects.warning ? (
                    <span className={styles.warningText}>
                      ⚠ {record.sideEffects.value}
                    </span>
                  ) : (
                    <span className={styles.normalText}>
                      {record.sideEffects.value}
                    </span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {record.followUp.warning ? (
                    <span className={styles.warningText}>
                      ⚠ {record.followUp.value}
                    </span>
                  ) : (
                    <span className={styles.normalText}>
                      {record.followUp.value}
                    </span>
                  )}
                </td>
                <td className={styles.tableCell}>
                  {record.reviewed && (
                    <span className={styles.reviewedBadge}>
                      <Checkmark16Regular /> Reviewed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
