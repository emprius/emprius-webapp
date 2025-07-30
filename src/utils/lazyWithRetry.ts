import { lazy, ComponentType } from 'react'
import { safeDynamicImport } from './chunkErrorHandler'

/**
 * Enhanced lazy loading with automatic retry on chunk loading errors
 */
// export function lazyWithRetry<T extends ComponentType<any>>(
//   importFn: () => Promise<{ default: T }>,
//   maxRetries = 3,
//   retryDelay = 1000
// ): React.LazyExoticComponent<T> {
//   return lazy(() => safeDynamicImport(importFn, maxRetries, retryDelay))
//   // return lazy(importFn)
// }

/**
 * Enhanced lazy loading for named exports with automatic retry
 */
export function lazyWithRetryNamed<T extends ComponentType<any>>(
  importFn: () => Promise<any>,
  exportName: string,
  maxRetries = 3,
  retryDelay = 1000
): React.LazyExoticComponent<T> {
  // return lazy(importFn).then((module) => ({
  //   default: module[exportName],
  // }))
  return lazy(() =>
    safeDynamicImport(importFn, maxRetries, retryDelay).then((module) => ({
      default: module[exportName],
    }))
  )
}

/**
 * Preload a lazy component to improve performance
 */
// export function preloadLazyComponent<T extends ComponentType<any>>(
//   lazyComponent: React.LazyExoticComponent<T>
// ): Promise<void> {
//   // Access the internal _payload to trigger loading
//   const payload = (lazyComponent as any)._payload
//   if (payload && typeof payload._result === 'undefined') {
//     return payload._result || Promise.resolve()
//   }
//   return Promise.resolve()
// }

/**
 * Create a lazy component with preloading capability
 */
// export function createPreloadableLazy<T extends ComponentType<any>>(
//   importFn: () => Promise<{ default: T }>,
//   maxRetries = 3,
//   retryDelay = 1000
// ) {
//   const LazyComponent = lazyWithRetry(importFn, maxRetries, retryDelay)
//
//   return {
//     Component: LazyComponent,
//     preload: () => preloadLazyComponent(LazyComponent),
//   }
// }
