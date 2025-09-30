-- フォルダー階層構造とPDF対応のためのマイグレーション
-- Supabase SQLエディタで実行してください

-- 1. フォルダーテーブルに親フォルダーIDカラムを追加
ALTER TABLE folders 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES folders(id) ON DELETE CASCADE;

-- 2. 親フォルダーIDのインデックスを作成
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);

-- 3. パスを効率的に取得するための再帰クエリ用のインデックス
CREATE INDEX IF NOT EXISTS idx_folders_id_parent_id ON folders(id, parent_id);

-- 4. フォルダーの深さを取得する関数（オプション）
CREATE OR REPLACE FUNCTION get_folder_path(folder_id UUID)
RETURNS TEXT AS $$
DECLARE
  folder_path TEXT := '';
  current_id UUID := folder_id;
  current_name TEXT;
  parent_id_var UUID;
BEGIN
  WHILE current_id IS NOT NULL LOOP
    SELECT name, parent_id INTO current_name, parent_id_var
    FROM folders
    WHERE id = current_id;
    
    IF folder_path = '' THEN
      folder_path := current_name;
    ELSE
      folder_path := current_name || ' / ' || folder_path;
    END IF;
    
    current_id := parent_id_var;
  END LOOP;
  
  RETURN folder_path;
END;
$$ LANGUAGE plpgsql;

-- 5. サブフォルダーを含むフォルダー削除のトリガー（既にCASCADEで対応済み）

-- 6. 確認用クエリ
-- テーブル構造の確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'folders'
ORDER BY ordinal_position;

-- 既存データの確認
SELECT id, name, parent_id, created_at FROM folders;

