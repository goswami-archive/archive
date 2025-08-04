import {
  AssemblyAI,
  type SpeechModel,
  type TranscribeParams,
} from 'assemblyai';
import '@dotenvx/dotenvx/config';
import { BOOST_WORDS } from '#transcribe/words.ts';
import { type TranscriptionProvider } from '../TranscriptionProvider.ts';
import { getTimestamp } from '#transcribe/getTimestamp.ts';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export class AssemblyAIProvider implements TranscriptionProvider {
  public async transcribe(
    audioFile: string,
    languageCode: string,
    timestamps: boolean,
    minGapSeconds: number
  ): Promise<string> {
    // https://www.assemblyai.com/docs/getting-started/models
    const model: SpeechModel = languageCode.startsWith('en')
      ? 'slam-1'
      : 'universal';

    const params: TranscribeParams = {
      speech_model: model,
      audio: audioFile,
      language_code: languageCode,
      punctuate: true,
      format_text: true,
      speaker_labels: true,
      keyterms_prompt: BOOST_WORDS,
      // word_boost: BOOST_WORDS,
    };

    const transcriptService = client.transcripts;
    const transcript = await transcriptService.transcribe(params);

    if (transcript.status === 'error') {
      throw new Error(transcript.error);
    }

    if (timestamps) {
      console.info('minGapSeconds parameter has no effect for AssemblyAI');
      const paragraphs = await transcriptService.paragraphs(transcript.id);
      const text: string[] = [];
      paragraphs.paragraphs.forEach((paragraph) => {
        text.push(`[${getTimestamp(paragraph.start)}] ${paragraph.text}`);
      });

      return text.join('\n\n');
    }

    return transcript.text!;
  }

  getName(): string {
    return '<a href="https://www.assemblyai.com/">AssemblyAI</a>';
  }
}
