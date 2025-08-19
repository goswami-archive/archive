import { getTimestamp } from './getTimestamp.ts';

export const TIMESTAMP_START_MARKER = '`';
export const TIMESTAMP_END_MARKER = '`';

export function addTimecode(text: string, timestampSeconds: number): string {
  return `${TIMESTAMP_START_MARKER}${getTimestamp(
    timestampSeconds * 1000
  )}${TIMESTAMP_END_MARKER} ${text}`;
}
