import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('writing')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  return rss({
    title: 'dbtlr.com — Writing',
    description: 'Notes on distributed systems, developer tools, and keeping software simple.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.blurb,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
