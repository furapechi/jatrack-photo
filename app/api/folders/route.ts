import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    console.log('Fetching folders - Parent ID:', parentId);

    const supabase = await createClient();
    
    // まず、parent_idカラムが存在するか確認するため、全フォルダーを取得
    const { data: folders, error } = await supabase
      .from('folders')
      .select(`
        *,
        photos!fk_folder(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // parent_idカラムが存在する場合のみフィルタリング
    if (folders && folders.length > 0 && 'parent_id' in folders[0]) {
      // 親フォルダーIDでフィルタリング
      const filteredFolders = folders.filter(folder => {
        if (parentId === 'null' || !parentId) {
          return folder.parent_id === null || folder.parent_id === undefined;
        } else {
          return folder.parent_id === parentId;
        }
      });
      return NextResponse.json(filteredFolders);
    }

    // parent_idカラムが存在しない場合（マイグレーション前）は全フォルダーを返す
    return NextResponse.json(folders || []);
  } catch (error: any) {
    console.error('Error fetching folders:', error?.message || error);
    return NextResponse.json({ 
      error: 'Failed to fetch folders',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, parentId } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    console.log('Creating folder:', name, 'Parent ID:', parentId);

    const supabase = await createClient();
    
    // まず、parent_idカラムが存在するか確認
    const { data: testFolder } = await supabase
      .from('folders')
      .select('*')
      .limit(1)
      .single();

    const folderData: any = { name: name.trim() };
    
    // parent_idカラムが存在し、かつparentIdが指定されている場合のみ追加
    if (testFolder && 'parent_id' in testFolder && parentId && parentId !== 'null') {
      folderData.parent_id = parentId;
    }

    const { data, error } = await supabase
      .from('folders')
      .insert([folderData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating folder:', error);
      throw error;
    }

    console.log('Folder created successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating folder:', error?.message || error);
    return NextResponse.json({ 
      error: 'Failed to create folder',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

