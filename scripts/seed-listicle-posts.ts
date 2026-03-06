import { db } from "../server/db";
import { blogPosts } from "../shared/schema";
import { listiclePosts } from "./listicle-data";

async function seedListiclePosts() {
  console.log(`Seeding ${listiclePosts.length} listicle blog posts...`);

  for (const post of listiclePosts) {
    try {
      await db
        .insert(blogPosts)
        .values(post)
        .onConflictDoUpdate({
          target: blogPosts.slug,
          set: {
            title: post.title,
            category: post.category,
            date: post.date,
            author: post.author,
            authorTeam: post.authorTeam,
            readTime: post.readTime,
            excerpt: post.excerpt,
            sections: post.sections,
            relatedSlugs: post.relatedSlugs,
            published: post.published,
            updatedAt: new Date(),
          },
        });
      console.log(`  ✓ ${post.slug}`);
    } catch (err) {
      console.error(`  ✗ ${post.slug}:`, err);
    }
  }

  console.log("Done seeding listicle posts.");
  process.exit(0);
}

seedListiclePosts();
