
"use client";

import { useEffect, useState } from "react";
import { getPostBySlug, getPageBySlug } from "@/lib/db";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import CommentsSection from "@/components/Comments";
import { useSettings } from "@/components/SettingsProvider";

export default function PostViewClient({ slug }: { slug: string }) {
    const [data, setData] = useState<any | null>(null);
    const [type, setType] = useState<"post" | "page" | null>(null);
    const [loading, setLoading] = useState(true);
    const { settings } = useSettings();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const post = await getPostBySlug(slug);
                if (post) {
                    setData(post);
                    setType("post");
                } else {
                    const page = await getPageBySlug(slug);
                    if (page) {
                        setData(page);
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

    if (loading) return <div className="text-center mt-32 text-muted-foreground font-medium animate-pulse italic">İçerik yükleniyor...</div>;

    if (!data) return (
        <div className="text-center mt-40 px-6">
            <h1 className="text-9xl font-black mb-4 bg-gradient-to-br from-muted-foreground to-foreground bg-clip-text text-transparent italic">404</h1>
            <p className="text-muted-foreground text-xl font-medium tracking-tight">Aradığınız içerik bu galakside bulunamadı.</p>
            <button onClick={() => window.location.href = '/'} className="mt-12 bg-foreground text-background px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Ana Sayfaya Dön</button>
        </div>
    );

    return (
        <article className="mt-10 px-4 max-w-4xl mx-auto pb-32">
            <header className="mb-16 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {type === "post" && data.createdAt && (
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] bg-primary/5 w-fit mx-auto px-6 py-2 rounded-full border border-primary/10">
                        {format(new Date(data.createdAt.seconds * 1000), "d MMMM yyyy", { locale: tr })}
                    </div>
                )}

                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9] italic uppercase">
                    {data.title}
                </h1>

                {type === "post" && data.coverImage && (
                    <div className="mt-16 rounded-[3rem] overflow-hidden border border-border shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10" />
                        <img
                            src={data.coverImage}
                            alt={data.title}
                            className="w-full aspect-[21/9] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                        />
                    </div>
                )}
            </header>

            <div className="prose dark:prose-invert prose-2xl mx-auto 
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-medium prose-p:italic
                prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
                prose-img:rounded-[3rem] prose-img:border prose-img:border-border prose-img:shadow-2xl
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-6 prose-blockquote:rounded-r-[2rem] prose-blockquote:italic
                prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:rounded-lg">
                {data.content.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                ) : (
                    data.content.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                    ))
                )}
            </div>

            {type === "post" && data.commentStatus !== 'closed' && (
                <div className="mt-32 pt-20 border-t border-border relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-8">
                        <span className="text-xs font-black tracking-[0.5em] text-muted-foreground">YORUMLAR</span>
                    </div>
                    <CommentsSection postId={data.id} />
                </div>
            )}
        </article>
    );
}
