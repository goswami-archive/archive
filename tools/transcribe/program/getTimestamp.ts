export function getTimestamp(milis: number): string {
  const hours = Math.floor(milis / 3600000)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((milis % 3600000) / 60000)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((milis % 60000) / 1000)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}
