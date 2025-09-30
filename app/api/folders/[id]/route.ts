import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // フォルダー内の写真を取得
    const { data: photos } = await supabase
      .from('photos')
      .select('file_path')
      .eq('folder_id', id);

    // ストレージから写真を削除
    if (photos && photos.length > 0) {
      const filePaths = photos.map(photo => photo.file_path);
      await supabase.storage.from('photos').remove(filePaths);
    }

    // フォルダーを削除（写真はCASCADEで自動削除）
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}

