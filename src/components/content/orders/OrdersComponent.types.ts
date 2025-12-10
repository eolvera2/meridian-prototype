/**
 * OrdersComponent Types
 *
 * Type definitions for the OrdersComponent.
 */

/**
 * An order item in the orders list.
 */
export interface OrderItem {
  id: string;
  text: string;
  code?: string;
}

/**
 * Props for the OrdersComponent.
 */
export interface OrdersComponentProps {
  /** Title of the orders card */
  title?: string;
  /** Date when orders were created */
  createdDate?: string;
  /** List of order items */
  orders?: OrderItem[];
  /** Whether the orders card is expanded */
  isExpanded?: boolean;
  /** Callback when expand/collapse is toggled */
  onToggleExpand?: () => void;
  /** Callback when an order text is changed */
  onOrderChange?: (orderId: string, text: string) => void;
  /** Callback when an order is deleted */
  onOrderDelete?: (orderId: string) => void;
  /** Callback when add order is clicked */
  onAddOrder?: () => void;
}
