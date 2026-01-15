/**
 * OrdersComponent
 *
 * Displays and manages a list of orders with an expandable card UI.
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@fluentui/react-components";
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
  ArrowExportUp20Regular,
  ArrowSync20Regular,
  History20Regular,
  Cart20Regular,
  MoreVertical20Regular,
  Add20Regular,
  Delete20Regular,
  Copy20Regular,
  Dismiss24Regular,
  PersonFeedback20Regular,
} from "@fluentui/react-icons";
import { useStyles } from "./OrdersComponent.styles";
import type { OrdersComponentProps, OrderItem } from "./OrdersComponent.types";
import { useOptionalTooltipContext } from "../tooltip";
import { useI18n } from "../../../i18n/I18nContext";

export const OrdersComponent: React.FC<OrdersComponentProps> = ({
  title,
  createdDate,
  orders: initialOrders = [
    { id: "1", text: "Start spironolactone 25 mg daily.", code: "150.33" },
    { id: "2", text: "Continue metoprolol succinate 50 mg daily." },
  ],
  isExpanded: controlledExpanded,
  onToggleExpand,
  onOrderChange,
  onOrderDelete,
  onAddOrder,
}) => {
  const styles = useStyles();
  const { t } = useI18n();
  const resolvedTitle = title ?? t("orders.title");
  const resolvedCreatedDate = createdDate ?? t("orders.createdDateSample");
  const [internalExpanded, setInternalExpanded] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [focusedOrderId, setFocusedOrderId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [previousOrderText, setPreviousOrderText] = useState<string>("");

  // Track the last non-empty value for each order - initialize immediately with initial values
  const lastNonEmptyValues = useRef<Record<string, string>>(
    initialOrders.reduce((acc, order) => {
      if (order.text.trim() !== "") {
        acc[order.id] = order.text;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  // Update lastNonEmptyValues when orders change (for new orders added)
  useEffect(() => {
    orders.forEach((order) => {
      if (order.text.trim() !== "" && !lastNonEmptyValues.current[order.id]) {
        lastNonEmptyValues.current[order.id] = order.text;
      }
    });
  }, [orders]);

  // Get optional tooltip context for mic cursor tooltip support
  const tooltipContext = useOptionalTooltipContext();
  const cursorTooltipHandlers = tooltipContext?.cursorTooltipHandlers;

  const isExpanded = controlledExpanded ?? internalExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const handleOrderChange = (orderId: string, text: string) => {
    // If text is cleared (empty), treat it as a deletion attempt
    if (text.trim() === "") {
      const previousText = lastNonEmptyValues.current[orderId];
      if (previousText && previousText.trim() !== "") {
        // Store the previous text before clearing
        setPreviousOrderText(previousText);
        setOrderToDelete(orderId);
        setDeleteDialogOpen(true);
        return;
      }
    } else {
      // Update the last non-empty value
      lastNonEmptyValues.current[orderId] = text;
    }

    if (onOrderChange) {
      onOrderChange(orderId, text);
    } else {
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, text } : order))
      );
    }
  };

  const handleDeleteClick = (orderId: string) => {
    const orderToDelete = orders.find((order) => order.id === orderId);
    if (orderToDelete) {
      setPreviousOrderText(orderToDelete.text);
    }
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      if (onOrderDelete) {
        onOrderDelete(orderToDelete);
      } else {
        setOrders((prev) => prev.filter((order) => order.id !== orderToDelete));
      }
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
    setPreviousOrderText("");
  };

  const handleCancelDelete = () => {
    // Restore the previous text if user cancels
    if (orderToDelete && previousOrderText) {
      if (onOrderChange) {
        onOrderChange(orderToDelete, previousOrderText);
      } else {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderToDelete
              ? { ...order, text: previousOrderText }
              : order
          )
        );
      }
    }
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
    setPreviousOrderText("");
  };

  const handleAddOrder = () => {
    if (onAddOrder) {
      onAddOrder();
    } else {
      const newId = String(orders.length + 1);
      setOrders((prev) => [...prev, { id: newId, text: "" }]);
    }
  };

  return (
    <div className={styles.ordersCard}>
      <div className={styles.accordionHeader}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <button
            className={styles.expandButton}
            onClick={handleToggleExpand}
            aria-label={isExpanded ? t("orders.collapse") : t("orders.expand")}
          >
            {isExpanded ? (
              <ChevronDown20Regular
                style={{ color: "var(--colorNeutralForeground2)" }}
              />
            ) : (
              <ChevronRight20Regular
                style={{ color: "var(--colorNeutralForeground2)" }}
              />
            )}
          </button>

          <div className={styles.headerContent}>
            <div className={styles.eyebrow}>
              <span>{t("orders.createdLabel")}</span>
              <span>{resolvedCreatedDate}</span>
            </div>
            <h3 className={styles.title}>{resolvedTitle}</h3>
          </div>

          <button
            className={styles.menuButton}
            aria-label={t("common.moreOptions")}
          >
            <MoreVertical20Regular
              style={{ color: "var(--colorNeutralForeground2)" }}
            />
          </button>
        </div>

        {/* Toolbar - only visible when expanded */}
        {isExpanded && (
          <div className={styles.toolbar}>
            <div className={styles.toolbarActions}>
              <div className={styles.leftActions}>
                <button
                  className={styles.toolbarButton}
                  aria-label={t("orders.toolbar.export")}
                >
                  <ArrowExportUp20Regular />
                </button>
                <button
                  className={styles.toolbarButton}
                  aria-label={t("orders.toolbar.sync")}
                >
                  <ArrowSync20Regular />
                </button>
                <button
                  className={styles.toolbarButton}
                  aria-label={t("orders.toolbar.history")}
                >
                  <History20Regular />
                </button>
                <button
                  className={styles.toolbarButton}
                  aria-label={t("orders.toolbar.cart")}
                >
                  <Cart20Regular />
                </button>
              </div>
              <button
                className={styles.toolbarButton}
                aria-label={t("orders.toolbar.feedback")}
              >
                <PersonFeedback20Regular />
              </button>
            </div>
            <div className={styles.divider} />
          </div>
        )}
      </div>

      {/* Orders Content - only visible when expanded */}
      {isExpanded && (
        <div className={styles.ordersContent}>
          <div className={styles.structuredPlan}>
            {orders.map((order, index) => (
              <div key={order.id} className={styles.orderItem}>
                {/* Badge with order number */}
                <div className={styles.orderBadge}>
                  <span className={styles.orderBadgeText}>{index + 1}</span>
                </div>

                {/* Order text - editable input with transparent background */}
                <div className={styles.orderTextContainer}>
                  <input
                    type="text"
                    className={styles.orderText}
                    value={order.text}
                    onChange={(e) =>
                      handleOrderChange(order.id, e.target.value)
                    }
                    onFocus={(e) => {
                      setFocusedOrderId(order.id);
                      cursorTooltipHandlers?.onFocus(e);
                    }}
                    onBlur={(e) => {
                      setFocusedOrderId(null);
                      cursorTooltipHandlers?.onBlur(e);
                    }}
                    onKeyDown={cursorTooltipHandlers?.onKeyDown}
                    onKeyUp={cursorTooltipHandlers?.onKeyUp}
                    onClick={cursorTooltipHandlers?.onClick}
                    onMouseEnter={cursorTooltipHandlers?.onMouseEnter}
                    onMouseMove={cursorTooltipHandlers?.onMouseMove}
                    onMouseLeave={cursorTooltipHandlers?.onMouseLeave}
                  />
                  {focusedOrderId === order.id && (
                    <div className={styles.orderFocusIndicator} />
                  )}
                </div>

                {/* Copy button with code (if code exists) */}
                {order.code && (
                  <button
                    className={styles.codeButton}
                    aria-label={t("orders.copyCode")}
                  >
                    <Copy20Regular className={styles.codeIcon} />
                    <span className={styles.codeText}>{order.code}</span>
                  </button>
                )}

                {/* Delete button */}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(order.id)}
                  aria-label={t("orders.deleteOrder")}
                >
                  <Delete20Regular />
                </button>
              </div>
            ))}

            {/* Add order button */}
            <button
              className={styles.addOrderButton}
              onClick={handleAddOrder}
              aria-label={t("orders.addOrder")}
            >
              <Add20Regular className="icon-size-20" />
              <span className={styles.addOrderText}>
                {t("orders.addOrderText")}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(_, data) => {
          if (!data.open) {
            handleCancelDelete();
          }
        }}
      >
        <DialogSurface className={styles.dialogSurface}>
          <DialogBody>
            <div className={styles.dialogHeader}>
              <DialogTitle className={styles.dialogTitle}>
                {t("orders.removeOrderTitle")}
              </DialogTitle>
              <button
                className={styles.dialogCloseButton}
                onClick={handleCancelDelete}
                aria-label={t("orders.closeDialog")}
              >
                <Dismiss24Regular />
              </button>
            </div>
            <DialogContent className={styles.dialogContent}>
              {t("orders.removeOrderBody")}
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
              <Button appearance="secondary" onClick={handleCancelDelete}>
                {t("common.cancel")}
              </Button>
              <Button appearance="primary" onClick={handleConfirmDelete}>
                {t("orders.remove")}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default OrdersComponent;
