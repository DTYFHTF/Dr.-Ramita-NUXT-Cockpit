import { sanitize } from 'isomorphic-dompurify';

export function sanitizedDescription(html) {
  return sanitize(html, {
    ALLOWED_TAGS: ['em', 'strong', 'i', 'b', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['style', 'class'],
    FORBID_TAGS: ['style', 'script', 'iframe', 'link'],
    FORBID_ATTR: ['onerror', 'onload']
  });
}

export function stripHtmlTags(html) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  return html; // Return the original string if executed on the server
}