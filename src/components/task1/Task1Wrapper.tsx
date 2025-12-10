/**
 * Task1Wrapper Component
 *
 * Narrow view wrapper for Task 1 that renders via iframe to /task1-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 */

export const Task1Wrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task1-home"
          title="Task 1 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task1Wrapper;
