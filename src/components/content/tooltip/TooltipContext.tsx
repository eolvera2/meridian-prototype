/* eslint-disable react-refresh/only-export-components */
/**
 * TooltipContext
 *
 * Provides global access to the MicCursorTooltip handlers for any input/textarea in the app.
 */

import React, {
  createContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  getCaretCoordinates,
  type TextFieldElement,
} from "../../../utils/getCaretCoordinates";

export interface TooltipPosition {
  x: number;
  y: number;
  fieldRect: DOMRect | null;
}

export interface TooltipHandlers {
  onMouseEnter: (event: React.MouseEvent<TextFieldElement>) => void;
  onMouseMove: (event: React.MouseEvent<TextFieldElement>) => void;
  onMouseLeave: () => void;
  onClick: (event: React.MouseEvent<TextFieldElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<TextFieldElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<TextFieldElement>) => void;
  onFocus: (event: React.FocusEvent<TextFieldElement>) => void;
  onBlur: (event: React.FocusEvent<TextFieldElement>) => void;
}

export interface TooltipContextValue {
  tooltipVisible: boolean;
  setTooltipVisible: React.Dispatch<React.SetStateAction<boolean>>;
  tooltipPosition: TooltipPosition;
  activeFieldRef: React.MutableRefObject<TextFieldElement | null>;
  cursorTooltipHandlers: TooltipHandlers;
  updateTooltipFromCaret: (element: TextFieldElement) => void;
  isSimulatingRef: React.MutableRefObject<boolean>;
}

export const TooltipContext = createContext<TooltipContextValue | null>(null);

interface TooltipProviderProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProviderProps> = ({
  children,
}) => {
  const activeFieldRef = useRef<TextFieldElement | null>(null);
  const focusedFieldRef = useRef<TextFieldElement | null>(null);
  const tooltipFadeTimeoutRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const focusDelayTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);
  const isSimulatingRef = useRef(false);

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

  // Mouse handlers are no-ops - tooltip visibility is controlled by focus only
  const handleFieldMouseEnter = useCallback(() => {
    // No-op: tooltip visibility is controlled by focus, not mouse
  }, []);

  const handleFieldMouseMove = useCallback(() => {
    // No-op: tooltip position is fixed relative to field, not dependent on mouse
  }, []);

  const handleFieldMouseLeave = useCallback(() => {
    // No-op: tooltip visibility is controlled by focus, not mouse
  }, []);

  const handleFieldFocus = useCallback(
    (event: React.FocusEvent<TextFieldElement>) => {
      // Fluent UI Textarea has a wrapper element - event.target is the actual textarea
      // while event.currentTarget might be the wrapper. Use event.target if it's a textarea/input
      let targetField = event.currentTarget;
      const eventTarget = event.target as HTMLElement;

      // If event.target is a textarea or input, use it instead (Fluent UI case)
      if (
        eventTarget &&
        (eventTarget.nodeName === "TEXTAREA" ||
          eventTarget.nodeName === "INPUT")
      ) {
        targetField = eventTarget as TextFieldElement;
      }

      focusedFieldRef.current = targetField;
      activeFieldRef.current = targetField;

      // Clear any existing focus delay timeout
      if (focusDelayTimeoutRef.current) {
        clearTimeout(focusDelayTimeoutRef.current);
        focusDelayTimeoutRef.current = null;
      }

      // Clear any existing fade timeout
      if (tooltipFadeTimeoutRef.current) {
        clearTimeout(tooltipFadeTimeoutRef.current);
        tooltipFadeTimeoutRef.current = null;
      }

      // Show tooltip visible immediately, but defer position calculation
      // to ensure element is properly laid out (especially for Fluent UI components)
      setTooltipVisible(true);

      // Use requestAnimationFrame to ensure the element has been painted and has valid dimensions
      requestAnimationFrame(() => {
        // Double-check the field is still focused
        if (focusedFieldRef.current === targetField) {
          updateTooltipFromCaret(targetField);
        }
      });
    },
    [updateTooltipFromCaret]
  );

  const handleFieldBlur = useCallback(
    (event: React.FocusEvent<TextFieldElement>) => {
      // Handle Fluent UI wrapper case - use event.target if it's the actual textarea/input
      let blurringField = event.currentTarget;
      const eventTarget = event.target as HTMLElement;

      if (
        eventTarget &&
        (eventTarget.nodeName === "TEXTAREA" ||
          eventTarget.nodeName === "INPUT")
      ) {
        blurringField = eventTarget as TextFieldElement;
      }

      // Hide tooltip when field loses focus
      setTooltipVisible(false);

      // Clear focus delay timeout when blurring
      if (focusDelayTimeoutRef.current) {
        clearTimeout(focusDelayTimeoutRef.current);
        focusDelayTimeoutRef.current = null;
      }

      setTimeout(() => {
        if (focusedFieldRef.current === null) {
          if (activeFieldRef.current === blurringField) {
            // Keep activeFieldRef pointing to the last field
          }
        }
      }, 0);

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
      if (activeFieldRef.current === event.currentTarget) {
        updateTooltipFromCaret(event.currentTarget);
      }
    },
    [updateTooltipFromCaret]
  );

  const handleFieldKeyDown = useCallback(
    (event: React.KeyboardEvent<TextFieldElement>) => {
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

      if (isModifierKey || isNavigationKey) return;

      if (!isTypingRef.current) {
        isTypingRef.current = true;
        setTooltipVisible(false);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    },
    []
  );

  const handleFieldKeyUp = useCallback(
    (event: React.KeyboardEvent<TextFieldElement>) => {
      if (isSimulatingRef.current) return;

      if (activeFieldRef.current === event.currentTarget) {
        updateTooltipFromCaret(event.currentTarget);
      }

      if (isTypingRef.current) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        // Show tooltip after 1 second delay when typing stops
        typingTimeoutRef.current = window.setTimeout(() => {
          isTypingRef.current = false;
          if (activeFieldRef.current) {
            setTooltipVisible(true);
            updateTooltipFromCaret(activeFieldRef.current);
          }
          typingTimeoutRef.current = null;
        }, 1000);
      }
    },
    [updateTooltipFromCaret]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipFadeTimeoutRef.current)
        clearTimeout(tooltipFadeTimeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (focusDelayTimeoutRef.current)
        clearTimeout(focusDelayTimeoutRef.current);
    };
  }, []);

  // Hide tooltip during scroll, show when scroll stops
  useEffect(() => {
    let scrollEndTimeout: number | null = null;

    const handleScroll = () => {
      if (tooltipVisible) {
        setTooltipVisible(false);
      }

      if (scrollEndTimeout !== null) {
        clearTimeout(scrollEndTimeout);
      }

      scrollEndTimeout = window.setTimeout(() => {
        const currentActiveField = activeFieldRef.current;
        if (currentActiveField) {
          const rect = currentActiveField.getBoundingClientRect();
          const isInViewport =
            rect.top >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.left >= 0 &&
            rect.right <= window.innerWidth;

          if (isInViewport) {
            updateTooltipFromCaret(currentActiveField);
            setTooltipVisible(true);
          }
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (scrollEndTimeout !== null) {
        clearTimeout(scrollEndTimeout);
      }
    };
  }, [tooltipVisible, updateTooltipFromCaret]);

  const cursorTooltipHandlers: TooltipHandlers = {
    onMouseEnter: handleFieldMouseEnter,
    onMouseMove: handleFieldMouseMove,
    onMouseLeave: handleFieldMouseLeave,
    onClick: handleFieldClick,
    onKeyDown: handleFieldKeyDown,
    onKeyUp: handleFieldKeyUp,
    onFocus: handleFieldFocus,
    onBlur: handleFieldBlur,
  };

  const value: TooltipContextValue = {
    tooltipVisible,
    setTooltipVisible,
    tooltipPosition,
    activeFieldRef,
    cursorTooltipHandlers,
    updateTooltipFromCaret,
    isSimulatingRef,
  };

  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
};
