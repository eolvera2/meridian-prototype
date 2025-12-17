/**
 * FAB (Floating Action Button) Component
 *
 * A floating button that helps users auto-scroll to the top or bottom of a container.
 * The button dynamically switches between up/down icons based on scroll position.
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Tooltip, mergeClasses } from "@fluentui/react-components";
import { ArrowDownRegular, ArrowUploadRegular } from "@fluentui/react-icons";
import { useStyles } from "./FAB.styles";
import type { FABProps, ScrollDirection } from "./FAB.types";

export const FAB: React.FC<FABProps> = ({
  scrollTargetRef,
  scrollTargetSelector = ".right-drawer-scroll-container, .document-scroll-container",
  visible = true,
  onScroll,
  className,
}) => {
  const styles = useStyles();
  const [direction, setDirection] = useState<ScrollDirection>("down");
  const [isVisible, setIsVisible] = useState(visible);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const MIN_OVERFLOW_PX = 100;

  const getScrollCandidates = useCallback((): HTMLElement[] => {
    if (!scrollTargetSelector) return [];
    return Array.from(document.querySelectorAll(scrollTargetSelector)).filter(
      (el): el is HTMLElement => el instanceof HTMLElement
    );
  }, [scrollTargetSelector]);

  const markScrollActivity = useCallback(() => {
    setIsScrolling(true);
    if (scrollIdleTimeoutRef.current) {
      clearTimeout(scrollIdleTimeoutRef.current);
    }
    scrollIdleTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  // Get the scroll target element
  const getScrollTarget = useCallback((): HTMLElement | null => {
    if (scrollTargetRef?.current) {
      return scrollTargetRef.current;
    }
    if (scrollTargetSelector) {
      const candidates = getScrollCandidates();

      // If multiple layouts are mounted (desktop/mobile/drawer), pick the best *visible*
      // scroll container. Prefer the RightDrawer when it is present and scrollable.
      const isVisible = (el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden")
          return false;
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      };

      const visibleCandidates = candidates.filter(isVisible);

      const score = (el: HTMLElement) => {
        const overflowPx = el.scrollHeight - el.clientHeight;
        const hasEnoughOverflow = overflowPx >= MIN_OVERFLOW_PX;
        const prefersDrawer = el.classList.contains(
          "right-drawer-scroll-container"
        );

        // If it doesn't really scroll, keep it low priority.
        if (!hasEnoughOverflow) return overflowPx;

        // Strongly prefer the drawer when it is scrollable.
        return overflowPx + (prefersDrawer ? 1_000_000 : 0);
      };

      const sorted = [...visibleCandidates].sort((a, b) => score(b) - score(a));
      return sorted[0] ?? candidates[0] ?? null;
    }
    return null;
  }, [getScrollCandidates, scrollTargetRef, scrollTargetSelector]);

  // Update visibility when prop changes (will be refined by handleScrollCheck)
  useEffect(() => {
    if (!visible) {
      setIsVisible(false);
      return;
    }
    // Check content height when visible prop becomes true
    const target = getScrollTarget();
    if (target) {
      const overflowPx = target.scrollHeight - target.clientHeight;
      const hasEnoughContent = overflowPx >= MIN_OVERFLOW_PX;
      setIsVisible(hasEnoughContent);
    }
  }, [visible, getScrollTarget]);

  // Handle scroll position changes
  const handleScrollCheck = useCallback(
    (explicitTarget?: HTMLElement) => {
      const target = explicitTarget ?? getScrollTarget();
      if (!target) {
        setIsVisible(false);
        return;
      }

      if (explicitTarget) {
        markScrollActivity();
      }

      const { scrollTop, scrollHeight, clientHeight } = target;
      const maxScroll = scrollHeight - clientHeight;
      const scrollPercentage = maxScroll > 0 ? scrollTop / maxScroll : 0;

      // Show FAB only when at least MIN_OVERFLOW_PX of content exists outside the viewport
      const hasEnoughContent = maxScroll >= MIN_OVERFLOW_PX;
      setIsVisible(visible && hasEnoughContent);

      // Switch direction based on position (if past 50%, show up arrow)
      if (scrollPercentage > 0.5) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    },
    [getScrollTarget, markScrollActivity, visible]
  );

  // Cleanup scroll-idle timer
  useEffect(() => {
    return () => {
      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current);
      }
    };
  }, []);

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

  // Set up scroll listener and observers
  useEffect(() => {
    let scrollTargets: HTMLElement[] = [];
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let rootMutationObserver: MutationObserver | null = null;
    let rafId: number | null = null;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const onScrollEvent = (ev: Event) => {
      const el =
        ev.currentTarget instanceof HTMLElement ? ev.currentTarget : undefined;
      handleScrollCheck(el);
    };

    const teardown = () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (rafId !== null) cancelAnimationFrame(rafId);
      scrollTargets.forEach((t) =>
        t.removeEventListener("scroll", onScrollEvent)
      );
      scrollTargets = [];
      if (resizeObserver) resizeObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      if (rootMutationObserver) rootMutationObserver.disconnect();
      resizeObserver = null;
      mutationObserver = null;
      rootMutationObserver = null;
    };

    const setup = () => {
      // Bind to all visible candidates so direction updates even if the active
      // scroll container changes when switching RightDrawer pages.
      const candidates = getScrollCandidates();
      if (candidates.length === 0) {
        retryTimeout = setTimeout(setup, 100);
        return;
      }

      const isVisible = (el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden")
          return false;
        const rect = el.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      };

      scrollTargets = candidates.filter(isVisible);

      handleScrollCheck();

      scrollTargets.forEach((t) =>
        t.addEventListener("scroll", onScrollEvent, { passive: true })
      );

      resizeObserver = new ResizeObserver(() => handleScrollCheck());
      scrollTargets.forEach((t) => resizeObserver?.observe(t));

      mutationObserver = new MutationObserver(() => handleScrollCheck());
      scrollTargets.forEach((t) =>
        mutationObserver?.observe(t, {
          childList: true,
          subtree: true,
          attributes: false,
        })
      );

      // Watch for RightDrawer content swaps / DOM replacements.
      rootMutationObserver = new MutationObserver(() => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          // Rebind if the candidate set has changed.
          teardown();
          setup();
        });
      });
      rootMutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    setup();
    return teardown;
  }, [getScrollCandidates, handleScrollCheck]);

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
  const Icon = direction === "down" ? ArrowDownRegular : ArrowUploadRegular;

  return (
    <div
      className={mergeClasses(
        styles.fabContainer,
        isVisible
          ? isScrolling
            ? styles.faded
            : styles.visible
          : styles.hidden,
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
