import React, { useState, useMemo } from "react";
import {
  Dropdown,
  Option,
  Checkbox,
  Button,
  mergeClasses,
} from "@fluentui/react-components";
import type { OptionOnSelectData } from "@fluentui/react-components";
import {
  ArrowSync16Regular,
  Checkmark16Regular,
} from "@fluentui/react-icons";
import { useDashboardStyles } from "./MedicationAdherenceDashboard.styles";

// ── Data Types ──────────────────────────────────────────────

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

// ── Static Data ─────────────────────────────────────────────

const CONTACT_RECORDS: ContactRecord[] = [
  { id: "cr-1", name: "Michael Chen", contactDate: "Feb 5, 2026", contactTime: "6:09 AM", daysAgo: 8, phone: "(555) 234-5678", pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, followUp: { value: "Yes", warning: true }, reviewed: true },
  { id: "cr-2", name: "Patricia Martinez", contactDate: "Feb 6, 2026", contactTime: "7:30 PM", daysAgo: 7, phone: "(256) 431-7337", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, followUp: { value: "Not needed", warning: false }, reviewed: true },
  { id: "cr-3", name: "Sarah Johnson", contactDate: "Jan 28, 2026", contactTime: "10:15 AM", daysAgo: 16, phone: "(312) 555-0198", pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-4", name: "Robert Kim", contactDate: "Jan 20, 2026", contactTime: "2:45 PM", daysAgo: 24, phone: "(415) 555-0342", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "Reported", warning: true }, followUp: { value: "Yes", warning: true }, reviewed: true },
  { id: "cr-5", name: "Linda Nguyen", contactDate: "Jan 15, 2026", contactTime: "9:00 AM", daysAgo: 29, phone: "(650) 555-0477", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, followUp: { value: "Not needed", warning: false }, reviewed: true },
  { id: "cr-6", name: "James Wilson", contactDate: "Dec 20, 2025", contactTime: "11:30 AM", daysAgo: 55, phone: "(206) 555-0613", pickedUpMeds: "Yes", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "Reported", warning: true }, followUp: { value: "Yes", warning: true }, reviewed: true },
  { id: "cr-7", name: "Maria Garcia", contactDate: "Dec 10, 2025", contactTime: "4:20 PM", daysAgo: 65, phone: "(713) 555-0829", pickedUpMeds: "No", takingAsRx: { value: "No", warning: true }, sideEffects: { value: "None", warning: false }, followUp: { value: "Yes", warning: true }, reviewed: false },
  { id: "cr-8", name: "David Thompson", contactDate: "Nov 25, 2025", contactTime: "8:00 AM", daysAgo: 80, phone: "(503) 555-0156", pickedUpMeds: "Yes", takingAsRx: { value: "Yes", warning: false }, sideEffects: { value: "None", warning: false }, followUp: { value: "Not needed", warning: false }, reviewed: true },
];

type TimeRange = "7" | "30" | "90";

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
};

// Adherence trend data (weekly data points for each time range)
const TREND_DATA: Record<TimeRange, { label: string; adherence: number; missedDoses: number }[]> = {
  "7": [
    { label: "Mon", adherence: 85, missedDoses: 3 },
    { label: "Tue", adherence: 82, missedDoses: 4 },
    { label: "Wed", adherence: 88, missedDoses: 2 },
    { label: "Thu", adherence: 84, missedDoses: 3 },
    { label: "Fri", adherence: 90, missedDoses: 1 },
    { label: "Sat", adherence: 86, missedDoses: 3 },
    { label: "Sun", adherence: 87, missedDoses: 2 },
  ],
  "30": [
    { label: "Wk 1", adherence: 80, missedDoses: 6 },
    { label: "Wk 2", adherence: 83, missedDoses: 5 },
    { label: "Wk 3", adherence: 85, missedDoses: 4 },
    { label: "Wk 4", adherence: 87, missedDoses: 3 },
  ],
  "90": [
    { label: "Jan", adherence: 78, missedDoses: 8 },
    { label: "Feb", adherence: 80, missedDoses: 7 },
    { label: "Mar", adherence: 82, missedDoses: 6 },
    { label: "Apr", adherence: 79, missedDoses: 7 },
    { label: "May", adherence: 83, missedDoses: 5 },
    { label: "Jun", adherence: 85, missedDoses: 4 },
    { label: "Jul", adherence: 84, missedDoses: 4 },
    { label: "Aug", adherence: 86, missedDoses: 3 },
    { label: "Sep", adherence: 87, missedDoses: 3 },
    { label: "Oct", adherence: 85, missedDoses: 4 },
    { label: "Nov", adherence: 86, missedDoses: 3 },
    { label: "Dec", adherence: 87, missedDoses: 2 },
  ],
};

// Stats that change based on time range
const STATS_DATA: Record<TimeRange, { adherenceRate: number; adherenceTrend: number; patientsAtRisk: number; riskHigh: number; riskMed: number; riskLow: number; successfulContacts: number; followUpNeeded: number; followUpUrgent: number; followUpRoutine: number }> = {
  "7": { adherenceRate: 89, adherenceTrend: 3, patientsAtRisk: 8, riskHigh: 2, riskMed: 4, riskLow: 2, successfulContacts: 78, followUpNeeded: 3, followUpUrgent: 1, followUpRoutine: 2 },
  "30": { adherenceRate: 87, adherenceTrend: 4, patientsAtRisk: 12, riskHigh: 4, riskMed: 6, riskLow: 2, successfulContacts: 74, followUpNeeded: 5, followUpUrgent: 2, followUpRoutine: 3 },
  "90": { adherenceRate: 83, adherenceTrend: -2, patientsAtRisk: 18, riskHigh: 6, riskMed: 8, riskLow: 4, successfulContacts: 68, followUpNeeded: 9, followUpUrgent: 4, followUpRoutine: 5 },
};

// Outreach Effectiveness by channel
const OUTREACH_DATA: Record<TimeRange, { channel: string; rate: number; total: number }[]> = {
  "7": [
    { channel: "Phone", rate: 65, total: 20 },
    { channel: "SMS", rate: 52, total: 15 },
    { channel: "Portal", rate: 73, total: 11 },
  ],
  "30": [
    { channel: "Phone", rate: 62, total: 85 },
    { channel: "SMS", rate: 48, total: 64 },
    { channel: "Portal", rate: 71, total: 42 },
  ],
  "90": [
    { channel: "Phone", rate: 58, total: 230 },
    { channel: "SMS", rate: 44, total: 180 },
    { channel: "Portal", rate: 68, total: 120 },
  ],
};

// Top Drivers of Non-Adherence
const DRIVERS_DATA: Record<TimeRange, { label: string; count: number; color: string }[]> = {
  "7": [
    { label: "Missed doses", count: 8, color: "#D13438" },
    { label: "Side effects", count: 5, color: "#CA5010" },
    { label: "Cost barriers", count: 3, color: "#8764B8" },
    { label: "Confusion", count: 2, color: "#0078D4" },
  ],
  "30": [
    { label: "Missed doses", count: 24, color: "#D13438" },
    { label: "Side effects", count: 16, color: "#CA5010" },
    { label: "Cost barriers", count: 10, color: "#8764B8" },
    { label: "Confusion", count: 7, color: "#0078D4" },
  ],
  "90": [
    { label: "Missed doses", count: 64, color: "#D13438" },
    { label: "Side effects", count: 42, color: "#CA5010" },
    { label: "Cost barriers", count: 28, color: "#8764B8" },
    { label: "Confusion", count: 18, color: "#0078D4" },
  ],
};

// ── SVG Line Chart Helper ───────────────────────────────────

const AdherenceTrendChart: React.FC<{ data: { label: string; adherence: number; missedDoses: number }[] }> = ({ data }) => {
  const width = 600;
  const height = 180;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const minY = 60;
  const maxY = 100;
  const maxMissed = Math.max(...data.map((d) => d.missedDoses), 1);

  const toX = (i: number) => padX + (i / (data.length - 1)) * chartW;
  const toYAdherence = (v: number) => padY + ((maxY - v) / (maxY - minY)) * chartH;
  const toYMissed = (v: number) => padY + ((maxMissed - v) / maxMissed) * chartH;

  const adherenceLine = data.map((d, i) => `${toX(i)},${toYAdherence(d.adherence)}`).join(" ");
  const missedLine = data.map((d, i) => `${toX(i)},${toYMissed(d.missedDoses)}`).join(" ");

  const gridLines = [100, 90, 80, 70, 60];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ maxHeight: 110 }}>
      {/* Grid lines */}
      {gridLines.map((v) => (
        <g key={v}>
          <line x1={padX} y1={toYAdherence(v)} x2={width - padX} y2={toYAdherence(v)} stroke="#e0e0e0" strokeDasharray="3 3" />
          <text x={padX - 6} y={toYAdherence(v) + 4} textAnchor="end" fontSize="10" fill="#888">{v}%</text>
        </g>
      ))}
      {/* X axis labels */}
      {data.map((d, i) => (
        <text key={d.label} x={toX(i)} y={height - 2} textAnchor="middle" fontSize="10" fill="#888">{d.label}</text>
      ))}
      {/* Missed doses line */}
      <polyline points={missedLine} fill="none" stroke="#FDE300" strokeWidth="2" strokeDasharray="5 3" />
      {data.map((d, i) => (
        <circle key={`m-${i}`} cx={toX(i)} cy={toYMissed(d.missedDoses)} r="3" fill="#FDE300" />
      ))}
      {/* Adherence line */}
      <polyline points={adherenceLine} fill="none" stroke="#0078D4" strokeWidth="2.5" />
      {data.map((d, i) => (
        <circle key={`a-${i}`} cx={toX(i)} cy={toYAdherence(d.adherence)} r="3.5" fill="#0078D4" />
      ))}
    </svg>
  );
};

// ── Component ───────────────────────────────────────────────

export const MedicationAdherenceDashboard: React.FC = () => {
  const styles = useDashboardStyles();
  const [timeRange, setTimeRange] = useState<TimeRange>("30");
  const [showUnreviewedOnly, setShowUnreviewedOnly] = useState(false);

  const handleTimeRangeChange = (_: unknown, data: OptionOnSelectData) => {
    if (data.optionValue) setTimeRange(data.optionValue as TimeRange);
  };

  // Dynamic data
  const stats = STATS_DATA[timeRange];
  const trendData = TREND_DATA[timeRange];
  const outreachData = OUTREACH_DATA[timeRange];
  const driversData = DRIVERS_DATA[timeRange];

  const maxDriverCount = Math.max(...driversData.map((d) => d.count));

  // Contact history
  const filteredByTime = useMemo(
    () => CONTACT_RECORDS.filter((r) => r.daysAgo <= Number(timeRange)),
    [timeRange]
  );
  const needsReviewCount = filteredByTime.filter((r) => !r.reviewed).length;
  const completedCount = filteredByTime.filter((r) => r.reviewed).length;
  const displayedRecords = showUnreviewedOnly
    ? filteredByTime.filter((r) => !r.reviewed)
    : filteredByTime;

  return (
    <div className={styles.root}>
      {/* ── Header + Filters ── */}
      <div className={styles.headerRow}>
        <div className={styles.dashboardHeader}>
          <div className={styles.title}>Medication Adherence Dashboard</div>
          <div className={styles.subtitle}>
            Monitor patient outreach and medication compliance
          </div>
        </div>

        <div className={styles.filtersBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Time Range</span>
            <Dropdown
              value={TIME_RANGE_LABELS[timeRange]}
              selectedOptions={[timeRange]}
              onOptionSelect={handleTimeRangeChange}
              style={{ minWidth: "150px" }}
            >
              <Option value="7">Last 7 days</Option>
              <Option value="30">Last 30 days</Option>
              <Option value="90">Last 90 days</Option>
            </Dropdown>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Condition</span>
            <Dropdown defaultValue="All" style={{ minWidth: "130px" }}>
              <Option value="all">All</Option>
              <Option value="diabetes">Diabetes</Option>
              <Option value="hypertension">Hypertension</Option>
              <Option value="cardiac">Cardiac</Option>
            </Dropdown>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Risk Level</span>
            <Dropdown defaultValue="All" style={{ minWidth: "110px" }}>
              <Option value="all">All</Option>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Dropdown>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Channel</span>
            <Dropdown defaultValue="All" style={{ minWidth: "110px" }}>
              <Option value="all">All</Option>
              <Option value="phone">Phone</Option>
              <Option value="sms">SMS</Option>
              <Option value="portal">Portal</Option>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Adherence Rate</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.adherenceRate}%</span>
            <span className={stats.adherenceTrend >= 0 ? styles.statTrendUp : styles.statTrendDown}>
              {stats.adherenceTrend >= 0 ? "↑" : "↓"} {stats.adherenceTrend >= 0 ? "+" : ""}{stats.adherenceTrend}%
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Patients at Risk</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.patientsAtRisk}</span>
          </div>
          <div className={styles.statBreakdown}>
            <span>High: <strong>{stats.riskHigh}</strong></span>
            <span>Med: <strong>{stats.riskMed}</strong></span>
            <span>Low: <strong>{stats.riskLow}</strong></span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Successful Contacts</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.successfulContacts}%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Follow-up Needed</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.followUpNeeded}</span>
          </div>
          <div className={styles.statBreakdown}>
            <span>Urgent: <strong>{stats.followUpUrgent}</strong></span>
            <span>Routine: <strong>{stats.followUpRoutine}</strong></span>
          </div>
        </div>
      </div>

      {/* ── Adherence Trend ── */}
      <div className={styles.sectionCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className={styles.sectionTitle}>Adherence Trend</span>
          <div className={styles.chartLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#0078D4" }} />
              Adherence %
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: "#FDE300" }} />
              Missed Doses
            </span>
          </div>
        </div>
        <AdherenceTrendChart data={trendData} />
      </div>

      {/* ── Two-column: Top Drivers + Outreach Effectiveness ── */}
      <div className={styles.twoColumnRow}>
        {/* Top Drivers of Non-Adherence */}
        <div className={styles.sectionCard}>
          <span className={styles.sectionTitle}>Top Drivers of Non-Adherence</span>
          <div className={styles.driversRow}>
            {driversData.map((d) => (
              <div className={styles.driverCol} key={d.label}>
                <span className={styles.driverValue}>{d.count}</span>
                <div className={styles.driverBarContainer}>
                  <div
                    className={styles.driverBar}
                    style={{
                      height: `${(d.count / maxDriverCount) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
                <span className={styles.driverLabel}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outreach Effectiveness by Channel */}
        <div className={styles.sectionCard}>
          <span className={styles.sectionTitle}>Outreach Effectiveness by Channel</span>
          <div className={styles.barChartList}>
            {outreachData.map((d) => (
              <div className={styles.barRow} key={d.channel}>
                <span className={styles.barLabel}>{d.channel}</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${d.rate}%`,
                      backgroundColor: "#0078D4",
                    }}
                  />
                </div>
                <span className={styles.barValue}>{d.rate}% ({d.total})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Patient Contact History ── */}
      <div className={styles.historySection}>
        <div>
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
            <span className={mergeClasses(styles.countBadge, styles.countBadgeReview)}>
              {needsReviewCount}
            </span>
          </span>
          <span>
            Completed:
            <span className={mergeClasses(styles.countBadge, styles.countBadgeCompleted)}>
              {completedCount}
            </span>
          </span>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.historyFilterGroup}>
            <span className={styles.filterLabel}>Contact Status</span>
            <Dropdown defaultValue="All Statuses">
              <Option value="all">All Statuses</Option>
              <Option value="reviewed">Reviewed</Option>
              <Option value="needs-review">Needs Review</Option>
            </Dropdown>
          </div>
          <div className={styles.historyFilterGroup}>
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
