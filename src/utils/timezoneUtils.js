// Timezone utility functions

/**
 * Get user's detected timezone
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert a local date string (YYYY-MM-DD) to UTC midnight
 * @param {string} dateString - Local date string in YYYY-MM-DD format
 * @param {string} timezone - User's timezone (optional, defaults to detected)
 * @returns {string} - ISO string in UTC
 */
export const localDateToUTC = (dateString, timezone = null) => {
  const tz = timezone || getUserTimezone();
  // Create date at midnight in user's timezone
  const date = new Date(dateString + 'T00:00:00');
  return date.toISOString();
};

/**
 * Convert UTC ISO string to local date string (YYYY-MM-DD)
 * @param {string} utcString - UTC ISO string
 * @param {string} timezone - User's timezone (optional, defaults to detected)
 * @returns {string} - Local date string in YYYY-MM-DD format
 */
export const utcToLocalDate = (utcString, timezone = null) => {
  const tz = timezone || getUserTimezone();
  const date = new Date(utcString);
  
  // Format as YYYY-MM-DD in user's timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date in YYYY-MM-DD format in user's timezone
 * @param {string} timezone - User's timezone (optional, defaults to detected)
 * @returns {string} - Today's date in YYYY-MM-DD format
 */
export const getTodayLocalDate = (timezone = null) => {
  const tz = timezone || getUserTimezone();
  const today = new Date();
  
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Get date key for schedule (just the date string itself)
 * Schedule IDs are stored as YYYY-MM-DD in the database
 * @param {string} timezone - User's timezone (optional, defaults to detected)
 * @returns {string} - Date key in YYYY-MM-DD format
 */
export const getDateKey = (date, timezone = null) => {
  const tz = timezone || getUserTimezone();
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
