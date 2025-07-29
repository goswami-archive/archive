export interface LanguageConfig {
  openingQuote: string;
  closingQuote: string;
  openingSingleQuote: string;
  closingSingleQuote: string;
}

export interface ProcessingStats {
  ellipsisFixed: number;
  multipleSpacesFixed: number;
  doubleQuotesFixed: number;
  singleQuotesFixed: number;
}

export interface ProcessingResult {
  processedText: string;
  report: string;
  statistics: ProcessingStats;
}
