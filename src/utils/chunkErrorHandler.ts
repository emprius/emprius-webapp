/**
 * Global chunk loading error handler
 * Catches dynamic import failures and handles them gracefully
 */

// interface ChunkErrorHandlerOptions {
//   maxRetries?: number
//   retryDelay?: number
//   onError?: (error: Error, retryCount: number) => void
//   onReload?: () => void
// }
//
// class ChunkErrorHandler {
//   private retryCount = 0
//   private maxRetries: number
//   private retryDelay: number
//   private onError?: (error: Error, retryCount: number) => void
//   private onReload?: () => void
//   private isReloading = false
//
//   constructor(options: ChunkErrorHandlerOptions = {}) {
//     this.maxRetries = options.maxRetries ?? 3
//     this.retryDelay = options.retryDelay ?? 1000
//     this.onError = options.onError
//     this.onReload = options.onReload
//     this.setupGlobalErrorHandler()
//   }
//
//   public destroy() {
//     window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
//     window.removeEventListener('error', this.handleError)
//   }
//
//   public reset() {
//     this.retryCount = 0
//     this.isReloading = false
//   }
//
//   private setupGlobalErrorHandler() {
//     // Handle unhandled promise rejections (chunk loading errors)
//     window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
//
//     // Handle regular errors
//     window.addEventListener('error', this.handleError)
//   }
//
//   private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
//     const error = event.reason
//     if (this.isChunkLoadError(error)) {
//       event.preventDefault() // Prevent the error from being logged to console
//       this.handleChunkError(error)
//     }
//   }
//
//   private handleError = (event: ErrorEvent) => {
//     if (this.isChunkLoadError(event.error)) {
//       event.preventDefault()
//       this.handleChunkError(event.error)
//     }
//   }
//
//   private isChunkLoadError(error: any): boolean {
//     if (!error) return false
//
//     const errorMessage = error.message || error.toString()
//     const chunkErrorPatterns = [
//       /loading dynamically imported module/i,
//       /loading css chunk/i,
//       /loading chunk/i,
//       /failed to fetch dynamically imported module/i,
//       /networkError/i,
//       /ChunkLoadError/i,
//     ]
//
//     return chunkErrorPatterns.some((pattern) => pattern.test(errorMessage))
//   }
//
//   private async handleChunkError(error: Error) {
//     if (this.isReloading) return
//
//     console.warn(`Chunk loading error detected (attempt ${this.retryCount + 1}):`, error)
//
//     this.onError?.(error, this.retryCount)
//
//     if (this.retryCount < this.maxRetries) {
//       this.retryCount++
//
//       // Wait before retrying
//       await new Promise((resolve) => setTimeout(resolve, this.retryDelay))
//
//       // Try to reload the current route instead of the entire page
//       if (this.retryCount === 1) {
//         this.reloadCurrentRoute()
//       } else {
//         this.forceReload()
//       }
//     } else {
//       // Max retries reached, force reload
//       this.forceReload()
//     }
//   }
//
//   private reloadCurrentRoute() {
//     try {
//       // Try to reload just the current route
//       const currentPath = window.location.pathname + window.location.search + window.location.hash
//       window.history.replaceState(null, '', currentPath)
//       window.location.reload()
//     } catch {
//       this.forceReload()
//     }
//   }
//
//   private forceReload() {
//     if (this.isReloading) return
//
//     this.isReloading = true
//     this.onReload?.()
//
//     // Clear all caches before reloading
//     if ('caches' in window) {
//       caches
//         .keys()
//         .then((names) => {
//           names.forEach((name) => {
//             caches.delete(name)
//           })
//         })
//         .finally(() => {
//           window.location.reload()
//         })
//     } else {
//       ;(window as Window).location.reload()
//     }
//   }
// }

// Create and export a singleton instance
// export const chunkErrorHandler = new ChunkErrorHandler({
//   maxRetries: 2,
//   retryDelay: 1000,
//   onError: (error, retryCount) => {
//     console.warn(`Chunk loading failed, retry ${retryCount}/2:`, error.message)
//   },
//   onReload: () => {
//     console.info('Reloading page due to chunk loading error...')
//   },
// })

// Helper function to check if error is a chunk loading error
export function isChunkLoadError(error: any): boolean {
  if (!error) return false

  const errorMessage = error.message || error.toString()
  const chunkErrorPatterns = [
    /loading dynamically imported module/i,
    /loading css chunk/i,
    /loading chunk/i,
    /failed to fetch dynamically imported module/i,
    /networkError/i,
    /ChunkLoadError/i,
  ]

  return chunkErrorPatterns.some((pattern) => pattern.test(errorMessage))
}

// Enhanced dynamic import wrapper with retry logic
export async function safeDynamicImport<T>(importFn: () => Promise<T>, maxRetries = 3, retryDelay = 1000): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await importFn()
    } catch (error) {
      lastError = error as Error

      if (isChunkLoadError(error)) {
        console.warn(`Dynamic import failed (attempt ${attempt + 1}/${maxRetries}):`, error)

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)))
          continue
        }
      }

      throw error
    }
  }

  throw lastError
}
