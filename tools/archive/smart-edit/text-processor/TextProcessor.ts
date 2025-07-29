import {
  type LanguageConfig,
  type ProcessingResult,
  type ProcessingStats,
} from './types.ts';

export class TextProcessor {
  private config: LanguageConfig;

  constructor(config: LanguageConfig) {
    this.config = config;
  }

  private fixEllipsis(text: string, stats: ProcessingStats): string {
    return text.replace(/\.{3}/g, () => {
      stats.ellipsisFixed++;
      return '…';
    });
  }

  private fixSpaces(text: string, stats: ProcessingStats): string {
    const lines = text.split('\n');

    const result = lines
      .map((line) => {
        // If line is empty or only whitespace, keep it as is (preserves empty lines)
        if (line.trim() === '') {
          return line;
        }
        // Remove multiple spaces but keep single spaces
        return line.replace(/[ \t]+/g, (match) => {
          if (match.length > 1) {
            stats.multipleSpacesFixed++;
          }
          return ' ';
        });
      })
      .join('\n');

    return result;
  }

  private fixQuotes(text: string, stats: ProcessingStats): string {
    let result = text;
    let inQuote = false;

    // Handle double quotes
    result = result.replace(/"/g, () => {
      stats.doubleQuotesFixed++;
      if (inQuote) {
        inQuote = false;
        return this.config.closingQuote;
      } else {
        inQuote = true;
        return this.config.openingQuote;
      }
    });

    // Reset quote state for single quotes
    let inSingleQuote = false;

    // Handle single quotes (but not apostrophes)
    result = result.replace(/'/g, (match, offset, string) => {
      // Check if it's likely an apostrophe (preceded by a letter and followed by a letter or suffix)
      const prevChar = string[offset - 1];
      const nextChar = string[offset + 1];

      if (
        prevChar &&
        /[a-zA-Z]/.test(prevChar) &&
        nextChar &&
        (/[a-zA-Z]/.test(nextChar) ||
          ['s', 't', 're', 've', 'll', 'd'].some((suffix) =>
            string.substring(offset + 1).startsWith(suffix)
          ))
      ) {
        return match; // Keep as apostrophe
      }

      // It's a quote
      stats.singleQuotesFixed++;
      if (inSingleQuote) {
        inSingleQuote = false;
        return this.config.closingSingleQuote;
      } else {
        inSingleQuote = true;
        return this.config.openingSingleQuote;
      }
    });

    return result;
  }

  private generateReport(stats: ProcessingStats): string {
    const changes: string[] = [];

    if (stats.ellipsisFixed > 0) {
      changes.push(
        `${stats.ellipsisFixed} ellipsis (… symbol${
          stats.ellipsisFixed > 1 ? 's' : ''
        })`
      );
    }

    if (stats.multipleSpacesFixed > 0) {
      changes.push(
        `${stats.multipleSpacesFixed} multiple space sequence${
          stats.multipleSpacesFixed > 1 ? 's' : ''
        }`
      );
    }

    if (stats.doubleQuotesFixed > 0) {
      changes.push(
        `${stats.doubleQuotesFixed} double quote${
          stats.doubleQuotesFixed > 1 ? 's' : ''
        }`
      );
    }

    if (stats.singleQuotesFixed > 0) {
      changes.push(
        `${stats.singleQuotesFixed} single quote${
          stats.singleQuotesFixed > 1 ? 's' : ''
        }`
      );
    }

    const totalChanges =
      stats.ellipsisFixed +
      stats.multipleSpacesFixed +
      stats.doubleQuotesFixed +
      stats.singleQuotesFixed;

    if (totalChanges === 0) {
      return 'No changes needed - text was already properly formatted.';
    }

    let report = `Text processing complete! Fixed ${totalChanges} issue${
      totalChanges > 1 ? 's' : ''
    }:\n`;
    report += changes.map((change) => `• ${change}`).join('\n');

    return report;
  }

  public process(markdownText: string): ProcessingResult {
    // Initialize statistics
    const stats: ProcessingStats = {
      ellipsisFixed: 0,
      multipleSpacesFixed: 0,
      doubleQuotesFixed: 0,
      singleQuotesFixed: 0,
    };

    // Split front-matter from content
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdownText.match(frontMatterRegex);

    let frontMatter = '';
    let content = markdownText;

    if (match) {
      frontMatter = `---\n${match[1]}\n---\n`;
      content = match[2];
    }

    // Apply fixes to content only (preserve front-matter as-is)
    content = this.fixEllipsis(content, stats);
    content = this.fixSpaces(content, stats);
    content = this.fixQuotes(content, stats);

    // Generate report
    const report = this.generateReport(stats);

    return {
      processedText: frontMatter + content,
      report: report,
      statistics: stats,
    };
  }
}
