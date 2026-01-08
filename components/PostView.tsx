"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import CommentsSection from "@/components/Comments";

export default function PostView({ slug }: { slug: string }) {
    const [data, setData] = useState<any | null>(null);
    const [type, setType] = useState<"post" | "page" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Önce yazılarda ara
                const postQ = query(collection(db, "posts"), where("slug", "==", slug));
                const postSnap = await getDocs(postQ);

                if (!postSnap.empty) {
                    setData({ id: postSnap.docs[0].id, ...postSnap.docs[0].data() });
                    setType("post");
                } else {
                    // Sonra sayfalarda ara
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

    if (loading) return <div className="text-center mt-20 text-zinc-500 font-medium animate-pulse">İçerik yükleniyor...</div>;

    if (!data) return (
        <div className="text-center mt-32 text-zinc-500">
            <h1 className="text-6xl font-black mb-4 text-zinc-800">404</h1>
            <p className="text-xl">Aradığınız içerik bulunamadı.</p>
            <button onClick={() => window.location.href = '/'} className="mt-8 text-rose-500 font-bold hover:underline">Ana Sayfaya Dön</button>
        </div>
    );

    return (
        <article className="mt-10 px-4 max-w-4xl mx-auto pb-20">
            <header className="mb-12 text-center space-y-6">
                {type === "post" && data.createdAt && (
                    <div className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] bg-rose-500/10 w-fit mx-auto px-4 py-1 rounded-full">
                        {format(new Date(data.createdAt.seconds * 1000), "d MMMM yyyy", { locale: tr })}
                    </div>
                )}
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] lg:leading-[0.85]">
                    {data.title}
                </h1>
                {type === "post" && data.coverImage && (
                    <div className="mt-12 rounded-[2.5rem] overflow-hidden border border-zinc-800/50 shadow-2xl rotate-1 group hover:rotate-0 transition-transform duration-500">
                        <img src={data.coverImage} alt={data.title} className="w-full aspect-[21/9] object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                    </div>
                )}
            </header>

            <div className="prose prose-invert prose-xl mx-auto 
                prose-p:text-zinc-400 prose-p:leading-relaxed
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                prose-img:rounded-[2rem] prose-img:border prose-img:border-zinc-800
                prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-rose-500 prose-blockquote:bg-rose-500/5 prose-blockquote:py-2 prose-blockquote:rounded-r-2xl">
                {data.content.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                ) : (
                    data.content.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                    ))
                )}
            </div>

            {type === "post" && (
                <div className="mt-24 pt-12 border-t border-zinc-900">
                    <CommentsSection postId={data.id} />
                </div>
            )}
        </article>
    );
}
