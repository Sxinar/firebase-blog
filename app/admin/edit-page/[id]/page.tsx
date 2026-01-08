"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";

export default function EditPagePage() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPage = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "pages", id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setSlug(data.slug);
                    setContent(data.content);
                } else {
                    alert("Sayfa bulunamadı!");
                    router.push("/admin/pages");
                }
            } catch (error) {
                console.error("Error fetching page:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const docRef = doc(db, "pages", id as string);
            await updateDoc(docRef, {
                title,
                slug: slug || title.toLowerCase().replace(/ /g, "-"),
                content,
                updatedAt: serverTimestamp(),
            });
            router.push("/admin/pages");
        } catch (error) {
            console.error("Error updating page: ", error);
            alert("Hata oluştu: " + error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Yükleniyor...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Sayfayı Düzenle</h1>
            <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                <CardHeader>
                    <CardTitle>Sayfa Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Sayfa Başlığı</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-zinc-950/50 border-zinc-700"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Slug (URL)</label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="bg-zinc-950/50 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">İçerik</label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[300px] bg-zinc-950/50 border-zinc-700"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full">İptal</Button>
                            <Button type="submit" disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700">
                                {saving ? "Kaydediliyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
