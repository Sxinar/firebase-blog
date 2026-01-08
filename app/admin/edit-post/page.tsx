"use client";

import { useState, useEffect, Suspense } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { RichTextEditor } from "@/components/RichTextEditor";

function EditPostContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                alert("ID bulunamadı!");
                router.push("/admin/posts");
                return;
            };
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setSlug(data.slug);
                    setCoverImage(data.coverImage || "");
                    setContent(data.content);
                } else {
                    alert("Yazı bulunamadı!");
                    router.push("/admin/posts");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setSaving(true);

        try {
            const docRef = doc(db, "posts", id);
            await updateDoc(docRef, {
                title,
                slug: slug || title.toLowerCase().replace(/ /g, "-"),
                content,
                coverImage,
                updatedAt: serverTimestamp(),
            });
            router.push("/admin/posts");
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("Hata oluştu: " + error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-3xl font-bold mb-8 text-white">Yazıyı Düzenle</h1>
            <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                <CardHeader>
                    <CardTitle>Yazı Detayları</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Başlık</label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Yazı başlığı..."
                                    className="bg-zinc-950/50 border-zinc-700"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Slug (Opsiyonel)</label>
                                <Input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="yazi-basligi"
                                    className="bg-zinc-950/50 border-zinc-700"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Kapak Görseli (URL)</label>
                            <Input
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://ornek.com/resim.jpg"
                                className="bg-zinc-950/50 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">İçerik (Zengin Metin)</label>
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                İptal
                            </Button>
                            <Button type="submit" disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                                {saving ? "Kaydediliyor..." : "Güncelle"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function EditPostPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-20">Yükleniyor...</div>}>
            <EditPostContent />
        </Suspense>
    )
}
