# Supabase Storage設定ガイド - 大容量動画対応

## 📦 ストレージバケットの設定

### 1. Supabase Dashboardでの設定

1. **https://supabase.com/dashboard** にアクセス
2. プロジェクトを選択
3. **Storage** → **photos** バケットを選択
4. 右上の **Settings** (歯車アイコン) をクリック

### 2. ファイルサイズ制限の設定

**File size limit** を以下のように設定：

```
Max file size: 500 MB
```

大容量動画をアップロードする場合は、さらに大きくすることも可能です：
- 1GB = 1024 MB
- 2GB = 2048 MB

### 3. 許可するMIMEタイプ

**Allowed MIME types** に以下を追加（既にある場合はスキップ）：

```
image/*
video/*
video/mp4
video/quicktime
video/x-msvideo
video/x-matroska
video/webm
```

### 4. SQLでのポリシー確認

既存のストレージポリシーを確認：

```sql
-- ストレージのポリシーを確認
SELECT * FROM storage.objects WHERE bucket_id = 'photos';

-- 必要に応じてポリシーを再作成
DROP POLICY IF EXISTS "Allow all access to photos bucket" ON storage.objects;

CREATE POLICY "Allow all access to photos bucket" 
ON storage.objects
FOR ALL 
USING (bucket_id = 'photos') 
WITH CHECK (bucket_id = 'photos');
```

## 🎥 対応動画形式

以下の動画フォーマットに対応しています：

- **MP4** (.mp4) - 推奨
- **MOV** (.mov) - iPhone/Macで一般的
- **WebM** (.webm) - Web最適化
- **MKV** (.mkv) - 高品質
- **AVI** (.avi) - 従来形式

## ⚡ パフォーマンス最適化

### 推奨される動画設定

- **解像度**: 1080p (1920x1080) 以下
- **ビットレート**: 5-10 Mbps
- **コーデック**: H.264 (MP4)
- **ファイルサイズ**: 500MB以下推奨

### 大容量ファイルの注意点

1. **アップロード時間**: 500MBのファイルは数分かかる場合があります
2. **ネットワーク**: 安定したインターネット接続が必要
3. **モバイル**: Wi-Fi接続を推奨

## 🔒 セキュリティ設定

### 本番環境での推奨設定

現在は誰でもアクセス可能な設定ですが、本番環境では認証を追加することを推奨：

```sql
-- 認証されたユーザーのみアクセス可能に変更
DROP POLICY IF EXISTS "Allow all access to photos bucket" ON storage.objects;

CREATE POLICY "Authenticated users can upload" 
ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Authenticated users can view" 
ON storage.objects
FOR SELECT 
TO authenticated
USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can delete" 
ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'photos');
```

## 📊 ストレージ容量の確認

Supabase Freeプランの制限：
- **ストレージ**: 1GB
- **帯域幅**: 2GB/月

容量を確認：
1. Supabase Dashboard → **Settings** → **Usage**
2. Storage使用量を確認

## 🚀 アップグレード

より大きなファイルや容量が必要な場合：
1. Supabase Dashboard → **Settings** → **Billing**
2. **Pro Plan** ($25/月) にアップグレード
   - ストレージ: 100GB
   - 帯域幅: 200GB/月

