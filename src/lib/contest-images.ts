import { CONTEST_CONFIG } from './contest-config';

export interface UploadedImageMeta {
  ok: true;
  width: number;
  height: number;
  bytes: number;
  mime: string;
  has_exif: boolean;
}

export interface UploadRejection {
  ok: false;
  reason: 'too_big' | 'wrong_mime' | 'corrupt';
}

export type UploadValidation = UploadedImageMeta | UploadRejection;

/**
 * Minimal validator for an uploaded image File/Blob.
 * Reads first bytes to sniff size + EXIF presence. Server-side resize
 * is deferred to Phase 2 (clients already upload reasonable sizes).
 */
export async function validateUpload(file: File): Promise<UploadValidation> {
  if (file.size > CONTEST_CONFIG.MAX_UPLOAD_BYTES) {
    return { ok: false, reason: 'too_big' };
  }
  if (!CONTEST_CONFIG.ACCEPTED_MIME.includes(file.type)) {
    return { ok: false, reason: 'wrong_mime' };
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const dims = extractDimensions(bytes, file.type);
  if (!dims) {
    return { ok: false, reason: 'corrupt' };
  }

  return {
    ok: true,
    width: dims.width,
    height: dims.height,
    bytes: file.size,
    mime: file.type,
    has_exif: hasExifMarker(bytes, file.type),
  };
}

export function extractDimensions(
  bytes: Uint8Array,
  mime: string,
): { width: number; height: number } | null {
  // PNG: IHDR @ offset 16 (8-byte signature + 4 chunk length + 4 chunk type)
  if (mime === 'image/png') {
    if (bytes.length < 24) return null;
    const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
    const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
    return { width, height };
  }
  // JPEG: walk segments until SOF0..SOF3 (0xFFC0..0xFFC3)
  if (mime === 'image/jpeg') {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
    let i = 2;
    while (i < bytes.length - 8) {
      if (bytes[i] !== 0xff) return null;
      const marker = bytes[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        const height = (bytes[i + 5] << 8) | bytes[i + 6];
        const width = (bytes[i + 7] << 8) | bytes[i + 8];
        return { width, height };
      }
      const segLen = (bytes[i + 2] << 8) | bytes[i + 3];
      if (segLen < 2) return null;
      i += 2 + segLen;
    }
    return null;
  }
  // WebP / HEIC / HEIF: skip detection for MVP, accept as-is
  return { width: 0, height: 0 };
}

export function hasExifMarker(bytes: Uint8Array, mime: string): boolean {
  if (mime !== 'image/jpeg') return false;
  // Look for APP1 segment with "Exif\0" signature in first 2 KB
  const limit = Math.min(bytes.length - 6, 2048);
  for (let i = 2; i < limit; i++) {
    if (
      bytes[i] === 0xff && bytes[i + 1] === 0xe1 &&
      bytes[i + 4] === 0x45 && bytes[i + 5] === 0x78 && bytes[i + 6] === 0x69
    ) {
      return true;
    }
  }
  return false;
}

/** Build a storage path following the agreed pattern. */
export function buildStoragePath(
  userId: string,
  roundSlug: string,
  entryId: string,
  mime: string,
): string {
  const ext =
    mime === 'image/png'  ? 'png'  :
    mime === 'image/webp' ? 'webp' :
    mime === 'image/heic' ? 'heic' :
    mime === 'image/heif' ? 'heif' :
                            'jpg';
  return `${userId}/${roundSlug}/${entryId}.${ext}`;
}
