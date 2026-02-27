import type { FC } from "react";
import { mergeClasses, Tooltip } from "@fluentui/react-components";
import {
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
  DocumentCheckmark20Regular,
  DocumentDismiss20Filled,
  LeafOne20Regular,
  LeafThree20Filled,
  HeartPulseCheckmark20Regular,
  HeartPulseWarning20Filled,
  BookPulse20Regular,
  BookDismiss20Filled,
  FlagCheckered20Regular,
  FlagOff20Filled,
  History20Regular,
  HistoryDismiss20Filled,
  Emoji20Regular,
  EmojiAngry20Filled,
  ArrowSort16Regular,
  ArrowSortUp16Filled,
  ArrowSortDown16Filled,
} from "@fluentui/react-icons";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";
import type { SortColumn, SortDirection } from "../careCoordination.constants";

// ── Icon maps ───────────────────────────────────────────────────────

export const getOutcomeIcon = (label: string, isWarning: boolean) => {
  switch (label) {
    case "Picked up meds":
      return isWarning ? <ShoppingBagDismiss20Filled aria-hidden="true" /> : <ShoppingBagCheckmark20Regular aria-hidden="true" />;
    case "Taking as Rx":
      return isWarning ? <ClipboardError20Filled aria-hidden="true" /> : <ClipboardCheckmark20Regular aria-hidden="true" />;
    case "Side effects":
      return isWarning ? <ChatMultipleMinus20Filled aria-hidden="true" /> : <ChatMultipleCheckmark20Regular aria-hidden="true" />;
    case "Intake Complete":
      return isWarning ? <DocumentDismiss20Filled aria-hidden="true" /> : <DocumentCheckmark20Regular aria-hidden="true" />;
    case "Allergies Confirmed":
      return isWarning ? <LeafThree20Filled aria-hidden="true" /> : <LeafOne20Regular aria-hidden="true" />;
    case "Red Flag":
      return isWarning ? <BookDismiss20Filled aria-hidden="true" /> : <BookPulse20Regular aria-hidden="true" />;
    case "BP Reading":
      return isWarning ? <HeartPulseWarning20Filled aria-hidden="true" /> : <HeartPulseCheckmark20Regular aria-hidden="true" />;
    case "BP at Goal":
      return isWarning ? <FlagOff20Filled aria-hidden="true" /> : <FlagCheckered20Regular aria-hidden="true" />;
    case "Med Adherence":
      return isWarning ? <HistoryDismiss20Filled aria-hidden="true" /> : <History20Regular aria-hidden="true" />;
    case "Escalated":
      return isWarning ? <EmojiAngry20Filled aria-hidden="true" /> : <Emoji20Regular aria-hidden="true" />;
    default:
      return isWarning ? <ShoppingBagDismiss20Filled aria-hidden="true" /> : <ShoppingBagCheckmark20Regular aria-hidden="true" />;
  }
};

export const getNeutralIcon = (label: string) => {
  switch (label) {
    case "Picked up meds": return <ShoppingBag20Regular aria-hidden="true" />;
    case "Taking as Rx": return <Clipboard20Regular aria-hidden="true" />;
    case "Side effects": return <ChatMultiple20Regular aria-hidden="true" />;
    default: return <ShoppingBag20Regular aria-hidden="true" />;
  }
};

// ── Indicator components ────────────────────────────────────────────

export const OutcomeIndicator: FC<{ label: string; value: string; isWarning: boolean }> = ({ label, value, isWarning }) => {
  const styles = useDashboardStyles();
  return (
    <Tooltip content={`${label}: ${value}`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, isWarning ? styles.outcomeBad : styles.outcomeGood)}>
        {getOutcomeIcon(label, isWarning)}
      </span>
    </Tooltip>
  );
};

export const NeutralOutcomeIndicator: FC<{ label: string }> = ({ label }) => {
  const styles = useDashboardStyles();
  return (
    <Tooltip content={`${label}: Pending`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, styles.outcomeNeutralIcon)}>
        {getNeutralIcon(label)}
      </span>
    </Tooltip>
  );
};

export const PainLevelIndicator: FC<{ level: number }> = ({ level }) => {
  const styles = useDashboardStyles();
  const clamped = Math.max(0, Math.min(10, level));
  const getPainClass = (l: number) => {
    if (l === 0) return styles.outcomeGood;
    if (l <= 3) return styles.outcomeYellow;
    if (l <= 6) return styles.outcomeOrange;
    return l >= 7 ? styles.outcomeBadFilled : styles.outcomeBad;
  };
  return (
    <Tooltip content={`Pain level: ${clamped}/10`} relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, getPainClass(clamped))}>
        {clamped}
      </span>
    </Tooltip>
  );
};

export const NeutralPainIndicator: FC = () => {
  const styles = useDashboardStyles();
  return (
    <Tooltip content="Pain level: Pending" relationship="label">
      <span className={mergeClasses(styles.outcomeIcon, styles.outcomeNeutralIcon)}>
        <NumberCircle020Regular aria-hidden="true" />
      </span>
    </Tooltip>
  );
};

// ── Sort icon ───────────────────────────────────────────────────────

export const SortIcon: FC<{ column: SortColumn; sortColumn: SortColumn | null; sortDirection: SortDirection }> = ({ column, sortColumn, sortDirection }) => {
  const styles = useDashboardStyles();
  if (sortColumn === column) {
    return sortDirection === "asc"
      ? <ArrowSortUp16Filled className={styles.sortIcon} />
      : <ArrowSortDown16Filled className={styles.sortIcon} />;
  }
  return <ArrowSort16Regular className={styles.sortIconInactive} />;
};
