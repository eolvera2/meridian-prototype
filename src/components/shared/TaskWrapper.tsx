/**
 * TaskWrapper Component
 *
 * Reusable narrow view wrapper for all tasks that renders via iframe.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 */

import { useParams } from "react-router-dom";
import { coerceSupportedLocale } from "../../i18n/locales";

interface TaskWrapperProps {
  /** The task number (1-9) */
  taskNumber: number;
  /** Optional custom title override */
  title?: string;
}

export const TaskWrapper = ({ taskNumber, title }: TaskWrapperProps) => {
  const params = useParams();
  const locale = coerceSupportedLocale(params.locale);
  const iframeTitle = title || `Task ${taskNumber} Narrow View`;
  const iframeSrc = `#/${locale}/task${taskNumber}-home`;

  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src={iframeSrc}
          title={iframeTitle}
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default TaskWrapper;
