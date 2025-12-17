/**
 * FAB (Floating Action Button) Types
 *
 * Type definitions for the FAB component.
 */

export type ScrollDirection = "up" | "down";

export interface FABProps {
  /** Target element or selector to scroll */
  scrollTargetRef?: React.RefObject<HTMLElement>;
  /** Custom scroll target selector */
  scrollTargetSelector?: string;
  /** Threshold in pixels to show/hide the button */
  threshold?: number;
  /** Whether the FAB is visible */
  visible?: boolean;
  /** Callback when scroll action is performed */
  onScroll?: (direction: ScrollDirection) => void;
  /** Custom class name */
  className?: string;
}
