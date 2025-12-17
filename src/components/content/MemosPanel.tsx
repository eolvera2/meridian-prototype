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
const formatDateLabel = (date: Date): string => {
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
    return "Today";
  }
  if (memoDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  // Format as "Wednesday, November 27"
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

// Helper to format time
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Group memos by date
const groupMemosByDate = (memos: Memo[]): MemoGroup[] => {
  const groups: Map<string, Memo[]> = new Map();

  // Sort memos by date descending
  const sortedMemos = [...memos].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  sortedMemos.forEach((memo) => {
    const label = formatDateLabel(memo.timestamp);
    const existing = groups.get(label) || [];
    groups.set(label, [...existing, memo]);
  });

  return Array.from(groups.entries()).map(([label, memos]) => ({
    label,
    memos,
  }));
};

// Generate sample memos with current week dates
const generateSampleMemos = (): Memo[] => {
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
      title: "Cardiac Monitoring Follow-up",
      description:
        "Review ECG results from this morning. Patient showing improved rhythm stability. Continue current medication protocol.",
    },
    {
      id: "2",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        today.getTime() + 9 * 60 * 60 * 1000 + 15 * 60 * 1000
      ), // 9:15 AM today
      title: "Lab Results Summary",
      description:
        "Recent CBC shows elevated WBC count (12.5). Consider infection workup if symptoms persist. Recommend repeat in 48 hours.",
    },
    {
      id: "3",
      author: "Dr. James Wilson",
      isAIGenerated: false,
      timestamp: new Date(
        yesterday.getTime() + 14 * 60 * 60 * 1000 + 30 * 60 * 1000
      ), // 2:30 PM yesterday
      title: "Medication Adjustment Notes",
      description:
        "Increased metoprolol to 50mg BID due to persistent tachycardia. Monitor BP closely over next 72 hours.",
    },
    {
      id: "4",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        yesterday.getTime() + 11 * 60 * 60 * 1000 + 20 * 60 * 1000
      ), // 11:20 AM yesterday
      title: "Risk Assessment Update",
      description:
        "Based on recent vitals and lab trends, cardiovascular risk score has decreased. Recommend continuing current treatment plan.",
    },
    {
      id: "5",
      author: "Dr. Sarah Mitchell",
      isAIGenerated: false,
      timestamp: new Date(
        twoDaysAgo.getTime() + 16 * 60 * 60 * 1000 + 10 * 60 * 1000
      ), // 4:10 PM
      title: "Discharge Planning Discussion",
      description:
        "Patient stable for discharge within 48-72 hours. Coordinate with social work for home care arrangements.",
    },
    {
      id: "6",
      author: "Dragon Copilot",
      isAIGenerated: true,
      timestamp: new Date(
        threeDaysAgo.getTime() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000
      ), // 8:45 AM
      title: "Vital Signs Trend Analysis",
      description:
        "Blood pressure showing downward trend over past 3 days. Current average 128/82. Heart rate stable at 72 bpm.",
    },
    {
      id: "7",
      author: "Dr. Emily Chen",
      isAIGenerated: false,
      timestamp: new Date(
        fourDaysAgo.getTime() + 13 * 60 * 60 * 1000 + 55 * 60 * 1000
      ), // 1:55 PM
      title: "Consultation Request - Cardiology",
      description:
        "Requesting cardiology consult for evaluation of new murmur detected during morning rounds. Echo recommended.",
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
    marginBottom: "8px",
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
    marginBottom: "8px",
    padding: "12px 16px",
  },
  memoHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  authorSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    gap: "8px",
  },
  moreButton: {
    minWidth: "auto",
    padding: "4px",
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
    zIndex: 10,
  },
  fabButton: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "20px",
    padding: "8px 16px",
    boxShadow: tokens.shadow8,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
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

const MemoCard: React.FC<MemoCardProps> = ({ memo, styles }) => {
  return (
    <Card className={styles.memoCard} appearance="filled">
      <div className={styles.memoHeader}>
        <div className={styles.authorSection}>
          {memo.isAIGenerated && (
            <img
              src={DragonCopilotLogo}
              alt="Dragon Copilot"
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
            aria-label="More options"
          />
          <span className={styles.timestamp}>{formatTime(memo.timestamp)}</span>
        </div>
      </div>
      <div className={styles.memoTitle}>{memo.title}</div>
      <div className={styles.memoDescription}>{memo.description}</div>
    </Card>
  );
};

export const MemosPanel: React.FC = () => {
  const styles = useStyles();
  const memos = React.useMemo(() => generateSampleMemos(), []);
  const groupedMemos = React.useMemo(() => groupMemosByDate(memos), [memos]);

  const handleAddMemo = () => {
    // Placeholder - will be implemented later
    console.log("Add memo clicked");
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
          <span className={styles.fabText}>Add a memo</span>
        </button>
      </div>
    </div>
  );
};

export default MemosPanel;
