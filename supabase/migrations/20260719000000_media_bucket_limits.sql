begin;

-- Gallery photo uploads now go directly from the browser to Storage via signed
-- upload URLs, so the app server never inspects the actual file bytes. Enforce
-- type/size at the bucket level instead, matching what uploadAlbumPhotos used
-- to check server-side.
update storage.buckets
set file_size_limit = 8000000,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'media';

commit;
