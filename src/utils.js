// src/utils.js

/**
 * Adds a specified number of months to a given date.
 * @param {number} dateMs - The starting date in milliseconds (e.g., Date.now()).
 * @param {number} n - The number of months to add.
 * @returns {number} - The new date in milliseconds.
 */
export function addMonths(dateMs, n) {
  const date = new Date(dateMs);
  date.setMonth(date.getMonth() + n);
  return date.getTime();
}

/**
 * Calculates the number of days remaining until the expiration date.
 * @param {number} expiresAtMs - The expiration date in milliseconds.
 * @returns {number} - Number of days left. Can be negative if expired.
 */
export function daysLeft(expiresAtMs) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const expiryDate = new Date(expiresAtMs);
  expiryDate.setHours(0, 0, 0, 0); // Normalize expiry to the start of the day

  const diffTime = expiryDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Determines the badge color based on the student's pass status.
 * - 'green': More than 7 days left and tickets > 0
 * - 'yellow': 1-7 days left and tickets > 0
 * - 'red': Expired or 0 tickets
 * @param {object} student - The student object.
 * @param {number} student.expiresAt - Expiration timestamp.
 * @param {number} student.tickets - Number of tickets remaining.
 * @returns {string} - Tailwind CSS background color class (e.g., 'bg-green-500').
 */
export function badgeColor(student) {
  if (!student || typeof student.expiresAt === 'undefined' || typeof student.tickets === 'undefined') {
    return 'bg-gray-400'; // Default or error color
  }
  const days = daysLeft(student.expiresAt);

  if (student.tickets <= 0 || days < 0) {
    return 'bg-red-500'; // Expired or no tickets
  }
  if (days <= 7) {
    return 'bg-yellow-500'; // Nearing expiration
  }
  return 'bg-green-500'; // Good status
}

/**
 * Generates a text description for the days remaining or status.
 * @param {object} student - The student object.
 * @param {number} student.expiresAt - Expiration timestamp.
 * @param {number} student.tickets - Number of tickets remaining.
 * @returns {string} - Text like "あと3日", "有効期限切れ", "利用完了".
 */
export function daysLeftText(student) {
  if (!student || typeof student.expiresAt === 'undefined' || typeof student.tickets === 'undefined') {
    return '情報なし';
  }
  const days = daysLeft(student.expiresAt);

  if (student.tickets <= 0) {
    return '利用完了';
  }
  if (days < 0) {
    return '有効期限切れ';
  }
  if (days === 0) {
    return '本日まで';
  }
  return `あと${days}日`;
}

/**
 * Formats a timestamp into a YYYY/MM/DD string.
 * @param {number} timestampMs - The timestamp in milliseconds.
 * @returns {string} - Formatted date string.
 */
export function formatDate(timestampMs) {
  if (!timestampMs) return '';
  const date = new Date(timestampMs);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}/${m}/${d}`;
}
