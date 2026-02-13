import React from "react";
import { createPortal } from "react-dom";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { Mic24Filled, DismissCircleFilled } from "@fluentui/react-icons";

interface MicCursorTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  fieldRect: DOMRect | null;
  mode?: "dictation" | "ambient";
  isActive?: boolean; // Whether the mic is actively recording (dictation state "on")
  onModeToggle?: () => void;
}

const BUBBLE_WIDTH = 37;
const BUBBLE_HEIGHT = 40;
const FIELD_PADDING = 2;

const useStyles = makeStyles({
  root: {
    position: "fixed",
    transform: "translate(-50%, 0)",
    // Only transition opacity/visibility, not position - prevents jitter on scroll
    transition: "opacity 0.3s ease-out, visibility 0.3s ease-out",
    zIndex: "var(--z-index-microphone)", // Above RightDrawer (150) but uses portal so it's in document root
    cursor: "pointer",
    // Use will-change to hint browser for GPU acceleration
    willChange: "opacity, visibility",
  },
  interactive: {
    pointerEvents: "auto",
  },
  nonInteractive: {
    pointerEvents: "none",
  },
  visible: {
    opacity: 1,
    visibility: "visible",
  },
  hidden: {
    opacity: 0,
    visibility: "hidden",
  },
  bubble: {
    width: `${BUBBLE_WIDTH}px`,
    height: `${BUBBLE_HEIGHT}px`,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  },
  iconWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "var(--spacing-xxlarge)",
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  iconDictation: {
    color: "var(--colorBrandForeground)",
  },
  iconAmbient: {
    color: "var(--palette-blue-0f6cbd)",
  },
});

export const MicCursorTooltip: React.FC<MicCursorTooltipProps> = ({
  x,
  y,
  visible,
  fieldRect,
  mode = "dictation",
  isActive = false,
  onModeToggle,
}) => {
  const styles = useStyles();
  const isDomAvailable = typeof document !== "undefined";
  const [isHovered, setIsHovered] = React.useState(false);

  const clampedPosition = React.useMemo(() => {
    if (!isDomAvailable) {
      return { left: 0, top: 0 };
    }

    if (!fieldRect) {
      return { left: x, top: y - BUBBLE_HEIGHT };
    }

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const minPointerX = fieldRect.left + FIELD_PADDING;
    const maxPointerX = fieldRect.right - FIELD_PADDING;
    const pointerX = clamp(x, minPointerX, maxPointerX);

    const minPointerY = fieldRect.top + FIELD_PADDING;
    const maxPointerY = fieldRect.bottom - FIELD_PADDING;
    const pointerY = clamp(y, minPointerY, maxPointerY);

    return {
      left: pointerX,
      top: pointerY - BUBBLE_HEIGHT,
    };
  }, [fieldRect, x, y, isDomAvailable]);

  if (!isDomAvailable) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onModeToggle?.();
  };

  // Prevent mousedown from causing textarea blur
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Determine which icon to show based on active state and hover:
  // - Mic Active + hovered: DismissCircleFilled (white icon on blue bg)
  // - Mic Active + not hovered: Mic24Filled (white icon on blue bg)
  // - Mic Inactive + hovered: Mic24Filled (blue icon on light blue bg)
  // - Mic Inactive + not hovered: Mic24Filled (blue icon on white bg)
  const renderIcon = () => {
    if (isActive && isHovered) {
      // Active + Hover: Cancel icon in white
      return (
        <DismissCircleFilled
          className={mergeClasses(styles.icon, styles.iconDictation)}
        />
      );
    }
    if (isActive) {
      // Active: Mic icon in white
      return (
        <Mic24Filled
          className={mergeClasses(styles.icon, styles.iconDictation)}
        />
      );
    }
    // Inactive (rest or hover): Mic icon in blue
    return (
      <Mic24Filled className={mergeClasses(styles.icon, styles.iconAmbient)} />
    );
  };

  // Determine which background to use based on active state and hover
  const renderBackground = () => {
    if (isActive) {
      // Active state: blue background
      return <DictationTooltipBackground className={styles.svg} />;
    }
    if (isHovered) {
      // Inactive + Hover: light blue background
      return <InactiveHoverTooltipBackground className={styles.svg} />;
    }
    // Inactive + Rest: white/gray background
    return <AmbientTooltipBackground className={styles.svg} />;
  };

  const node = (
    <div
      className={mergeClasses(
        styles.root,
        visible ? styles.visible : styles.hidden,
        visible ? styles.interactive : styles.nonInteractive
      )}
      style={{ left: clampedPosition.left, top: clampedPosition.top }}
      role="button"
      tabIndex={visible ? 0 : -1}
      aria-label={
        mode === "dictation"
          ? "Switch to ambient mode"
          : "Switch to dictation mode"
      }
      aria-hidden={!visible}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.bubble}>
        {renderBackground()}
        <div className={styles.iconWrapper}>{renderIcon()}</div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};

const DictationTooltipBackground: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="37"
    height="40"
    viewBox="0 0 37 40"
    fill="none"
  >
    <g filter="url(#micTooltipShadow)">
      <mask id="micTooltipMask" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33 3C33 1.34315 31.6569 0 30 0H7C5.34315 0 4 1.34315 4 3V20.697C4 22.3538 5.34314 23.697 7 23.697H10.3976C11.432 23.697 12.3934 24.2298 12.9416 25.1069L15.956 29.9298C17.1311 31.8098 19.869 31.8098 21.044 29.9298L24.0584 25.1069C24.6066 24.2298 25.568 23.697 26.6024 23.697H30C31.6569 23.697 33 22.3538 33 20.697V3Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33 3C33 1.34315 31.6569 0 30 0H7C5.34315 0 4 1.34315 4 3V20.697C4 22.3538 5.34314 23.697 7 23.697H10.3976C11.432 23.697 12.3934 24.2298 12.9416 25.1069L15.956 29.9298C17.1311 31.8098 19.869 31.8098 21.044 29.9298L24.0584 25.1069C24.6066 24.2298 25.568 23.697 26.6024 23.697H30C31.6569 23.697 33 22.3538 33 20.697V3Z"
        fill="#0F6CBD"
      />
      <path
        d="M24.0584 25.1069L23.2104 24.5769L24.0584 25.1069ZM15.956 29.9298L15.108 30.4599L15.956 29.9298ZM21.044 29.9298L20.196 29.3998L21.044 29.9298ZM7 0V1H30V0V-1H7V0ZM4 20.697H5V3H4H3V20.697H4ZM10.3976 23.697V22.697H7V23.697V24.697H10.3976V23.697ZM15.956 29.9298L16.804 29.3998L13.7896 24.5769L12.9416 25.1069L12.0936 25.6369L15.108 30.4599L15.956 29.9298ZM24.0584 25.1069L23.2104 24.5769L20.196 29.3998L21.044 29.9298L21.892 30.4598L24.9064 25.6369L24.0584 25.1069ZM30 23.697V22.697H26.6024V23.697V24.697H30V23.697ZM33 3H32V20.697H33H34V3H33ZM30 23.697V24.697C32.2091 24.697 34 22.9061 34 20.697H33H32C32 21.8015 31.1046 22.697 30 22.697V23.697ZM24.0584 25.1069L24.9064 25.6369C25.2719 25.0522 25.9128 24.697 26.6024 24.697V23.697V22.697C25.2232 22.697 23.9414 23.4074 23.2104 24.5769L24.0584 25.1069ZM15.956 29.9298L15.108 30.4599C16.6747 32.9664 20.3253 32.9664 21.892 30.4598L21.044 29.9298L20.196 29.3998C19.4126 30.6531 17.5874 30.6531 16.804 29.3998L15.956 29.9298ZM10.3976 23.697V24.697C11.0872 24.697 11.7281 25.0522 12.0936 25.6369L12.9416 25.1069L13.7896 24.5769C13.0586 23.4074 11.7768 22.697 10.3976 22.697V23.697ZM4 20.697H3C3 22.9061 4.79086 24.697 7 24.697V23.697V22.697C5.89543 22.697 5 21.8015 5 20.697H4ZM30 0V1C31.1046 1 32 1.89543 32 3H33H34C34 0.790861 32.2091 -1 30 -1V0ZM7 0V-1C4.79086 -1 3 0.790864 3 3H4H5C5 1.89543 5.89543 1 7 1V0Z"
        fill="#0F6CBD"
        mask="url(#micTooltipMask)"
      />
    </g>
    <defs>
      <filter
        id="micTooltipShadow"
        x="0"
        y="0"
        width="37"
        height="39.3398"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const AmbientTooltipBackground: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="37"
    height="40"
    viewBox="0 0 37 40"
    fill="none"
  >
    <g filter="url(#filter0_d_ambient)">
      <mask id="ambientMask" fill="white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33 3C33 1.34315 31.6569 0 30 0H7C5.34315 0 4 1.34315 4 3V20.697C4 22.3538 5.34314 23.697 7 23.697H10.3976C11.432 23.697 12.3934 24.2298 12.9416 25.1069L15.956 29.9298C17.1311 31.8098 19.869 31.8098 21.044 29.9298L24.0584 25.1069C24.6066 24.2298 25.568 23.697 26.6024 23.697H30C31.6569 23.697 33 22.3538 33 20.697V3Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33 3C33 1.34315 31.6569 0 30 0H7C5.34315 0 4 1.34315 4 3V20.697C4 22.3538 5.34314 23.697 7 23.697H10.3976C11.432 23.697 12.3934 24.2298 12.9416 25.1069L15.956 29.9298C17.1311 31.8098 19.869 31.8098 21.044 29.9298L24.0584 25.1069C24.6066 24.2298 25.568 23.697 26.6024 23.697H30C31.6569 23.697 33 22.3538 33 20.697V3Z"
        fill="#F6F6F6"
      />
      <path
        d="M24.0584 25.1069L23.2104 24.5769L24.0584 25.1069ZM15.956 29.9298L15.108 30.4599L15.956 29.9298ZM21.044 29.9298L20.196 29.3998L21.044 29.9298ZM7 0V1H30V0V-1H7V0ZM4 20.697H5V3H4H3V20.697H4ZM10.3976 23.697V22.697H7V23.697V24.697H10.3976V23.697ZM15.956 29.9298L16.804 29.3998L13.7896 24.5769L12.9416 25.1069L12.0936 25.6369L15.108 30.4599L15.956 29.9298ZM24.0584 25.1069L23.2104 24.5769L20.196 29.3998L21.044 29.9298L21.892 30.4598L24.9064 25.6369L24.0584 25.1069ZM30 23.697V22.697H26.6024V23.697V24.697H30V23.697ZM33 3H32V20.697H33H34V3H33ZM30 23.697V24.697C32.2091 24.697 34 22.9061 34 20.697H33H32C32 21.8015 31.1046 22.697 30 22.697V23.697ZM24.0584 25.1069L24.9064 25.6369C25.2719 25.0522 25.9128 24.697 26.6024 24.697V23.697V22.697C25.2232 22.697 23.9414 23.4074 23.2104 24.5769L24.0584 25.1069ZM15.956 29.9298L15.108 30.4599C16.6747 32.9664 20.3253 32.9664 21.892 30.4598L21.044 29.9298L20.196 29.3998C19.4126 30.6531 17.5874 30.6531 16.804 29.3998L15.956 29.9298ZM10.3976 23.697V24.697C11.0872 24.697 11.7281 25.0522 12.0936 25.6369L12.9416 25.1069L13.7896 24.5769C13.0586 23.4074 11.7768 22.697 10.3976 22.697V23.697ZM4 20.697H3C3 22.9061 4.79086 24.697 7 24.697V23.697V22.697C5.89543 22.697 5 21.8015 5 20.697H4ZM30 0V1C31.1046 1 32 1.89543 32 3H33H34C34 0.790861 32.2091 -1 30 -1V0ZM7 0V-1C4.79086 -1 3 0.790864 3 3H4H5C5 1.89543 5.89543 1 7 1V0Z"
        fill="#BDBDBD"
        mask="url(#ambientMask)"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_ambient"
        x="0"
        y="0"
        width="37"
        height="39.3398"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

// Light blue background for inactive hover state (no border)
const InactiveHoverTooltipBackground: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="37"
    height="40"
    viewBox="0 0 37 40"
    fill="none"
  >
    <g filter="url(#filter0_d_hover)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33 3C33 1.34315 31.6569 0 30 0H7C5.34315 0 4 1.34315 4 3V20.697C4 22.3538 5.34314 23.697 7 23.697H10.3976C11.432 23.697 12.3934 24.2298 12.9416 25.1069L15.956 29.9298C17.1311 31.8098 19.869 31.8098 21.044 29.9298L24.0584 25.1069C24.6066 24.2298 25.568 23.697 26.6024 23.697H30C31.6569 23.697 33 22.3538 33 20.697V3Z"
        fill="#D4E8F8"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_hover"
        x="0"
        y="0"
        width="37"
        height="39.3398"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
