/**
 * MedicationAdherenceWorklist Component
 *
 * Standalone clone of the Home worklist for independent medication adherence customization.
 */

import React, { useMemo, useState, useEffect } from "react";
import {
  TabList,
  Tab,
  SearchBox,
  Button,
  Checkbox,
  Divider,
  Tooltip,
  mergeClasses,
} from "@fluentui/react-components";
import type {
  SelectTabEvent,
  SelectTabData,
  TabValue,
} from "@fluentui/react-components";
import {
  Search20Regular,
  ArrowSort16Regular,
  ArrowUp16Regular,
  ArrowDown16Regular,
  ArrowSync16Regular,
  MoreVerticalFilled,
  Chat20Regular,
  Call20Regular,
  CallRegular,
} from "@fluentui/react-icons";

import { useStyles } from "./MedicationAdherenceWorklist.styles";
import { useMedicationAdherenceWorklistContext } from "./MedicationAdherenceWorklistContext";
import type {
  MedicationAdherenceWorklistProps,
  MedicationAdherenceSortOrder,
} from "./MedicationAdherenceWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";

type MedicationAdherenceTab = "urgent" | "queue" | "cleared";

export const MedicationAdherenceWorklist: React.FC<
  MedicationAdherenceWorklistProps
> = ({ isCollapsed = false }) => {
  const styles = useStyles();
  const { t } = useI18n();
  const { patients, setSelectedPatientId, callPatients } = useMedicationAdherenceWorklistContext();

  const [activeTab, setActiveTab] = useState<TabValue>("urgent");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortOrder, setSortOrder] =
    useState<MedicationAdherenceSortOrder>("none");
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());

  const activeMedicationTab = activeTab as MedicationAdherenceTab;

  const tabbedPatients = useMemo(
    () =>
      patients.filter(
        (patient) => patient.group?.toLowerCase() === activeMedicationTab
      ),
    [patients, activeMedicationTab]
  );

  const filteredPatients = useMemo(() => {
    let next = [...tabbedPatients];

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
    }

    return next;
  }, [tabbedPatients, searchValue, sortOrder]);

  const handleTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value);
    setSearchValue("");
    setIsSearchVisible(false);
    setSortOrder("none");
    setSelectedPatients(new Set());
  };

  const handleSearchToggle = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchValue("");
    }
  };

  const handleSortToggle = () => {
    const nextOrder: MedicationAdherenceSortOrder =
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
    <div
      className={`${styles.worklist} ${
        isCollapsed ? styles.worklistCollapsed : ""
      }`}
    >
      <div className={styles.header}>
        <div
          className={`${styles.tabs} ${
            isSearchVisible ? styles.tabsSearchActive : ""
          }`}
          role="tablist"
          aria-label="Medication adherence tabs"
        >
          {!isSearchVisible ? (
            <>
              <TabList
                selectedValue={activeTab}
                onTabSelect={handleTabSelect}
                size="small"
                className={styles.tabStretchList}
              >
                <Tab
                  className={mergeClasses(styles.tabStretch, styles.tabUrgent)}
                  value="urgent"
                >
                  <span className={styles.tabLabel}>
                    <span
                      className={`${styles.tabDot} ${styles.tabDotUrgent}`}
                      aria-hidden="true"
                    />
                    Urgent
                  </span>
                </Tab>
                <Tab
                  className={mergeClasses(styles.tabStretch, styles.tabQueue)}
                  value="queue"
                >
                  <span className={styles.tabLabel}>
                    <span
                      className={`${styles.tabDot} ${styles.tabDotQueue}`}
                      aria-hidden="true"
                    />
                    Queue
                  </span>
                </Tab>
                <Tab
                  className={mergeClasses(styles.tabStretch, styles.tabCleared)}
                  value="cleared"
                >
                  <span className={styles.tabLabel}>
                    <span
                      className={`${styles.tabDot} ${styles.tabDotCleared}`}
                      aria-hidden="true"
                    />
                    Cleared
                  </span>
                </Tab>
              </TabList>

              <Tooltip content={t("common.search")} relationship="label">
                <span className="inline-flex">
                  <button
                    className={styles.searchButton}
                    onClick={handleSearchToggle}
                    aria-label="Search medication adherence patients"
                  >
                    <Search20Regular />
                  </button>
                </span>
              </Tooltip>
            </>
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
        </div>

        <Divider />

        <div className={styles.calendarFilter}>
          <div className={styles.dateRange}>
            <div className={styles.selectAllRow}>
              <Checkbox
                checked={
                  filteredPatients.length > 0 &&
                  filteredPatients.every((p) => selectedPatients.has(p.id))
                    ? true
                    : filteredPatients.some((p) => selectedPatients.has(p.id))
                    ? "mixed"
                    : false
                }
                onChange={(_, data) => {
                  if (data.checked) {
                    setSelectedPatients(new Set(filteredPatients.map((p) => p.id)));
                  } else {
                    setSelectedPatients(new Set());
                  }
                }}
                aria-label="Select all patients"
              />
              <div className={styles.dateText}>
                Select all
              </div>
            </div>
            <div className={styles.filterOptions}>
              <Tooltip content="Refresh" relationship="label">
                <span className="inline-flex">
                  <Button
                    appearance="subtle"
                    className={styles.filterButton}
                    icon={<ArrowSync16Regular />}
                    aria-label="Refresh patient list"
                    onClick={() => {
                      setSelectedPatients(new Set());
                    }}
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
                    aria-label="Sort medication adherence patients"
                    onClick={handleSortToggle}
                  />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.worklistBody}>
        <div className={styles.content} role="tabpanel">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className={styles.listItem}
              data-patient-id={patient.id}
              data-patient-name={patient.name}
              data-patient-reason={patient.reason}
              onClick={() => setSelectedPatientId(patient.id)}
            >
              <div className={styles.listItemContent}>
                <Checkbox
                  className={styles.patientCheckbox}
                  checked={selectedPatients.has(patient.id)}
                  onChange={(e, data) => {
                    e.stopPropagation();
                    setSelectedPatients((prev) => {
                      const next = new Set(prev);
                      if (data.checked) {
                        next.add(patient.id);
                      } else {
                        next.delete(patient.id);
                      }
                      return next;
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${patient.name}`}
                />
                <div className={styles.listItemMain}>
                  <div className={styles.listItemHeader}>
                    <div className={styles.patientName}>{patient.name}</div>
                    <div className={styles.headerActions}>
                      {patient.status ? (
                        <div className={styles.statusPill}>{patient.status}</div>
                      ) : null}
                      <button
                        className={`${styles.moreButton} more-button`}
                        aria-label={t("common.moreOptions")}
                      >
                        <MoreVerticalFilled />
                      </button>
                    </div>
                  </div>

                  <div className={styles.metaInfoRow}>
                    <div className={styles.inlineMeta}>
                      <span className={styles.inlineMetaLabel}>Last contact:</span>
                      <span className={styles.inlineMetaValue}>{patient.lastContactDate}</span>
                      <span className={styles.contactMethodIcon}>
                        {patient.lastContactMethod === "chat" ? (
                          <Chat20Regular />
                        ) : (
                          <Call20Regular />
                        )}
                      </span>
                    </div>
                    <div className={styles.inlineMeta}>
                      <span className={styles.inlineMetaLabel}>Discharge:</span>
                      <span className={styles.inlineMetaValue}>{patient.dischargeDate}</span>
                    </div>
                  </div>

                  <div className={styles.summaryText}>{patient.reason}</div>

                  <div className={styles.detailsLine}>
                    {patient.demographics}
                  </div>

                  <div className={`${styles.actionButtons} action-buttons`}>
                    <Tooltip content="Call patient" relationship="label">
                      <span className="inline-flex">
                        <button
                          className={styles.actionButton}
                          aria-label="Call patient"
                          onClick={(e) => {
                            e.stopPropagation();
                            callPatients([patient.id]);
                          }}
                        >
                          <Call20Regular />
                        </button>
                      </span>
                    </Tooltip>
                    <Tooltip content="Chat with patient" relationship="label">
                      <span className="inline-flex">
                        <button
                          className={styles.actionButton}
                          aria-label="Chat with patient"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Chat20Regular />
                        </button>
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className={styles.groupHeader}>
              <div className={styles.groupTitle}>No patients in this tab</div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerLabel}>
              Ready to contact {selectedPatients.size} patient{selectedPatients.size !== 1 ? "s" : ""}
            </div>
            <div className={styles.footerActions}>
              <Button
                appearance="primary"
                icon={<CallRegular />}
                disabled={selectedPatients.size === 0}
                style={{ flex: 1 }}
                onClick={() => {
                  callPatients(Array.from(selectedPatients));
                  setSelectedPatients(new Set());
                }}
              >
                Call
              </Button>
              <Button
                appearance="secondary"
                icon={<Chat20Regular />}
                disabled={selectedPatients.size === 0}
                style={{ flex: 1 }}
              >
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationAdherenceWorklist;
