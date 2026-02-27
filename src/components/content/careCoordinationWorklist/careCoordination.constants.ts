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

export const TREND_DATA: Record<
  TimeRange,
  { label: string; adherence: number; missedDoses: number }[]
> = {
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

export interface StatsData {
  adherenceRate: number;
  adherenceTrend: number;
  patientsAtRisk: number;
  riskHigh: number;
  riskMed: number;
  riskLow: number;
  successfulContacts: number;
  followUpNeeded: number;
  followUpUrgent: number;
  followUpRoutine: number;
}

export const STATS_DATA: Record<TimeRange, StatsData> = {
  "7": {
    adherenceRate: 89, adherenceTrend: 3, patientsAtRisk: 8,
    riskHigh: 2, riskMed: 4, riskLow: 2,
    successfulContacts: 78, followUpNeeded: 3, followUpUrgent: 1, followUpRoutine: 2,
  },
  "30": {
    adherenceRate: 87, adherenceTrend: 4, patientsAtRisk: 12,
    riskHigh: 4, riskMed: 6, riskLow: 2,
    successfulContacts: 74, followUpNeeded: 5, followUpUrgent: 2, followUpRoutine: 3,
  },
  "90": {
    adherenceRate: 83, adherenceTrend: -2, patientsAtRisk: 18,
    riskHigh: 6, riskMed: 8, riskLow: 4,
    successfulContacts: 68, followUpNeeded: 9, followUpUrgent: 4, followUpRoutine: 5,
  },
};

export const OUTREACH_DATA: Record<
  TimeRange,
  { channel: string; rate: number; total: number }[]
> = {
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

export const DRIVERS_DATA: Record<
  TimeRange,
  { label: string; count: number; color: string }[]
> = {
  "7": [
    { label: "Missed doses", count: 8, color: CC_COLORS.negative },
    { label: "Side effects", count: 5, color: CC_COLORS.warning },
    { label: "Cost barriers", count: 3, color: CC_COLORS.chartPurple },
    { label: "Confusion", count: 2, color: CC_COLORS.chartBlue },
  ],
  "30": [
    { label: "Missed doses", count: 24, color: CC_COLORS.negative },
    { label: "Side effects", count: 16, color: CC_COLORS.warning },
    { label: "Cost barriers", count: 10, color: CC_COLORS.chartPurple },
    { label: "Confusion", count: 7, color: CC_COLORS.chartBlue },
  ],
  "90": [
    { label: "Missed doses", count: 64, color: CC_COLORS.negative },
    { label: "Side effects", count: 42, color: CC_COLORS.warning },
    { label: "Cost barriers", count: 28, color: CC_COLORS.chartPurple },
    { label: "Confusion", count: 18, color: CC_COLORS.chartBlue },
  ],
};

export const PAGE_SIZE = 10;
