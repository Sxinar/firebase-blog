"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Palette } from "lucide-react";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteTitle: "Semih BAŞARAN",
        siteDescription: "Semih BAŞARAN ve yazıları",
        primaryColor: "#e11d48", // Default rose
        githubUrl: "https://github.com/basaransemih",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "site");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as any);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "site"), settings);
            alert("Ayarlar başarıyla kaydedildi.");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Ayarlar yükleniyor...</div>;

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Genel Ayarlar</h1>
                <p className="text-zinc-400">Sitenizin genel görünümünü ve bilgilerini buradan düzenleyin.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-indigo-400" />
                            Site Bilgileri
                        </CardTitle>
                        <CardDescription className="text-zinc-500">Arama motorları ve tarayıcı sekmesi için kullanılan bilgiler.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Site Başlığı</label>
                            <Input
                                value={settings.siteTitle}
                                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                className="bg-zinc-950/50 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Site Açıklaması</label>
                            <Textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="bg-zinc-950/50 border-zinc-700 min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5 text-rose-400" />
                            Görünüm Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-zinc-400">Varsayılan Tema</label>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant={theme === "light" ? "default" : "outline"}
                                    onClick={() => setTheme("light")}
                                    className="flex-1 gap-2"
                                >
                                    <Sun className="w-4 h-4" /> Açık
                                </Button>
                                <Button
                                    type="button"
                                    variant={theme === "dark" ? "default" : "outline"}
                                    onClick={() => setTheme("dark")}
                                    className="flex-1 gap-2"
                                >
                                    <Moon className="w-4 h-4" /> Koyu
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Vurgu Rengi (Accent Color)</label>
                            <div className="flex gap-4 items-center">
                                <Input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="w-12 h-12 p-1 bg-zinc-950/50 border-zinc-700 cursor-pointer"
                                />
                                <span className="text-zinc-500 text-sm font-mono">{settings.primaryColor}</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-2">Bu renk sitedeki butonlar, linkler ve vurgu noktaları için kullanılacaktır.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 px-12 py-6 text-lg">
                        {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
