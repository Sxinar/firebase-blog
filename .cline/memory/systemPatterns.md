# System Patterns

## Mimari
- **Frontend Framework:** Next.js 14 (App Router).
- **Dil:** TypeScript.
- **Stil:** Tailwind CSS + Shadcn/UI.
- **Backend / DB Service:** Firebase (Firestore, Auth, Storage).
- **Hosting:** Vercel veya Firebase Hosting (Planlanan).

## Dizayn Desenleri
- **Bileşen Tabanlı:** UI, yeniden kullanılabilir `components/ui` bileşenleri üzerine kurulu.
- **Server Components & Client Components:** SEO için varsayılan olarak Server Component, interaktivite gereken yerlerde (formlar, butonlar) `"use client"` direktifi.
- **Yönetim Ayrımı:** `/admin` rotası tamamen ayrı bir layout ve koruma mekanizmasına sahip. `/` (root) rotası public erişime açık.
- **Veri Akışı:** Firebase SDK direkt olarak componentler içinde kullanılıyor (Basitlik ve hız için). Karmaşık state'ler için React Hooks (`useState`, `useEffect`).

## Dosya Yapısı
- `/app`: Tüm sayfalar ve rotalar.
- `/components`: UI bileşenleri ve özel bileşenler (Navbar, AdminSidebar vb.).
- `/lib`: Yardımcı fonksiyonlar ve Firebase konfigürasyonu (`firebase.ts`).
- `/types`: TypeScript tip tanımları.
