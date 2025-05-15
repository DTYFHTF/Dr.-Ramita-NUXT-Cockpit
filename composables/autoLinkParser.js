import { visit } from 'unist-util-visit';
import { useGlossaryStore } from '@/stores/glossary';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { h } from 'vue';

export async function autoLinkContent(content) {
  const glossaryStore = useGlossaryStore();
  await glossaryStore.loadTerms();

  const terms = glossaryStore.terms;

  if (!terms || terms.length === 0) {
    console.warn('No glossary terms available');
    return content;
  }

  const termOccurrences = new Map();

  // Build regex pattern for terms (longest first)
  const termRegexPattern = terms
    .filter((term) => term.linkable)
    .sort((a, b) => b.title.length - a.title.length)
    .flatMap((term) => {
      return term.title;
    })
    .join('|');


  if (!termRegexPattern) {
    console.warn('No valid regex pattern generated');
    return content;
  }

  const regex = new RegExp(`\\b(${termRegexPattern})\\b`, 'gi');

  const linkedContent = content.replace(regex, (match) => {
    const term = terms.find((t) => t.title.toLowerCase() === match.toLowerCase());
    if (term) {

      // Check and update occurrence count
      const currentCount = termOccurrences.get(term.slug) || 0;
      if (currentCount >= term.occurrenceLimit) {
        console.warn(`Occurrence limit reached for term: ${term.title}`);
        return match;
      }
      termOccurrences.set(term.slug, currentCount + 1);

      // Safeguard to prevent duplicate replacements
      if (match.includes('<GlossaryTerm')) {
        console.warn('Duplicate replacement detected for:', match);
        return match;
      }

      return `<GlossaryTerm term="${term.slug}">${match}</GlossaryTerm>`;
    }
    return match;
  });

  return linkedContent;
}
