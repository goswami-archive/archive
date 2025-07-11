export function formatDuration(duration: number): string {
  const seconds = Math.floor(duration);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
}

const pad = (num: number) => String(num).padStart(2, '0');
