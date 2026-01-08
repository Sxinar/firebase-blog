
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const postsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Post[];
            setPosts(postsData);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

        try {
            await deleteDoc(doc(db, "posts", id));
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Silinirken bir hata oluştu.");
        }
    };

    if (loading) return <div className="text-white">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Yazılar</h1>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href="/admin/add-post">Yeni Yazı Ekle</Link>
                </Button>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-900">
                        <TableRow className="border-zinc-800 hover:bg-zinc-900">
                            <TableHead className="text-zinc-400">Başlık</TableHead>
                            <TableHead className="text-zinc-400">Slug</TableHead>
                            <TableHead className="text-zinc-400">Tarih</TableHead>
                            <TableHead className="text-right text-zinc-400">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-zinc-500">Henüz hiç yazı eklenmemiş.</TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post) => (
                                <TableRow key={post.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="font-medium text-zinc-200">{post.title}</TableCell>
                                    <TableCell className="text-zinc-400">{post.slug}</TableCell>
                                    <TableCell className="text-zinc-400">
                                        {post.createdAt ? format(new Date(post.createdAt.seconds * 1000), "d MMM yyyy", { locale: tr }) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-700">
                                                <Link href={`/${post.slug}`} target="_blank">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                                                <Link href={`/admin/edit-post?id=${post.id}`}>
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
