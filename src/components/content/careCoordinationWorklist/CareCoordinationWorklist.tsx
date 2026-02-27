/**
 * CareCoordinationWorklist Component
 *
 * Standalone clone of the Home worklist for independent medication adherence customization.
 */

import React, { useMemo, useState, useEffect } from "react";
import {
  SearchBox,
  Button,
  Checkbox,
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
  Call20Regular,
  CallRegular,
  PersonAdd20Regular,
  DeleteRegular,
  Delete20Regular,
} from "@fluentui/react-icons";

import { useStyles } from "./CareCoordinationWorklist.styles";
import { useCareCoordinationWorklistContext } from "./CareCoordinationWorklistContext";
import type {
  CareCoordinationWorklistProps,
  CareCoordinationSortOrder,
  CallType,
} from "./CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "./CareCoordinationWorklist.types";
import { useI18n } from "../../../i18n/I18nContext";
import { AddPatientForm } from "./AddPatientForm";

export const CareCoordinationWorklist: React.FC<
  CareCoordinationWorklistProps
> = ({ isCollapsed = false }) => {
  const styles = useStyles();
  const { t } = useI18n();
  const { patients, setSelectedPatientId, callPatients, removeFromQueue, addPatient, callTypeFilter, setCallTypeFilter } = useCareCoordinationWorklistContext();

  const [searchValue, setSearchValue] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortOrder, setSortOrder] =
    useState<CareCoordinationSortOrder>("none");
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [addPatientOpen, setAddPatientOpen] = useState(false);

  const tabbedPatients = useMemo(
    () =>
      patients.filter(
        (patient) => patient.group?.toLowerCase() === "queue"
      ),
    [patients]
  );

  const filteredPatients = useMemo(() => {
    let next = [...tabbedPatients];

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
      // Default: sort by lastContactDate descending (most recent first)
      // Date format is M/D/YY
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
  }, [tabbedPatients, searchValue, sortOrder, callTypeFilter]);

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
              <div className={styles.tabStretchList} style={{ alignItems: "center", paddingLeft: "8px" }}>
                <span className={styles.tabLabel} style={{ fontWeight: 600, fontSize: "16px" }}>
                  Queue
                </span>
              </div>

              <Tooltip content="Add Patient" relationship="label">
                <span className="inline-flex">
                  <button
                    className={styles.searchButton}
                    onClick={() => setAddPatientOpen(true)}
                    aria-label="Add patient"
                  >
                    <PersonAdd20Regular />
                  </button>
                </span>
              </Tooltip>
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
              <Menu
                checkedValues={{ callType: [callTypeFilter] }}
                onCheckedValueChange={(_: unknown, data: MenuCheckedValueChangeData) => {
                  setCallTypeFilter((data.checkedItems[0] || "all") as "all" | CallType);
                  setSelectedPatients(new Set());
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
                      {patient.callType ? (
                        <div className={`${styles.callTypePill} ${styles[`callType_${patient.callType.replace(/-/g, "_")}` as keyof typeof styles] || ""}`}>
                          {CALL_TYPE_LABELS[patient.callType as CallType] || patient.callType}
                        </div>
                      ) : patient.status ? (
                        <div className={styles.statusPill}>{patient.status}</div>
                      ) : null}
                      <button
                        className={`${styles.moreButton} more-button`}
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
                      <span className={styles.inlineMetaLabel}>
                        {patient.callType === "patient-intake" ? "Appointment date:" : "Discharge date:"}
                      </span>
                      <span className={styles.inlineMetaValue}>{patient.dischargeDate || patient.lastContactDate}</span>
                    </div>
                  </div>

                  <div className={`${styles.actionButtons} action-buttons`}>
                    <Tooltip content="Remove from Queue" relationship="label">
                      <span className="inline-flex">
                        <button
                          className={styles.actionButtonDanger}
                          aria-label="Remove from Queue"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue([patient.id]);
                          }}
                        >
                          <Delete20Regular />
                        </button>
                      </span>
                    </Tooltip>
                    <Tooltip content="Schedule Call" relationship="label">
                      <span className="inline-flex" style={{ marginLeft: "auto" }}>
                        <button
                          className={styles.actionButton}
                          aria-label="Schedule Call"
                          onClick={(e) => {
                            e.stopPropagation();
                            callPatients([patient.id]);
                          }}
                        >
                          <Call20Regular />
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
              {selectedPatients.size > 0 ? (
                <>
                  Selected: {filteredPatients
                    .filter((p) => selectedPatients.has(p.id))
                    .map((p) => p.name)
                    .slice(0, 3)
                    .join(", ")}
                  {selectedPatients.size > 3 && ` +${selectedPatients.size - 3} more`}
                </>
              ) : (
                <>Select patients</>
              )}
            </div>
            <div className={styles.footerActions}>
              <Button
                appearance="secondary"
                icon={<DeleteRegular />}
                disabled={selectedPatients.size === 0}
                style={{ flex: 1, height: "44px", fontSize: "14px", fontWeight: 600, color: selectedPatients.size > 0 ? "#D13438" : undefined, borderColor: selectedPatients.size > 0 ? "#D13438" : undefined }}
                onClick={() => {
                  removeFromQueue(Array.from(selectedPatients));
                  setSelectedPatients(new Set());
                }}
              >
                Remove
              </Button>
              <Button
                appearance="primary"
                icon={<CallRegular />}
                disabled={selectedPatients.size === 0}
                style={{ flex: 1, height: "44px", fontSize: "14px", fontWeight: 600 }}
                onClick={() => {
                  callPatients(Array.from(selectedPatients));
                  setSelectedPatients(new Set());
                }}
              >
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {addPatientOpen && (
        <AddPatientForm
          onSave={(patient) => {
            addPatient(patient);
            setAddPatientOpen(false);
          }}
          onCancel={() => setAddPatientOpen(false)}
        />
      )}
    </div>
  );
};

export default CareCoordinationWorklist;
