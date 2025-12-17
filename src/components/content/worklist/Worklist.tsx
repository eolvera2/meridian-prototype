/**
 * Worklist Component
 *
 * Displays a list of patients grouped by date with search and filter functionality.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PresenceBadge,
  TabList,
  Tab,
  SearchBox,
  Button,
  Divider,
  Tooltip,
} from "@fluentui/react-components";
import type {
  SelectTabEvent,
  SelectTabData,
  TabValue,
} from "@fluentui/react-components";
import {
  Search20Regular,
  CalendarLtr20Regular,
  ChevronDown12Regular,
  Filter16Regular,
  ArrowSort16Regular,
  ArrowUp16Regular,
  ArrowDown16Regular,
  MoreVerticalFilled,
  ChatAdd24Filled,
  DeviceEqRegular,
} from "@fluentui/react-icons";

import { useStyles } from "./Worklist.styles";
import { useWorklistContext } from "./WorklistContext";
import type { WorklistProps, SortOrder } from "./Worklist.types";

const ORDERED_GROUPS = [
  "Today",
  "Yesterday",
  "Last Week",
  "Last 2 Weeks",
  "Last Month",
  "Later",
];

export const Worklist: React.FC<WorklistProps> = ({
  isCollapsed = false,
  onPatientSelect,
  onAddPatient,
  onMicButtonClick,
}) => {
  const styles = useStyles();
  const { patients } = useWorklistContext();
  const toId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const hasValidLastModified = (value?: string) => {
    const normalized = value?.trim();
    return Boolean(normalized && normalized !== "--" && normalized !== "0");
  };

  const shouldShowLastModified = (patient: (typeof patients)[number]) => {
    const recordingSeconds = patient.initialRecordingSeconds ?? 0;
    return recordingSeconds > 0 && hasValidLastModified(patient.lastModified);
  };

  const [activeTab, setActiveTab] = useState<TabValue>("schedule");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  // Update filteredPatients when context patients change (e.g., lastModified updated)
  React.useEffect(() => {
    if (searchValue.length < 3 && sortOrder === "none") {
      setFilteredPatients(patients);
    }
  }, [patients, searchValue, sortOrder]);

  const handleTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value);
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchValue("");
      setFilteredPatients(patients);
      setSortOrder("none");
      setExpandedGroups(
        ORDERED_GROUPS.reduce((acc, g) => {
          acc[g] = g === "Today";
          return acc;
        }, {} as Record<string, boolean>)
      );
    }
  };

  const handleSortToggle = () => {
    const nextOrder: SortOrder =
      sortOrder === "none" ? "asc" : sortOrder === "asc" ? "desc" : "none";
    setSortOrder(nextOrder);

    let sortedPatients = [...filteredPatients];
    if (nextOrder === "asc") {
      sortedPatients.sort((a, b) => a.name.localeCompare(b.name));
    } else if (nextOrder === "desc") {
      sortedPatients.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      sortedPatients =
        searchValue.length >= 3
          ? patients.filter((patient) => {
              const names = patient.name.toLowerCase().split(" ");
              const searchLower = searchValue.toLowerCase();
              return (
                names.some((name) => name.includes(searchLower)) ||
                patient.name.toLowerCase().includes(searchLower)
              );
            })
          : patients;
    }
    setFilteredPatients(sortedPatients);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    let filtered: typeof patients;
    if (value.length >= 3) {
      filtered = patients.filter((patient) => {
        const names = patient.name.toLowerCase().split(" ");
        const searchLower = value.toLowerCase();
        return (
          names.some((name) => name.includes(searchLower)) ||
          patient.name.toLowerCase().includes(searchLower)
        );
      });

      const groupsWithResults = [
        ...new Set(filtered.map((patient) => patient.group)),
      ];
      setExpandedGroups((prev) => {
        const updated = { ...prev };
        groupsWithResults.forEach((group) => {
          if (group) {
            updated[group] = true;
          }
        });
        return updated;
      });
    } else {
      filtered = patients;
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredPatients(filtered);
  };

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    ORDERED_GROUPS.reduce((acc, g) => {
      acc[g] = g === "Today";
      return acc;
    }, {} as Record<string, boolean>)
  );

  const groups = ORDERED_GROUPS.filter((g) =>
    filteredPatients.some((p) => p.group === g)
  );

  // Refs for auto-expand calculation
  const worklistBodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const hasAutoExpandedRef = useRef(false);

  const estimateGroupContentHeight = useCallback(
    (groupName: string) => {
      const patientsInGroup = filteredPatients.filter(
        (p) => p.group === groupName
      );
      const heightPerPatient = 140;
      return patientsInGroup.length * heightPerPatient;
    },
    [filteredPatients]
  );

  useEffect(() => {
    if (hasAutoExpandedRef.current || isCollapsed || !worklistBodyRef.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!worklistBodyRef.current || !contentRef.current) return;

      const worklistBodyHeight = worklistBodyRef.current.clientHeight;
      const footerHeight = 80;
      const availableHeight = worklistBodyHeight - footerHeight;

      const headerHeight = 48;
      const groupsWithPatients = groups;
      const totalHeadersHeight = groupsWithPatients.length * headerHeight;
      const todayContentHeight = estimateGroupContentHeight("Today");
      const currentHeight = totalHeadersHeight + todayContentHeight;

      let remainingSpace = availableHeight - currentHeight;

      if (remainingSpace > 100) {
        const sectionsToExpand: string[] = [];

        for (const group of groupsWithPatients) {
          if (group === "Today") continue;

          const groupContentHeight = estimateGroupContentHeight(group);

          if (remainingSpace >= groupContentHeight) {
            sectionsToExpand.push(group);
            remainingSpace -= groupContentHeight;
          } else if (remainingSpace > 100) {
            if (groupContentHeight <= remainingSpace * 2) {
              sectionsToExpand.push(group);
              break;
            }
          }

          if (remainingSpace < 100) break;
        }

        if (sectionsToExpand.length > 0) {
          setExpandedGroups((prev) => {
            const updated = { ...prev };
            sectionsToExpand.forEach((group) => {
              updated[group] = true;
            });
            return updated;
          });
        }
      }

      hasAutoExpandedRef.current = true;
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [groups, isCollapsed, estimateGroupContentHeight]);

  const handlePatientClick = (patientId: string) =>
    onPatientSelect?.(patientId);
  const handleAddPatient = () => onAddPatient?.();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchVisible) {
        setIsSearchVisible(false);
        setSearchValue("");
        setFilteredPatients(patients);
        setSortOrder("none");
        setExpandedGroups(
          ORDERED_GROUPS.reduce((acc, g) => {
            acc[g] = g === "Today";
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchVisible, patients]);

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
          aria-label="Worklist tabs"
        >
          {!isSearchVisible ? (
            <>
              <TabList
                selectedValue={activeTab}
                onTabSelect={handleTabSelect}
                size="small"
                className={styles.tabStretchList}
              >
                <Tab className={styles.tabStretch} value="schedule">
                  <span className={styles.tabLabel}>Schedule</span>
                </Tab>
                <Tab className={styles.tabStretch} value="patient-list">
                  <span className={styles.tabLabel}>User-added</span>
                </Tab>
              </TabList>

              <Tooltip content="Search" relationship="label">
                <span style={{ display: "inline-flex" }}>
                  <button
                    className={styles.searchButton}
                    onClick={handleSearchToggle}
                    aria-label="Search patients"
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
                  onChange={(_, data) => handleSearchChange(data.value || "")}
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
            <div className={styles.dateInput}>
              <div className={styles.dateInputContent}>
                <CalendarLtr20Regular className={styles.dateIcon} />
                <div className={styles.dateText}>July 23</div>
                <ChevronDown12Regular className={styles.chevronIcon} />
              </div>
              <div className={styles.dateUnderline} />
            </div>
            <div className={styles.filterOptions}>
              <Button
                appearance="subtle"
                className={styles.filterButton}
                icon={<Filter16Regular />}
                aria-label="Filter options"
              />
              <Tooltip content="Sort" relationship="label">
                <span style={{ display: "inline-flex" }}>
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
                    aria-label={`Sort patients ${
                      sortOrder === "none"
                        ? "alphabetically"
                        : sortOrder === "asc"
                        ? "descending"
                        : "ascending"
                    }`}
                    onClick={handleSortToggle}
                  />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.worklistBody} ref={worklistBodyRef}>
        <div
          className={styles.content}
          ref={contentRef}
          role="tabpanel"
          id={
            activeTab === "schedule"
              ? "worklist-panel-schedule"
              : "worklist-panel-patient-list"
          }
          aria-labelledby={
            activeTab === "schedule"
              ? "worklist-tab-schedule"
              : "worklist-tab-patient-list"
          }
        >
          {activeTab === "schedule"
            ? groups.map((group) => (
                <div
                  key={group}
                  ref={(el) => {
                    if (el) groupRefs.current.set(group, el);
                  }}
                >
                  <div
                    className={styles.groupHeader}
                    role="button"
                    tabIndex={0}
                    aria-expanded={!!expandedGroups[group]}
                    aria-controls={`worklist-group-${toId(group)}-content`}
                    id={`worklist-group-${toId(group)}-header`}
                    onClick={() =>
                      setExpandedGroups((s) => ({ ...s, [group]: !s[group] }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setExpandedGroups((s) => ({
                          ...s,
                          [group]: !s[group],
                        }));
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <ChevronDown12Regular
                        className={styles.headerChevron}
                        aria-hidden="true"
                        style={{
                          transform: expandedGroups[group]
                            ? "rotate(0deg)"
                            : "rotate(-90deg)",
                          transition: "transform 120ms ease",
                          transformOrigin: "center",
                        }}
                      />
                      <div className={styles.groupTitle}>{group}</div>
                    </div>
                  </div>

                  {expandedGroups[group] && (
                    <div
                      role="region"
                      id={`worklist-group-${toId(group)}-content`}
                      aria-labelledby={`worklist-group-${toId(group)}-header`}
                    >
                      {filteredPatients
                        .filter((p) => p.group === group)
                        .map((patient) => (
                          <div
                            key={patient.id}
                            className={styles.listItem}
                            data-patient-id={patient.id}
                            data-patient-name={patient.name}
                            data-patient-reason={patient.reason}
                            data-patient-time={patient.time}
                            onClick={() => handlePatientClick(patient.id)}
                          >
                            <div className={styles.listItemContent}>
                              <div className={styles.listItemMain}>
                                <div className={styles.listItemHeader}>
                                  <div className={styles.patientName}>
                                    {patient.name}
                                  </div>
                                  <div className={styles.rightSide}>
                                    {activeTab === "schedule" && (
                                      <div className={styles.timeText}>
                                        {patient.time}
                                      </div>
                                    )}
                                    <button
                                      className={`${styles.moreButton} more-button`}
                                      aria-label="More options"
                                    >
                                      <MoreVerticalFilled />
                                    </button>
                                  </div>
                                </div>
                                <div className={styles.description}>
                                  Reason: {patient.reason}
                                  <br />
                                  {patient.details}
                                </div>
                                <div className={styles.statusRow}>
                                  {patient.signed &&
                                  patient.group ===
                                    "Today" ? null : patient.status ===
                                    "Sync initiated" ? (
                                    <div className={styles.syncPill}>
                                      Sync initiated
                                    </div>
                                  ) : (
                                    patient.status && (
                                      <div className={styles.statusBadge} />
                                    )
                                  )}

                                  <div className={styles.statusText}>
                                    {patient.signed &&
                                    patient.group === "Today" ? (
                                      <>
                                        <div className={styles.signedPill}>
                                          <PresenceBadge />
                                          <div className={styles.signedText}>
                                            Signed
                                          </div>
                                        </div>
                                        {shouldShowLastModified(patient) && (
                                          <div className={styles.modifiedText}>
                                            Modified {patient.lastModified}
                                          </div>
                                        )}
                                      </>
                                    ) : shouldShowLastModified(patient) ? (
                                      <div className={styles.modifiedText}>
                                        Modified {patient.lastModified}
                                      </div>
                                    ) : (
                                      <>{patient.status}</>
                                    )}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Tooltip
                                    content="Ambient Recording"
                                    relationship="label"
                                  >
                                    <span style={{ display: "inline-flex" }}>
                                      <button
                                        className={`${styles.micButton} mic-button`}
                                        aria-label="Ambient Recording"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onPatientSelect?.(patient.id);
                                          onMicButtonClick?.(patient.id);
                                        }}
                                      >
                                        <DeviceEqRegular />
                                      </button>
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))
            : filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={styles.listItem}
                  data-patient-id={patient.id}
                  data-patient-name={patient.name}
                  data-patient-reason={patient.reason}
                  data-patient-time={patient.time}
                  onClick={() => handlePatientClick(patient.id)}
                >
                  <div className={styles.listItemContent}>
                    <div className={styles.listItemMain}>
                      <div className={styles.listItemHeader}>
                        <div className={styles.patientName}>{patient.name}</div>
                        <div className={styles.rightSide}>
                          <button
                            className={`${styles.moreButton} more-button`}
                            aria-label="More options"
                          >
                            <MoreVerticalFilled />
                          </button>
                        </div>
                      </div>
                      <div className={styles.description}>
                        Reason: {patient.reason}
                        <br />
                        {patient.details}
                      </div>
                      <div className={styles.statusRow}>
                        <div className={styles.userAddedPill}>User-added</div>
                        <div className={styles.createdText}>
                          Created {patient.time}
                        </div>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Tooltip
                          content="Ambient Recording"
                          relationship="label"
                        >
                          <span style={{ display: "inline-flex" }}>
                            <button
                              className={`${styles.micButton} mic-button`}
                              aria-label="Ambient Recording"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPatientSelect?.(patient.id);
                                onMicButtonClick?.(patient.id);
                              }}
                            >
                              <DeviceEqRegular />
                            </button>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.addPatientButton}
            onClick={handleAddPatient}
          >
            <ChatAdd24Filled className={styles.addIcon} />
            <div className={styles.addPatientText}>Add patient</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Worklist;
