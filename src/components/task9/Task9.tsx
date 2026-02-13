/**
 * Task9 Component
 *
 * EHR Fame layout - Contoso EHR design (without blue background)
 * Based on Figma node 12577-112363
 */

import React from "react";
import {
  Button,
  FluentProvider,
  webLightTheme,
} from "@fluentui/react-components";
import {
  Subtract20Regular,
  Square20Regular,
  Dismiss20Regular,
  Person28Regular,
  QuestionCircle16Regular,
  PersonFeedback16Regular,
  Search16Regular,
  Add20Regular,
  ClipboardPulse20Regular,
} from "@fluentui/react-icons";
import { useTask9Styles } from "./Task9Styles";
import { FloatingMicBar } from "./FloatingMicBar";
import { useI18n } from "../../i18n/I18nContext";

// Service codes for Level of Service
const SERVICE_CODES = [
  "99202",
  "99203",
  "99204",
  "99205",
  "99212",
  "99213",
  "99214",
  "99215",
];

// Left nav items - first one is Notes (selected), rest are generic
const LEFT_NAV_ITEMS = [
  { id: "notes", type: "notes" },
  { id: "item2", type: "generic" },
  { id: "item3", type: "generic" },
  { id: "item4", type: "generic" },
  { id: "item5", type: "generic" },
  { id: "item6", type: "generic" },
  { id: "item7", type: "generic" },
  { id: "item8", type: "generic" },
  { id: "item9", type: "generic" },
  { id: "item10", type: "generic" },
  { id: "item11", type: "generic" },
];

export const Task9: React.FC = () => {
  const styles = useTask9Styles();
  const { t } = useI18n();

  return (
    <FluentProvider theme={webLightTheme}>
      {/* EHR Fame - main card filling viewport */}
      <div className={styles.ehrFame}>
        {/* Contoso Title Bar */}
        <div className={styles.contosoTitle}>
          <div className={styles.contosoBadge}>
            {t("task9.contoso.badgeLetter")}
          </div>
          <span className={styles.contosoAppTitle}>
            {t("task9.contoso.appTitle")}
          </span>
          <div className={styles.contosoTitleRight}>
            <Button
              appearance="subtle"
              icon={<Subtract20Regular />}
              size="large"
              aria-label={t("common.minimize")}
            />
            <Button
              appearance="subtle"
              icon={<Square20Regular />}
              size="large"
              aria-label={t("common.maximize")}
            />
            <Button
              appearance="subtle"
              icon={<Dismiss20Regular />}
              size="large"
              aria-label={t("common.close")}
            />
          </div>
        </div>

        {/* Header with patient info */}
        <div className={styles.ehrHeader}>
          <div className={styles.patientAvatar}>
            <Person28Regular />
          </div>
          <div className={styles.patientInfo}>
            <span className={styles.patientName}>
              {t("task9.patient.name")}
            </span>
            <span className={styles.patientDetails}>
              {t("task9.patient.details")}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* EHR Body */}
        <div className={styles.ehrBody}>
          {/* Left Navigation */}
          <div className={styles.leftNav}>
            {LEFT_NAV_ITEMS.map((item) => (
              <div key={item.id} className={styles.leftNavItem}>
                {item.type === "notes" ? (
                  <>
                    <div className={styles.leftNavItemBadge}>
                      <ClipboardPulse20Regular
                        style={{
                          color: "var(--colorBrandForeground)",
                          width: 16,
                          height: 16,
                        }}
                      />
                    </div>
                    <span className={styles.leftNavItemText}>
                      {t("task9.leftNav.notes")}
                    </span>
                  </>
                ) : (
                  <>
                    <div className={styles.leftNavItemBadgeGeneric} />
                    <div className={styles.leftNavItemPlaceholder} />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Epic Note (Main Content) */}
          <div className={styles.epicNote}>
            <div className={styles.noteContainer}>
              <div className={styles.noteHeader}>
                <div className={styles.noteHeaderActions}>
                  <PersonFeedback16Regular />
                  <QuestionCircle16Regular />
                </div>
                <h1 className={styles.noteTitle}>{t("task9.noteTitle")}</h1>
              </div>
              <div className={styles.noteBody}>
                {/* Note body content - empty white space */}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Level of Service */}
            <div className={styles.levelOfService}>
              <div className={styles.losHeader}>
                {t("task9.levelOfService.title")}
              </div>
              <div className={styles.losSearchBar}>
                <div className={styles.losSearchInput}>
                  <Search16Regular
                    style={{ color: "var(--palette-gray-616161)" }}
                  />
                  <span className={styles.losSearchText}>
                    {t("task9.levelOfService.searchPlaceholder")}
                  </span>
                </div>
                <button className={styles.losAddButton}>
                  <Add20Regular />
                  <span>{t("common.add")}</span>
                </button>
              </div>
              <div className={styles.losButtonGrid}>
                {SERVICE_CODES.map((code) => (
                  <button key={code} className={styles.losCodeButton}>
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* EHR Component placeholders */}
            <div className={styles.ehrComponent}>
              <div className={styles.ehrComponentAvatar} />
              <div className={styles.ehrComponentLine} />
              <div className={styles.ehrComponentLine} />
              <div className={styles.ehrComponentLine} />
              <div className={styles.ehrComponentLine} />
            </div>

            <div className={styles.ehrComponent}>
              <div className={styles.ehrComponentAvatar} />
              <div className={styles.ehrComponentLine} />
              <div className={styles.ehrComponentLine} />
              <div className={styles.ehrComponentLine} />
              <div className={styles.ehrComponentLine} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerBadge}>
            {t("task9.contoso.badgeLetter")}
          </div>
          <span className={styles.footerText}>{t("task9.footer")}</span>
        </div>

        {/* Floating Mic Bar */}
        <FloatingMicBar />
      </div>
    </FluentProvider>
  );
};

export default Task9;
