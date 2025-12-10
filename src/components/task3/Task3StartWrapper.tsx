/**
 * Task3StartWrapper Component
 *
 * Narrow view wrapper for Task 3 that renders via iframe to /task3-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Task 3: Start in Dictation mode, success when user switches to Ambient mode.
 */

export const Task3StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task3-home"
          title="Task 3 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task3StartWrapper;
