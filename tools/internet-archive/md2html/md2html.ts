import flow from 'lodash.flow';

/**
 * Simple markdown to html formatter for https://archive.org
 */
export function md2html(markdown: string): string {
  const html = flow(
    formatTimecodes,
    styleH2,
    styleCiteAfterBlockquote,
    addBreaksInBlockquotes,
    addStyleToBlockquotes,
    wrapParagraphs
  )(markdown);

  return html;
}

function formatTimecodes(html: string): string {
  return html.replace(
    /^#(\d{2}:\d{2}:\d{2})#\s+/gm,
    (_, tc) => `<span style="color:gray"><time>${tc}</time></span><br>`
  );
}

function addBreaksInBlockquotes(html: string): string {
  return html.replace(
    /<blockquote\b([^>]*)>([\s\S]*?)<\/blockquote>/gi,
    (match, attrs, content) => {
      // Remove one leading newline if present
      const cleaned = content.replace(/^\n/, '');
      // Replace the rest with <br>
      const withBreaks = cleaned.replace(/\n/g, '<br>');
      return `<blockquote${attrs}>${withBreaks}</blockquote>`;
    }
  );
}

function addStyleToBlockquotes(html: string): string {
  const style = [
    'margin: 0',
    'margin-inline-start:2em',
    'font-weight:600',
    'font-size:inherit',
  ];

  return html.replace(
    /<blockquote(?![^>]*class=)/g,
    `<blockquote style="${style.join(';')}"`
  );
}

// async function renderHtml(markdown: string): Promise<string> {
//   // return marked.parse(markdown);
//   return markdown;
// }

function wrapParagraphs(text: string): string {
  const processedText = text
    .trim()
    .replace(/\n\s*\n+/g, '<!--PARAGRAPH_BREAK-->');

  const parts = processedText.split('<!--PARAGRAPH_BREAK-->');

  const blockLevelTagsRegex =
    /^<(blockquote|div|p|h[1-6]|ul|ol|li|pre|table|cite)/i;

  const result = parts
    .map((part) => {
      const trimmedPart = part.trim();

      if (trimmedPart === '') {
        return '';
      }

      if (blockLevelTagsRegex.test(trimmedPart)) {
        return trimmedPart;
      } else {
        return `<p style="text-align: justify">${trimmedPart}</p>`;
      }
    })
    .join('\n');

  return result;
}

function styleCiteAfterBlockquote(html: string): string {
  const style = [
    'display:block',
    'margin-top:0.5em',
    'margin-inline-start:3em',
    'margin-block-end:1em',
  ];
  return html.replace(
    /<\/blockquote>\s*<cite\b(?![^>]*style=)/gi,
    `</blockquote><cite style="${style.join(';')}"`
  );
}

function generateEditorsList(
  lang: string,
  editors = [],
  translators = [],
  transcribers = []
) {
  return `<dl>
      <dt>Editors: ${editors.join(', ')}</dt>
      <dt>Translators: ${translators.join(', ')}</dt>
      <dt>Transcribers: ${transcribers.join(', ')}</dt>
    </dl>`;
}

function styleH2(html: string) {
  const style = ['font-size: 20px', 'text-align: center'];

  return html.replace(
    /<h2\b(?![^>]*style=)([^>]*)>/gi,
    `<h2 style="${style.join(';')}">`
  );
}
