export const dynamic = 'force-static'

import { MetadataRoute } from 'next'
import { getPosts, getPages } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://semik-gunce.web.app'

    // Fetch all posts and pages
    const { posts } = await getPosts(100)
    const pages = await getPages()

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: new Date(post.createdAt?.seconds * 1000 || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const pageUrls = pages.map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.createdAt?.seconds * 1000 || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        ...postUrls,
        ...pageUrls,
    ]
}
