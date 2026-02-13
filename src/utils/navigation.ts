/**
 * Navigation utilities for HashRouter compatibility
 */

/**
 * Appends ?success=true query parameter to the current hash route.
 * Works with HashRouter by preserving the route and adding a query param.
 * e.g., #/en-US/task1-start becomes #/en-US/task1-start?success=true
 * 
 * Handles both iframe and regular window contexts, with fallback for cross-origin restrictions.
 * 
 * @returns void
 */
export const navigateToSuccess = (): void => {
  const isInIframe = window.parent !== window;

  const appendSuccess = (win: Window) => {
    const currentHash = win.location.hash;
    if (!currentHash.includes("success=true")) {
      // Check if there's already a query string in the hash
      const separator = currentHash.includes("?") ? "&" : "?";
      win.location.hash =
        currentHash.replace("#", "") + separator + "success=true";
    }
  };

  if (isInIframe) {
    try {
      appendSuccess(window.parent);
    } catch {
      // Fallback if cross-origin restriction applies
      appendSuccess(window);
    }
  } else {
    appendSuccess(window);
  }
};
