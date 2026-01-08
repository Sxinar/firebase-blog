"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useSearchParams, usePathname } from "next/navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import { Suspense } from "react";
import PostView from "@/components/PostView";

export default function HomePage() {
    return (
        <Suspense fallback={<div className="text-center mt-20 text-zinc-500 animate-pulse font-medium underline decoration-rose-500/30">İçerik yükleniyor...</div>}>
            <HomeContent />
        </Suspense>
    );
}

import { useSettings } from "@/components/SettingsProvider";
import { getPosts } from "@/lib/db";

function HomeContent() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const { settings } = useSettings();

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const searchQuery = searchParams.get("search");

    const slug = pathname === "/" ? null : pathname.slice(1);

    const fetchPosts = async (isLoadMore = false) => {
        try {
            setLoading(true);
            const { posts: newPosts, lastDoc: newLastDoc } = await getPosts(5, isLoadMore ? lastDoc : null);

            if (isLoadMore) {
                setPosts(prev => [...prev, ...newPosts]);
            } else {
                setPosts(newPosts);
            }

            setLastDoc(newLastDoc);
            setHasMore(newPosts.length === 5);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q);
    });

    return (
        <div className="flex flex-col items-center justify-center space-y-16 mt-12 mb-20 px-4">
            <div className="flex flex-col items-center space-y-6 text-center group">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-rose-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Avatar className="w-40 h-40 border-8 border-background shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative">
                        <AvatarImage src="https://github.com/basaransemih.png" className="object-cover" />
                        <AvatarFallback className="text-2xl font-black">SB</AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-3">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic">
                        {settings.siteTitle || "Semih BAŞARAN"}
                    </h1>
                    <p className="text-muted-foreground text-xl font-medium tracking-tight max-w-lg">
                        {settings.siteDescription || "Dijital günlük, teknoloji ve hayat üzerine notlar."}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link href="https://github.com/basaransemih" target="_blank" className="p-3 bg-muted rounded-2xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:scale-110 transition-all duration-300">
                        <Github className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-4xl space-y-10">
                <div className="flex items-center gap-4 text-muted-foreground/20">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-black tracking-[0.4em] uppercase text-muted-foreground">SON YAZILAR</span>
                    <div className="h-px flex-1 bg-border"></div>
                </div>

                {posts.length === 0 && !loading ? (
                    <div className="text-center text-muted-foreground py-10 italic font-medium">
                        {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : "Henüz yazı bulunmuyor."}
                    </div>
                ) : (
                    <div className="flex flex-col border-y border-border">
                        {filteredPosts.map((post) => {
                            const readingTime = Math.ceil(post.content.split(' ').length / 200);
                            return (
                                <Link
                                    key={post.id}
                                    href={`/${post.slug}`}
                                    className="group flex items-center justify-between py-6 px-2 hover:bg-muted/50 transition-all duration-300 border-b border-border last:border-0"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="flex gap-1.5 text-xs font-black uppercase tracking-widest min-w-[80px]">
                                            <span className="text-primary">{format(new Date(post.createdAt?.seconds * 1000 || Date.now()), "MMM", { locale: tr })}</span>
                                            <span className="text-muted-foreground">{format(new Date(post.createdAt?.seconds * 1000 || Date.now()), "dd")}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">🚀</span>
                                            <h3 className="text-lg md:text-xl font-bold text-foreground/80 group-hover:text-primary transition-colors tracking-tight">
                                                {post.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center gap-2 text-muted-foreground font-medium text-sm italic">
                                        <span>{readingTime} dk okuma süresi</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {hasMore && posts.length > 0 && (
                    <div className="flex justify-center pt-8">
                        <Button
                            onClick={() => fetchPosts(true)}
                            disabled={loading}
                            className="bg-foreground hover:bg-foreground/90 text-background font-black px-12 h-16 rounded-[1.5rem] border border-border transition-all hover:scale-105 active:scale-95"
                        >
                            {loading ? "YÜKLENİYOR..." : "DAHA FAZLA GÖSTER"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

