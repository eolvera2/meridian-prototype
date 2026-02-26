import type { FC } from "react";
import { mergeClasses } from "@fluentui/react-components";
import { useDashboardStyles } from "../CareCoordinationDashboard.styles";

interface SummaryCountersProps {
  total: number;
  needsReviewCount: number;
  inProgressCount: number;
  reviewedCount: number;
  scheduledCount: number;
  retryCount: number;
}

export const SummaryCounters: FC<SummaryCountersProps> = ({
  total,
  needsReviewCount,
  inProgressCount,
  reviewedCount,
  scheduledCount,
  retryCount,
}) => {
  const styles = useDashboardStyles();

  return (
    <div className={styles.summaryCounts}>
      <span>
        Total: <strong>{total}</strong>
      </span>
      <div className={styles.summaryCountsGrid}>
        <span className={styles.summaryCountItem}>
          <span className={styles.summaryCountLabel} style={{ width: "82px" }}>Need Review:</span>
          <span className={mergeClasses(styles.countBadge, styles.countBadgeReview)}>
            {needsReviewCount}
          </span>
        </span>
        <span className={styles.summaryCountItem}>
          <span className={styles.summaryCountLabel} style={{ width: "74px" }}>In Progress:</span>
          <span className={mergeClasses(styles.countBadge, styles.countBadgeCompleted)}>
            {inProgressCount}
          </span>
        </span>
        <span className={styles.summaryCountItem}>
          <span className={styles.summaryCountLabel} style={{ width: "62px" }}>Reviewed:</span>
          <span className={mergeClasses(styles.countBadge, styles.countBadgeReviewed)}>
            {reviewedCount}
          </span>
        </span>
        <span className={styles.summaryCountItem}>
          <span className={styles.summaryCountLabel} style={{ width: "82px" }}>Scheduled:</span>
          <span className={mergeClasses(styles.countBadge, styles.countBadgeRetry)}>
            {scheduledCount}
          </span>
        </span>
        <span className={styles.summaryCountItem}>
          <span className={styles.summaryCountLabel} style={{ width: "74px" }}>Will Retry:</span>
          <span className={mergeClasses(styles.countBadge, styles.countBadgeRetry)}>
            {retryCount}
          </span>
        </span>
      </div>
    </div>
  );
};
