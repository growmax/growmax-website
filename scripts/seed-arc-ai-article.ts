import { db, pool } from '../lib/db'
import { blogPosts } from '../lib/schema'
import { arcAiArticle } from '../lib/arcAiArticle'

async function seed() {
  const inserted = await db
    .insert(blogPosts)
    .values(arcAiArticle)
    .onConflictDoNothing({ target: blogPosts.slug })
    .returning({ id: blogPosts.id, slug: blogPosts.slug })

  console.log(inserted.length ? `Published ${inserted[0].slug}` : `Skipped ${arcAiArticle.slug}; it already exists`)
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => pool.end())