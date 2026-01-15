/**
 * NarrowViewWrapper Component
 *
 * Narrow view wrapper that renders via iframe to /home.
 * Using iframe ensures the app respects the narrow container width
 * and layouts properly within the 375px viewport.
 */

import { useParams } from "react-router-dom";
import { coerceSupportedLocale } from "../i18n/locales";
import { useI18n } from "../i18n/I18nContext";

export const NarrowViewWrapper = () => {
  const params = useParams();
  const locale = coerceSupportedLocale(params.locale);
  const { t } = useI18n();

  return (
    <div className="narrow-view-background">
      <div className="narrow-view-container">
        <iframe
          src={`#/${locale}/home`}
          title={t("narrowView.iframeTitle")}
          className="narrow-view-iframe"
        />
      </div>
    </div>
  );
};
