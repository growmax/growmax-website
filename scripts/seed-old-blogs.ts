import { db } from "../server/db";
import { blogPosts, blogRedirects } from "../shared/schema";
import { eq } from "drizzle-orm";
import { batch1Posts } from "./old-blog-batch-1";
import { batch2Posts } from "./old-blog-batch-2";
import { batch3Posts } from "./old-blog-batch-3";
import { batch4Posts } from "./old-blog-batch-4";

const allPosts = [...batch1Posts, ...batch2Posts, ...batch3Posts, ...batch4Posts];

async function seed() {
  console.log(`Seeding ${allPosts.length} old blog posts...`);

  let inserted = 0;
  let skipped = 0;
  let redirectsRemoved = 0;

  for (const post of allPosts) {
    try {
      await db.insert(blogPosts).values({
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
        author: post.author,
        authorTeam: post.authorTeam,
        readTime: post.readTime,
        excerpt: post.excerpt,
        sections: post.sections,
        relatedSlugs: post.relatedSlugs,
        published: true,
        legacyUrl: null,
      }).onConflictDoNothing();
      inserted++;
    } catch (err: any) {
      if (err.message?.includes("unique") || err.message?.includes("duplicate")) {
        skipped++;
      } else {
        console.error(`Failed to insert "${post.slug}":`, err.message);
      }
    }

    try {
      const oldPath = `/blog/${post.slug}`;
      const deleted = await db.delete(blogRedirects).where(eq(blogRedirects.oldPath, oldPath));
      if (deleted.rowCount && deleted.rowCount > 0) {
        redirectsRemoved++;
      }
    } catch {}
  }

  console.log(`Posts: ${inserted} inserted, ${skipped} skipped`);
  console.log(`Redirects removed: ${redirectsRemoved} (these slugs now serve content directly)`);

  const remaining = await db.select().from(blogRedirects);
  console.log(`Remaining redirects in DB: ${remaining.length}`);

  const totalPosts = await db.select().from(blogPosts);
  console.log(`Total blog posts in DB: ${totalPosts.length}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
