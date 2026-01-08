"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import { RichTextEditor } from "@/components/RichTextEditor";

export default function AddPagePage() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "pages"), {
                title,
                slug: slug || title.toLowerCase().replace(/ /g, "-"),
                content,
                createdAt: serverTimestamp(),
            });
            router.push("/admin/pages");
        } catch (error) {
            console.error("Error adding page: ", error);
            alert("Hata oluştu: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Yeni Sayfa Ekle</h1>
            <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                <CardHeader>
                    <CardTitle>Sayfa Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Sayfa Başlığı</label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Örn: Hakkımda"
                                    className="bg-zinc-950/50 border-zinc-700 focus-visible:ring-indigo-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Slug (URL)</label>
                                <Input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="hakkimda"
                                    className="bg-zinc-950/50 border-zinc-700 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">İçerik (Zengin Metin)</label>
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg transition-all active:scale-[0.98]">
                            {loading ? "Kaydediliyor..." : "Sayfayı Yayınla"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
