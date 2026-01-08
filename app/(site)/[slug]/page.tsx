
"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import CommentsSection from "@/components/Comments";

export default function ContentPage() {
    const { slug } = useParams();
    const [data, setData] = useState<any | null>(null);
    const [type, setType] = useState<"post" | "page" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!slug) return;
            try {
                // Try post first
                const postQ = query(collection(db, "posts"), where("slug", "==", slug));
                const postSnap = await getDocs(postQ);

                if (!postSnap.empty) {
                    setData({ id: postSnap.docs[0].id, ...postSnap.docs[0].data() });
                    setType("post");
                } else {
                    // Try page
                    const pageQ = query(collection(db, "pages"), where("slug", "==", slug));
                    const pageSnap = await getDocs(pageQ);

                    if (!pageSnap.empty) {
                        setData({ id: pageSnap.docs[0].id, ...pageSnap.docs[0].data() });
                        setType("page");
                    }
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) return <div className="text-center mt-10 text-zinc-500 font-medium">İçerik yükleniyor...</div>;
    if (!data) return <div className="text-center mt-20 text-zinc-500">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p>Aradığınız içerik bulunamadı.</p>
    </div>;

    return (
        <article className="mt-10 px-4 max-w-4xl mx-auto">
            <header className="mb-12 text-center space-y-4">
                {type === "post" && data.createdAt && (
                    <div className="text-sm font-bold text-rose-500 uppercase tracking-widest">
                        {format(new Date(data.createdAt.seconds * 1000), "d MMMM yyyy", { locale: tr })}
                    </div>
                )}
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                    {data.title}
                </h1>
                {type === "post" && data.coverImage && (
                    <div className="mt-8 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
                        <img src={data.coverImage} alt={data.title} className="w-full aspect-video object-cover" />
                    </div>
                )}
            </header>

            <div className="prose prose-invert prose-lg mx-auto prose-p:text-zinc-400 prose-headings:text-zinc-100 prose-img:rounded-3xl prose-a:text-rose-500">
                {/* Check if content is HTML or plain text */}
                {data.content.includes('<') && data.content.includes('>') ? (
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                ) : (
                    data.content.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                    ))
                )}
            </div>

            {type === "post" && (
                <div className="mt-20 pt-10 border-t border-zinc-800">
                    <CommentsSection postId={data.id} />
                </div>
            )}
        </article>
    );
}
