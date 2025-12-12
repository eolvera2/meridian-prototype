/**
 * FloatingMicBar Component
 *
 * Floating Dragon Copilot mic bar UI
 * Based on Figma node 12577-112387
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Button,
  ToggleButton,
  Checkbox,
  mergeClasses,
} from "@fluentui/react-components";
import {
  Subtract20Regular,
  ArrowMaximize20Regular,
  Dismiss20Regular,
  Mic24Filled,
  MicOffRegular,
  ChevronDownRegular,
  NoteRegular,
  NoteFilled,
  AlertRegular,
  AlertFilled,
} from "@fluentui/react-icons";
import { useFloatingMicBarStyles } from "./FloatingMicBarStyles";
import { FloatingMemos } from "./FloatingMemos";
import DragonLogo from "../../assets/logo.svg";
import CopilotIdle from "../../assets/Copilot.svg";

export const FloatingMicBar: React.FC = () => {
  const styles = useFloatingMicBarStyles();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Mic and button states
  const [isRecording, setIsRecording] = useState(true);
  const [isMemosExpanded, setIsMemosExpanded] = useState(true);
  const [isCopilotActive, setIsCopilotActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [memoText, setMemoText] = useState("");

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from title bar, not from buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    setIsDragging(true);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Keep within viewport bounds
      const container = containerRef.current;
      if (container) {
        const maxX = window.innerWidth - container.offsetWidth;
        const maxY = window.innerHeight - container.offsetHeight;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Set initial position on first load (140px from right and top)
  useEffect(() => {
    const container = containerRef.current;
    if (container && position.x === 0 && position.y === 0) {
      const containerWidth = container.offsetWidth;
      const initialX = window.innerWidth - containerWidth - 140;
      const initialY = 140;
      setPosition({ x: initialX, y: initialY });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate style based on position
  const containerStyle: React.CSSProperties = {
    top: position.y,
    right: "auto",
    left: position.x,
  };

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const note = `Patient: Ellis Turner\nCondition: Overdue for colonoscopy follow-up\nNotes: Underwent initial colonoscopy at age 35 due to family history of colorectal issues; acknowledges being overdue for a follow-up last year but did not schedule it.`;
    let index = 0;

    setMemoText(""); // Reset before animation

    setTimeout(() => {
      const textarea = document.getElementById(
        "memo-textarea"
      ) as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.focus();
        textarea.click();
      }

      const typingInterval = setInterval(() => {
        if (index < note.length) {
          setMemoText((prevText) => {
            if (textarea) textarea.focus();
            return prevText + note.charAt(index);
          });
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 33); // 2x faster than before

      // Cleanup
      return () => clearInterval(typingInterval);
    }, 100); // Delay to ensure textarea is mounted
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className={styles.container} style={containerStyle}>
      {/* Title Bar - Drag Handle */}
      <div
        className={styles.titleBar}
        onMouseDown={handleMouseDown}
        style={{ cursor: "default" }}
      >
        <div className={styles.titleBarLeft}>
          <img
            src={DragonLogo}
            alt="Dragon Copilot"
            className={styles.dragonLogo}
          />
        </div>
        <div className={styles.titleBarRight}>
          <Button
            appearance="subtle"
            icon={<Subtract20Regular />}
            className={styles.titleBarButton}
            aria-label="Minimize"
          />
          <Button
            appearance="subtle"
            icon={<ArrowMaximize20Regular />}
            className={styles.titleBarButton}
            aria-label="Maximize"
          />
          <Button
            appearance="subtle"
            icon={<Dismiss20Regular />}
            className={styles.titleBarButton}
            aria-label="Dismiss"
            onClick={() => setIsVisible(false)}
          />
        </div>
      </div>

      {/* Select a patient label */}
      <div
        style={{
          display: "flex",
          height: "24px",
          flex: 1,
          alignItems: "center",
          overflow: "hidden",
          color: "var(--colorNeutralForeground2)",
          textOverflow: "ellipsis",
          fontFamily: 'var(--Typography-Font-family-Base, "Segoe UI")',
          fontSize: "var(--Typography-Caption-2-Strong-Font-size, 10px)",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "var(--Typography-Caption-2-Strong-Line-height, 14px)",
          margin: "4px", // Left margin set to 4px
        }}
      >
        &lt; Memos
      </div>

      {/* Mic Button Centered Above */}
      <div className={styles.micBarMicRow}>
        <Button
          appearance="subtle"
          className={mergeClasses(
            styles.micButton,
            isRecording && styles.micButtonRecording
          )}
          onClick={() => {
            const newRecordingState = !isRecording;
            setIsRecording(newRecordingState);
            if (newRecordingState) {
              setIsMemosExpanded(true);
            }
          }}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <div className={styles.micButtonContent}>
            <div className={styles.primaryAction}>
              <div className={styles.micIconSection}>
                {isRecording ? (
                  <Mic24Filled
                    className={mergeClasses(
                      styles.micIcon,
                      styles.micIconRecording
                    )}
                  />
                ) : (
                  <MicOffRegular className={styles.micIcon} />
                )}
              </div>
            </div>
            <div
              className={mergeClasses(
                styles.secondaryAction,
                isRecording && styles.secondaryActionRecording
              )}
            >
              <ChevronDownRegular
                className={mergeClasses(
                  styles.chevronIcon,
                  isRecording && styles.chevronIconRecording
                )}
              />
            </div>
          </div>
        </Button>
      </div>

      {/* Dictation Checkbox and Toggle Buttons Row */}
      <div className={styles.micBarToggleRow}>
        <Checkbox
          checked={true}
          disabled={false}
          label="Dictation"
          className={styles.dictationCheckbox}
        />
        <div className={styles.micBarToggleRowActions}>
          <ToggleButton
            appearance="subtle"
            icon={
              isMemosExpanded ? (
                <NoteFilled className={styles.iconActive} />
              ) : (
                <NoteRegular />
              )
            }
            checked={isMemosExpanded}
            onClick={() => {
              setIsMemosExpanded(!isMemosExpanded);
              setIsNotificationsActive(false);
              setIsCopilotActive(false);
            }}
            className={styles.actionButton}
            aria-label="Toggle Memos"
          />
          <ToggleButton
            appearance="subtle"
            icon={
              isNotificationsActive ? (
                <AlertFilled className={styles.iconActive} />
              ) : (
                <AlertRegular />
              )
            }
            checked={isNotificationsActive}
            onClick={() => {
              setIsNotificationsActive(!isNotificationsActive);
              setIsMemosExpanded(false);
              setIsCopilotActive(false);
            }}
            className={styles.actionButton}
            aria-label="Toggle Notifications"
          />
          <ToggleButton
            appearance="subtle"
            icon={
              <img src={CopilotIdle} alt="Copilot" width={24} height={24} />
            }
            checked={isCopilotActive}
            onClick={() => {
              setIsCopilotActive(!isCopilotActive);
              setIsMemosExpanded(false);
              setIsNotificationsActive(false);
            }}
            className={styles.actionButton}
            aria-label="Toggle Copilot"
          />
        </div>
      </div>

      {/* Memos Content Area - Now at the bottom */}
      {isMemosExpanded && (
        <div className={styles.mainContent}>
          <FloatingMemos
            isRecording={isRecording}
            isExpanded={isMemosExpanded}
            onToggleExpand={() => setIsMemosExpanded(!isMemosExpanded)}
            memoText={memoText}
            setMemoText={setMemoText}
            onClose={() => setIsMemosExpanded(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FloatingMicBar;
