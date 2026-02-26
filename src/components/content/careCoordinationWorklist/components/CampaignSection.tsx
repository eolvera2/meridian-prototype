import React from "react";
import {
  Label,
  Dropdown,
  Option,
} from "@fluentui/react-components";
import { useAddPatientFormStyles } from "../AddPatientForm.styles";
import type { CallType } from "../CareCoordinationWorklist.types";
import { CALL_TYPE_LABELS } from "../CareCoordinationWorklist.types";
import { campaignDescriptions, campaignOutcomes } from "../constants/campaignConfig";

interface CampaignSectionProps {
  callType: CallType;
  onCallTypeChange: (value: CallType) => void;
  onLiveTransferChange: (value: boolean) => void;
}

export const CampaignSection: React.FC<CampaignSectionProps> = ({
  callType,
  onCallTypeChange,
  onLiveTransferChange,
}) => {
  const styles = useAddPatientFormStyles();

  return (
    <>
      {/* Call Type dropdown */}
      <div className={styles.fieldFullWidth}>
        <Label htmlFor="callType" required>Call Type</Label>
        <Dropdown
          id="callType"
          value={CALL_TYPE_LABELS[callType]}
          onOptionSelect={(_, d) => {
            const newType = (d.optionValue ?? "medication-adherence") as CallType;
            onCallTypeChange(newType);
            onLiveTransferChange(newType === "hypertension-management");
          }}
          style={{ width: "100%" }}
        >
          <Option value="medication-adherence">{CALL_TYPE_LABELS["medication-adherence"]}</Option>
          <Option value="patient-intake">{CALL_TYPE_LABELS["patient-intake"]}</Option>
          <Option value="hypertension-management">{CALL_TYPE_LABELS["hypertension-management"]}</Option>
        </Dropdown>
      </div>

      {/* Campaign Description */}
      <div className={styles.fieldFullWidth}>
        <div className={styles.campaignDescription}>
          {campaignDescriptions[callType]}
        </div>
      </div>

      {/* What the system will collect */}
      <div className={styles.fieldFullWidth}>
        <Label className={styles.outcomesLabel}>What the system will collect</Label>
        <div className={styles.outcomesGrid}>
          {campaignOutcomes[callType].map((item, idx) => (
            <span key={idx} className={styles.outcomeItem}>
              • {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
