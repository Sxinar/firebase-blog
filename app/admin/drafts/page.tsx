"use client";

import { useState, useEffect } from "react";
import { Draft, DraftManager } from "@/lib/drafts";
import { Clock, Trash2, Edit, FileText } from "lucide-react";
import Link from "next/link";

const manager = new DraftManager();

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(manager.getDrafts());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Bu taslağı silmek istediğinizden emin misiniz?")) {
      manager.deleteDraft(id);
      setDrafts(manager.getDrafts());
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText size={32} />
          Taslaklar
        </h1>
        <Link 
          href="/admin/posts/new"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90"
        >
          Yeni Yazı
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText size={64} className="mx-auto mb-4 opacity-20" />
          <p className="text-xl">Henüz taslak yok</p>
          <p className="mt-2">Yazılarınız otomatik olarak taslak olarak kaydedilir</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {drafts.map(draft => (
            <div 
              key={draft.id}
              className="border rounded-lg p-6 hover:border-primary transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">
                    {draft.title || "Başlıksız"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {draft.excerpt || draft.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {formatDate(draft.lastSaved)}
                    </span>
                    <span>Versiyon {draft.version}</span>
                    {draft.tags.length > 0 && (
                      <div className="flex gap-2">
                        {draft.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag}
                            className="bg-gray-100 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/admin/posts/edit/${draft.id}`}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Edit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
