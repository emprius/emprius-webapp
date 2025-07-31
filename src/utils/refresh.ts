/**
 * Utility function to force a page refresh deleting all caches.
 */
export const forceRefresh = () => {
  window.location.replace(location.pathname + '?nocache=' + new Date().getTime())
  // Clear caches and reload
  if ('caches' in window) {
    caches
      .keys()
      .then((names) => {
        names.forEach((name) => caches.delete(name))
      })
      .finally(() => {
        ;(window as any).location.reload(true)
      })
  } else {
    ;(window as any).location.reload(true)
  }
}
