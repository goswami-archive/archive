export interface TranscriptionProvider {
  transcribe(
    audioFile: string,
    languageCode: string,
    timestamps: boolean,
    minGapSeconds: number
  ): Promise<string>;

  getName(): string;
}
