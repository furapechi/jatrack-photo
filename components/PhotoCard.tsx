'use client';

import { Trash2, Download, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface PhotoCardProps {
  photo: {
    id: string;
    file_name: string;
    url: string;
    created_at: string;
    mime_type?: string;
  };
  onDelete: () => void;
}

export default function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  const [showActions, setShowActions] = useState(false);
  const isVideo = photo.mime_type?.startsWith('video/');

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
    <div 
      className="group relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-200 touch-manipulation"
      onClick={() => setShowActions(!showActions)}
    >
      {isVideo ? (
        <div className="relative w-full h-full">
          <video
            src={photo.url}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            muted
            loop
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
          {/* 再生アイコン */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 sm:p-4">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white" />
            </div>
          </div>
        </div>
      ) : (
        <Image
          src={photo.url}
          alt={photo.file_name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      )}
      
      {/* オーバーレイ - モバイルでタップ、デスクトップでホバー */}
      <div className={`
        absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-200
        ${showActions ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}
      `}>
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
          <p className="text-white text-xs sm:text-sm font-medium truncate mb-2">
            {photo.file_name}
          </p>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="flex-1 p-2 bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg backdrop-blur-sm transition-colors touch-manipulation"
              aria-label="ダウンロード"
            >
              <Download className="w-4 h-4 text-white mx-auto" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-1 p-2 bg-red-500/80 hover:bg-red-500 active:bg-red-600 rounded-lg backdrop-blur-sm transition-colors touch-manipulation"
              aria-label="削除"
            >
              <Trash2 className="w-4 h-4 text-white mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

