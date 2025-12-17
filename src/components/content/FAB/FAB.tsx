/**
 * FAB (Floating Action Button) Component
 *
 * A floating button that helps users auto-scroll to the top or bottom of a container.
 * The button dynamically switches between up/down icons based on scroll position.
 */

import React, { useState, useEffect, useCallback } from "react";
import { Tooltip, mergeClasses } from "@fluentui/react-components";
import { ArrowDownRegular, ArrowUpRegular } from "@fluentui/react-icons";
import { useStyles } from "./FAB.styles";
import type { FABProps, ScrollDirection } from "./FAB.types";

export const FAB: React.FC<FABProps> = ({
  scrollTargetRef,
  scrollTargetSelector = ".document-component-root",
  visible = true,
  onScroll,
  className,
}) => {
  const styles = useStyles();
  const [direction, setDirection] = useState<ScrollDirection>("down");
  const [isVisible, setIsVisible] = useState(false);

  // Get the scroll target element
  const getScrollTarget = useCallback((): HTMLElement | null => {
    if (scrollTargetRef?.current) {
      return scrollTargetRef.current;
    }
    if (scrollTargetSelector) {
      return document.querySelector(scrollTargetSelector);
    }
    return null;
  }, [scrollTargetRef, scrollTargetSelector]);

  // Handle scroll position changes
  const handleScrollCheck = useCallback(() => {
    const target = getScrollTarget();
    if (!target) {
      setIsVisible(false);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = target;
    const maxScroll = scrollHeight - clientHeight;
    const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

    // Show FAB only when content exceeds 1.5x viewport height (enough to warrant scroll help)
    const hasEnoughContent = scrollHeight >= clientHeight * 1.5;
    setIsVisible(visible && hasEnoughContent);

    // Switch direction based on position (if past 50%, show up arrow)
    if (scrollPercentage > 0.5) {
      setDirection("up");
    } else {
      setDirection("down");
    }
  }, [getScrollTarget, visible]);

  // Scroll to top or bottom
  const handleClick = useCallback(() => {
    const target = getScrollTarget();
    if (!target) return;

    if (direction === "down") {
      target.scrollTo({
        top: target.scrollHeight,
        behavior: "smooth",
      });
    } else {
      target.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    onScroll?.(direction);
  }, [direction, getScrollTarget, onScroll]);

  // Set up scroll listener
  useEffect(() => {
    const target = getScrollTarget();
    if (!target) return;

    // Initial check
    handleScrollCheck();

    // Add scroll listener
    target.addEventListener("scroll", handleScrollCheck, { passive: true });

    // Set up mutation observer to detect content changes
    const observer = new MutationObserver(handleScrollCheck);
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => {
      target.removeEventListener("scroll", handleScrollCheck);
      observer.disconnect();
    };
  }, [getScrollTarget, handleScrollCheck]);

  // Re-check on window resize
  useEffect(() => {
    const handleResize = () => {
      handleScrollCheck();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleScrollCheck]);

  const tooltipContent =
    direction === "down" ? "Scroll to bottom" : "Scroll to top";
  const Icon = direction === "down" ? ArrowDownRegular : ArrowUpRegular;

  return (
    <div
      className={mergeClasses(
        styles.fabContainer,
        isVisible ? styles.visible : styles.hidden,
        className
      )}
    >
      <Tooltip content={tooltipContent} relationship="label">
        <button
          className={styles.fabButton}
          onClick={handleClick}
          aria-label={tooltipContent}
          type="button"
        >
          <Icon className={styles.fabIcon} />
        </button>
      </Tooltip>
    </div>
  );
};

export default FAB;
