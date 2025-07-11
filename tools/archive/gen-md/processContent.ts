import flow from 'lodash.flow';

function processContent(content: string) {
  return flow([removeDiacritics, toProperQuotes, toProperEllipsis])(content);
}

function toTypingQuotes(content: string) {
  return content.replace(/‘/g, "'").replace(/’/g, "'");
}

function toProperEllipsis(content: string) {
  return content.replace(/\.\.\./g, '…');
}

function toDoubleQuotes(content: string) {
  return content.replace(/“/g, '"').replace(/”/g, '"');
}

function toSingleSpace(content: string) {
  return content.replace(/\s+/g, ' ');
}

function toProperQuotes(content: string) {
  return content.replace(/"/g, '“').replace(/'/g, '‘');
}

function toLongDash(content: string) {
  return content.replace(/-/g, '—');
}

function removeDiacritics(content: string) {
  return content.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function cleanSpaces(text: string) {
  return text.replace(/(?<!\n\s*)\s{2,}(?!\s*\n)/g, ' ');
}

export { processContent };
