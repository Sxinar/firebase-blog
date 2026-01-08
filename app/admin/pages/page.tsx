"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Page {
    id: string;
    title: string;
    slug: string;
    createdAt: any;
}

export default function AdminPagesPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const querySnapshot = await getDocs(query(collection(db, "pages"), orderBy("createdAt", "desc")));
            const pagesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Page[];
            setPages(pagesData);
        } catch (error) {
            console.error("Error fetching pages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Bu sayfayı silmek istediğinize emin misiniz?")) {
            try {
                await deleteDoc(doc(db, "pages", id));
                setPages(pages.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting page:", error);
            }
        }
    };

    if (loading) return <div className="text-white">Sayfalar yükleniyor...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Sayfa Yönetimi</h1>
                    <p className="text-zinc-400">Hakkımda, İletişim gibi sabit sayfaları yönetin.</p>
                </div>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 rounded-xl">
                    <Link href="/admin/add-page" className="flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Sayfa Ekle
                    </Link>
                </Button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-zinc-900/50">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-bold py-5">BAŞLIK</TableHead>
                            <TableHead className="text-zinc-400 font-bold">SLUG</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-right pr-8">İŞLEMLER</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-zinc-500">
                                    Henüz oluşturulmuş sayfa yok.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages.map((page) => (
                                <TableRow key={page.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors">
                                    <TableCell className="font-medium text-zinc-200 py-4 flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-indigo-400" />
                                        {page.title}
                                    </TableCell>
                                    <TableCell>
                                        <code className="bg-zinc-950 text-emerald-400 px-2.5 py-1 rounded-md text-sm border border-emerald-500/20">
                                            /{page.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-right pr-8 space-x-2">
                                        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white">
                                            <Link href={`/${page.slug}`} target="_blank">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-indigo-400">
                                            <Link href={`/admin/edit-page?id=${page.id}`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(page.id)}
                                            className="text-zinc-400 hover:text-rose-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
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
