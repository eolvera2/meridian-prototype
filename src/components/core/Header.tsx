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
import { useI18n } from "../../i18n/I18nContext";

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
  const { t } = useI18n();

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
            <Tooltip content={t("header.tooltip.home")} relationship="label">
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
                aria-label={t("header.aria.backToHome")}
                disabled={disableNavigation}
              />
            </Tooltip>
          </div>
          <div className={styles.patientInfo}>
            <div className={styles.name} title={patient?.name}>
              {patient ? patient.name : t("header.patient.noneSelected")}
            </div>
            <div className={styles.subtitle}>
              {patient ? (
                <>
                  <div className={styles.reasonRow}>
                    <span className={styles.reasonLabel}>
                      {t("header.patient.reasonForVisit")}
                    </span>
                    <span>{patient.reason ?? ""}</span>
                  </div>
                  {patient.details ? (
                    <div className={styles.detailsRow}>{patient.details}</div>
                  ) : null}
                </>
              ) : (
                t("header.patient.selectFromWorklist")
              )}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <Tooltip content={t("header.tooltip.transcript")} relationship="label">
            <span className="inline-flex">
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
                aria-label={t("header.aria.toggleTranscript")}
                style={
                  scriptChecked
                    ? { backgroundColor: "var(--colorNeutralBackground3)" }
                    : undefined
                }
                disabled={disableNavigation}
              />
            </span>
          </Tooltip>

          <Tooltip content={t("header.tooltip.library")} relationship="label">
            <span className="inline-flex">
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
                aria-label={t("header.aria.toggleLibrary")}
                style={
                  libraryChecked
                    ? { backgroundColor: "var(--colorNeutralBackground3)" }
                    : undefined
                }
                disabled={disableNavigation}
              />
            </span>
          </Tooltip>

          <Tooltip content={t("header.tooltip.menu")} relationship="label">
            <span className="inline-flex">
              <Button
                aria-label={t("common.moreOptions")}
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
