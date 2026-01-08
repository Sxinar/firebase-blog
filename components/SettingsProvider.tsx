
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Settings } from "@/types";
import { getSettings } from "@/lib/db";

interface SettingsContextType {
    settings: Settings;
    loading: boolean;
}

const defaultSettings: Settings = {
    siteTitle: "Dawn Blog",
    siteDescription: "Minimalist & Modern Blog",
    primaryColor: "#6366f1",
    maintenanceMode: false
};

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    loading: true
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getSettings();
                setSettings(data);

                // Set primary color as a CSS variable
                if (data.primaryColor) {
                    document.documentElement.style.setProperty('--primary-hex', data.primaryColor);
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // Maintenance mode check
    if (!loading && settings.maintenanceMode && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/login')) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">BAKIM MODU</h1>
                <p className="text-zinc-400 text-lg max-w-md">Size daha iyi bir deneyim sunmak için şu an bakımdayız. Lütfen daha sonra tekrar ziyaret edin.</p>
            </div>
        );
    }

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
