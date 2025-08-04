export interface TranscriptionResponseWithSentences {
  status: 'done' | 'error';
  result: {
    transcription: {
      utterances: Utterance[];
      sentences: Sentence[];
      full_transcript: string;
    };
  };
}

export interface Paragraph {
  timestamp: number;
  text: string;
}

export interface Utterance {
  words: Word[];
  text: string;
  language: string;
  start: number;
  end: number;
  confidence: number;
  channel: number;
}

export interface Word {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface Sentence {
  sentence: string;
  start: number;
  end: number;
}
