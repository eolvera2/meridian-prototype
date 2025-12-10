/**
 * TaskWrapper Component
 *
 * Reusable narrow view wrapper for all tasks that renders via iframe.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 */

interface TaskWrapperProps {
  /** The task number (1-9) */
  taskNumber: number;
  /** Optional custom title override */
  title?: string;
}

export const TaskWrapper = ({ taskNumber, title }: TaskWrapperProps) => {
  const iframeTitle = title || `Task ${taskNumber} Narrow View`;
  const iframeSrc = `#/task${taskNumber}-home`;

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
