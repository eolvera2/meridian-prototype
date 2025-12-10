/**
 * Task4StartWrapper Component
 *
 * Narrow view wrapper for Task 4 that renders via iframe to /task4-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Task 4: Start in Ambient mode (Mic Off), success when user adds a Referral letter.
 */

export const Task4StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task4-home"
          title="Task 4 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task4StartWrapper;
