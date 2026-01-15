import React from "react";
import {
  makeStyles,
  tokens,
  Button,
  mergeClasses,
  Card,
} from "@fluentui/react-components";
import {
  MoreHorizontal20Regular,
  NoteAdd20Regular,
} from "@fluentui/react-icons";
import DragonCopilotLogo from "../../assets/logo.svg";
import { useI18n } from "../../i18n/I18nContext";

// Types
interface Memo {
  id: string;
  author: string;
  isAIGenerated: boolean;
  timestamp: Date;
  title: string;
  description: string;
}

interface MemoGroup {
  label: string;
  memos: Memo[];
}

// Helper to format relative dates
const formatDateLabel = (
  date: Date,
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string,
  t: (key: string) => string
): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const memoDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (memoDate.getTime() === today.getTime()) {
    return t("common.today");
  }
  if (memoDate.getTime() === yesterday.getTime()) {
    return t("common.yesterday");
  }

  // Format as "Wednesday, November 27"
  return formatDate(date, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

// Group memos by date
const groupMemosByDate = (
  memos: Memo[],
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string,
  t: (key: string) => string
): MemoGroup[] => {
  const groups: Map<string, Memo[]> = new Map();

  // Sort memos by date descending
  const sortedMemos = [...memos].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  sortedMemos.forEach((memo) => {
    const label = formatDateLabel(memo.timestamp, formatDate, t);
    const existing = groups.get(label) || [];
    groups.set(label, [...existing, memo]);
  });

  return Array.from(groups.entries()).map(([label, memos]) => ({
    label,
    memos,
  }));
};

// Generate sample memos with current week dates
const generateSampleMemos = (t: (key: string) => string): Memo[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const fourDaysAgo = new Date(today);
  fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

  return [
    {
      id: "1",
      author: "Dr. Sarah Mitchell",
      isAIGenerated: false,
      timestamp: new Date(
        today.getTime() + 10 * 60 * 60 * 1000 + 45 * 60 * 1000
      ), // 10:45 AM today
      title: t("memos.sample.1.title"),
      description: t("memos.sample.1.description"),
    },
    {
      id: "2",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        today.getTime() + 9 * 60 * 60 * 1000 + 15 * 60 * 1000
      ), // 9:15 AM today
      title: t("memos.sample.2.title"),
      description: t("memos.sample.2.description"),
    },
    {
      id: "3",
      author: "Dr. James Wilson",
      isAIGenerated: false,
      timestamp: new Date(
        yesterday.getTime() + 14 * 60 * 60 * 1000 + 30 * 60 * 1000
      ), // 2:30 PM yesterday
      title: t("memos.sample.3.title"),
      description: t("memos.sample.3.description"),
    },
    {
      id: "4",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        yesterday.getTime() + 11 * 60 * 60 * 1000 + 20 * 60 * 1000
      ), // 11:20 AM yesterday
      title: t("memos.sample.4.title"),
      description: t("memos.sample.4.description"),
    },
    {
      id: "5",
      author: "Dr. Sarah Mitchell",
      isAIGenerated: false,
      timestamp: new Date(
        twoDaysAgo.getTime() + 16 * 60 * 60 * 1000 + 10 * 60 * 1000
      ), // 4:10 PM
      title: t("memos.sample.5.title"),
      description: t("memos.sample.5.description"),
    },
    {
      id: "6",
      author: t("app.title"),
      isAIGenerated: true,
      timestamp: new Date(
        threeDaysAgo.getTime() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000
      ), // 8:45 AM
      title: t("memos.sample.6.title"),
      description: t("memos.sample.6.description"),
    },
    {
      id: "7",
      author: "Dr. Emily Chen",
      isAIGenerated: false,
      timestamp: new Date(
        fourDaysAgo.getTime() + 13 * 60 * 60 * 1000 + 55 * 60 * 1000
      ), // 1:55 PM
      title: t("memos.sample.7.title"),
      description: t("memos.sample.7.description"),
    },
  ];
};

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  memosList: {
    flex: 1,
    overflowY: "auto",
    padding: "0 16px 80px 16px", // Extra bottom padding for FAB
  },
  dateGroup: {
    marginBottom: "var(--spacing-large)",
  },
  dateLabel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
  },
  dateLineLeft: {
    width: "12px",
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  dateLine: {
    flex: 1,
    height: "1px",
    backgroundColor: tokens.colorNeutralStroke2,
  },
  memoCard: {
    marginBottom: "var(--spacing-large)",
    padding: "12px 16px",
  },
  memoHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "var(--spacing-large)",
  },
  authorSection: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  authorLogo: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
  },
  authorName: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightRegular,
  },
  authorNameAI: {
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
  },
  moreButton: {
    minWidth: "auto",
    padding: "var(--spacing-small-4)",
    color: tokens.colorNeutralForeground3,
  },
  timestamp: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  memoTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: "4px",
    lineHeight: tokens.lineHeightBase300,
  },
  memoDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fabContainer: {
    position: "absolute",
    bottom: "14px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "var(--z-index-navigation)",
  },
  fabButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "var(--border-radius-pill)",
    padding: "8px 16px",
    boxShadow: tokens.shadow8,
    display: "flex",
    alignItems: "center",
    gap: "var(--gap-large)",
    cursor: "pointer",
    transition: "var(--transition-ease-fast)",
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground3,
      boxShadow: tokens.shadow16,
    },
  },
  fabIcon: {
    color: "black",
  },
  fabText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
});

interface MemoCardProps {
  memo: Memo;
  styles: ReturnType<typeof useStyles>;
}

/**
 * Memoized MemoCard component to prevent re-renders when unrelated memos change.
 * Only re-renders when the memo data or styles reference changes.
 */
const MemoCard = React.memo<MemoCardProps>(({ memo, styles }) => {
  const { formatTime, t } = useI18n();

  return (
    <Card className={styles.memoCard} appearance="filled">
      <div className={styles.memoHeader}>
        <div className={styles.authorSection}>
          {memo.isAIGenerated && (
            <img
              src={DragonCopilotLogo}
              alt={t("app.title")}
              className={styles.authorLogo}
            />
          )}
          <span
            className={mergeClasses(
              styles.authorName,
              memo.isAIGenerated && styles.authorNameAI
            )}
          >
            {memo.author}
          </span>
        </div>
        <div className={styles.headerRight}>
          <Button
            appearance="subtle"
            icon={<MoreHorizontal20Regular />}
            className={styles.moreButton}
            aria-label={t("memos.moreOptions")}
          />
          <span className={styles.timestamp}>
            {formatTime(memo.timestamp, {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      </div>
      <div className={styles.memoTitle}>{memo.title}</div>
      <div className={styles.memoDescription}>{memo.description}</div>
    </Card>
  );
});

export const MemosPanel: React.FC = () => {
  const { formatDate, t } = useI18n();
  const styles = useStyles();
  const memos = React.useMemo(() => generateSampleMemos(t), [t]);
  const groupedMemos = React.useMemo(
    () => groupMemosByDate(memos, formatDate, t),
    [memos, formatDate, t]
  );

  const handleAddMemo = () => {
    // Placeholder - will be implemented later
  };

  return (
    <div className={styles.container}>
      <div
        className={mergeClasses(
          styles.memosList,
          "right-drawer-scroll-container"
        )}
      >
        {groupedMemos.map((group) => (
          <div key={group.label} className={styles.dateGroup}>
            <div className={styles.dateLabel}>
              <span className={styles.dateLineLeft} />
              <span>{group.label}</span>
              <span className={styles.dateLine} />
            </div>
            {group.memos.map((memo) => (
              <MemoCard key={memo.id} memo={memo} styles={styles} />
            ))}
          </div>
        ))}
      </div>

      <div className={styles.fabContainer}>
        <button className={styles.fabButton} onClick={handleAddMemo}>
          <NoteAdd20Regular className={styles.fabIcon} />
          <span className={styles.fabText}>{t("memos.addMemo")}</span>
        </button>
      </div>
    </div>
  );
};

export default MemosPanel;
