import fs from 'node:fs';
import path from 'node:path';
import FormData from 'form-data';
import axios from 'axios';
import { BOOST_WORDS } from '#transcribe/words.ts';
import { type TranscriptionProvider } from '../TranscriptionProvider.ts';
import {
  type AudioUploadResponse,
  type TranscriptionResponseWithSentences,
} from './types.ts';
import { combineSentencesIntoParagraphs } from './combineSentencesIntoParagraphs.ts';
import { addTimecode } from '#transcribe/program/addTimecode.ts';

const API_BASE_URL = 'https://api.gladia.io/v2';
const UPLOADED_FILE_CACHE = '.gladia.json';

const authHeaders: Record<string, string> = {
  'x-gladia-key': process.env.GLADIA_API_KEY!,
};

export class GladiaProvider implements TranscriptionProvider {
  public async transcribe(
    audioFile: string,
    languageCode: string,
    timestamps: boolean,
    minGapSeconds: number
  ): Promise<string> {
    // Step 1: Upload audio file
    const audioUrl = await this.uploadFile(audioFile);
    console.log('- Audio uploaded:', audioUrl);

    // Step 2: Request transcription
    // docs.gladia.io/chapters/pre-recorded-stt/features
    const transcribeConfig = {
      audio_url: audioUrl,
      language_config: {
        languages: [languageCode],
      },
      // diarization: true,
      // diarization_config: {
      //   number_of_speakers: 2,
      //   min_speakers: 1,
      //   max_speakers: 2,
      // },
      punctuation_enhanced: true,
      sentences: true,
      custom_vocabulary: true,
      custom_vocabulary_config: {
        vocabulary: BOOST_WORDS,
        default_intensity: 0.6,
      },
      custom_spelling_config: {
        spelling_dictionary: {
          // '.': ['period', 'full stop'],
          // SQL: ['sequel'],
        },
      },
    };

    const transcriptionResponse = await axios.post(
      `${API_BASE_URL}/pre-recorded`,
      transcribeConfig,
      {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
      }
    );

    const resultUrl = transcriptionResponse.data.result_url;
    console.log('- Transcription requested. Result URL:', resultUrl);

    // Step 3: Poll for transcription result
    let result: TranscriptionResponseWithSentences;
    while (true) {
      const resultResponse = await axios.get(resultUrl, {
        headers: { ...authHeaders },
      });

      result = resultResponse.data;
      if (result.status === 'done') {
        break;
      } else if (result.status === 'error') {
        throw new Error('Transcription failed');
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (timestamps) {
      // Step 4: Group sentences into paragraphs
      const paragraphs = combineSentencesIntoParagraphs(
        result.result.transcription.sentences,
        minGapSeconds
      );

      // Step 5: Display paragraphs with timestamps
      const text = paragraphs.map((p) => {
        return addTimecode(p.text, p.timestamp);
      });

      return text.join('\n\n');
    }

    return result.result.transcription.full_transcript;
  }

  getName(): string {
    return '<a href="https://app.gladia.io/">Gladia</a>';
  }

  private async uploadFile(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const cachedUrl = getCachedUrl(filePath);
    if (cachedUrl) {
      console.log('- Using cached audio URL:', cachedUrl);
      return cachedUrl;
    }

    const form = new FormData();
    const stream = fs.createReadStream(filePath);

    const extension = path.extname(filePath);
    const fileName = path.basename(filePath);

    form.append('audio', stream, {
      filename: fileName,
      contentType: `audio/${extension}`,
    });

    console.log('- Uploading file to Gladia...');
    const uploadResponse = await axios.post<AudioUploadResponse>(
      `${API_BASE_URL}/upload`,
      form,
      {
        // form.getHeaders to get correctly formatted form-data boundaries
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
        headers: { ...form.getHeaders(), ...authHeaders },
      }
    );

    const { audio_url, audio_metadata } = uploadResponse.data;
    writeIdToCache(filePath, audio_metadata.id);

    return audio_url;
  }
}

function writeIdToCache(filePath: string, fileId: string): void {
  const cacheFile = path.join(path.dirname(filePath), UPLOADED_FILE_CACHE);
  let gladiaJson: Record<string, string> = {};

  // Read existing data if file exists
  if (fs.existsSync(cacheFile)) {
    gladiaJson = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }

  // Add or update the entry
  const fileName = path.basename(filePath);
  gladiaJson[fileName] = fileId;

  // Write back to file
  fs.writeFileSync(cacheFile, JSON.stringify(gladiaJson, null, 2));
}

function getCachedUrl(filePath: string): string | null {
  const cacheFile = path.join(path.dirname(filePath), UPLOADED_FILE_CACHE);
  if (fs.existsSync(cacheFile)) {
    const gladiaJson = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    const fileName = path.basename(filePath);

    return gladiaJson[fileName]
      ? `https://api.gladia.io/file/${gladiaJson[fileName]}`
      : null;
  }
  return null;
}

//---------------
// const paras = combineSentencesIntoParagraphs(
//   (RESPONSE as ResponseWithSentences).transcription.sentences,
//   1
// );
// const t = paras.map((para, index) => {
//   return `[${getTimestamp(para.timestamp * 1000)}] ${para.text}`;
// });

// return t.join('\n\n');
//---------------
