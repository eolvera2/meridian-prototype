import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
// Import styles in the correct order to ensure proper cascade
import "./index.css";
// App component will import specific component styles
import App from "./App";
import AppTask1 from "./AppTask1";
import AppTask2Start from "./AppTask2Start";
import AppTask3Start from "./AppTask3Start";
import AppTask4Start from "./AppTask4Start";
import AppTask5Start from "./AppTask5Start";
import AppTask6Start from "./AppTask6Start";
import AppTask7Start from "./AppTask7Start";
import AppTask8Start from "./AppTask8Start";
import { NarrowViewWrapper } from "./components/NarrowViewWrapper";
import { Task9 } from "./components/task9";
import { Task1Wrapper } from "./components/task1";
import { Task2StartWrapper } from "./components/task2";
import { Task3StartWrapper } from "./components/task3";
import { Task4StartWrapper } from "./components/task4";
import { Task5StartWrapper } from "./components/task5";
import { Task6StartWrapper } from "./components/task6";
import { Task7StartWrapper } from "./components/task7";
import { Task8StartWrapper } from "./components/task8";
import { AuthProvider, ProtectedRoute } from "./components/auth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task1-home"
            element={
              <ProtectedRoute>
                <AppTask1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task1-start"
            element={
              <ProtectedRoute>
                <Task1Wrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task2-home"
            element={
              <ProtectedRoute>
                <AppTask2Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task2-start"
            element={
              <ProtectedRoute>
                <Task2StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task3-home"
            element={
              <ProtectedRoute>
                <AppTask3Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task3-start"
            element={
              <ProtectedRoute>
                <Task3StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task4-home"
            element={
              <ProtectedRoute>
                <AppTask4Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task4-start"
            element={
              <ProtectedRoute>
                <Task4StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task5-home"
            element={
              <ProtectedRoute>
                <AppTask5Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task5-start"
            element={
              <ProtectedRoute>
                <Task5StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task6-home"
            element={
              <ProtectedRoute>
                <AppTask6Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task6-start"
            element={
              <ProtectedRoute>
                <Task6StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task7-home"
            element={
              <ProtectedRoute>
                <AppTask7Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task7-start"
            element={
              <ProtectedRoute>
                <Task7StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task8-home"
            element={
              <ProtectedRoute>
                <AppTask8Start />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task8-start"
            element={
              <ProtectedRoute>
                <Task8StartWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/narrow"
            element={
              <ProtectedRoute>
                <NarrowViewWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/task9-start"
            element={
              <ProtectedRoute>
                <Task9 />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
