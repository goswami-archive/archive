import { type Sentence, type Paragraph } from './types.ts';

export function combineSentencesIntoParagraphs(
  sentences: Sentence[],
  maxGapSeconds: number
): Paragraph[] {
  if (!sentences || sentences.length === 0) {
    return [];
  }

  const paragraphs: Paragraph[] = [];
  let currentParagraph: Sentence[] = [sentences[0]];
  let currentParagraphStartTime = sentences[0].start;
  let currentParagraphLimitTime = currentParagraphStartTime + maxGapSeconds;

  for (let i = 1; i < sentences.length; i++) {
    const currentSentence = sentences[i];
    if (currentSentence.start < currentParagraphLimitTime) {
      currentParagraph.push(currentSentence);
    } else if (currentSentence.start >= currentParagraphLimitTime) {
      paragraphs.push(createParagraph(currentParagraph));
      currentParagraph = [currentSentence];
      currentParagraphStartTime = currentSentence.start;
      currentParagraphLimitTime = currentParagraphStartTime + maxGapSeconds;
    }
  }

  // Add the last paragraph if it exists
  if (currentParagraph.length > 0) {
    paragraphs.push(createParagraph(currentParagraph));
  }

  return paragraphs;
}

function createParagraph(sentences: Sentence[]): Paragraph {
  const text = sentences.map((u) => u.sentence).join(' ');
  const timestamp = sentences[0].start;

  return {
    timestamp,
    text: text.trim(),
  };
}
