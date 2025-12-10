/**
 * Task8StartWrapper Component
 *
 * Narrow view wrapper for Task 8 that renders via iframe to /task8-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Task 8: Start with Note expanded, success when user opens the Copilot Panel.
 */

export const Task8StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task8-home"
          title="Task 8 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task8StartWrapper;
