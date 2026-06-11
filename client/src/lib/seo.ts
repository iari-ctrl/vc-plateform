import { useEffect } from 'react';

const SUFFIX = 'VC Premium Experience';

/** Sets document title and meta description for the current page. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    if (title) document.title = `${title} · ${SUFFIX}`;
    else document.title = `${SUFFIX} — Comprendre, tester, apprendre le capital-risque`;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
