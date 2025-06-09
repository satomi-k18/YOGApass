// Date calculation helpers and other utilities

/**
 * Adds a specified number of months to a given date.
 * @param {number} dateMs - The date in milliseconds (e.g., Date.now()).
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
 * Determines the badge color based on the student's ticket status or expiration.
 * @param {object} student - The student object.
 * @returns {string} - A Tailwind CSS color class (e.g., 'bg-green-500 text-white').
 */
export function badgeColor(student) {
  if (!student || typeof student.expiresAt !== 'number' || typeof student.tickets !== 'number') {
    return 'bg-gray-400 text-white'; // Default or error color
  }

  const now = Date.now();
  const daysLeft = (student.expiresAt - now) / (1000 * 60 * 60 * 24);

  if (student.tickets <= 0) {
    return 'bg-slate-500 text-white'; // No tickets left (grayed out)
  }
  if (daysLeft < 0) {
    return 'bg-red-600 text-white'; // Expired
  }
  if (daysLeft < 7) {
    return 'bg-yellow-500 text-gray-800'; // Expiring soon (within 7 days)
  }
  return 'bg-green-500 text-white'; // Active
}

/**
 * Generates a text string describing the days left until expiration or status.
 * @param {object} student - The student object.
 * @returns {string} - Text like 'あと7日', '期限切れ', '残り1回'.
 */
export function daysLeftText(student) {
  if (!student || typeof student.expiresAt !== 'number' || typeof student.tickets !== 'number') {
    return '情報なし';
  }

  const now = Date.now();
  const daysRemaining = Math.ceil((student.expiresAt - now) / (1000 * 60 * 60 * 24));

  if (student.tickets <= 0) {
    return '利用終了';
  }
  if (daysRemaining < 0) {
    return '期限切れ';
  }
  if (daysRemaining === 0) {
    return '本日まで';
  }
  return `あと${daysRemaining}日`;
}

/**
 * Formats a timestamp into a YYYY/MM/DD string.
 * @param {number} timestamp - The date in milliseconds.
 * @returns {string} - Formatted date string.
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

console.log('utils.js loaded with functions');
