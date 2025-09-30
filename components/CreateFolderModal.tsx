'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function CreateFolderModal({ isOpen, onClose, onSubmit }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // モバイルでのスクロール防止
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName.trim());
      setFolderName('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 sm:p-6 animate-in slide-in-from-bottom sm:zoom-in duration-300">
        {/* ドラッグハンドル（モバイル用） */}
        <div className="sm:hidden w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            新しいフォルダー
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-lg transition-colors touch-manipulation"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="フォルダー名を入力"
            className="w-full px-4 py-3 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all"
            autoFocus
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors touch-manipulation"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="flex-1 px-4 py-3 sm:py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all touch-manipulation"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

