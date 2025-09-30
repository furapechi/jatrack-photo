'use client';

import { Trash2, Download } from 'lucide-react';
import Image from 'next/image';

interface PhotoCardProps {
  photo: {
    id: string;
    file_name: string;
    url: string;
    created_at: string;
  };
  onDelete: () => void;
}

export default function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-200">
      <Image
        src={photo.url}
        alt={photo.file_name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
      
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium truncate mb-2">
            {photo.file_name}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={handleDownload}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
              aria-label="ダウンロード"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg backdrop-blur-sm transition-colors"
              aria-label="削除"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

