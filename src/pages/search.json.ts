import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { fmtLong } from '../lib/format';

// Build-time search index for the ⌘K palette (fetched by src/scripts/search.js).
// Order matters: the palette groups rows under Writing / Projects / Pages headers
// by type transitions.
export const GET: APIRoute = async () => {
  const posts = (await getCollection('writing')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

  const items = [
    ...posts.map((p) => ({
      type: 'post',
      title: p.data.title,
      sub: `${fmtLong(p.data.date)} · #${p.data.tag}`,
      href: `/writing/${p.id}/`,
    })),
    ...projects.map((p) => ({
      type: 'project',
      title: p.data.name,
      sub: `${p.data.lang} · ${p.data.short}`,
      href: `/projects/${p.id}/`,
    })),
    { type: 'page', title: 'Home', sub: 'Drew Butler', href: '/' },
    { type: 'page', title: 'Writing', sub: 'all posts', href: '/writing/' },
    { type: 'page', title: 'Projects', sub: 'all projects', href: '/projects/' },
    { type: 'page', title: 'About', sub: 'who is Drew', href: '/about/' },
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json' },
  });
};
