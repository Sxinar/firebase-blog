"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "messages"), {
                ...formData,
                createdAt: serverTimestamp(),
            });
            setSent(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Mesaj gönderilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10 px-4 max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">İletişim</h1>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Benimle iletişime geçmek için aşağıdaki formu kullanabilir veya doğrudan e-posta gönderebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100 shadow-2xl overflow-hidden rounded-3xl">
                        <CardHeader className="bg-zinc-900/50 p-8 border-b border-zinc-800">
                            <CardTitle className="text-2xl">Bana Mesaj Gönder</CardTitle>
                            <CardDescription className="text-zinc-500">En kısa sürede size geri dönüş yapacağım.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            {sent ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Mesajınız Alındı!</h3>
                                    <p className="text-zinc-400">İletişime geçtiğiniz için teşekkürler. En kısa sürede yanıtlayacağım.</p>
                                    <Button variant="outline" onClick={() => setSent(false)} className="mt-4 border-zinc-700 hover:bg-zinc-800 rounded-xl px-8">Yeni Mesaj Gönder</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">Adınız</label>
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ad Soyad"
                                                className="bg-zinc-950/50 border-zinc-700 h-12 rounded-xl focus:ring-rose-500 ring-offset-zinc-900"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">E-posta</label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="eposta@adresiniz.com"
                                                className="bg-zinc-950/50 border-zinc-700 h-12 rounded-xl focus:ring-rose-500 ring-offset-zinc-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Konu</label>
                                        <Input
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="Hangi konuda yazıyorsunuz?"
                                            className="bg-zinc-950/50 border-zinc-700 h-12 rounded-xl focus:ring-rose-500 ring-offset-zinc-900"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Mesajınız</label>
                                        <Textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Mesajınızı buraya yazın..."
                                            className="bg-zinc-950/50 border-zinc-700 min-h-[150px] rounded-xl focus:ring-rose-500 ring-offset-zinc-900"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={loading} className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-lg font-bold rounded-xl transition-all active:scale-[0.98]">
                                        {loading ? "Gönderiliyor..." : "Hemen Gönder"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100 rounded-3xl">
                        <CardContent className="p-8 space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-rose-500">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">E-posta</h4>
                                    <p className="text-zinc-400 text-sm">basaransmk@yandex.com</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-emerald-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Konum</h4>
                                    <p className="text-zinc-400 text-sm">Türkiye, İstanbul</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-indigo-500">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Sosyal Medya</h4>
                                    <p className="text-zinc-400 text-sm">@basaransemih</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-rose-600 rounded-3xl text-white space-y-4">
                        <h3 className="text-xl font-bold">Bir projeniz mi var?</h3>
                        <p className="text-rose-100 opacity-90 text-sm italic">"Birlikte harika şeyler inşa edebiliriz. Mesaj atın, hemen planlayalım."</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
