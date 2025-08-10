/**
 * Validation utility functions
 */

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Phone validation regex (allows international formats)
 */
export const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(email?.trim() || '')
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  if (!phone?.trim()) return true // Phone is optional
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  return PHONE_REGEX.test(cleanPhone)
}

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName) => {
  if (!value?.trim()) {
    return `❌ ${fieldName} is required`
  }
  return null
}

/**
 * Validate email field
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  const requiredError = validateRequired(email, 'Email')
  if (requiredError) return requiredError
  
  if (!isValidEmail(email)) {
    return '❌ Please enter a valid email address'
  }
  return null
}

/**
 * Validate phone field (optional)
 * @param {string} phone - Phone to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  if (!phone?.trim()) return null // Phone is optional
  
  if (!isValidPhone(phone)) {
    return '❌ Please enter a valid phone number'
  }
  return null
}

/**
 * Validate form data object
 * @param {Object} formData - Form data to validate
 * @param {Object} validations - Validation rules
 * @returns {Array} Array of error messages
 */
export const validateForm = (formData, validations) => {
  const errors = []
  
  Object.entries(validations).forEach(([field, validationFn]) => {
    const error = validationFn(formData[field])
    if (error) errors.push(error)
  })
  
  return errors
}
