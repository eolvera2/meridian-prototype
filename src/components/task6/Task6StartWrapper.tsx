/**
 * Task6StartWrapper Component
 *
 * Narrow view wrapper for Task 6 that renders via iframe to /task6-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Task 6: Start with Orders expanded, success when user reaches Settings -> Documents.
 */

export const Task6StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task6-home"
          title="Task 6 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task6StartWrapper;
