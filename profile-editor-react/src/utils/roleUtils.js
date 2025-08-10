/**
 * Role utility functions for centralized role checking
 */

/**
 * Normalize role string to lowercase for consistent comparison
 * @param {string} role - The role to normalize
 * @returns {string} Normalized role in lowercase
 */
export const normalizeRole = (role) => {
  return role?.toString().toLowerCase() || ''
}

/**
 * Check if user has admin role
 * @param {Object} memberData - User member data object
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (memberData) => {
  return normalizeRole(memberData?.role) === 'admin'
}

/**
 * Check if user has client role
 * @param {Object} memberData - User member data object
 * @returns {boolean} True if user is client
 */
export const isClient = (memberData) => {
  return normalizeRole(memberData?.role) === 'client'
}

/**
 * Get role display name with proper capitalization
 * @param {string} role - The role string
 * @returns {string} Properly capitalized role name
 */
export const getRoleDisplayName = (role) => {
  if (!role) return '—'
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}
