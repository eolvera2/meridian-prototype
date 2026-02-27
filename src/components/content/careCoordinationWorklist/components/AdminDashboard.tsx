import { useState, type FC } from "react";
import {
  Dropdown,
  Option,
  Button,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import type { OptionOnSelectData } from "@fluentui/react-components";
import {
  ChevronDown16Regular,
  ChevronUp16Regular,
} from "@fluentui/react-icons";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import type { CallType } from "../CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "../CareCoordinationWorklist.types";
import {
  CC_COLORS,
  TIME_RANGE_LABELS,
  STATS_DATA,
  CONTACT_TREND_DATA,
  OUTCOME_BY_TYPE_DATA,
  CALL_EFFICIENCY_DATA,
  MED_ADHERENCE_TREND_DATA,
  BP_DISTRIBUTION_DATA,
  BARRIERS_DATA,
  RISK_HEATMAP_DATA,
} from "../careCoordination.constants";
import type { TimeRange } from "../careCoordination.constants";
import { ContactOutcomeTrend } from "./ContactOutcomeTrend";
import { OutcomesByTypeChart } from "./OutcomesByTypeChart";
import { CallEfficiencyChart } from "./CallEfficiencyChart";
import { MedAdherenceTrendChart } from "./MedAdherenceTrendChart";
import { BpDistributionChart } from "./BpDistributionChart";
import { BarriersChart } from "./BarriersChart";
import { RiskHeatmap } from "./RiskHeatmap";

// ── Helpers ─────────────────────────────────────────────────────────

const getSuccessCardClass = (_rate: number, styles: ReturnType<typeof useDashboardStyles>) => {
  // 78%+ with positive trend is good for outreach programs
  if (_rate >= 70) return styles.statCardGood;
  if (_rate >= 55) return styles.statCardWarning;
  return styles.statCardCritical;
};

const getEscalationCardClass = (rate: number, styles: ReturnType<typeof useDashboardStyles>) => {
  if (rate <= 15) return styles.statCardGood;
  if (rate <= 25) return styles.statCardWarning;
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

  const stats = STATS_DATA[timeRange];
  const trendData = CONTACT_TREND_DATA[timeRange];
  const outcomeData = OUTCOME_BY_TYPE_DATA[timeRange];
  const efficiencyData = CALL_EFFICIENCY_DATA[timeRange];
  const medAdherenceData = MED_ADHERENCE_TREND_DATA[timeRange];
  const bpData = BP_DISTRIBUTION_DATA[timeRange];
  const barriersData = BARRIERS_DATA[timeRange];
  const heatmapData = RISK_HEATMAP_DATA[timeRange];

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
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsGrid}>
        <div className={mergeClasses(styles.statCard, getSuccessCardClass(stats.contactSuccessRate, styles))}>
          <span className={styles.statLabel}>Contact Success Rate</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.contactSuccessRate}%</span>
            <span className={stats.contactSuccessTrend >= 0 ? styles.statTrendUp : styles.statTrendDown}>
              {stats.contactSuccessTrend >= 0 ? "↑" : "↓"} {stats.contactSuccessTrend >= 0 ? "+" : ""}{stats.contactSuccessTrend}%
            </span>
          </div>
        </div>

        <div className={mergeClasses(styles.statCard, stats.actionHigh > 4 ? styles.statCardCritical : stats.actionHigh > 2 ? styles.statCardWarning : styles.statCardNeutral)}>
          <span className={styles.statLabel}>Patients Requiring Action</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.patientsRequiringAction}</span>
            <div className={styles.statBreakdown}>
              <span>High: <strong>{stats.actionHigh}</strong></span>
              <span>Med: <strong>{stats.actionMed}</strong></span>
              <span>Low: <strong>{stats.actionLow}</strong></span>
            </div>
          </div>
        </div>

        <div className={mergeClasses(styles.statCard, styles.statCardNeutral)}>
          <span className={styles.statLabel}>Avg Calls to Resolution</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.avgCallsToResolution}</span>
          </div>
        </div>

        <div className={mergeClasses(styles.statCard, getEscalationCardClass(stats.escalationRate, styles))}>
          <span className={styles.statLabel}>Escalation Rate</span>
          <div className={styles.statValueRow}>
            <span className={styles.statValue}>{stats.escalationRate}%</span>
            <span className={stats.escalationTrend <= 0 ? styles.statTrendUp : styles.statTrendDown}>
              {stats.escalationTrend <= 0 ? "↓" : "↑"} {stats.escalationTrend > 0 ? "+" : ""}{stats.escalationTrend}%
            </span>
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

      {/* ── Charts Row 1: Operational Performance ── */}
      {chartsExpanded && (
        <div id="charts-section">
          <div className={styles.threeColumnRow}>
            {/* Contact Outcome Trend */}
            <div className={styles.sectionCard}>
              <span className={styles.sectionTitle}>Contact Outcome Trend</span>
              <div className={styles.trendRow}>
                <div className={styles.trendChartArea}>
                  <ContactOutcomeTrend data={trendData} />
                </div>
                <div className={styles.trendLegendSide}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: CC_COLORS.positive }} />
                    Success Rate
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: CC_COLORS.negative }} />
                    Escalation Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Medication Adherence Trend */}
            <div className={styles.sectionCard}>
              <span className={styles.sectionTitle}>Medication Adherence Trend</span>
              <div className={styles.trendRow}>
                <div className={styles.trendChartArea}>
                  <MedAdherenceTrendChart data={medAdherenceData} />
                </div>
                <div className={styles.trendLegendSide}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: CC_COLORS.positive }} />
                    Adherence Rate
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: CC_COLORS.chartTeal }} />
                    Refill Rate
                  </span>
                </div>
              </div>
            </div>

            {/* Combined: Outcomes by Call Type + Call Attempt Efficiency */}
            <div className={styles.sectionCard}>
              <span className={styles.sectionTitle}>Outcomes by Call Type</span>
              <OutcomesByTypeChart data={outcomeData} />
              <div style={{ borderTop: `1px solid ${tokens.colorNeutralStroke2}`, margin: "8px 0" }} />
              <span className={styles.sectionTitle}>Call Attempt Efficiency</span>
              <CallEfficiencyChart data={efficiencyData} />
            </div>
          </div>

          {/* ── Charts Row 2: Population Health ── */}
          <div className={styles.threeColumnRow} style={{ marginTop: "16px" }}>
            {/* BP Control Distribution */}
            <div className={styles.sectionCard}>
              <span className={styles.sectionTitle}>BP Control Distribution</span>
              <BpDistributionChart data={bpData} />
            </div>

            {/* Top Barriers to Adherence */}
            <div className={styles.sectionCard}>
              <span className={styles.sectionTitle}>Top Barriers to Adherence</span>
              <BarriersChart data={barriersData} />
            </div>

            {/* Patient Risk Heatmap */}
            <div className={styles.sectionCard}>
              <span className={styles.sectionTitle}>Patient Risk Heatmap</span>
              <RiskHeatmap data={heatmapData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
