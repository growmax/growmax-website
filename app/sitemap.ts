import { MetadataRoute } from 'next'
import { storage } from '@/lib/storage'

const BASE_URL = 'https://www.growmax.io'

const staticRoutes = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { url: '/revenue-platform', priority: 0.9, changeFrequency: 'weekly' as const },
  { url: '/revenue-platform/compare', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/demo', priority: 0.9, changeFrequency: 'monthly' as const },
  { url: '/company/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
  { url: '/solutions/spare-parts-ecommerce', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/write-for-us', priority: 0.5, changeFrequency: 'monthly' as const },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/comparisons/handshake-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/tradegecko-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/sana-commerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/orocommerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/bigcommerce-b2b-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/shopify-plus-b2b-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/magento-b2b-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/dynamics-365-commerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/salesforce-commerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/woocommerce-b2b-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/zoho-commerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/sap-commerce-cloud-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/oracle-commerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/comparisons/netsuite-suitecommerce-alternatives', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/electrical-distributors', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/building-materials', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/industrial-manufacturing', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/food-beverage', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/automotive-aftermarket', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/plumbing-hvac', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/janitorial-sanitation', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/safety-ppe', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/industrial-fasteners', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/pump-valve', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/chemical-distributors', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/industries/packaging-distributors', priority: 0.8, changeFrequency: 'monthly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const posts = await storage.getPublishedBlogPosts()
    blogPosts = posts.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {}

  return [
    ...staticRoutes.map(r => ({ url: `${BASE_URL}${r.url}`, lastModified: new Date(), changeFrequency: r.changeFrequency, priority: r.priority })),
    ...blogPosts,
  ]
}
