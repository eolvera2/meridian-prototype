/**
 * Task2StartWrapper Component
 * Narrow view wrapper for Task 2 - renders via iframe to /task2-home.
 * Success condition: User switches to Dictation mode (checkbox or tooltip)
 */

import { TaskWrapper } from "../shared/TaskWrapper";

export const Task2StartWrapper = () => <TaskWrapper taskNumber={2} />;

export default Task2StartWrapper;
