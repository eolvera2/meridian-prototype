/**
 * Task3StartWrapper Component
 * Narrow view wrapper for Task 3 - renders via iframe to /task3-home.
 * Task 3: Start in Dictation mode, success when user switches to Ambient mode.
 */

import { TaskWrapper } from "../shared/TaskWrapper";

export const Task3StartWrapper = () => <TaskWrapper taskNumber={3} />;

export default Task3StartWrapper;
