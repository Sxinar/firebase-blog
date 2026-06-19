"use client";

import { Clock, Save } from "lucide-react";

interface DraftIndicatorProps {
  lastSaved: Date | null;
  saving: boolean;
  autoSaveEnabled: boolean;
  onToggleAutoSave: (enabled: boolean) => void;
  onManualSave: () => void;
}

export function DraftIndicator({
  lastSaved,
  saving,
  autoSaveEnabled,
  onToggleAutoSave,
  onManualSave
}: DraftIndicatorProps) {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <Clock size={16} className={saving ? "animate-spin" : ""} />
        {saving ? (
          <span className="text-blue-600">Kaydediliyor...</span>
        ) : lastSaved ? (
          <span className="text-gray-600">
            Son kaydedilme: {new Date(lastSaved).toLocaleTimeString('tr-TR')}
          </span>
        ) : (
          <span className="text-gray-400">Henüz kaydedilmedi</span>
        )}
      </div>
      
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={autoSaveEnabled}
          onChange={(e) => onToggleAutoSave(e.target.checked)}
          className="rounded"
        />
        <span>Otomatik kaydet</span>
      </label>

      <button
        onClick={onManualSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
      >
        <Save size={16} />
        Manuel Kaydet
      </button>
    </div>
  );
}
