/**
 * Task5StartWrapper Component
 *
 * Narrow view wrapper for Task 5 that renders via iframe to /task5-home.
 * Using iframe ensures dialogs overlay properly outside the narrow container.
 *
 * Task 5: Start with pre-populated Referral Letter, success when user deletes an order.
 */

export const Task5StartWrapper = () => {
  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src="#/task5-home"
          title="Task 5 Narrow View"
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};

export default Task5StartWrapper;
