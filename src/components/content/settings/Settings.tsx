/**
 * Settings Component
 *
 * Settings panel with expandable sections and sub-page navigation.
 */

import React from "react";
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
  DismissCircle12Regular,
  DocumentOnePageSparkleRegular,
  MicSettings20Regular,
  Settings20Regular,
  TextField20Regular,
  Library20Regular,
  Person20Regular,
} from "@fluentui/react-icons";
import { useStyles } from "./Settings.styles";
import { useI18n } from "../../../i18n/I18nContext";

export interface SettingsProps {
  onClose?: () => void;
  onTitleChange?: (title: string) => void;
  activeSubPage?: string | null;
  onSubPageChange?: (page: string | null) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onTitleChange,
  activeSubPage,
  onSubPageChange,
}) => {
  const styles = useStyles();
  const { t } = useI18n();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(
    "languages"
  );
  const [languages, setLanguages] = React.useState<Array<"en" | "es">>([
    "en",
    "es",
  ]);
  const [internalPage, setInternalPage] = React.useState<string | null>(
    activeSubPage ?? null
  );
  const previousActiveRef = React.useRef(activeSubPage);

  React.useEffect(() => {
    if (activeSubPage !== previousActiveRef.current) {
      previousActiveRef.current = activeSubPage;
      if (activeSubPage !== undefined) {
        setInternalPage(activeSubPage ?? null);
      }
    }
  }, [activeSubPage]);

  const currentPage = internalPage;

  const handleSectionClick = (section: string, navigable?: boolean) => {
    if (navigable) {
      setInternalPage(section);
      onSubPageChange?.(section);
    } else {
      setExpandedSection(expandedSection === section ? null : section);
    }
  };

  const handleBack = () => {
    setInternalPage(null);
    onSubPageChange?.(null);
  };

  const handleRemoveLanguage = (language: string) => {
    setLanguages(languages.filter((lang) => lang !== language));
  };

  // Sub-page configurations
  const subPages = React.useMemo<
    Record<string, { backLabel: string; title: string; message: string }>
  >(
    () => ({
      documents: {
        backLabel: t("rightDrawer.titles.settings"),
        title: t("settings.sections.documents"),
        message: t("settings.subPages.documents.comingSoon"),
      },
    }),
    [t]
  );

  React.useEffect(() => {
    const nextTitle =
      currentPage && subPages[currentPage]
        ? ""
        : t("rightDrawer.titles.settings");
    onTitleChange?.(nextTitle);
  }, [currentPage, onTitleChange, subPages, t]);

  // Render sub-page if one is active
  if (currentPage && subPages[currentPage]) {
    const page = subPages[currentPage];
    return (
      <div className={styles.subPageContainer}>
        <div className={styles.subPageHeader} onClick={handleBack}>
          <ChevronLeft20Regular className={styles.backIcon} />
          <span className={styles.backText}>{page.backLabel}</span>
        </div>
        <div className={styles.subPageTitle}>{page.title}</div>
        <div className={styles.subPageBody}>
          <span className={styles.placeholderMessage}>{page.message}</span>
        </div>
      </div>
    );
  }

  const settingSections = [
    {
      id: "languages",
      title: t("settings.sections.ambientRecordingLanguages"),
      description: t("settings.descriptions.certifiedLanguages"),
      expandable: true,
    },
    {
      id: "microphone",
      icon: <MicSettings20Regular />,
      title: t("settings.sections.microphone"),
      description: null,
      expandable: false,
    },
    {
      id: "general",
      icon: <Settings20Regular />,
      title: t("settings.sections.general"),
      description: null,
      expandable: false,
    },
    {
      id: "style",
      icon: <TextField20Regular />,
      title: t("settings.sections.styleAndFormat"),
      description: null,
      expandable: false,
    },
    {
      id: "documents",
      icon: <DocumentOnePageSparkleRegular />,
      title: t("settings.sections.documents"),
      description: null,
      expandable: false,
      navigable: true,
    },
    {
      id: "library",
      icon: <Library20Regular />,
      title: t("settings.sections.library"),
      description: null,
      expandable: false,
    },
    {
      id: "profile",
      icon: <Person20Regular />,
      title: t("settings.sections.profile"),
      description: null,
      expandable: false,
    },
  ];

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.content}>
        {settingSections.map((section) => (
          <div
            key={section.id}
            className={`${styles.settingSection} ${
              expandedSection === section.id
                ? styles.settingSectionExpanded
                : ""
            }`}
            onClick={() => {
              if (section.navigable) {
                handleSectionClick(section.id, true);
              } else if (section.expandable) {
                handleSectionClick(section.id, false);
              }
            }}
          >
            <div className={styles.settingHeader}>
              <div className={styles.settingLeft}>
                {section.icon && (
                  <div className={styles.settingIcon}>{section.icon}</div>
                )}
                <div className={styles.settingContent}>
                  <div className={styles.settingTitle}>{section.title}</div>
                  {section.description && (
                    <div className={styles.settingDescription}>
                      {section.description}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight20Regular className={styles.chevronIcon} />
            </div>

            {section.id === "languages" && expandedSection === "languages" && (
              <div className={styles.expandedContent}>
                <div className={styles.languageTags}>
                  {languages.map((lang) => {
                    const languageLabel = t(
                      `settings.languages.options.${lang}`
                    );
                    return (
                      <div key={lang} className={styles.languageTag}>
                        {languageLabel}
                        {lang !== "en" && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLanguage(lang);
                            }}
                            role="button"
                            aria-label={t(
                              `settings.languages.removeAria.${lang}`
                            )}
                            className={styles.removeBadge}
                          >
                            <div className={styles.badgeContent}>
                              <DismissCircle12Regular />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
