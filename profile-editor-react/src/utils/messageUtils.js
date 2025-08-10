/**
 * Message utility functions for centralized communication with parent window
 */

/**
 * Send message to parent window
 * @param {Object} message - Message object to send
 * @param {string} message.type - Message type
 * @param {*} message.payload - Message payload (optional)
 */
export const sendMessageToParent = (message) => {
  try {
    window.parent.postMessage(message, "*")
  } catch (error) {
    console.error('Error sending message to parent:', error)
  }
}

/**
 * Send ready message to parent
 */
export const sendReadyMessage = () => {
  sendMessageToParent("ready")
}

/**
 * Send save data message
 * @param {Object} data - Data to save
 */
export const sendSaveDataMessage = (data) => {
  sendMessageToParent({ 
    type: "saveData", 
    payload: data 
  })
}

/**
 * Send logout request message
 */
export const sendLogoutRequest = () => {
  sendMessageToParent({ 
    type: "logoutRequest" 
  })
}

/**
 * Send application submission message
 * @param {Object} applicationData - Application data to submit
 */
export const sendApplicationSubmission = (applicationData) => {
  sendMessageToParent({
    type: "submitApplication",
    payload: applicationData
  })
}

/**
 * Send get applications request (for admin)
 */
export const sendGetApplicationsRequest = () => {
  sendMessageToParent({ 
    type: "getApplications" 
  })
}

/**
 * Send get my applications request (for client)
 * @param {string} memberId - Member ID
 */
export const sendGetMyApplicationsRequest = (memberId) => {
  sendMessageToParent({
    type: "getMyApplications",
    payload: { memberId }
  })
}

/**
 * Send application status update request
 * @param {string} applicationId - Application ID
 * @param {string} status - New status
 */
export const sendApplicationStatusUpdate = (applicationId, status) => {
  sendMessageToParent({
    type: "updateApplicationStatus",
    payload: { applicationId, status }
  })
}

/**
 * Send application delete request
 * @param {string} applicationId - Application ID to delete
 */
export const sendApplicationDeleteRequest = (applicationId) => {
  sendMessageToParent({
    type: "deleteApplication",
    payload: { applicationId }
  })
}
