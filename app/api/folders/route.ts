import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching folders - Environment check:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    const supabase = await createClient();
    const { data: folders, error } = await supabase
      .from('folders')
      .select(`
        *,
        photos(count)
      `)
      .order('created_at', { ascending: false });

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
    const { name } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    console.log('Creating folder:', name);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('folders')
      .insert([{ name: name.trim() }])
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

