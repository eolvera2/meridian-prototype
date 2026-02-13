import { useCallback, useEffect, useState } from "react";
import type { RightDrawerContent } from "../../shared";

const getWindowWidth = () =>
  typeof window === "undefined" ? 1024 : window.innerWidth;

const isMediumScreen = (width: number): boolean => width <= 768 && width >= 481;

/**
 * Hook for managing right drawer panel controls and responsive layout behavior.
 * 
 * @returns Panel control state and functions for managing drawer visibility and content
 */
export const usePanelControls = () => {
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false);
  const [rightDrawerContent, setRightDrawerContent] =
    useState<RightDrawerContent>("copilot");
  const [windowWidth, setWindowWidth] = useState(() => getWindowWidth());

  useEffect(() => {
    const handleResize = () => setWindowWidth(getWindowWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldUseDrawerLayout = useCallback(() => {
    return isMediumScreen(windowWidth) && rightDrawerVisible;
  }, [windowWidth, rightDrawerVisible]);

  const shouldShowWorklistWithDrawer = useCallback(
    (worklistCollapsed: boolean) => {
      return (
        isMediumScreen(windowWidth) && rightDrawerVisible && !worklistCollapsed
      );
    },
    [windowWidth, rightDrawerVisible]
  );

  return {
    rightDrawerVisible,
    setRightDrawerVisible,
    rightDrawerContent,
    setRightDrawerContent,
    shouldUseDrawerLayout,
    shouldShowWorklistWithDrawer,
  } as const;
};
