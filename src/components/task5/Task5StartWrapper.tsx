/**
 * Task5StartWrapper Component
 * Narrow view wrapper for Task 5 - renders via iframe to /task5-home.
 * Task 5: Start with pre-populated Referral Letter, success when user deletes an order.
 */

import { TaskWrapper } from "../shared/TaskWrapper";

export const Task5StartWrapper = () => <TaskWrapper taskNumber={5} />;

export default Task5StartWrapper;
