
"use client";

import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "@/lib/db";
import { Settings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        siteTitle: "",
        siteDescription: "",
        primaryColor: "#6366f1",
        maintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await getSettings();
            setSettings(data);
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(settings);
            alert("Ayarlar başarıyla kaydedildi! Sayfayı yenileyerek değişiklikleri görebilirsiniz.");
            window.location.reload();
        } catch (error) {
            console.error("Save error:", error);
            alert("Hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-black text-white">Genel Ayarlar</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-zinc-900/50 border-zinc-800 text-white col-span-2">
                    <CardHeader>
                        <CardTitle>Site Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Site Başlığı</Label>
                            <Input
                                value={settings.siteTitle}
                                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                className="bg-zinc-950/50 border-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Site Açıklaması (SEO)</Label>
                            <Textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="bg-zinc-950/50 border-zinc-700"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Tema & Görünüm</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Ana Renk (Primary Color)</Label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="color"
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="w-12 h-12 rounded cursor-pointer bg-transparent border-none"
                                />
                                <Input
                                    value={settings.primaryColor}
                                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                    className="bg-zinc-950/50 border-zinc-700 font-mono"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Durum</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/30 border border-zinc-800">
                            <div className="space-y-0.5">
                                <Label className="text-base">Bakım Modu</Label>
                                <p className="text-sm text-zinc-400">Siteyi ziyaretçilere kapatır.</p>
                            </div>
                            <Switch
                                checked={settings.maintenanceMode}
                                onCheckedChange={(val: boolean) => setSettings({ ...settings, maintenanceMode: val })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20"
            >
                {saving ? "Kaydediliyor..." : "Ayarları Güncelle"}
            </Button>
        </div>
    );
}
