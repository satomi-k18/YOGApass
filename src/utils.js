// src/utils.js

/**
 * Adds a specified number of months to a given date.
 * @param {number} dateMs - The starting date in milliseconds (e.g., Date.now()).
 * @param {number} n - The number of months to add.
 * @returns {number} - The new date in milliseconds.
 */
export function addMonths(dateMs, n) {
  const date = new Date(dateMs);
  // Handle cases where adding n months might skip a month (e.g., Jan 31 + 1 month)
  // Set day to 1 to avoid issues, then set month, then restore original day if possible
  const originalDay = date.getDate();
  date.setDate(1);
  date.setMonth(date.getMonth() + n);
  
  // Check if the new month has fewer days than the original day
  const daysInNewMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  date.setDate(Math.min(originalDay, daysInNewMonth));
  
  return date.getTime();
}

/**
 * Calculates the number of days remaining until the expiration date, ignoring time components.
 * @param {number} expiresAtMs - The expiration date in milliseconds.
 * @returns {number} - Number of days left. Can be negative if expired.
 */
export function daysLeft(expiresAtMs) {
  if (typeof expiresAtMs !== 'number') return NaN; // Handle invalid input
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

  const expiryDate = new Date(expiresAtMs);
  expiryDate.setHours(0, 0, 0, 0); // Normalize expiry to the start of the day

  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Determines the badge color and text style based on the student's pass status.
 * @param {object} student - The student object.
 * @param {number} student.expiresAt - Expiration timestamp.
 * @param {number} student.tickets - Number of tickets remaining.
 * @returns {string} - Tailwind CSS classes (e.g., 'bg-green-500 text-white').
 */
export function badgeColor(student) {
  if (!student || typeof student.expiresAt !== 'number' || typeof student.tickets !== 'number') {
    return 'bg-gray-400 text-white'; // Default or error color
  }
  const days = daysLeft(student.expiresAt);

  if (student.tickets <= 0) {
    return 'bg-slate-500 text-white'; // No tickets left
  }
  if (days < 0) {
    return 'bg-red-600 text-white'; // Expired (and tickets > 0)
  }
  // days >= 0 means today or future
  if (days < 7) { // 0-6 days left (today up to 6 days in future)
    return 'bg-yellow-500 text-gray-800'; // Expiring soon
  }
  return 'bg-green-500 text-white'; // Active (7+ days left)
}

/**
 * Generates a text description for the days remaining or status.
 * @param {object} student - The student object.
 * @param {number} student.expiresAt - Expiration timestamp.
 * @param {number} student.tickets - Number of tickets remaining.
 * @returns {string} - Text like "あと3日", "有効期限切れ", "利用完了".
 */
export function daysLeftText(student) {
  if (!student || typeof student.expiresAt !== 'number' || typeof student.tickets !== 'number') {
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
 * Formats a date from milliseconds to YYYY-MM-DD string.
 * @param {number} dateMs - The date in milliseconds.
 * @returns {string} - Formatted date string or 'N/A' if input is invalid.
 */
export function formatDate(dateMs) {
  if (typeof dateMs !== 'number' || isNaN(dateMs)) {
    return 'N/A';
  }
  const date = new Date(dateMs);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

