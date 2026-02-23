/**
 * CareCoordinationReviewedPanel Component
 *
 * Simplified patient list for the "Reviewed" panel displayed on the far right.
 * No checkboxes, no "Add Patient" button, no "Select All", no footer.
 */

import React, { useMemo, useState, useEffect } from "react";
import {
  SearchBox,
  Button,
  Divider,
  Tooltip,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItemRadio,
  MenuGroup,
  MenuGroupHeader,
} from "@fluentui/react-components";
import type {
  MenuCheckedValueChangeData,
} from "@fluentui/react-components";
import {
  Search20Regular,
  ArrowSort16Regular,
  ArrowUp16Regular,
  ArrowDown16Regular,
  ArrowSync16Regular,
  Filter16Regular,
  MoreVerticalFilled,
} from "@fluentui/react-icons";

import { useReviewedPanelStyles } from "./CareCoordinationReviewedPanel.styles";
import { useCareCoordinationWorklistContext } from "./CareCoordinationWorklistContext";
import type { CareCoordinationSortOrder, CallType } from "./CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "./CareCoordinationWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";

export const CareCoordinationReviewedPanel: React.FC = () => {
  const styles = useReviewedPanelStyles();
  const { t } = useI18n();
  const { patients, setSelectedPatientId, callTypeFilter, setCallTypeFilter } = useCareCoordinationWorklistContext();

  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<CareCoordinationSortOrder>("none");

  const reviewedPatients = useMemo(
    () => patients.filter((p) => p.group?.toLowerCase() === "reviewed"),
    [patients]
  );

  const filteredPatients = useMemo(() => {
    let next = [...reviewedPatients];

    if (callTypeFilter !== "all") {
      next = next.filter((p) => p.callType === callTypeFilter);
    }

    if (searchValue.trim().length >= 2) {
      const searchLower = searchValue.trim().toLowerCase();
      next = next.filter((patient) => {
        const searchableText = `${patient.name} ${patient.reason} ${patient.languagePreference} ${patient.lastContactSummary}`.toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    if (sortOrder === "asc") {
      next.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      next.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      const parseDate = (d: string) => {
        const parts = d.split("/");
        if (parts.length === 3) {
          const year = 2000 + Number(parts[2]);
          return new Date(year, Number(parts[0]) - 1, Number(parts[1])).getTime();
        }
        return 0;
      };
      next.sort((a, b) => parseDate(b.lastContactDate) - parseDate(a.lastContactDate));
    }

    return next;
  }, [reviewedPatients, searchValue, sortOrder, callTypeFilter]);

  const handleSearchToggle = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchValue("");
    }
  };

  const handleSortToggle = () => {
    const nextOrder: CareCoordinationSortOrder =
      sortOrder === "none" ? "asc" : sortOrder === "asc" ? "desc" : "none";
    setSortOrder(nextOrder);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchVisible) {
        setIsSearchVisible(false);
        setSearchValue("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchVisible]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        {!isSearchVisible ? (
          <div className={styles.titleRow}>
            <span className={styles.title}>Reviewed</span>
            <div className={styles.headerActions}>
              <Tooltip content={t("common.search")} relationship="label">
                <span className="inline-flex">
                  <button
                    className={styles.headerButton}
                    onClick={handleSearchToggle}
                    aria-label="Search reviewed patients"
                  >
                    <Search20Regular />
                  </button>
                </span>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className={styles.searchContainerActive}>
            <div className={styles.searchBox}>
              <SearchBox
                placeholder="Search patients..."
                value={searchValue}
                onChange={(_, data) => setSearchValue(data.value || "")}
                dismiss={{
                  onClick: handleSearchToggle,
                }}
                autoFocus
              />
            </div>
          </div>
        )}

        <Divider />

        <div className={styles.filterRow}>
          <Menu
            checkedValues={{ callType: [callTypeFilter] }}
            onCheckedValueChange={(_: unknown, data: MenuCheckedValueChangeData) => {
              setCallTypeFilter((data.checkedItems[0] || "all") as "all" | CallType);
            }}
          >
            <MenuTrigger disableButtonEnhancement>
              <Tooltip content="Filter by call type" relationship="label">
                <span className="inline-flex">
                  <Button
                    appearance="subtle"
                    className={styles.filterButton}
                    icon={<Filter16Regular />}
                    aria-label="Filter by call type"
                    style={callTypeFilter !== "all" ? { color: "var(--colorBrandForeground1)" } : undefined}
                  />
                </span>
              </Tooltip>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuGroup>
                  <MenuGroupHeader>Call Type</MenuGroupHeader>
                  <MenuItemRadio name="callType" value="all">All Types</MenuItemRadio>
                  <MenuItemRadio name="callType" value="medication-adherence">Med Adherence</MenuItemRadio>
                  <MenuItemRadio name="callType" value="patient-intake">Patient Intake</MenuItemRadio>
                  <MenuItemRadio name="callType" value="hypertension-management">Chronic Care</MenuItemRadio>
                </MenuGroup>
              </MenuList>
            </MenuPopover>
          </Menu>
          <Tooltip content="Refresh" relationship="label">
            <span className="inline-flex">
              <Button
                appearance="subtle"
                className={styles.filterButton}
                icon={<ArrowSync16Regular />}
                aria-label="Refresh reviewed list"
              />
            </span>
          </Tooltip>
          <Tooltip content={t("worklist.sort.tooltip")} relationship="label">
            <span className="inline-flex">
              <Button
                appearance="subtle"
                className={styles.filterButton}
                icon={
                  sortOrder === "asc" ? (
                    <ArrowUp16Regular />
                  ) : sortOrder === "desc" ? (
                    <ArrowDown16Regular />
                  ) : (
                    <ArrowSort16Regular />
                  )
                }
                aria-label="Sort reviewed patients"
                onClick={handleSortToggle}
              />
            </span>
          </Tooltip>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.content} role="region" aria-label="Reviewed patients">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={styles.listItem}
              onClick={() => setSelectedPatientId(patient.id)}
            >
              <div className={styles.listItemMain}>
                <div className={styles.listItemHeader}>
                  <div className={styles.patientName}>{patient.name}</div>
                  <div className={styles.headerActionsRow}>
                    {patient.callType ? (
                      <div className={`${styles.callTypePill} ${styles[`callType_${patient.callType.replace(/-/g, "_")}` as keyof typeof styles] || ""}`}>
                        {CALL_TYPE_LABELS[patient.callType as CallType] || patient.callType}
                      </div>
                    ) : patient.status ? (
                      <div className={styles.statusPill}>{patient.status}</div>
                    ) : null}
                    <button
                      className={styles.moreButton}
                      aria-label={t("common.moreOptions")}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalFilled />
                    </button>
                  </div>
                </div>

                <div className={styles.summaryText}>{patient.reason}</div>

                <div className={styles.metaInfoRow}>
                  <div className={styles.inlineMeta}>
                    <span className={styles.inlineMetaLabel}>Last contact:</span>
                    <span className={styles.inlineMetaValue}>{patient.lastContactDate}</span>
                  </div>
                </div>
                <div className={styles.actionButtonsSpacer} />
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className={styles.emptyState}>
              No reviewed patients
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareCoordinationReviewedPanel;
