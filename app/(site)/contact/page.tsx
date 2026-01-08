"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MapPin, Globe } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendMessage({
                ...formData
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
        <div className="mt-20 px-4 max-w-6xl mx-auto pb-24 space-y-20">
            <header className="text-center space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase italic leading-[0.8]">
                    İletişim
                </h1>
                <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto font-medium tracking-tight italic">
                    "Bir fikriniz mi var? Birlikte dijital dünyayı güzelleştirelim."
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Links */}
                <div className="space-y-6">
                    <ContactCard
                        icon={Mail}
                        title="E-posta"
                        value="basaransmk@yandex.com"
                        color="text-primary"
                        bg="bg-primary/10"
                    />
                    <ContactCard
                        icon={MapPin}
                        title="Konum"
                        value="İstanbul, Türkiye"
                        color="text-primary"
                        bg="bg-primary/10"
                    />
                    <ContactCard
                        icon={Globe}
                        title="Web"
                        value="semihbasaran.com"
                        color="text-primary"
                        bg="bg-primary/10"
                    />

                    <div className="p-8 bg-primary rounded-[2.5rem] text-primary-foreground shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-2xl font-black mb-2 italic uppercase">Hızlı Yanıt</h3>
                        <p className="font-medium opacity-80">Genellikle 24 saat içinde tüm mesajlara geri dönüş yapıyorum.</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="glass rounded-[3rem] p-8 md:p-12 overflow-hidden relative border border-border">
                        {sent ? (
                            <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <Send className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black text-foreground italic uppercase">TEŞEKKÜRLER!</h3>
                                    <p className="text-muted-foreground text-xl font-medium">Mesajınız başarıyla iletildi. En kısa sürede yanıtlayacağım.</p>
                                </div>
                                <Button
                                    onClick={() => setSent(false)}
                                    className="mt-8 bg-foreground text-background hover:opacity-90 px-10 h-14 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                >
                                    Yeni Mesaj
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">İSİM SOYİSİM</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Semih Başaran"
                                            className="bg-muted/50 border-border h-16 rounded-2xl px-6 focus:ring-primary/50 text-lg font-medium text-foreground"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">E-POSTA ADRESİ</label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="hello@world.com"
                                            className="bg-muted/50 border-border h-16 rounded-2xl px-6 focus:ring-primary/50 text-lg font-medium text-foreground"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">KONU</label>
                                    <Input
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Bir proje hakkında..."
                                        className="bg-muted/50 border-border h-16 rounded-2xl px-6 focus:ring-primary/50 text-lg font-medium text-foreground"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">MESAJINIZ</label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Neler anlatmak istersiniz?"
                                        className="bg-muted/50 border-border min-h-[200px] rounded-3xl p-6 focus:ring-primary/50 text-lg font-medium leading-relaxed text-foreground"
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-20 bg-primary hover:opacity-90 text-primary-foreground text-2xl font-black rounded-[2rem] shadow-2xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                                >
                                    {loading ? (
                                        <span className="animate-pulse">GÖNDERİLİYOR...</span>
                                    ) : (
                                        <>GÖNDER <Send className="w-6 h-6" /></>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon: Icon, title, value, color, bg }: any) {
    return (
        <Card className="bg-muted/30 border-border rounded-[2rem] hover:bg-muted/50 transition-all duration-300 group">
            <CardContent className="p-8 flex items-center gap-6">
                <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">{title}</h4>
                    <p className="text-xl font-black text-foreground mt-1 tracking-tight">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
