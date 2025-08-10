import { useEffect } from 'react'

/**
 * Custom hook for handling messages from parent window
 * @param {Object} handlers - Object containing message type handlers
 * @param {Function} handlers.onSaveSuccess - Handler for save success messages
 * @param {Function} handlers.onSaveError - Handler for save error messages
 * @param {Function} handlers.onSaving - Handler for saving status messages
 * @param {Function} handlers.onApplicationSuccess - Handler for application success messages
 * @param {Function} handlers.onApplicationError - Handler for application error messages
 * @param {Function} handlers.onSubmittingApplication - Handler for application submission status
 * @param {Function} handlers.onApplicationsData - Handler for applications data
 * @param {Function} handlers.onApplicationUpdateSuccess - Handler for application update success
 * @param {Function} handlers.onApplicationUpdateError - Handler for application update error
 * @param {Function} handlers.onApplicationDeleteSuccess - Handler for application delete success
 * @param {Function} handlers.onApplicationDeleteError - Handler for application delete error
 * @param {Function} handlers.onMyApplicationsData - Handler for my applications data
 * @param {Function} handlers.onMyApplicationsError - Handler for my applications error
 */
export const useMessageHandler = (handlers) => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (!event.data) return

      const { type } = event.data

      // Handle different message types
      switch (type) {
        case "saveSuccess":
          handlers.onSaveSuccess?.(event.data)
          break
        case "saveError":
          handlers.onSaveError?.(event.data)
          break
        case "saving":
          handlers.onSaving?.(event.data)
          break
        case "applicationSuccess":
          handlers.onApplicationSuccess?.(event.data)
          break
        case "applicationError":
          handlers.onApplicationError?.(event.data)
          break
        case "submittingApplication":
          handlers.onSubmittingApplication?.(event.data)
          break
        case "applicationsData":
          handlers.onApplicationsData?.(event.data)
          break
        case "applicationUpdateSuccess":
          handlers.onApplicationUpdateSuccess?.(event.data)
          break
        case "applicationUpdateError":
          handlers.onApplicationUpdateError?.(event.data)
          break
        case "applicationDeleteSuccess":
          handlers.onApplicationDeleteSuccess?.(event.data)
          break
        case "applicationDeleteError":
          handlers.onApplicationDeleteError?.(event.data)
          break
        case "myApplicationsData":
          handlers.onMyApplicationsData?.(event.data)
          break
        case "myApplicationsError":
          handlers.onMyApplicationsError?.(event.data)
          break
        default:
          // Handle initial data from parent (no type)
          if (typeof event.data === "object" && !event.data.type) {
            handlers.onInitialData?.(event.data)
          }
          break
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [handlers])
}
