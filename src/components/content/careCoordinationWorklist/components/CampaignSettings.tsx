import React from "react";
import {
  Input,
  Label,
  Dropdown,
  Option,
  Checkbox,
} from "@fluentui/react-components";
import { useAddPatientFormStyles } from "../AddPatientForm.styles";
import type { CallType } from "../CareCoordinationWorklist.types";

interface CampaignSettingsProps {
  callType: CallType;
  recurrenceInterval: number;
  onRecurrenceIntervalChange: (value: number) => void;
  recurrenceUnit: string;
  onRecurrenceUnitChange: (value: string) => void;
  timingWindow: string;
  onTimingWindowChange: (value: string) => void;
  campaignStartDate: string;
  onCampaignStartDateChange: (value: string) => void;
  campaignEndDate: string;
  onCampaignEndDateChange: (value: string) => void;
  retryCount: number;
  onRetryCountChange: (value: number) => void;
  retryIntervalHours: number;
  onRetryIntervalHoursChange: (value: number) => void;
  leaveVoicemail: boolean;
  onLeaveVoicemailChange: (value: boolean) => void;
  liveTransfer: boolean;
  onLiveTransferChange: (value: boolean) => void;
  daysBeforeAppt: number;
  onDaysBeforeApptChange: (value: number) => void;
}

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({
  callType,
  recurrenceInterval,
  onRecurrenceIntervalChange,
  recurrenceUnit,
  onRecurrenceUnitChange,
  timingWindow,
  onTimingWindowChange,
  campaignStartDate,
  onCampaignStartDateChange,
  campaignEndDate,
  onCampaignEndDateChange,
  retryCount,
  onRetryCountChange,
  retryIntervalHours,
  onRetryIntervalHoursChange,
  leaveVoicemail,
  onLeaveVoicemailChange,
  liveTransfer,
  onLiveTransferChange,
  daysBeforeAppt,
  onDaysBeforeApptChange,
}) => {
  const styles = useAddPatientFormStyles();

  return (
    <div className={styles.fieldFullWidth}>
      <div className={styles.campaignSettingsCard}>
        <div className={styles.sectionTitle}>Campaign Settings</div>
        <div className={styles.fieldGrid}>
          {/* Recurrence / Days Before Appointment */}
          {callType !== "patient-intake" ? (
            <div className={styles.fieldFullWidth}>
              <Label>Recurrence</Label>
              <div className={styles.inlineRow}>
                <span className={styles.inlineLabel}>Every</span>
                <Input
                  type="number"
                  value={String(recurrenceInterval)}
                  onChange={(_, d) => onRecurrenceIntervalChange(Number(d.value) || 1)}
                  style={{ width: "60px" }}
                />
                <Dropdown
                  value={recurrenceUnit}
                  onOptionSelect={(_, d) => onRecurrenceUnitChange(d.optionText ?? "days")}
                  style={{ minWidth: "100px" }}
                >
                  <Option>days</Option>
                  <Option>weeks</Option>
                  <Option>months</Option>
                </Dropdown>
              </div>
            </div>
          ) : (
            <div className={styles.fieldFullWidth}>
              <Label>Days Before Appointment</Label>
              <div className={styles.inlineRow}>
                <span className={styles.inlineLabel}>Call</span>
                <Input
                  type="number"
                  value={String(daysBeforeAppt)}
                  onChange={(_, d) => onDaysBeforeApptChange(Number(d.value) || 1)}
                  style={{ width: "50px" }}
                />
                <span className={styles.inlineLabel}>days before appointment</span>
              </div>
            </div>
          )}

          {/* Timing Window */}
          <div className={styles.fieldFullWidth}>
            <Label>Timing Window</Label>
            <Dropdown
              value={timingWindow}
              onOptionSelect={(_, d) => onTimingWindowChange(d.optionText ?? "Weekdays (8 AM – 5 PM)")}
              style={{ width: "100%" }}
            >
              <Option>Weekday mornings (8 AM – 12 PM)</Option>
              <Option>Weekday afternoons (12 PM – 5 PM)</Option>
              <Option>Weekdays (8 AM – 5 PM)</Option>
              <Option>Any day (8 AM – 8 PM)</Option>
            </Dropdown>
          </div>

          {/* Start Date */}
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={campaignStartDate}
              onChange={(_, d) => onCampaignStartDateChange(d.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* End Date */}
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={campaignEndDate}
              onChange={(_, d) => onCampaignEndDateChange(d.value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* Retry Policy */}
          <div className={styles.fieldFullWidth}>
            <Label>Retry Policy</Label>
            <div className={styles.inlineRowWrap}>
              <span className={styles.inlineLabel}>Retry up to</span>
              <Input
                type="number"
                value={String(retryCount)}
                onChange={(_, d) => onRetryCountChange(Number(d.value) || 1)}
                style={{ width: "50px" }}
              />
              <span className={styles.inlineLabel}>times, every</span>
              <Input
                type="number"
                value={String(retryIntervalHours)}
                onChange={(_, d) => onRetryIntervalHoursChange(Number(d.value) || 1)}
                style={{ width: "50px" }}
              />
              <span className={styles.inlineLabel}>hours</span>
            </div>
            <Checkbox
              checked={leaveVoicemail}
              onChange={(_, d) => onLeaveVoicemailChange(!!d.checked)}
              label="Leave voicemail on last attempt"
              className={styles.voicemailCheckbox}
            />
          </div>

          {/* Live Transfer */}
          <div className={styles.fieldFullWidth}>
            <Checkbox
              checked={liveTransfer}
              onChange={(_, d) => onLiveTransferChange(!!d.checked)}
              label="Enable live transfer for escalations"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
