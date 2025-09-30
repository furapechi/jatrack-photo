'use client';

import { useState, useEffect, useRef } from 'react';
import { FolderPlus, Upload, Images } from 'lucide-react';
import FolderCard from '@/components/FolderCard';
import PhotoCard from '@/components/PhotoCard';
import CreateFolderModal from '@/components/CreateFolderModal';

interface Folder {
  id: string;
  name: string;
  photos: { count: number }[];
}

interface Photo {
  id: string;
  file_name: string;
  url: string;
  created_at: string;
}

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // フォルダー一覧を取得
  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/folders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFolders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setFolders([]);
    }
  };

  // 写真一覧を取得
  const fetchPhotos = async (folderId: string) => {
    try {
      const response = await fetch(`/api/photos?folderId=${folderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchPhotos(selectedFolder);
    } else {
      setPhotos([]);
    }
  }, [selectedFolder]);

  // フォルダー作成
  const handleCreateFolder = async (name: string) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      
      if (response.ok) {
        await fetchFolders();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  // フォルダー削除
  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('このフォルダーと中の写真をすべて削除しますか？')) return;

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (selectedFolder === folderId) {
          setSelectedFolder(null);
        }
        await fetchFolders();
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  // 写真アップロード
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedFolder) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folderId', selectedFolder);

        await fetch('/api/photos', {
          method: 'POST',
          body: formData,
        });
      }

      await fetchPhotos(selectedFolder);
      await fetchFolders(); // カウント更新のため
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 写真削除
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('この写真を削除しますか？')) return;

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPhotos(selectedFolder!);
        await fetchFolders(); // カウント更新のため
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Images className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Photo Manager
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  写真を整理して管理
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <FolderPlus className="w-5 h-5" />
              新しいフォルダー
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フォルダー一覧 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            フォルダー
          </h2>
          {folders.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <FolderPlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                フォルダーを作成して写真を整理しましょう
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  isSelected={selectedFolder === folder.id}
                  onSelect={() => setSelectedFolder(folder.id)}
                  onDelete={() => handleDeleteFolder(folder.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 写真一覧 */}
        {selectedFolder && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                写真 ({photos.length}枚)
              </h2>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`
                    flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium 
                    hover:bg-green-600 transition-all cursor-pointer shadow-lg hover:shadow-xl
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? 'アップロード中...' : '写真をアップロード'}
                </label>
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  写真をアップロードしてください
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onDelete={() => handleDeletePhoto(photo.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* モーダル */}
      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFolder}
      />
    </main>
  );
}

