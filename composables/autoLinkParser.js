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
  const termMap = new Map();

  // Build regex pattern for terms (longest first)
  const termRegexPattern = terms
    .filter((term) => term.linkable)
    .sort((a, b) => b.title.length - a.title.length)
    .flatMap((term) => {
      termMap.set(term.title.toLowerCase(), term);
      return [term.title, ...term.relatedTerms];
    })
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const termRegex = new RegExp(`\\b(${termRegexPattern})\\b`, 'gi');

  // Process AST
  const markdownAst = unified().use(remarkParse).parse(content);

  visit(markdownAst, 'text', (node, index, parent) => {
    if (!parent || parent.type === 'link' || parent.type === 'code') return;

    const matches = node.value?.match(termRegex);
    if (!matches) return;

    let newValue = node.value;

    matches.forEach((match) => {
      const term = termMap.get(match.toLowerCase());
      if (!term) return;

      const replacement = `[GLOSSARY:${term.slug}]${match}[/GLOSSARY]`;
      newValue = newValue.replace(new RegExp(`\\b${match}\\b`, 'g'), replacement);
    });

    node.value = newValue;
  });

  const processedContent = unified()
    .use(() => (tree) => tree)
    .use(remarkHtml)
    .stringify(markdownAst)
    .replace(/\[GLOSSARY:(.*?)\](.*?)\[\/GLOSSARY\]/g, (_, slug, text) => {
      return `<GlossaryTerm termSlug="${slug}">${text}</GlossaryTerm>`;
    });

  return processedContent;
}
