import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { postUrl, readingTime, SITE, sortedPosts } from "../utils";

export async function GET(context: APIContext) {
  const posts = await sortedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: postUrl(post),
      pubDate: post.data.date,
      categories: [...post.data.categories, ...post.data.tags],
      customData: `<readingTime>${readingTime(post.body)} min</readingTime>`,
    })),
    customData: `<language>${SITE.locale}</language>`,
  });
}
