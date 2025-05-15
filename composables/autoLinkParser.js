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
  console.log('Loaded glossary terms:', terms); // Debugging log

  if (!terms || terms.length === 0) {
    console.warn('No glossary terms available');
    return content;
  }

  const termMap = new Map();

  // Build regex pattern for terms (longest first)
  const termRegexPattern = terms
    .filter((term) => term.linkable)
    .sort((a, b) => b.title.length - a.title.length)
    .flatMap((term) => {
      console.log('Processing term:', term.title); // Debugging log
      return term.title;
    })
    .join('|');

  console.log('Generated regex pattern:', termRegexPattern); // Debugging log

  if (!termRegexPattern) {
    console.warn('No valid regex pattern generated');
    return content;
  }

  const regex = new RegExp(`\\b(${termRegexPattern})\\b`, 'gi');
  console.log('Regex object:', regex); // Debugging log

  const matches = content.match(regex);
  console.log('Matches found:', matches); // Debugging log

  if (!matches) {
    console.warn('No matches found in content');
    return content;
  }

  const linkedContent = content.replace(regex, (match) => {
    const term = terms.find((t) => t.title.toLowerCase() === match.toLowerCase());
    if (term) {
      console.log('Matched term:', term); // Debugging log

      // Safeguard to prevent duplicate replacements
      if (match.includes('<GlossaryTerm')) {
        console.warn('Duplicate replacement detected for:', match);
        return match;
      }

      return `<GlossaryTerm term="${term.slug}">${match}</GlossaryTerm>`;
    }
    return match;
  });

  console.log('Final linked content:', linkedContent); // Debugging log
  return linkedContent;
}
