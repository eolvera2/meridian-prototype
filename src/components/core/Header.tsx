import React from "react";
import { Button, ToggleButton, Tooltip } from "@fluentui/react-components";
import {
  bundleIcon,
  Script24Regular as ScriptRegular,
  Script24Filled as ScriptFilled,
  Library24Regular as LibraryRegular,
  Library24Filled as LibraryFilled,
  ChevronLeft24Regular as ChevronLeftRegular,
  ChevronLeft24Filled as ChevronLeftFilled,
  MoreVertical24Regular as MoreVertical,
} from "@fluentui/react-icons";
import { useStyles } from "./Header.styles";

const Script = bundleIcon(ScriptFilled, ScriptRegular);
const Library = bundleIcon(LibraryFilled, LibraryRegular);

export interface HeaderPatient {
  id: string;
  name: string;
  reason?: string;
  time?: string;
  details?: string;
  initialRecordingSeconds?: number;
}

export interface HeaderProps {
  patient?: HeaderPatient | null;
  scriptChecked?: boolean;
  libraryChecked?: boolean;
  homeChecked?: boolean;
  worklistCollapsed?: boolean;
  onToggleScript?: (next: boolean) => void;
  onToggleLibrary?: (next: boolean) => void;
  onHomeClick?: () => void;
  disableNavigation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  scriptChecked = false,
  libraryChecked = false,
  homeChecked = false,
  worklistCollapsed = false,
  onToggleScript,
  onToggleLibrary,
  onHomeClick,
  disableNavigation = false,
}) => {
  const styles = useStyles();

  // Determine header class based on worklist state
  const getHeaderClass = () => {
    let headerClass = styles.header;

    // On mobile, hide header when worklist is expanded (not collapsed)
    // On desktop, header is always visible
    if (!worklistCollapsed) {
      // Worklist is expanded - hide header only on mobile
      headerClass += ` ${styles.headerHiddenOnMobile}`;
    }

    return headerClass;
  };

  return (
    <div className={getHeaderClass()}>
      <div className={styles.headerContent}>
        <div className={styles.left}>
          <div className={styles.homeButtonContainer}>
            <Tooltip content="Home" relationship="label">
              <Button
                onClick={() => onHomeClick?.()}
                className={styles.homeToggleButton}
                icon={
                  homeChecked ? (
                    <ChevronLeftFilled className={styles.iconFilled} />
                  ) : (
                    <ChevronLeftRegular className={styles.icon} />
                  )
                }
                appearance="transparent"
                size="small"
                aria-label="Back to Home"
                disabled={disableNavigation}
              />
            </Tooltip>
          </div>
          <div className={styles.patientInfo}>
            <div className={styles.name} title={patient?.name}>
              {patient ? patient.name : "No patient selected"}
            </div>
            <div className={styles.subtitle}>
              {patient ? (
                <>
                  <div className={styles.reasonRow}>
                    <span className={styles.reasonLabel}>
                      Reason for Visit:
                    </span>
                    <span>{patient.reason ?? ""}</span>
                  </div>
                  {patient.details ? (
                    <div className={styles.detailsRow}>{patient.details}</div>
                  ) : null}
                </>
              ) : (
                "Select a patient from the worklist"
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <Tooltip content="Transcript" relationship="label">
            <span style={{ display: "inline-flex" }}>
              <ToggleButton
                checked={scriptChecked}
                onClick={() => onToggleScript?.(!scriptChecked)}
                className={styles.toggleIconButton}
                icon={
                  scriptChecked ? (
                    <Script className={styles.iconFilled} />
                  ) : (
                    <ScriptRegular className={styles.icon} />
                  )
                }
                appearance="subtle"
                size="small"
                aria-label="Toggle Transcript"
                style={
                  scriptChecked ? { backgroundColor: "#f5f5f5" } : undefined
                }
                disabled={disableNavigation}
              />
            </span>
          </Tooltip>

          <Tooltip content="Library" relationship="label">
            <span style={{ display: "inline-flex" }}>
              <ToggleButton
                checked={libraryChecked}
                onClick={() => onToggleLibrary?.(!libraryChecked)}
                className={styles.toggleIconButton}
                icon={
                  libraryChecked ? (
                    <Library className={styles.iconFilled} />
                  ) : (
                    <LibraryRegular className={styles.icon} />
                  )
                }
                appearance="subtle"
                size="small"
                aria-label="Toggle Library"
                style={
                  libraryChecked ? { backgroundColor: "#f5f5f5" } : undefined
                }
                disabled={disableNavigation}
              />
            </span>
          </Tooltip>

          <Tooltip content="Menu" relationship="label">
            <span style={{ display: "inline-flex" }}>
              <Button
                aria-label="More options"
                appearance="subtle"
                size="small"
                icon={<MoreVertical className={styles.icon} />}
                className={styles.iconButton}
              />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Header;
