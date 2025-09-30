import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    console.log('Fetching folders - Parent ID:', parentId);

    const supabase = await createClient();
    
    let query = supabase
      .from('folders')
      .select(`
        *,
        photos!fk_folder(count)
      `)
      .order('created_at', { ascending: false });

    // 親フォルダーIDでフィルタリング（nullの場合はルートフォルダーのみ）
    if (parentId === 'null' || !parentId) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', parentId);
    }

    const { data: folders, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(folders);
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
    const folderData: any = { name: name.trim() };
    
    if (parentId && parentId !== 'null') {
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

