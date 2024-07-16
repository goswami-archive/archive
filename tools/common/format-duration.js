/**
 * @param {number} duration
 * @returns {string} string in format hh:mm:ss
 */
export function formatDuration(duration) {
  const seconds = Math.floor(duration);
  const pad = (num) => String(num).padStart(2, "0");
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}
