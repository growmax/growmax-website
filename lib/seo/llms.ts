import type { BlogPost } from '@/lib/schema'
import { BASE_URL, indexableRoutes } from '@/lib/seo/indexableRoutes'

const coreDescriptions: Record<string, string> = {
  '/': 'B2B commerce software for manufacturers and distributors.',
  '/revenue-platform': 'Growmax revenue platform for connected B2B commerce operations.',
  '/revenue-platform/compare': 'Compare Growmax capabilities for B2B commerce teams.',
  '/minori-ai': 'Minori AI prepares quotes, orders, and product data for human review.',
  '/minori-ai/commerce-agents': 'Commerce agent capabilities for manufacturers and distributors.',
  '/minori-ai/connect': 'Connect Minori AI with commerce data and operational systems.',
  '/minori-ai/how-it-works': 'How Minori AI turns requests into governed, reviewable work.',
  '/demo': 'Request a Growmax product demonstration.',
  '/company/about': 'About Growmax and its work in B2B commerce.',
  '/blog': 'Growmax insights and guidance for B2B commerce teams.',
  '/solutions/spare-parts-ecommerce': 'Ecommerce capabilities for spare-parts businesses.',
  '/write-for-us': 'Contributor information for the Growmax blog.',
  '/privacy': 'Growmax privacy policy.',
  '/terms-of-service': 'Growmax terms of service.',
}

function titleFromPath(path: string) {
  if (path === '/') return 'Growmax'
  return path
    .split('/')
    .filter(Boolean)
    .at(-1)!
    .split('-')
    .map(word => {
      const upper = word.toUpperCase()
      if (['B2B', 'AI', 'ERP', 'CRM', 'PPE', 'HVAC'].includes(upper)) return upper
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

function descriptionForPath(path: string) {
  if (coreDescriptions[path]) return coreDescriptions[path]
  if (path.startsWith('/comparisons/')) return `Growmax comparison guide for teams evaluating ${titleFromPath(path)}.`
  if (path.startsWith('/industries/')) return `B2B commerce guidance and capabilities for ${titleFromPath(path).toLowerCase()}.`
  return `Growmax information about ${titleFromPath(path).toLowerCase()}.`
}

function cleanText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function routeLine(path: string) {
  return `- [${titleFromPath(path)}](${BASE_URL}${path}): ${descriptionForPath(path)}`
}

export function buildLlmsTxt(posts: BlogPost[]) {
  const core = indexableRoutes.filter(route => !route.url.startsWith('/comparisons/') && !route.url.startsWith('/industries/'))
  const comparisons = indexableRoutes.filter(route => route.url.startsWith('/comparisons/'))
  const industries = indexableRoutes.filter(route => route.url.startsWith('/industries/'))
  const uniquePosts = [...new Map(posts.map(post => [post.slug, post])).values()]

  return [
    '# Growmax',
    '',
    '> Growmax provides B2B commerce software and Minori AI for manufacturers and distributors. The platform helps teams prepare quotes, orders, product data, and connected revenue operations with human review.',
    '',
    `Canonical site: ${BASE_URL}`,
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    `Expanded LLM content: ${BASE_URL}/llms-full.txt`,
    '',
    '## Main pages',
    ...core.map(route => routeLine(route.url)),
    '',
    '## Industry pages',
    ...industries.map(route => routeLine(route.url)),
    '',
    '## Comparison pages',
    ...comparisons.map(route => routeLine(route.url)),
    '',
    '## Blog posts',
    ...(uniquePosts.length
      ? uniquePosts.map(post => `- [${cleanText(post.title)}](${BASE_URL}/blog/${post.slug}): ${cleanText(post.excerpt)}`)
      : [`- [Growmax blog](${BASE_URL}/blog): Published B2B commerce insights and guidance.`]),
    '',
  ].join('\n')
}

export function buildLlmsFullTxt(posts: BlogPost[]) {
  const uniquePosts = [...new Map(posts.map(post => [post.slug, post])).values()]
  return [
    buildLlmsTxt(uniquePosts),
    '## Expanded blog content',
    '',
    ...uniquePosts.flatMap(post => [
      `### ${cleanText(post.title)}`,
      '',
      `Source: ${BASE_URL}/blog/${post.slug}`,
      '',
      cleanText(post.excerpt),
      '',
      ...(post.sections ?? []).flatMap(section => [
        `#### ${cleanText(section.heading)}`,
        '',
        cleanText(section.content),
        '',
      ]),
    ]),
  ].join('\n')
}
