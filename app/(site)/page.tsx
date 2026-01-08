"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";

export default function HomePage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

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

        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-12 mt-10">

            <div className="flex flex-col items-center space-y-4 text-center">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                    <AvatarImage src="https://github.com/basaransemih.png" />
                    <AvatarFallback>SB</AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">basaransemih</h1>
                    <p className="text-muted-foreground text-lg">Semih BAŞARAN ve yazıları</p>
                </div>

                <Link href="https://github.com/basaransemih" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors p-2">
                    <Github className="w-6 h-6" />
                </Link>
            </div>

            <div className="w-full max-w-lg space-y-8">

                {loading ? (
                    <div className="text-center text-zinc-500">Yazılar yükleniyor...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-zinc-500">Henüz yazı bulunmuyor.</div>
                ) : (
                    posts.map((post) => (
                        <Link key={post.id} href={`/${post.slug}`} className="group flex items-start gap-6">
                            <div className="flex flex-col items-end text-xs font-bold text-red-500 uppercase min-w-[3rem] pt-1">
                                <span>ARA</span>
                                <span className="text-xl leading-none">
                                    {post.createdAt ? new Date(post.createdAt.seconds * 1000).getDate() : ""}
                                </span>
                            </div>
                            <div className="text-lg text-zinc-300 group-hover:text-red-500 transition-colors font-medium">
                                {post.title}
                            </div>
                        </Link>
                    ))
                )}

            </div>
        </div>
    );
}
