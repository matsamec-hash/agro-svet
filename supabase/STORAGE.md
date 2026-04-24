# Supabase Storage

## bazar-images bucket

Public bucket. 5 images per listing. See bazar spec.

## contest-photos bucket (fotosoutez)

Public bucket created 2026-04-22 via Supabase dashboard.

- **Public**: yes (any anon read)
- **File size limit**: 20 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/heic, image/heif`
- **Path pattern**: `{user_id}/{round_slug}/{entry_id}.{ext}`

### Policies

- `contest_storage_upload` — INSERT, role `authenticated`, WITH CHECK `bucket_id = 'contest-photos'`
- `contest_storage_read` — SELECT, roles `anon, authenticated`, USING `bucket_id = 'contest-photos'`
- `contest_storage_delete` — DELETE, role `authenticated`, USING:
  ```sql
  bucket_id = 'contest-photos' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (SELECT 1 FROM bazar_users WHERE id = auth.uid() AND is_admin = true)
  )
  ```
