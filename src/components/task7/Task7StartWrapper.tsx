/**
 * Task7StartWrapper Component
 *
 * Narrow view wrapper for Task 7 that renders via iframe to /task7-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Task 7: Start with Note expanded, success when user completes pronoun replacement.
 */

export const Task7StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task7-home"
          title="Task 7 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task7StartWrapper;
