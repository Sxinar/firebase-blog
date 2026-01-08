"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Link as LinkIcon, FileText, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SlugItem {
    id: string;
    title: string;
    slug: string;
    type: "post" | "page";
}

export default function AdminSlugsPage() {
    const [items, setItems] = useState<SlugItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsSnap = await getDocs(collection(db, "posts"));
                const pagesSnap = await getDocs(collection(db, "pages"));

                const posts = postsSnap.docs.map(doc => ({ id: doc.id, title: doc.data().title, slug: doc.data().slug, type: "post" as const }));
                const pages = pagesSnap.docs.map(doc => ({ id: doc.id, title: doc.data().title, slug: doc.data().slug, type: "page" as const }));

                setItems([...posts, ...pages]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredItems = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.slug.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="text-white">Yükleniyor...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Slug Yönetimi</h1>
                <p className="text-zinc-400">Tüm içeriklerin URL (slug) yapılarını buradan inceleyin.</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                    placeholder="İçerik veya slug ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-14 bg-zinc-900/50 border-zinc-800 rounded-2xl w-full max-w-md focus:ring-indigo-500"
                />
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-zinc-900/50">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-bold py-5">TÜR</TableHead>
                            <TableHead className="text-zinc-400 font-bold">İÇERİK BAŞLIĞI</TableHead>
                            <TableHead className="text-zinc-400 font-bold">SLUG / URL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item) => (
                            <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors group">
                                <TableCell className="py-4">
                                    {item.type === "post" ? (
                                        <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 gap-1.5 px-3 py-1">
                                            <FileText className="w-3.5 h-3.5" /> Yazı
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5 px-3 py-1">
                                            <Layout className="w-3.5 h-3.5" /> Sayfa
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-zinc-200">
                                    {item.title}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 group-hover:text-amber-400 transition-colors">
                                        <LinkIcon className="w-4 h-4 text-zinc-500" />
                                        <code className="text-sm">/{item.slug}</code>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
