"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github } from "lucide-react";
import Link from "next/link";
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

function HomeContent() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const searchQuery = searchParams.get("search");

    const slug = pathname === "/" ? null : pathname.slice(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Post[];
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (pathname === "/") {
            fetchPosts();
        }
    }, [pathname]);

    if (slug && !["about", "contact", "login"].includes(slug)) {
        return <PostView slug={slug} />;
    }

    const filteredPosts = posts.filter(post => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q);
    });

    return (
        <div className="flex flex-col items-center justify-center space-y-16 mt-12 mb-20">
            <div className="flex flex-col items-center space-y-6 text-center group">
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Avatar className="w-40 h-40 border-8 border-background shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] relative">
                        <AvatarImage src="https://github.com/basaransemih.png" className="object-cover" />
                        <AvatarFallback className="text-2xl font-black">SB</AvatarFallback>
                    </Avatar>
                </div>

                <div className="space-y-3">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">
                        Semih BAŞARAN
                    </h1>
                    <p className="text-zinc-500 text-xl font-medium tracking-tight">
                        Dijital günlük, teknoloji ve hayat üzerine notlar.
                    </p>
                </div>

                <Link href="https://github.com/basaransemih" target="_blank" className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 hover:scale-110 transition-all duration-300">
                    <Github className="w-6 h-6" />
                </Link>
            </div>

            <div className="w-full max-w-2xl space-y-10 px-4">
                <div className="flex items-center gap-4 text-zinc-800">
                    <div className="h-px flex-1 bg-zinc-900"></div>
                    <span className="text-xs font-black tracking-[0.4em] uppercase">SON YAZILAR</span>
                    <div className="h-px flex-1 bg-zinc-900"></div>
                </div>

                {loading ? (
                    <div className="text-center text-zinc-500 font-medium py-10">Yazılar yükleniyor...</div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center text-zinc-500 py-10">
                        {searchQuery ? `"${searchQuery}" için sonuç bulunamadı.` : "Henüz yazı bulunmuyor."}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredPosts.map((post) => (
                            <Link key={post.id} href={`/${post.slug}`} className="group flex items-center gap-8 p-6 rounded-[2rem] hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/50 transition-all duration-500">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{format(new Date(post.createdAt.seconds * 1000), "MMM", { locale: tr })}</span>
                                    <span className="text-3xl font-black text-rose-500 leading-none mt-1">
                                        {post.createdAt ? new Date(post.createdAt.seconds * 1000).getDate() : ""}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl md:text-2xl font-black text-zinc-200 group-hover:text-white tracking-tighter transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-zinc-500 text-sm line-clamp-1 font-medium italic">
                                        {post.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
