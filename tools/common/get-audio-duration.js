import { parseFile } from "music-metadata";

/**
 * @param {string} file
 * @returns {Promise<number>}
 */
export async function getAudioDuration(file) {
  try {
    const metaData = await parseFile(file, { skipCovers: true });
    return metaData.format.duration;
  } catch (error) {
    console.error(error.message);
  }
}
