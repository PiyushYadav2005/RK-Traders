import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
}

/**
 * Sets `document.title` and the meta description for the current page.
 * Because this is a React SPA, each route needs to update the <head>
 * dynamically so Google sees unique titles/descriptions per page.
 */
export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    // Title — prepend page name to site name
    document.title = title;

    // Meta description
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) {
      meta.content = description;
    } else {
      meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Canonical URL — update per page
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const url = `${window.location.origin}${window.location.pathname}`;
    if (canonical) {
      canonical.href = url;
    } else {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = url;
      document.head.appendChild(canonical);
    }
  }, [title, description]);
}
