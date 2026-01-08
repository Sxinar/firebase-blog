
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import tr from "date-fns/locale/tr";

export default function PostPage() {
    const { slug } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                const q = query(collection(db, "posts"), where("slug", "==", slug));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnap = querySnapshot.docs[0];
                    setPost({
                        id: docSnap.id,
                        ...docSnap.data()
                    } as Post);
                } else {
                    console.error("Post not found");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) return <div className="text-center mt-10 text-zinc-500">Yükleniyor...</div>;
    if (!post) return <div className="text-center mt-10 text-zinc-500">Yazı bulunamadı.</div>;

    return (
        <article className="mt-10 px-4">
            <header className="mb-8 text-center space-y-4">
                <div className="text-sm font-medium text-red-500 uppercase tracking-wider">
                    {post.createdAt ? format(new Date(post.createdAt.seconds * 1000), "d MMMM yyyy", { locale: tr }) : ""}
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {post.title}
                </h1>
            </header>

            <div className="prose prose-invert prose-lg mx-auto prose-p:text-zinc-400 prose-headings:text-zinc-200">
                {/* Basic rendering, ideally use a markdown renderer here */}
                {post.content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                ))}
            </div>
        </article>
    );
}
