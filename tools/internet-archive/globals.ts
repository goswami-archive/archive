export const IA = {
  binary: 'ia',
  retries: 3,
};

export const IA_AUDIO_KEY = 'ia';

export const DEFAULT_METADATA = {
  mediatype: 'audio',
  licenseurl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  collection: 'opensource_audio',
} as const;

export const getIdentifier = (slug: string) => `bs-goswami-${slug}`;
