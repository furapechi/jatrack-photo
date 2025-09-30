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
        relative group cursor-pointer rounded-xl p-6 transition-all duration-200
        ${isSelected 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105' 
          : 'bg-white dark:bg-gray-800 hover:shadow-md hover:scale-102 border border-gray-200 dark:border-gray-700'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`
            p-3 rounded-lg transition-colors
            ${isSelected ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-900/30'}
          `}>
            <Folder className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <div>
            <h3 className={`font-semibold text-lg ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
              {folder.name}
            </h3>
            <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
              {photoCount}枚の写真
            </p>
          </div>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`
            opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg
            ${isSelected 
              ? 'hover:bg-white/20 text-white' 
              : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400'
            }
          `}
          aria-label="フォルダーを削除"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

