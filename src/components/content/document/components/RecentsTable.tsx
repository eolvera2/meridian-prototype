/**
 * RecentsTable Component
 * Displays a table of recent documents with name, order count, and timestamps
 */

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCellLayout,
  tokens,
} from "@fluentui/react-components";
import type {
  DocumentGridItem,
  DocumentData,
} from "../DocumentComponent.types";
import { useStyles } from "../DocumentComponent.styles";

export interface RecentsTableProps {
  /** Grid items to display */
  gridItems: DocumentGridItem[];
  /** Order counts per document (updated dynamically) */
  orderCounts: Record<string, number>;
  /** Callback when a document is clicked */
  onDocumentClick: (documentId: string) => void;
  /** Whether ambient recording has stopped (triggers timestamp update) */
  ambientRecordingStopped?: boolean;
}

/**
 * Helper to get order count for a document
 */
function getOrderCount(
  doc: DocumentData,
  orderCounts: Record<string, number>
): string {
  // First check if we have a tracked count (from card updates)
  if (orderCounts[doc.id] !== undefined) {
    return orderCounts[doc.id] > 0 ? String(orderCounts[doc.id]) : "";
  }
  // Fallback to initial document data
  if (doc.type === "orders") {
    const section = doc.sections?.[0];
    const count = section?.orderItems?.length ?? 0;
    return count > 0 ? String(count) : "";
  }
  return doc.orders && doc.orders > 0 ? String(doc.orders) : "";
}

/**
 * Helper to get timestamp display for a document
 */
function getTimestampDisplay(
  doc: DocumentData,
  ambientRecordingStopped?: boolean
): {
  created: string;
  modified: string;
} {
  // Check if document has "--" timestamp (empty/initial state)
  if (doc.created === "--") {
    return { created: "--", modified: "--" };
  }

  // Check if document was just generated (12:00 PM timestamp)
  if (doc.created === "12:00 PM") {
    // If document has a modified field, use it
    if (doc.modified) {
      return {
        created: "Created today at 12:00 PM",
        modified: `Modified today at ${doc.modified}`,
      };
    }
    return { created: "Created today at 12:00 PM", modified: "" };
  }

  // Check if document was created at 12:20 PM (task4 success / task5 start for Referral Letter)
  if (doc.created === "12:20 PM") {
    // If document has a modified field, use it
    if (doc.modified) {
      return {
        created: "Created today at 12:20 PM",
        modified: `Modified today at ${doc.modified}`,
      };
    }
    return { created: "Created today at 12:20 PM", modified: "" };
  }

  // Get current time for newly added documents
  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // When ambient recording stops, show updated timestamps
  if (ambientRecordingStopped) {
    if (doc.type === "orders") {
      return {
        created: "Created today at 12:00 PM",
        modified: "",
      };
    }
    if (doc.type === "progress-note") {
      return {
        created: "Created today at 12:00 PM",
        modified: "",
      };
    }
    return { created: `Created today at ${currentTime}`, modified: "" };
  }

  // Default timestamps before recording stops
  if (doc.type === "orders") {
    return {
      created: "Created today at 11:45 AM",
      modified: "Modified Today at 12:02 PM",
    };
  }
  if (doc.type === "progress-note") {
    return {
      created: "Created today at 11:32 AM",
      modified: "Modified Today at 11:58 AM",
    };
  }

  // For newly added documents (referral-letter, well-visit, annual, etc.)
  // Show created timestamp with current time
  return { created: `Created today at ${currentTime}`, modified: "" };
}

/**
 * RecentsTable renders a table showing recent documents
 */
export function RecentsTable({
  gridItems,
  orderCounts,
  onDocumentClick,
  ambientRecordingStopped,
}: RecentsTableProps) {
  const styles = useStyles();

  return (
    <div className={styles.table}>
      <div className={styles.tableWrapper}>
        <Table aria-label="Recent documents" className={styles.recentGrid}>
          <TableBody>
            {gridItems.map((item) => {
              const orderCount = getOrderCount(item.document, orderCounts);
              const timestamps = getTimestampDisplay(
                item.document,
                ambientRecordingStopped
              );
              return (
                <TableRow key={item.id}>
                  <TableCell style={{ width: "50%" }}>
                    <TableCellLayout>
                      <a
                        href="#"
                        className={styles.documentLink}
                        onClick={(e) => {
                          e.preventDefault();
                          onDocumentClick(item.id);
                        }}
                        title={item.name}
                      >
                        {item.document.type === "orders" && orderCount
                          ? `Orders (${orderCount})`
                          : item.name}
                      </a>
                    </TableCellLayout>
                  </TableCell>
                  <TableCell style={{ width: "50%" }}>
                    <TableCellLayout>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        <div className={styles.timestampText}>
                          {timestamps.created}
                        </div>
                        {timestamps.modified && (
                          <div
                            className={styles.timestampText}
                            style={{
                              color: tokens.colorNeutralForeground3,
                            }}
                          >
                            {timestamps.modified}
                          </div>
                        )}
                      </div>
                    </TableCellLayout>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
