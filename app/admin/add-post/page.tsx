
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function AddPostPage() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [content, setContent] = useState("");
    const [commentStatus, setCommentStatus] = useState<'open' | 'closed'>('open');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, "posts"), {
                title,
                slug: slug || title.toLowerCase().replace(/ /g, "-"),
                content,
                coverImage,
                commentStatus,
                createdAt: serverTimestamp(),
            });
            router.push("/admin/posts");
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Hata oluştu: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-4xl font-black mb-8 text-white uppercase italic tracking-tighter">Yeni Yazı Ekle</h1>
            <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100 rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-zinc-900/50 p-8 border-b border-zinc-800">
                    <CardTitle className="text-2xl font-black italic uppercase">Yazı Detayları</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">BAŞLIK</label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Yazı başlığı..."
                                    className="bg-zinc-950/50 border-zinc-800 h-16 rounded-2xl px-6 focus:ring-primary/50 text-lg font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">SLUG (OPSİYONEL)</label>
                                <Input
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="yazi-basligi"
                                    className="bg-zinc-950/50 border-zinc-800 h-16 rounded-2xl px-6 focus:ring-primary/50 text-lg font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">KAPAK GÖRSELİ (URL)</label>
                            <Input
                                value={coverImage}
                                onChange={(e) => setCoverImage(e.target.value)}
                                placeholder="https://ornek.com/resim.jpg"
                                className="bg-zinc-950/50 border-zinc-800 h-16 rounded-2xl px-6 focus:ring-primary/50 text-lg font-bold"
                            />
                            {coverImage && (
                                <div className="mt-4 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/30 p-2 shadow-2xl">
                                    <img
                                        src={coverImage}
                                        alt="Önizleme"
                                        className="w-full h-64 object-cover rounded-2xl"
                                        onError={(e) => (e.currentTarget.src = "https://placehold.co/1200x600/18181b/52525b?text=Geçersiz+Görsel+URL")}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between p-6 bg-zinc-950/30 rounded-[2rem] border border-zinc-800">
                            <div className="space-y-1">
                                <h4 className="font-black text-zinc-200 uppercase italic">Yorumlar</h4>
                                <p className="text-sm text-zinc-500 font-medium">Bu yazı için yorumları aç/kapat.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{commentStatus === 'open' ? 'AÇIK' : 'KAPALI'}</span>
                                <Switch
                                    checked={commentStatus === 'open'}
                                    onCheckedChange={(checked: boolean) => setCommentStatus(checked ? 'open' : 'closed')}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">İÇERİK (ZENGİN METİN)</label>
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-20 bg-primary hover:bg-primary/90 text-white text-2xl font-black rounded-[2rem] shadow-2xl shadow-primary/20 transition-all active:scale-95 group flex items-center justify-center gap-4">
                            {loading ? (
                                <span className="animate-pulse">KAYDEDİLİYOR...</span>
                            ) : (
                                <>YAZIYI YAYINLA</>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
