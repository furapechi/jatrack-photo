import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 署名付きURLを生成
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => {
        const { data } = await supabase.storage
          .from('photos')
          .createSignedUrl(photo.file_path, 3600); // 1時間有効

        return {
          ...photo,
          url: data?.signedUrl || '',
        };
      })
    );

    return NextResponse.json(photosWithUrls);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string;

    if (!file || !folderId) {
      return NextResponse.json({ error: 'File and folder ID are required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // ファイル名をユニークにする
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folderId}/${fileName}`;

    // ストレージにアップロード
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // データベースに記録
    const { data, error: dbError } = await supabase
      .from('photos')
      .insert([{
        folder_id: folderId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

