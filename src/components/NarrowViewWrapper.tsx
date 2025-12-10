/**
 * NarrowViewWrapper Component
 *
 * Narrow view wrapper that renders via iframe to /home.
 * Using iframe ensures the app respects the narrow container width
 * and layouts properly within the 375px viewport.
 */

export const NarrowViewWrapper = () => (
  <div className="narrow-view-background">
    <div className="narrow-view-container">
      <iframe src="#/home" title="Narrow View" className="narrow-view-iframe" />
    </div>
  </div>
);
