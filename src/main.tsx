import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
// Import styles in the correct order to ensure proper cascade
import "./index.css";

// Eagerly load main App component (needed immediately)
import App from "./App";

// Lazy load task components (only loaded when navigated to)
const AppTask1 = lazy(() => import("./AppTask1"));
const AppTask2Start = lazy(() => import("./AppTask2Start"));
const AppTask3Start = lazy(() => import("./AppTask3Start"));
const AppTask4Start = lazy(() => import("./AppTask4Start"));
const AppTask5Start = lazy(() => import("./AppTask5Start"));
const AppTask6Start = lazy(() => import("./AppTask6Start"));
const AppTask7Start = lazy(() => import("./AppTask7Start"));
const AppTask8Start = lazy(() => import("./AppTask8Start"));

// Lazy load wrapper components
const NarrowViewWrapper = lazy(() =>
  import("./components/NarrowViewWrapper").then((module) => ({
    default: module.NarrowViewWrapper,
  }))
);
const Task9 = lazy(() =>
  import("./components/task9").then((module) => ({ default: module.Task9 }))
);
const Task1Wrapper = lazy(() =>
  import("./components/task1").then((module) => ({
    default: module.Task1Wrapper,
  }))
);
const Task2StartWrapper = lazy(() =>
  import("./components/task2").then((module) => ({
    default: module.Task2StartWrapper,
  }))
);
const Task3StartWrapper = lazy(() =>
  import("./components/task3").then((module) => ({
    default: module.Task3StartWrapper,
  }))
);
const Task4StartWrapper = lazy(() =>
  import("./components/task4").then((module) => ({
    default: module.Task4StartWrapper,
  }))
);
const Task5StartWrapper = lazy(() =>
  import("./components/task5").then((module) => ({
    default: module.Task5StartWrapper,
  }))
);
const Task6StartWrapper = lazy(() =>
  import("./components/task6").then((module) => ({
    default: module.Task6StartWrapper,
  }))
);
const Task7StartWrapper = lazy(() =>
  import("./components/task7").then((module) => ({
    default: module.Task7StartWrapper,
  }))
);
const Task8StartWrapper = lazy(() =>
  import("./components/task8").then((module) => ({
    default: module.Task8StartWrapper,
  }))
);

// Auth components - keep eager loaded as they're needed for initial routing
import { AuthProvider, ProtectedRoute } from "./components/auth";
import { DEFAULT_LOCALE } from "./i18n/locales";
import { LocaleGuard } from "./i18n/LocaleGuard";

/**
 * Simple loading fallback component for lazy-loaded routes
 */
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontSize: "16px",
      color: "#666",
    }}
  >
    Loading...
  </div>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          {/* Default entry: redirect to default locale */}
          <Route
            path="/"
            element={<Navigate to={`/${DEFAULT_LOCALE}/home`} replace />}
          />

          {/* Legacy (non-locale) routes: keep old hashes working */}
          <Route
            path="/home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/home`} replace />}
          />
          <Route
            path="/task1-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task1-home`} replace />}
          />
          <Route
            path="/task1-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task1-start`} replace />}
          />
          <Route
            path="/task2-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task2-home`} replace />}
          />
          <Route
            path="/task2-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task2-start`} replace />}
          />
          <Route
            path="/task3-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task3-home`} replace />}
          />
          <Route
            path="/task3-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task3-start`} replace />}
          />
          <Route
            path="/task4-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task4-home`} replace />}
          />
          <Route
            path="/task4-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task4-start`} replace />}
          />
          <Route
            path="/task5-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task5-home`} replace />}
          />
          <Route
            path="/task5-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task5-start`} replace />}
          />
          <Route
            path="/task6-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task6-home`} replace />}
          />
          <Route
            path="/task6-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task6-start`} replace />}
          />
          <Route
            path="/task7-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task7-home`} replace />}
          />
          <Route
            path="/task7-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task7-start`} replace />}
          />
          <Route
            path="/task8-home"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task8-home`} replace />}
          />
          <Route
            path="/task8-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task8-start`} replace />}
          />
          <Route
            path="/narrow"
            element={<Navigate to={`/${DEFAULT_LOCALE}/narrow`} replace />}
          />
          <Route
            path="/task9-start"
            element={<Navigate to={`/${DEFAULT_LOCALE}/task9-start`} replace />}
          />

          {/* Locale-prefixed routes */}
          <Route path="/:locale" element={<LocaleGuard />}>
            {/* Everything under a locale still requires auth, but auth UI needs i18n */}
            <Route element={<ProtectedRoute>{<Outlet />}</ProtectedRoute>}>
              <Route index element={<Navigate to="home" replace />} />

              <Route path="home" element={<App />} />
              <Route path="task1-home" element={<AppTask1 />} />
              <Route path="task1-start" element={<Task1Wrapper />} />

              <Route path="task2-home" element={<AppTask2Start />} />
              <Route path="task2-start" element={<Task2StartWrapper />} />

              <Route path="task3-home" element={<AppTask3Start />} />
              <Route path="task3-start" element={<Task3StartWrapper />} />

              <Route path="task4-home" element={<AppTask4Start />} />
              <Route path="task4-start" element={<Task4StartWrapper />} />

              <Route path="task5-home" element={<AppTask5Start />} />
              <Route path="task5-start" element={<Task5StartWrapper />} />

              <Route path="task6-home" element={<AppTask6Start />} />
              <Route path="task6-start" element={<Task6StartWrapper />} />

              <Route path="task7-home" element={<AppTask7Start />} />
              <Route path="task7-start" element={<Task7StartWrapper />} />

              <Route path="task8-home" element={<AppTask8Start />} />
              <Route path="task8-start" element={<Task8StartWrapper />} />

              <Route path="narrow" element={<NarrowViewWrapper />} />
              <Route path="task9-start" element={<Task9 />} />
            </Route>
          </Route>
        </Routes>
        </Suspense>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
