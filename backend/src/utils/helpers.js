// utils/helpers.js
// Purpose: small, general-purpose functions that don't belong anywhere else,
// but get reused across multiple modules (attendance, marks, auth, etc.)

/**
 * Check if a string looks like a valid email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format a JS Date (or date string) as YYYY-MM-DD
 * @param {Date|string} date
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Calculate attendance percentage for the attendance module
 * @param {number} presentCount - number of days marked PRESENT
 * @param {number} totalCount - total attendance records
 * @returns {number} - percentage rounded to 2 decimals
 */
function calculateAttendancePercentage(presentCount, totalCount) {
  if (totalCount === 0) return 0;
  return Number(((presentCount / totalCount) * 100).toFixed(2));
}

/**
 * Calculate a letter grade from marks (used by the marks module)
 * @param {number} marksObtained
 * @param {number} maxMarks
 * @returns {string} - e.g. 'A+', 'B', 'F'
 */
function calculateGrade(marksObtained, maxMarks) {
  const percentage = (marksObtained / maxMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

module.exports = {
  isValidEmail,
  formatDate,
  calculateAttendancePercentage,
  calculateGrade,
};
