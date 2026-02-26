import { useState, type FC } from "react";
import {
  Dropdown,
  Option,
  Button,
  mergeClasses,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from "@fluentui/react-components";
import type { OptionOnSelectData } from "@fluentui/react-components";
import {
  Filter16Regular,
  ChevronDown16Regular,
  ChevronUp16Regular,
} from "@fluentui/react-icons";
import { tokens } from "@fluentui/react-components";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import type { CallType } from "../CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "../CareCoordinationWorklist.types";
import {
  CC_COLORS,
  TIME_RANGE_LABELS,
  TREND_DATA,
  STATS_DATA,
  OUTREACH_DATA,
  DRIVERS_DATA,
} from "../careCoordination.constants";
import type { TimeRange } from "../careCoordination.constants";
import { AdherenceTrendChart } from "./AdherenceTrendChart";

// ── Helpers ─────────────────────────────────────────────────────────

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

// ── Props ───────────────────────────────────────────────────────────

interface AdminDashboardProps {
  timeRange: TimeRange;
  setTimeRange: (v: TimeRange) => void;
  callTypeFilter: "all" | CallType;
  setCallTypeFilter: (v: "all" | CallType) => void;
  setCurrentPage: (v: number) => void;
}

// ── Component ───────────────────────────────────────────────────────

export const AdminDashboard: FC<AdminDashboardProps> = ({
  timeRange,
  setTimeRange,
  callTypeFilter,
  setCallTypeFilter,
  setCurrentPage,
}) => {
  const styles = useDashboardStyles();
  const [chartsExpanded, setChartsExpanded] = useState(true);
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  const stats = STATS_DATA[timeRange];
  const trendData = TREND_DATA[timeRange];
  const outreachData = OUTREACH_DATA[timeRange];
  const driversData = DRIVERS_DATA[timeRange];
  const maxDriverCount = Math.max(...driversData.map((d) => d.count));
  const driverTotal = driversData.reduce((sum, d) => sum + d.count, 0);

  const handleTimeRangeChange = (_: unknown, data: OptionOnSelectData) => {
    if (data.optionValue) {
      setTimeRange(data.optionValue as TimeRange);
      setCurrentPage(1);
    }
  };

  return (
    <div className={styles.historySection}>
      {/* ── Header + Filters ── */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <div>
            <div className={styles.historyTitle}>Care Coordination Dashboard</div>
            <div className={styles.historySubtitle}>
              Monitor patient outreach and care coordination activities
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

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Call Type</span>
            <Dropdown
              value={callTypeFilter === "all" ? "All Types" : CALL_TYPE_LABELS[callTypeFilter]}
              selectedOptions={[callTypeFilter]}
              onOptionSelect={(_, data) => {
                setCallTypeFilter((data.optionValue ?? "all") as "all" | CallType);
                setCurrentPage(1);
              }}
              style={{ minWidth: "150px" }}
            >
              <Option value="all">All Types</Option>
              <Option value="medication-adherence">{CALL_TYPE_LABELS["medication-adherence"]}</Option>
              <Option value="patient-intake">{CALL_TYPE_LABELS["patient-intake"]}</Option>
              <Option value="hypertension-management">{CALL_TYPE_LABELS["hypertension-management"]}</Option>
            </Dropdown>
          </div>

          <Popover open={filterPopoverOpen} onOpenChange={(_, data) => setFilterPopoverOpen(data.open)}>
            <PopoverTrigger disableButtonEnhancement>
              <Button appearance="subtle" icon={<Filter16Regular />} aria-label="Open filters">
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
          Trends &amp; Analytics
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

      {/* ── Charts Row ── */}
      {chartsExpanded && (
        <div id="charts-section">
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
                    <span className={styles.legendDot} style={{ backgroundColor: CC_COLORS.chartBlue }} />
                    Adherence %
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: CC_COLORS.missedDoses }} />
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
                        style={{ width: `${d.rate}%` }}
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
  );
};
