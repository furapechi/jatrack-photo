'use client';

import { useState, useEffect, useRef } from 'react';
import { FolderPlus, Upload, Images, Home as HomeIcon, ChevronRight } from 'lucide-react';
import FolderCard from '@/components/FolderCard';
import PhotoCard from '@/components/PhotoCard';
import CreateFolderModal from '@/components/CreateFolderModal';

interface Folder {
  id: string;
  name: string;
  parent_id?: string | null;
  photos: { count: number }[];
}

interface Photo {
  id: string;
  file_name: string;
  url: string;
  created_at: string;
  mime_type?: string;
}

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'ホーム' }]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // フォルダー一覧を取得
  const fetchFolders = async (parentId: string | null = null) => {
    try {
      const url = parentId 
        ? `/api/folders?parentId=${parentId}` 
        : '/api/folders?parentId=null';
      const response = await fetch(url);
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
    fetchFolders(currentFolderId);
  }, [currentFolderId]);

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
        body: JSON.stringify({ 
          name,
          parentId: currentFolderId 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        await fetchFolders(currentFolderId);
        setIsModalOpen(false);
      } else {
        console.error('Failed to create folder:', data);
        alert(`フォルダーの作成に失敗しました: ${data.details || data.error}`);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('フォルダーの作成中にエラーが発生しました');
    }
  };

  // フォルダーを開く
  const handleOpenFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    setSelectedFolder(null);
  };

  // パンくずリストでナビゲーション
  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
    setSelectedFolder(null);
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
        await fetchFolders(currentFolderId);
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
      await fetchFolders(currentFolderId); // カウント更新のため
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
      await fetchFolders(currentFolderId); // カウント更新のため
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* ヘッダー - モバイル最適化 */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex-shrink-0">
                <Images className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  Photo Manager
                </h1>
                <p className="hidden sm:block text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  写真を整理して管理
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 active:scale-95 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap flex-shrink-0"
            >
              <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">新しいフォルダー</span>
              <span className="sm:hidden">追加</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        {/* パンくずリスト */}
        <nav className="flex items-center gap-2 mb-4 px-1 overflow-x-auto pb-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id || 'home'} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`
                  flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-sm sm:text-base font-medium transition-colors
                  ${index === breadcrumbs.length - 1
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {index === 0 && <HomeIcon className="w-4 h-4" />}
                <span className="whitespace-nowrap">{crumb.name}</span>
              </button>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </nav>

        {/* フォルダー一覧 */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 px-1">
            フォルダー
          </h2>
          {folders.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 mx-1">
              <FolderPlus className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                フォルダーを作成して写真を整理しましょう
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  isSelected={selectedFolder === folder.id}
                  onSelect={() => setSelectedFolder(folder.id)}
                  onOpen={() => handleOpenFolder(folder)}
                  onDelete={() => handleDeleteFolder(folder.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 写真一覧 */}
        {selectedFolder && (
          <section>
            <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                メディア ({photos.length}件)
              </h2>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className={`
                    flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl font-medium 
                    hover:bg-green-600 active:scale-95 transition-all cursor-pointer shadow-lg hover:shadow-xl text-sm sm:text-base
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{isUploading ? 'アップロード中...' : '写真・動画をアップロード'}</span>
                  <span className="sm:hidden">{isUploading ? '...' : 'アップロード'}</span>
                </label>
              </div>
            </div>

            {photos.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 mx-1">
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                  写真や動画をアップロードしてください
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
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

