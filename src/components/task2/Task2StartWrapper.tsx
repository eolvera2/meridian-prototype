/**
 * Task2StartWrapper Component
 *
 * Narrow view wrapper for Task 2 Start that renders via iframe to /task2-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Success condition: User switches to Dictation mode (checkbox or tooltip)
 */

export const Task2StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task2-home"
          title="Task 2 Start Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task2StartWrapper;
