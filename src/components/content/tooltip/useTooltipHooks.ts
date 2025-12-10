/**
 * Tooltip Hooks
 *
 * Separated from TooltipContext to avoid React Fast Refresh compatibility issues.
 */

import { useContext } from "react";
import { TooltipContext } from "./TooltipContext";

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltipContext must be used within a TooltipProvider");
  }
  return context;
};

// Optional hook that returns null if not in context (for optional usage)
export const useOptionalTooltipContext = () => {
  return useContext(TooltipContext);
};
