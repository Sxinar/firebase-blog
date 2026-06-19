"use client";

import { useState, useEffect, useCallback } from 'react';
import { Draft, DraftManager } from '@/lib/drafts';

const manager = new DraftManager();

export function useDraft(initialDraft?: Partial<Draft>) {
  const [draft, setDraft] = useState<Partial<Draft>>(
    initialDraft || {
      title: '',
      content: '',
      excerpt: '',
      tags: [],
      categoryId: '',
      authorId: '',
      autoSaveEnabled: true
    }
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  const saveDraft = useCallback(() => {
    setSaving(true);
    try {
      const saved = manager.saveDraft(draft as Omit<Draft, 'id' | 'lastSaved' | 'version'>);
      setLastSaved(saved.lastSaved);
      return saved;
    } finally {
      setSaving(false);
    }
  }, [draft]);

  useEffect(() => {
    if (draft.autoSaveEnabled) {
      manager.enableAutoSave(
        draft,
        (saved) => {
          setLastSaved(saved.lastSaved);
        },
        30000 // 30 seconds
      );
    }

    return () => {
      manager.disableAutoSave();
    };
  }, [draft, draft.autoSaveEnabled]);

  const updateDraft = useCallback((updates: Partial<Draft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  }, []);

  const deleteDraft = useCallback((id: string) => {
    manager.deleteDraft(id);
  }, []);

  return {
    draft,
    updateDraft,
    saveDraft,
    deleteDraft,
    lastSaved,
    saving
  };
}
