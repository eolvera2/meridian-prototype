import type { ActiveCallRecord, ContactRecord } from "./CareCoordinationWorklistContext";

// ── Semantic color constants (no Fluent UI token equivalents) ───────
export const CC_COLORS = {
  urgencyBg: "#FFF8E1",
  urgencyBorder: "#CA5010",
  negative: "#D13438",
  warning: "#CA5010",
  chartPurple: "#8764B8",
  chartBlue: "#0078D4",
  missedDoses: "#9A6700",
};

// ── Shared types ────────────────────────────────────────────────────
export type TimeRange = "7" | "30" | "90";
export type SortColumn = "name" | "mrn" | "callType" | "contactDate" | "followUp" | "status";
export type SortDirection = "asc" | "desc";

export type TableRow =
  | { type: "active"; record: ActiveCallRecord }
  | { type: "history"; record: ContactRecord };

// ── Static data ─────────────────────────────────────────────────────

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
};

export interface StatsData {
  contactSuccessRate: number;
  contactSuccessTrend: number;
  patientsRequiringAction: number;
  actionHigh: number;
  actionMed: number;
  actionLow: number;
  avgCallsToResolution: number;
  escalationRate: number;
  escalationTrend: number;
}

export const STATS_DATA: Record<TimeRange, StatsData> = {
  "7": {
    contactSuccessRate: 82, contactSuccessTrend: 4,
    patientsRequiringAction: 6, actionHigh: 2, actionMed: 3, actionLow: 1,
    avgCallsToResolution: 1.8, escalationRate: 14, escalationTrend: -2,
  },
  "30": {
    contactSuccessRate: 78, contactSuccessTrend: 3,
    patientsRequiringAction: 11, actionHigh: 4, actionMed: 5, actionLow: 2,
    avgCallsToResolution: 2.1, escalationRate: 18, escalationTrend: 1,
  },
  "90": {
    contactSuccessRate: 74, contactSuccessTrend: -1,
    patientsRequiringAction: 16, actionHigh: 6, actionMed: 7, actionLow: 3,
    avgCallsToResolution: 2.4, escalationRate: 22, escalationTrend: 3,
  },
};

export const CONTACT_TREND_DATA: Record<
  TimeRange,
  { label: string; successRate: number; escalationRate: number }[]
> = {
  "7": [
    { label: "Mon", successRate: 80, escalationRate: 16 },
    { label: "Tue", successRate: 78, escalationRate: 18 },
    { label: "Wed", successRate: 85, escalationRate: 12 },
    { label: "Thu", successRate: 82, escalationRate: 14 },
    { label: "Fri", successRate: 88, escalationRate: 10 },
    { label: "Sat", successRate: 84, escalationRate: 13 },
    { label: "Sun", successRate: 83, escalationRate: 15 },
  ],
  "30": [
    { label: "Wk 1", successRate: 75, escalationRate: 20 },
    { label: "Wk 2", successRate: 78, escalationRate: 18 },
    { label: "Wk 3", successRate: 80, escalationRate: 16 },
    { label: "Wk 4", successRate: 82, escalationRate: 14 },
  ],
  "90": [
    { label: "Jan", successRate: 70, escalationRate: 24 },
    { label: "Feb", successRate: 72, escalationRate: 22 },
    { label: "Mar", successRate: 74, escalationRate: 20 },
    { label: "Apr", successRate: 73, escalationRate: 21 },
    { label: "May", successRate: 76, escalationRate: 18 },
    { label: "Jun", successRate: 78, escalationRate: 16 },
    { label: "Jul", successRate: 77, escalationRate: 17 },
    { label: "Aug", successRate: 80, escalationRate: 15 },
    { label: "Sep", successRate: 81, escalationRate: 14 },
    { label: "Oct", successRate: 79, escalationRate: 16 },
    { label: "Nov", successRate: 82, escalationRate: 13 },
    { label: "Dec", successRate: 83, escalationRate: 12 },
  ],
};

export const OUTCOME_BY_TYPE_DATA: Record<
  TimeRange,
  { type: string; positive: number; warning: number; critical: number }[]
> = {
  "7": [
    { type: "Med Adherence", positive: 14, warning: 5, critical: 2 },
    { type: "Patient Intake", positive: 6, warning: 2, critical: 1 },
    { type: "Chronic Care", positive: 4, warning: 2, critical: 1 },
  ],
  "30": [
    { type: "Med Adherence", positive: 48, warning: 18, critical: 8 },
    { type: "Patient Intake", positive: 22, warning: 7, critical: 3 },
    { type: "Chronic Care", positive: 16, warning: 8, critical: 4 },
  ],
  "90": [
    { type: "Med Adherence", positive: 132, warning: 52, critical: 22 },
    { type: "Patient Intake", positive: 64, warning: 20, critical: 9 },
    { type: "Chronic Care", positive: 44, warning: 24, critical: 12 },
  ],
};

export const CALL_EFFICIENCY_DATA: Record<
  TimeRange,
  { firstAttempt: number; afterRetry: number; unresolved: number }
> = {
  "7":  { firstAttempt: 62, afterRetry: 24, unresolved: 14 },
  "30": { firstAttempt: 58, afterRetry: 26, unresolved: 16 },
  "90": { firstAttempt: 54, afterRetry: 28, unresolved: 18 },
};

export const BP_DISTRIBUTION_DATA: Record<
  TimeRange,
  { atGoal: number; borderline: number; uncontrolled: number; urgent: number }
> = {
  "7":  { atGoal: 3, borderline: 2, uncontrolled: 1, urgent: 1 },
  "30": { atGoal: 10, borderline: 7, uncontrolled: 5, urgent: 2 },
  "90": { atGoal: 26, borderline: 18, uncontrolled: 14, urgent: 6 },
};

export const BARRIERS_DATA: Record<
  TimeRange,
  { label: string; count: number; trend: number; color: string }[]
> = {
  "7": [
    { label: "Cost / Insurance", count: 4, trend: 1, color: CC_COLORS.negative },
    { label: "Side Effects", count: 5, trend: -1, color: CC_COLORS.warning },
    { label: "Dosing Confusion", count: 3, trend: 0, color: CC_COLORS.chartPurple },
    { label: "Pharmacy Access", count: 2, trend: 1, color: CC_COLORS.chartBlue },
    { label: "Pain Management", count: 3, trend: 0, color: "#498205" },
  ],
  "30": [
    { label: "Cost / Insurance", count: 14, trend: 3, color: CC_COLORS.negative },
    { label: "Side Effects", count: 16, trend: -2, color: CC_COLORS.warning },
    { label: "Dosing Confusion", count: 9, trend: 1, color: CC_COLORS.chartPurple },
    { label: "Pharmacy Access", count: 7, trend: 2, color: CC_COLORS.chartBlue },
    { label: "Pain Management", count: 8, trend: 1, color: "#498205" },
  ],
  "90": [
    { label: "Cost / Insurance", count: 38, trend: 5, color: CC_COLORS.negative },
    { label: "Side Effects", count: 42, trend: -4, color: CC_COLORS.warning },
    { label: "Dosing Confusion", count: 24, trend: 2, color: CC_COLORS.chartPurple },
    { label: "Pharmacy Access", count: 18, trend: 6, color: CC_COLORS.chartBlue },
    { label: "Pain Management", count: 22, trend: 3, color: "#498205" },
  ],
};

export const RISK_HEATMAP_DATA: Record<
  TimeRange,
  { type: string; low: number; medium: number; high: number; urgent: number }[]
> = {
  "7": [
    { type: "Med Adherence", low: 8, medium: 5, high: 3, urgent: 1 },
    { type: "Patient Intake", low: 4, medium: 2, high: 1, urgent: 1 },
    { type: "Chronic Care", low: 2, medium: 2, high: 1, urgent: 1 },
  ],
  "30": [
    { type: "Med Adherence", low: 28, medium: 16, high: 8, urgent: 3 },
    { type: "Patient Intake", low: 14, medium: 7, high: 4, urgent: 2 },
    { type: "Chronic Care", low: 8, medium: 6, high: 4, urgent: 2 },
  ],
  "90": [
    { type: "Med Adherence", low: 72, medium: 42, high: 22, urgent: 8 },
    { type: "Patient Intake", low: 38, medium: 18, high: 10, urgent: 4 },
    { type: "Chronic Care", low: 22, medium: 16, high: 12, urgent: 6 },
  ],
};

export const PAGE_SIZE = 10;
