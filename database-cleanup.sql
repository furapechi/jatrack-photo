-- 既存のポリシーとテーブルをクリーンアップ
-- ⚠️ 注意: これはすべてのデータを削除します

-- ポリシーの削除
DROP POLICY IF EXISTS "Allow all access to folders" ON folders;
DROP POLICY IF EXISTS "Allow all access to photos" ON photos;
DROP POLICY IF EXISTS "Allow all access to photos bucket" ON storage.objects;

-- テーブルの削除（CASCADE で関連データも削除）
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS folders CASCADE;

-- トリガーと関数の削除
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
DROP FUNCTION IF EXISTS update_updated_at_column();

