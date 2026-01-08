"use client"

import * as React from "react"
import { useEffect } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    useEffect(() => {
        const applyPrimaryColor = async () => {
            try {
                const docRef = doc(db, "settings", "site");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const color = docSnap.data().primaryColor;
                    if (color) {
                        document.documentElement.style.setProperty('--primary-hex', color);
                    }
                }
            } catch (e) { }
        };
        applyPrimaryColor();
    }, []);

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
