import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Build-time search index for the ⌘K palette (fetched by src/scripts/search.js).
// Order matters: the palette groups rows under Writing / Projects / Pages headers
// by type transitions.
export const GET: APIRoute = async () => {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

  const items = [
    ...projects.map((p) => ({
      type: 'project',
      title: p.data.name,
      sub: `${p.data.lang} · ${p.data.short}`,
      href: `/projects/${p.id}/`,
    })),
    { type: 'page', title: 'Home', sub: 'Drew Butler', href: '/' },
    { type: 'page', title: 'Projects', sub: 'all projects', href: '/projects/' },
    { type: 'page', title: 'About', sub: 'who is Drew', href: '/about/' },
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
};
