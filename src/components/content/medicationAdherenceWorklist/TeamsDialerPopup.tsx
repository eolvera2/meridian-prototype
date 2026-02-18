import React, { useState, useEffect, useRef, useCallback } from "react";
import { mergeClasses, Tooltip } from "@fluentui/react-components";
import {
  Dismiss16Regular,
  Open16Regular,
  MoreHorizontal20Regular,
  Mic20Regular,
  Mic20Filled,
  Speaker220Regular,
  Speaker220Filled,
  CallEnd20Filled,
  PersonCall20Regular,
} from "@fluentui/react-icons";
import { useTeamsDialerStyles } from "./TeamsDialerPopup.styles";

interface TeamsDialerPopupProps {
  patientName: string;
  phoneNumber: string;
  onHangUp: () => void;
}

export const TeamsDialerPopup: React.FC<TeamsDialerPopupProps> = ({
  patientName,
  phoneNumber,
  onHangUp,
}) => {
  const styles = useTeamsDialerStyles();
  const [elapsed, setElapsed] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <div className={styles.titleLeft}>
            <svg className={styles.teamsIcon} viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="4" fill="#5059C9" />
              <circle cx="16" cy="8" r="3" fill="#7B83EB" />
              <rect x="12" y="12" width="10" height="7" rx="1.5" fill="#7B83EB" />
              <circle cx="10" cy="7" r="3.5" fill="#fff" />
              <rect x="3" y="11" width="14" height="9" rx="2" fill="#fff" />
              <rect x="7" y="14" width="6" height="1.2" rx="0.6" fill="#5059C9" />
              <rect x="7" y="16.5" width="4" height="1.2" rx="0.6" fill="#5059C9" />
            </svg>
            <span className={styles.titleText}>Teams dialer</span>
          </div>
          <div className={styles.titleActions}>
            <Tooltip content="Pop out" relationship="label">
              <button className={styles.controlBtn} style={{ color: "#616161" }} aria-label="Pop out">
                <Open16Regular />
              </button>
            </Tooltip>
            <Tooltip content="Close" relationship="label">
              <button className={styles.controlBtn} style={{ color: "#616161" }} aria-label="Close" onClick={onHangUp}>
                <Dismiss16Regular />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Control bar */}
        <div className={styles.controlBar}>
          <div className={styles.timerSection}>
            <div className={styles.recordDot} />
            <span className={styles.timerText}>{formatTime(elapsed)}</span>
          </div>
          <div className={styles.controlButtons}>
            <Tooltip content={speakerOn ? "Speaker on" : "Speaker off"} relationship="label">
              <button
                className={mergeClasses(styles.controlBtn, speakerOn && styles.controlBtnActive)}
                onClick={() => setSpeakerOn((v) => !v)}
                aria-label={speakerOn ? "Speaker on" : "Speaker off"}
              >
                {speakerOn ? <Speaker220Filled /> : <Speaker220Regular />}
              </button>
            </Tooltip>
            <Tooltip content={micOn ? "Mute" : "Unmute"} relationship="label">
              <button
                className={mergeClasses(styles.controlBtn, micOn && styles.controlBtnActive)}
                onClick={() => setMicOn((v) => !v)}
                aria-label={micOn ? "Mute" : "Unmute"}
              >
                {micOn ? <Mic20Filled /> : <Mic20Regular />}
              </button>
            </Tooltip>
            <Tooltip content="More options" relationship="label">
              <button className={styles.controlBtn} aria-label="More options">
                <MoreHorizontal20Regular />
              </button>
            </Tooltip>
            <Tooltip content="Hang up" relationship="label">
              <button className={styles.hangUpBtn} onClick={onHangUp} aria-label="Hang up">
                <CallEnd20Filled />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.avatarRing}>
            <PersonCall20Regular className={styles.avatarIcon} style={{ width: 36, height: 36 }} />
          </div>
          <div className={styles.callerName}>{patientName}</div>
          <div className={styles.callerPhone}>{phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};
