import { getPostBySlug, getPageBySlug, getPosts, getPages } from "@/lib/db";
import { Metadata } from "next";
import PostViewClient from "./PostViewClient";

export async function generateStaticParams() {
    const { posts } = await getPosts(100);
    const pages = await getPages();

    const paths = [
        ...posts.map((post) => ({ slug: post.slug })),
        ...pages.map((page) => ({ slug: page.slug })),
    ];

    return paths;
}

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const page = !post ? await getPageBySlug(slug) : null;

    if (post) {
        return {
            title: `${post.title} | Semih Başaran`,
            description: post.content.replace(/<[^>]*>/g, '').slice(0, 160),
            openGraph: {
                images: post.coverImage ? [post.coverImage] : [],
            },
        };
    }

    if (page) {
        return {
            title: `${page.title} | Semih Başaran`,
            description: page.content.replace(/<[^>]*>/g, '').slice(0, 160),
        };
    }

    return {
        title: "İçerik Bulunamadı",
    };
}

export default async function DynamicPage({ params }: Props) {
    const { slug } = await params;
    return <PostViewClient slug={slug} />;
}
