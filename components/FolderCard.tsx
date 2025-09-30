'use client';

import { Folder, Trash2 } from 'lucide-react';

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    photos: { count: number }[];
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function FolderCard({ folder, isSelected, onSelect, onDelete }: FolderCardProps) {
  const photoCount = folder.photos?.[0]?.count || 0;

  return (
    <div
      onClick={onSelect}
      className={`
        relative group cursor-pointer rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all duration-200 touch-manipulation
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-[1.02] sm:scale-105' 
          : 'bg-white dark:bg-gray-800 active:scale-[0.98] sm:hover:shadow-md sm:hover:scale-102 border border-gray-200 dark:border-gray-700'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className={`
            p-2 sm:p-3 rounded-lg transition-colors flex-shrink-0
            ${isSelected ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/30'}
          `}>
            <Folder className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <div className="min-w-0">
            <h3 className={`font-semibold text-base sm:text-lg truncate ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
              {folder.name}
            </h3>
            <p className={`text-xs sm:text-sm ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
              {photoCount}枚
            </p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-2 sm:p-2 rounded-lg touch-manipulation flex-shrink-0
            ${isSelected 
              ? 'hover:bg-white/20 text-white active:bg-white/30' 
              : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 active:bg-red-100 dark:active:bg-red-900/40'
            }
          `}
          aria-label="フォルダーを削除"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

