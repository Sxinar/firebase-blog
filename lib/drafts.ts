export interface Draft {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  categoryId: string;
  authorId: string;
  lastSaved: Date;
  autoSaveEnabled: boolean;
  version: number;
}

export class DraftManager {
  private readonly DRAFTS_KEY = 'firebase_blog_drafts';
  private autoSaveInterval?: NodeJS.Timeout;

  saveDraft(draft: Omit<Draft, 'id' | 'lastSaved' | 'version'>): Draft {
    const drafts = this.getDrafts();
    const existingIndex = drafts.findIndex(d => 
      d.title === draft.title && d.authorId === draft.authorId
    );

    const newDraft: Draft = {
      ...draft,
      id: existingIndex >= 0 ? drafts[existingIndex].id : crypto.randomUUID(),
      lastSaved: new Date(),
      version: existingIndex >= 0 ? drafts[existingIndex].version + 1 : 1
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = newDraft;
    } else {
      drafts.push(newDraft);
    }

    localStorage.setItem(this.DRAFTS_KEY, JSON.stringify(drafts));
    return newDraft;
  }

  getDrafts(authorId?: string): Draft[] {
    const stored = localStorage.getItem(this.DRAFTS_KEY);
    const drafts = stored ? JSON.parse(stored) : [];
    return authorId ? drafts.filter((d: Draft) => d.authorId === authorId) : drafts;
  }

  getDraft(id: string): Draft | null {
    const drafts = this.getDrafts();
    return drafts.find(d => d.id === id) || null;
  }

  deleteDraft(id: string): void {
    const drafts = this.getDrafts().filter(d => d.id !== id);
    localStorage.setItem(this.DRAFTS_KEY, JSON.stringify(drafts));
  }

  enableAutoSave(
    draft: Partial<Draft>, 
    onSave: (draft: Draft) => void,
    intervalMs: number = 30000
  ): void {
    this.disableAutoSave();
    this.autoSaveInterval = setInterval(() => {
      if (draft.autoSaveEnabled) {
        const saved = this.saveDraft(draft as Omit<Draft, 'id' | 'lastSaved' | 'version'>);
        onSave(saved);
      }
    }, intervalMs);
  }

  disableAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = undefined;
    }
  }
}
