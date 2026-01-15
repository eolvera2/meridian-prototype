/**
 * useTooltipHandlers Hook
 *
 * Manages tooltip visibility, positioning, and user interactions for the MicCursorTooltip.
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  getCaretCoordinates,
  type TextFieldElement,
} from "../../../../utils/getCaretCoordinates";
import type { TooltipPosition } from "../DocumentComponent.types";
import { DOCUMENT_TIMING_MS } from "../DocumentComponent.constants";

export interface UseTooltipHandlersOptions {
  isSimulatingRef: React.RefObject<boolean>;
}

export interface UseTooltipHandlersReturn {
  tooltipVisible: boolean;
  setTooltipVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipPosition: TooltipPosition;
  activeFieldRef: React.RefObject<TextFieldElement | null>;
  focusedFieldRef: React.RefObject<TextFieldElement | null>;
  isHoveringRef: React.RefObject<TextFieldElement | null>;
  cursorTooltipHandlers: {
    onMouseEnter: (event: React.MouseEvent<TextFieldElement>) => void;
    onMouseMove: (event: React.MouseEvent<TextFieldElement>) => void;
    onMouseLeave: () => void;
    onClick: (event: React.MouseEvent<TextFieldElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<TextFieldElement>) => void;
    onKeyUp: (event: React.KeyboardEvent<TextFieldElement>) => void;
    onFocus: (event: React.FocusEvent<TextFieldElement>) => void;
    onBlur: (event: React.FocusEvent<TextFieldElement>) => void;
  };
  updateTooltipFromCaret: (element: TextFieldElement) => void;
}

export const useTooltipHandlers = (
  options: UseTooltipHandlersOptions
): UseTooltipHandlersReturn => {
  const { isSimulatingRef } = options;

  const activeFieldRef = useRef<TextFieldElement | null>(null);
  const focusedFieldRef = useRef<TextFieldElement | null>(null);
  const isHoveringRef = useRef<TextFieldElement | null>(null);
  const tooltipFadeTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
    fieldRect: null,
  });

  const updateTooltipFromCaret = useCallback((element: TextFieldElement) => {
    const coords = getCaretCoordinates(element);
    if (!coords) return;

    const rect = element.getBoundingClientRect();
    setTooltipPosition({
      x: coords.left,
      y: coords.top,
      fieldRect: rect,
    });
  }, []);

  const handleFieldMouseEnter = useCallback(
    (event: React.MouseEvent<TextFieldElement>) => {
      isHoveringRef.current = event.currentTarget;

      // Don't show tooltip if dictation simulation is running
      if (isSimulatingRef.current) {
        return;
      }

      // Only show tooltip if the field is also focused
      if (focusedFieldRef.current !== event.currentTarget) {
        return;
      }

      activeFieldRef.current = event.currentTarget;
      updateTooltipFromCaret(event.currentTarget);
      setTooltipVisible(true);

      // Clear any pending fade timeout
      if (tooltipFadeTimeoutRef.current) {
        clearTimeout(tooltipFadeTimeoutRef.current);
        tooltipFadeTimeoutRef.current = null;
      }
    },
    [isSimulatingRef, updateTooltipFromCaret]
  );

  const handleFieldMouseMove = useCallback(
    (event: React.MouseEvent<TextFieldElement>) => {
      // Don't update tooltip if dictation simulation is running
      if (isSimulatingRef.current) {
        return;
      }

      if (activeFieldRef.current === event.currentTarget) {
        updateTooltipFromCaret(event.currentTarget);
      }
    },
    [isSimulatingRef, updateTooltipFromCaret]
  );

  const handleFieldMouseLeave = useCallback(() => {
    isHoveringRef.current = null;

    // Clear any existing timeout
    if (tooltipFadeTimeoutRef.current) {
      clearTimeout(tooltipFadeTimeoutRef.current);
      tooltipFadeTimeoutRef.current = null;
    }

    // Keep tooltip visible - don't fade it away when mouse leaves
    // The tooltip will remain visible as long as a field is focused
  }, []);

  const handleFieldFocus = useCallback(
    (event: React.FocusEvent<TextFieldElement>) => {
      focusedFieldRef.current = event.currentTarget;

      // Don't show tooltip if dictation simulation is running
      if (isSimulatingRef.current) {
        return;
      }

      // Always set active field and show tooltip on focus (not just when hovering)
      activeFieldRef.current = event.currentTarget;
      updateTooltipFromCaret(event.currentTarget);
      setTooltipVisible(true);

      // Clear any pending fade timeout
      if (tooltipFadeTimeoutRef.current) {
        clearTimeout(tooltipFadeTimeoutRef.current);
        tooltipFadeTimeoutRef.current = null;
      }
    },
    [isSimulatingRef, updateTooltipFromCaret]
  );

  const handleFieldBlur = useCallback(
    (event: React.FocusEvent<TextFieldElement>) => {
      const blurringField = event.currentTarget;

      // Use setTimeout to check if focus moved to another tracked field
      // This allows the focus event on the new field to fire first
      setTimeout(() => {
        // If focus moved to another field, focusedFieldRef will be updated by handleFieldFocus
        // If focusedFieldRef is still null, focus went outside all tracked fields
        if (focusedFieldRef.current === null) {
          // Focus left all tracked fields - keep tooltip at last position
          // activeFieldRef still holds the last focused field for position reference
          // The tooltip remains visible at the last caret position

          // Only hide if the blurring field was the active one and no new field took focus
          if (activeFieldRef.current === blurringField) {
            // Keep activeFieldRef pointing to the last field so tooltip stays in place
            // Don't clear it - this preserves the "last focused" position
          }
        }
      }, DOCUMENT_TIMING_MS.deferToNextTick);

      // Clear the focused ref immediately (it will be set again if another field gets focus)
      focusedFieldRef.current = null;

      if (tooltipFadeTimeoutRef.current) {
        clearTimeout(tooltipFadeTimeoutRef.current);
        tooltipFadeTimeoutRef.current = null;
      }
    },
    []
  );

  const handleFieldClick = useCallback(
    (event: React.MouseEvent<TextFieldElement>) => {
      // Don't show tooltip if dictation simulation is running
      if (isSimulatingRef.current) {
        return;
      }

      if (activeFieldRef.current === event.currentTarget) {
        updateTooltipFromCaret(event.currentTarget);
      }
    },
    [isSimulatingRef, updateTooltipFromCaret]
  );

  const handleFieldKeyDown = useCallback(
    (event: React.KeyboardEvent<TextFieldElement>) => {
      // Don't hide tooltip for non-character keys (arrows, shift, ctrl, etc.)
      const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
      const isNavigationKey = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "Shift",
        "Control",
        "Alt",
        "Meta",
        "Tab",
        "Escape",
        "CapsLock",
      ].includes(event.key);

      if (isModifierKey || isNavigationKey) {
        return;
      }

      // Hide tooltip when user starts typing
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        setTooltipVisible(false);
      }

      // Clear any existing typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    },
    []
  );

  const handleFieldKeyUp = useCallback(
    (event: React.KeyboardEvent<TextFieldElement>) => {
      // Don't show tooltip if dictation simulation is running
      if (isSimulatingRef.current) {
        return;
      }

      // Update tooltip position
      if (activeFieldRef.current === event.currentTarget) {
        updateTooltipFromCaret(event.currentTarget);
      }

      // If user was typing, set a timeout to show tooltip again after 500ms of no typing
      if (isTypingRef.current) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = window.setTimeout(() => {
          isTypingRef.current = false;
          // Only show tooltip if we have an active field
          if (activeFieldRef.current) {
            setTooltipVisible(true);
            updateTooltipFromCaret(activeFieldRef.current);
          }
          typingTimeoutRef.current = null;
        }, DOCUMENT_TIMING_MS.tooltipAfterTypingIdleDelay);
      }
    },
    [isSimulatingRef, updateTooltipFromCaret]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipFadeTimeoutRef.current) {
        clearTimeout(tooltipFadeTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const cursorTooltipHandlers = React.useMemo(
    () => ({
      onMouseEnter: handleFieldMouseEnter,
      onMouseMove: handleFieldMouseMove,
      onMouseLeave: handleFieldMouseLeave,
      onClick: handleFieldClick,
      onKeyDown: handleFieldKeyDown,
      onKeyUp: handleFieldKeyUp,
      onFocus: handleFieldFocus,
      onBlur: handleFieldBlur,
    }),
    [
      handleFieldMouseEnter,
      handleFieldMouseMove,
      handleFieldMouseLeave,
      handleFieldClick,
      handleFieldKeyDown,
      handleFieldKeyUp,
      handleFieldFocus,
      handleFieldBlur,
    ]
  );

  return {
    tooltipVisible,
    setTooltipVisible,
    tooltipPosition,
    activeFieldRef,
    focusedFieldRef,
    isHoveringRef,
    cursorTooltipHandlers,
    updateTooltipFromCaret,
  };
};
