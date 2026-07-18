const PROFILE_PICTURE_PREFIX = '/storage/v1/object/public/profile_pictures/';

export type ProfileImageMime = 'image/jpeg' | 'image/png' | 'image/webp';

export function hasValidImageSignature(bytes: Uint8Array, mime: ProfileImageMime): boolean {
  if (mime === 'image/jpeg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mime === 'image/png') {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= png.length && png.every((byte, index) => bytes[index] === byte);
  }

  return (
    bytes.length >= 12 &&
    String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'RIFF' &&
    String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]) === 'WEBP'
  );
}

export function profilePicturePathFromPublicUrl(
  publicUrl: string | null,
  supabaseUrl: string,
  userId: string,
): string | null {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const supabaseOrigin = new URL(supabaseUrl).origin;
    if (url.origin !== supabaseOrigin || !url.pathname.startsWith(PROFILE_PICTURE_PREFIX)) {
      return null;
    }

    const path = decodeURIComponent(url.pathname.slice(PROFILE_PICTURE_PREFIX.length));
    return path.startsWith(`${userId}/`) && !path.includes('..') ? path : null;
  } catch {
    return null;
  }
}
