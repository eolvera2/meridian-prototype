import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Dropdown,
  Option,
  Button,
  mergeClasses,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Tooltip,
  Switch,
} from "@fluentui/react-components";
import type { OptionOnSelectData } from "@fluentui/react-components";
import {
  ArrowSync16Regular,
  Checkmark16Regular,
  Timer16Regular,
  Warning16Regular,
  Filter16Regular,
  ChevronDown16Regular,
  ChevronUp16Regular,
  ArrowLeft16Regular,
  ArrowRight16Regular,
  ArrowImport16Regular,
  ArrowExportUp16Regular,
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
} from "@fluentui/react-icons";
import { useDashboardStyles } from "./MedicationAdherenceDashboard.styles";
import { useMedicationAdherenceWorklistContext } from "./MedicationAdherenceWorklistContext";
import type { CallRecordStatus, ContactRecord } from "./MedicationAdherenceWorklistContext";

// ── Data Types ──────────────────────────────────────────────

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

const ADHERENCE_COLOR = "#0078D4";
const MISSED_DOSES_COLOR = "#9A6700";

const AdherenceTrendChart: React.FC<{ data: { label: string; adherence: number; missedDoses: number }[] }> = ({ data }) => {
  const width = 500;
  const height = 180;
  const padX = 54;
  const padY = 14;
  const padBottom = 28;
  const chartW = width - padX * 2;
  const chartH = height - padY - padBottom;
  const minY = 50;
  const maxY = 100;
  const maxMissed = Math.max(...data.map((d) => d.missedDoses), 1);

  const toX = (i: number) => padX + (i / (data.length - 1)) * chartW;
  const toYAdherence = (v: number) => padY + ((maxY - v) / (maxY - minY)) * chartH;
  const toYMissed = (v: number) => padY + ((maxMissed - v) / maxMissed) * chartH;

  const adherenceLine = data.map((d, i) => `${toX(i)},${toYAdherence(d.adherence)}`).join(" ");
  const missedLine = data.map((d, i) => `${toX(i)},${toYMissed(d.missedDoses)}`).join(" ");

  const gridLines = [100, 75, 50];

  const ariaDescription = data.map(d => `${d.label}: ${d.adherence}% adherence, ${d.missedDoses} missed`).join("; ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Adherence trend chart. ${ariaDescription}`}
    >
      <title>Adherence Trend Chart</title>
      {/* Grid lines */}
      {gridLines.map((v) => (
        <g key={v}>
          <line x1={padX} y1={toYAdherence(v)} x2={width - padX} y2={toYAdherence(v)} stroke="#e0e0e0" strokeDasharray="3 3" />
          <text x={padX - 6} y={toYAdherence(v) + 5} textAnchor="end" fontSize="16" fill="#666">{v}%</text>
        </g>
      ))}
      {/* X axis labels */}
      {data.map((d, i) => (
        <text key={d.label} x={toX(i)} y={height - 6} textAnchor="middle" fontSize="16" fill="#666">{d.label}</text>
      ))}
      {/* Missed doses line */}
      <polyline points={missedLine} fill="none" stroke={MISSED_DOSES_COLOR} strokeWidth="2" strokeDasharray="5 3" />
      {data.map((d, i) => (
        <g key={`m-${i}`}>
          <circle cx={toX(i)} cy={toYMissed(d.missedDoses)} r="3" fill={MISSED_DOSES_COLOR} />
          <title>{`${d.label}: ${d.missedDoses} missed doses`}</title>
        </g>
      ))}
      {/* Adherence line */}
      <polyline points={adherenceLine} fill="none" stroke={ADHERENCE_COLOR} strokeWidth="2.5" />
      {data.map((d, i) => (
        <g key={`a-${i}`}>
          <circle cx={toX(i)} cy={toYAdherence(d.adherence)} r="3.5" fill={ADHERENCE_COLOR} />
          <title>{`${d.label}: ${d.adherence}% adherence`}</title>
        </g>
      ))}
    </svg>
  );
};

// ── Helpers ─────────────────────────────────────────────────

const PAGE_SIZE = 10;

const getAdherenceCardClass = (rate: number, styles: ReturnType<typeof useDashboardStyles>) => {
  if (rate >= 85) return styles.statCardGood;
  if (rate >= 70) return styles.statCardWarning;
  return styles.statCardCritical;
};

const getContactCardClass = (rate: number, styles: ReturnType<typeof useDashboardStyles>) => {
  if (rate >= 70) return styles.statCardGood;
  if (rate >= 50) return styles.statCardWarning;
  return styles.statCardCritical;
};

// ── Component ───────────────────────────────────────────────

export const MedicationAdherenceDashboard: React.FC = () => {
  const styles = useDashboardStyles();
  const [timeRange, setTimeRange] = useState<TimeRange>("30");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminView, setAdminView] = useState(false);
  const [chartsExpanded, setChartsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const { activeCallRecords, resolveCallRecord, setSelectedPatientId, contactRecords } = useMedicationAdherenceWorklistContext();

  // Track which records we've already started timers for
  const resolvedTimers = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newInProgress = activeCallRecords.filter(
      (r) => r.status === "in-progress" && !resolvedTimers.current.has(r.id)
    );
    newInProgress.forEach((record) => {
      resolvedTimers.current.add(record.id);
      setTimeout(() => {
        resolveCallRecord(record.id);
      }, 10000);
    });
  }, [activeCallRecords, resolveCallRecord]);

  const handleTimeRangeChange = (_: unknown, data: OptionOnSelectData) => {
    if (data.optionValue) {
      setTimeRange(data.optionValue as TimeRange);
      setCurrentPage(1);
    }
  };

  // Dynamic data
  const stats = STATS_DATA[timeRange];
  const trendData = TREND_DATA[timeRange];
  const outreachData = OUTREACH_DATA[timeRange];
  const driversData = DRIVERS_DATA[timeRange];

  const maxDriverCount = Math.max(...driversData.map((d) => d.count));
  const driverTotal = driversData.reduce((sum, d) => sum + d.count, 0);

  // Contact history
  const filteredByTime = useMemo(
    () => contactRecords.filter((r) => r.daysAgo <= Number(timeRange)),
    [timeRange, contactRecords]
  );
  const needsReviewCount = filteredByTime.filter((r) => !r.reviewed).length;
  const inProgressCount = activeCallRecords.filter((r) => r.status === "in-progress").length;
  const displayedRecords = statusFilter === "needs-review"
    ? filteredByTime.filter((r) => !r.reviewed)
    : filteredByTime;

  // Combine active call records with displayed records for pagination
  const allTableRecords = useMemo(() => {
    const filteredActive = statusFilter === "needs-review"
      ? activeCallRecords.filter((r) => r.status === "needs-review")
      : statusFilter === "in-progress"
        ? activeCallRecords.filter((r) => r.status === "in-progress")
        : activeCallRecords;
    const activeRows = filteredActive.map((r) => ({ type: "active" as const, record: r }));
    const historyRows = statusFilter === "in-progress"
      ? []
      : displayedRecords.map((r) => ({ type: "history" as const, record: r }));
    return [...activeRows, ...historyRows];
  }, [activeCallRecords, displayedRecords, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(allTableRecords.length / PAGE_SIZE));
  const paginatedRecords = allTableRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const getStatusPillClass = (status: CallRecordStatus) => {
    switch (status) {
      case "in-progress": return styles.statusPillInProgress;
      case "needs-review": return styles.statusPillNeedsReview;
      case "completed": return styles.statusPillCompleted;
    }
  };

  const getStatusLabel = (status: CallRecordStatus) => {
    switch (status) {
      case "in-progress": return "In Progress";
      case "needs-review": return "Needs Review";
      case "completed": return "Completed";
    }
  };

  const handleExport = useCallback(() => {
    const headers = ["Patient Name", "Contact Date", "Phone", "Picked Up Meds", "Taking As Rx", "Side Effects", "Follow-up", "Status"];
    const rows = displayedRecords.map((r) => [
      r.name,
      `${r.contactDate} ${r.contactTime}`,
      r.phone,
      r.pickedUpMeds,
      r.takingAsRx.value,
      r.sideEffects.value,
      r.followUp.value,
      r.reviewed ? "Reviewed" : "Needs Review",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contact-history-${timeRange}d.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [displayedRecords, timeRange]);

  // Outcome icon helper – category-specific icons
  const getOutcomeIcon = (label: string, isWarning: boolean) => {
    switch (label) {
      case "Picked up meds":
        return isWarning ? <ShoppingBagDismiss20Filled aria-hidden="true" /> : <ShoppingBagCheckmark20Regular aria-hidden="true" />;
      case "Taking as Rx":
        return isWarning ? <ClipboardError20Filled aria-hidden="true" /> : <ClipboardCheckmark20Regular aria-hidden="true" />;
      case "Side effects":
        return isWarning ? <ChatMultipleMinus20Filled aria-hidden="true" /> : <ChatMultipleCheckmark20Regular aria-hidden="true" />;
      default:
        return isWarning ? <ShoppingBagDismiss20Filled aria-hidden="true" /> : <ShoppingBagCheckmark20Regular aria-hidden="true" />;
    }
  };

  const OutcomeIndicator: React.FC<{ label: string; value: string; isWarning: boolean }> = ({ label, value, isWarning }) => (
    <Tooltip content={`${label}: ${value}`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, isWarning ? styles.outcomeBad : styles.outcomeGood)}>
        {getOutcomeIcon(label, isWarning)}
      </span>
    </Tooltip>
  );

  // Neutral outcome icon for new/active records
  const getNeutralIcon = (label: string) => {
    switch (label) {
      case "Picked up meds": return <ShoppingBag20Regular aria-hidden="true" />;
      case "Taking as Rx": return <Clipboard20Regular aria-hidden="true" />;
      case "Side effects": return <ChatMultiple20Regular aria-hidden="true" />;
      default: return <ShoppingBag20Regular aria-hidden="true" />;
    }
  };

  const NeutralOutcomeIndicator: React.FC<{ label: string }> = ({ label }) => (
    <Tooltip content={`${label}: Pending`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, styles.outcomeNeutralIcon)}>
        {getNeutralIcon(label)}
      </span>
    </Tooltip>
  );

  const getPainClass = (level: number) => {
    if (level === 0) return styles.outcomeGood;
    if (level <= 3) return styles.outcomeYellow;
    if (level <= 6) return styles.outcomeOrange;
    return level >= 7 ? styles.outcomeBadFilled : styles.outcomeBad;
  };

  const PainLevelIndicator: React.FC<{ level: number }> = ({ level }) => {
    const clamped = Math.max(0, Math.min(10, level));
    return (
      <Tooltip content={`Pain level: ${clamped}/10`} relationship="label">
        <span className={mergeClasses(styles.outcomeIcon, getPainClass(clamped))}>
          {clamped}
        </span>
      </Tooltip>
    );
  };

  const NeutralPainIndicator: React.FC = () => (
    <Tooltip content="Pain level: Pending" relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, styles.outcomeNeutralIcon)}>
        <NumberCircle020Regular aria-hidden="true" />
      </span>
    </Tooltip>
  );

  return (
    <div className={styles.root}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Switch
          checked={adminView}
          onChange={(_, data) => setAdminView(data.checked)}
          label="Admin view"
          labelPosition="before"
        />
      </div>

      {adminView && (
      <>{/* ── Dashboard Overview ── */}
      <div className={styles.historySection}>
      {/* ── Header + Filters ── */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div>
            <div className={styles.historyTitle}>Medication Adherence Dashboard</div>
            <div className={styles.historySubtitle}>
              Monitor patient outreach and medication compliance
            </div>
          </div>
        </div>

        <div className={styles.filterPopoverTrigger}>
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

          <Popover open={filterPopoverOpen} onOpenChange={(_, data) => setFilterPopoverOpen(data.open)}>
            <PopoverTrigger disableButtonEnhancement>
              <Button
                appearance="subtle"
                icon={<Filter16Regular />}
                aria-label="Open filters"
              >
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverSurface>
              <div className={styles.filterPopoverContent}>
                <div className={styles.filterPopoverRow}>
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
                </div>
                <div className={styles.filterPopoverRow}>
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
            </PopoverSurface>
          </Popover>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsGrid}>
        <div className={mergeClasses(styles.statCard, getAdherenceCardClass(stats.adherenceRate, styles))}>
          <span className={styles.statLabel}>Adherence Rate</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.adherenceRate}%</span>
            <span className={stats.adherenceTrend >= 0 ? styles.statTrendUp : styles.statTrendDown}>
              {stats.adherenceTrend >= 0 ? "↑" : "↓"} {stats.adherenceTrend >= 0 ? "+" : ""}{stats.adherenceTrend}%
            </span>
          </div>
        </div>

        <div className={mergeClasses(styles.statCard, stats.riskHigh > 4 ? styles.statCardCritical : stats.riskHigh > 2 ? styles.statCardWarning : styles.statCardNeutral)}>
          <span className={styles.statLabel}>Patients at Risk</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.patientsAtRisk}</span>
            <div className={styles.statBreakdown}>
              <span>High: <strong>{stats.riskHigh}</strong></span>
              <span>Med: <strong>{stats.riskMed}</strong></span>
              <span>Low: <strong>{stats.riskLow}</strong></span>
            </div>
          </div>
        </div>

        <div className={mergeClasses(styles.statCard, getContactCardClass(stats.successfulContacts, styles))}>
          <span className={styles.statLabel}>Successful Contacts</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.successfulContacts}%</span>
          </div>
        </div>

        <div className={mergeClasses(styles.statCard, stats.followUpUrgent > 3 ? styles.statCardCritical : stats.followUpUrgent > 1 ? styles.statCardWarning : styles.statCardNeutral)}>
          <span className={styles.statLabel}>Follow-up Needed</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.followUpNeeded}</span>
            <div className={styles.statBreakdown}>
              <span>Urgent: <strong>{stats.followUpUrgent}</strong></span>
              <span>Routine: <strong>{stats.followUpRoutine}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Toggle ── */}
      <div className={styles.chartToggleRow}>
        <span className={styles.chartToggleLabel}>
          Trends & Analytics
        </span>
        <Button
          appearance="subtle"
          size="small"
          icon={chartsExpanded ? <ChevronUp16Regular /> : <ChevronDown16Regular />}
          onClick={() => setChartsExpanded((prev) => !prev)}
          aria-expanded={chartsExpanded}
          aria-controls="charts-section"
        >
          {chartsExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>

      {/* ── Charts Row: Adherence Trend + Top Drivers + Outreach ── */}
      {chartsExpanded && (
      <div
        id="charts-section"
      >
        <div className={styles.threeColumnRow}>
          {/* Adherence Trend */}
          <div className={styles.sectionCard}>
            <span className={styles.sectionTitle}>Adherence Trend</span>
            <div className={styles.trendRow}>
              <div className={styles.trendChartArea}>
                <AdherenceTrendChart data={trendData} />
              </div>
              <div className={styles.trendLegendSide}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: ADHERENCE_COLOR }} />
                  Adherence %
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ backgroundColor: MISSED_DOSES_COLOR }} />
                  Missed Doses
                </span>
              </div>
            </div>
            {/* Accessible data table for screen readers */}
            <div className={styles.srOnly}>
              <table>
                <caption>Adherence Trend Data</caption>
                <thead><tr><th>Period</th><th>Adherence %</th><th>Missed Doses</th></tr></thead>
                <tbody>
                  {trendData.map(d => <tr key={d.label}><td>{d.label}</td><td>{d.adherence}%</td><td>{d.missedDoses}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Drivers of Non-Adherence */}
          <div className={styles.sectionCard}>
            <span className={styles.sectionTitle}>Top Drivers of Non-Adherence</span>
            <div className={styles.driversRow}>
              {driversData.map((d) => (
                <div className={styles.driverCol} key={d.label}>
                  <div className={styles.driverBarContainer}>
                    <span className={styles.driverValue}>
                      {Math.round((d.count / driverTotal) * 100)}% ({d.count})
                    </span>
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
      </div>
      )}
      </div>
      </>
      )}

      {/* ── Patient Contact History ── */}
      <div className={styles.historySection}>
        <div className={styles.historyHeaderRow}>
          <div>
            <div className={styles.historyTitle}>Patient Contact History</div>
            <div className={styles.historySubtitle}>
              Review past patient contacts and mark them as reviewed
            </div>
          </div>
          <div className={styles.headerActionsRight}>
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
                In Progress:
                <span className={mergeClasses(styles.countBadge, styles.countBadgeCompleted)}>
                  {inProgressCount}
                </span>
              </span>
            </div>
            <Tooltip content="Import contact history" relationship="label">
              <Button
                appearance="subtle"
                icon={<ArrowImport16Regular />}
                aria-label="Import contact history"
              >
                Import
              </Button>
            </Tooltip>
            <Tooltip content="Export contact history as CSV" relationship="label">
              <Button
                appearance="subtle"
                icon={<ArrowExportUp16Regular />}
                aria-label="Export contact history"
                onClick={handleExport}
              >
                Export
              </Button>
            </Tooltip>
          </div>
        </div>

        <div className={styles.filtersRow}>
          <div className={styles.historyFilterGroup}>
            <span className={styles.filterLabel}>Contact Status</span>
            <Dropdown
              defaultValue="All Statuses"
              defaultSelectedOptions={["all"]}
              onOptionSelect={(_, data) => setStatusFilter(data.optionValue ?? "all")}
            >
              <Option value="all">All Statuses</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="needs-review">Needs Review</Option>
            </Dropdown>
          </div>
          <div className={styles.filterActions}>

            <Button
              appearance="subtle"
              icon={<ArrowSync16Regular />}
              aria-label="Refresh contact history"
            />
          </div>
        </div>

        <table className={styles.table} aria-label="Patient contact history">
          <thead>
            <tr>
              <th className={styles.tableHeader}>Patient Name</th>
              <th className={styles.tableHeader}>Contact Date</th>
              <th className={styles.tableHeader}>Outcomes</th>
              <th className={styles.tableHeader}>Follow-up</th>
              <th className={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.length === 0 && (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  No contact records found for the selected time range.
                </td>
              </tr>
            )}
            {paginatedRecords.map((item) => {
              if (item.type === "active") {
                const record = item.record;
                return (
                  <tr key={record.id} className={styles.tableRow}>
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
                      {record.contactDate}
                      <br />
                      <span style={{ color: "var(--colorNeutralForeground3)", fontSize: "12px" }}>
                        {record.contactTime}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.outcomesCell}>
                        {record.status === "in-progress" ? (
                          <>
                            <NeutralOutcomeIndicator label="Picked up meds" />
                            <NeutralOutcomeIndicator label="Taking as Rx" />
                            <NeutralOutcomeIndicator label="Side effects" />
                            <NeutralPainIndicator />
                          </>
                        ) : (
                          <>
                            <OutcomeIndicator label="Picked up meds" value={record.pickedUpMeds} isWarning={record.pickedUpMeds !== "Yes"} />
                            <OutcomeIndicator label="Taking as Rx" value={record.takingAsRx.value} isWarning={record.takingAsRx.warning} />
                            <OutcomeIndicator label="Side effects" value={record.sideEffects.value} isWarning={record.sideEffects.warning} />
                            <PainLevelIndicator level={record.painLevel} />
                          </>
                        )}
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
                      <span className={getStatusPillClass(record.status)}>
                        {record.status === "in-progress" && <Timer16Regular />}
                        {record.status === "needs-review" && <Warning16Regular />}
                        {record.status === "completed" && <Checkmark16Regular />}
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                  </tr>
                );
              } else {
                const record = item.record;
                return (
                  <tr key={record.id} className={styles.tableRow}>
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
                      {record.contactDate}
                      <br />
                      <span style={{ color: "var(--colorNeutralForeground3)", fontSize: "12px" }}>
                        {record.contactTime}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.outcomesCell}>
                        <OutcomeIndicator label="Picked up meds" value={record.pickedUpMeds} isWarning={record.pickedUpMeds !== "Yes"} />
                        <OutcomeIndicator label="Taking as Rx" value={record.takingAsRx.value} isWarning={record.takingAsRx.warning} />
                        <OutcomeIndicator label="Side effects" value={record.sideEffects.value} isWarning={record.sideEffects.warning} />
                        <PainLevelIndicator level={record.painLevel} />
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
                      {record.reviewed ? (
                        <span className={styles.reviewedBadge}>
                          <Checkmark16Regular /> Reviewed
                        </span>
                      ) : (
                        <span className={styles.statusPillNeedsReview}>
                          <Warning16Regular /> Needs Review
                        </span>
                      )}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {allTableRecords.length > PAGE_SIZE && (
          <div className={styles.paginationRow}>
            <span className={styles.paginationInfo}>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, allTableRecords.length)} of {allTableRecords.length}
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
      </div>
    </div>
  );
};
