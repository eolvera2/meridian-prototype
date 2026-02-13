import * as React from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { coerceSupportedLocale, DEFAULT_LOCALE } from "./locales";
import { getLocaleResources } from "./resources";
import { I18nProvider } from "./I18nContext";

export const LocaleGuard: React.FC = () => {
  const params = useParams();
  const location = useLocation();

  const requested = params.locale;
  const locale = coerceSupportedLocale(requested);

  // Normalize casing in URL (e.g., /en-us/home -> /en-US/home)
  if (requested && requested !== locale) {
    const rest = location.pathname.replace(/^\/[^/]+/, "");
    return <Navigate to={`/${locale}${rest}${location.search}`} replace />;
  }

  // If someone somehow hits /:locale without param, enforce default.
  if (!requested) {
    return <Navigate to={`/${DEFAULT_LOCALE}/home`} replace />;
  }

  const resources = getLocaleResources(locale);
  return (
    <I18nProvider resources={resources}>
      <Outlet />
    </I18nProvider>
  );
};
