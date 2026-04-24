import { describe, expect, it } from 'vitest';
import {
  buildStoragePath,
  extractDimensions,
  hasExifMarker,
  validateUpload,
} from '../../src/lib/contest-images';

// PNG: signature + IHDR with width=200, height=100
function makePng(width = 200, height = 100): Uint8Array {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const ihdrLen = [0, 0, 0, 13];
  const ihdrType = [0x49, 0x48, 0x44, 0x52];
  const w = [(width >>> 24) & 0xff, (width >>> 16) & 0xff, (width >>> 8) & 0xff, width & 0xff];
  const h = [(height >>> 24) & 0xff, (height >>> 16) & 0xff, (height >>> 8) & 0xff, height & 0xff];
  return new Uint8Array([...sig, ...ihdrLen, ...ihdrType, ...w, ...h, 8, 2, 0, 0, 0]);
}

// Minimal JPEG: SOI + APP1(Exif) + SOF0 with width=640, height=480
function makeJpeg(opts: { withExif?: boolean; width?: number; height?: number } = {}): Uint8Array {
  const { withExif = false, width = 640, height = 480 } = opts;
  const out: number[] = [0xff, 0xd8]; // SOI
  if (withExif) {
    // APP1 marker, length=10, "Exif\0\0" + 2 dummy bytes
    out.push(0xff, 0xe1, 0x00, 0x0a, 0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0x00, 0x00);
  }
  // SOF0: marker, length=17, precision=8, height (2B), width (2B), components=3, ...
  out.push(0xff, 0xc0, 0x00, 0x11, 0x08);
  out.push((height >> 8) & 0xff, height & 0xff);
  out.push((width >> 8) & 0xff, width & 0xff);
  out.push(0x03); // 3 components
  // components data padding (3 components × 3 bytes)
  for (let i = 0; i < 9; i++) out.push(0x00);
  return new Uint8Array(out);
}

function asFile(bytes: Uint8Array, mime: string, name = 'test.bin', size?: number): File {
  return new File([bytes], name, { type: mime, lastModified: 0, ...(size ? { size } : {}) });
}

describe('extractDimensions', () => {
  it('parses PNG IHDR', () => {
    const png = makePng(800, 600);
    expect(extractDimensions(png, 'image/png')).toEqual({ width: 800, height: 600 });
  });

  it('returns null for truncated PNG', () => {
    expect(extractDimensions(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), 'image/png')).toBeNull();
  });

  it('parses JPEG SOF0', () => {
    expect(extractDimensions(makeJpeg({ width: 1200, height: 900 }), 'image/jpeg')).toEqual({
      width: 1200,
      height: 900,
    });
  });

  it('parses JPEG with EXIF segment before SOF0', () => {
    expect(extractDimensions(makeJpeg({ withExif: true, width: 640, height: 480 }), 'image/jpeg')).toEqual({
      width: 640,
      height: 480,
    });
  });

  it('returns null for JPEG without SOI marker', () => {
    expect(extractDimensions(new Uint8Array([0x00, 0x00, 0xff, 0xc0]), 'image/jpeg')).toBeNull();
  });

  it('returns 0/0 for unknown mime (webp/heic accepted as-is)', () => {
    expect(extractDimensions(new Uint8Array([0]), 'image/webp')).toEqual({ width: 0, height: 0 });
  });
});

describe('hasExifMarker', () => {
  it('detects EXIF in JPEG', () => {
    expect(hasExifMarker(makeJpeg({ withExif: true }), 'image/jpeg')).toBe(true);
  });
  it('returns false when JPEG has no EXIF', () => {
    expect(hasExifMarker(makeJpeg({ withExif: false }), 'image/jpeg')).toBe(false);
  });
  it('returns false for PNG (no EXIF concept here)', () => {
    expect(hasExifMarker(makePng(), 'image/png')).toBe(false);
  });
});

describe('buildStoragePath', () => {
  it('uses jpg extension for JPEG', () => {
    expect(buildStoragePath('user-1', '2026-05', 'entry-9', 'image/jpeg')).toBe('user-1/2026-05/entry-9.jpg');
  });
  it('uses png for PNG', () => {
    expect(buildStoragePath('u', 'r', 'e', 'image/png')).toBe('u/r/e.png');
  });
  it('uses webp/heic/heif for those mimes', () => {
    expect(buildStoragePath('u', 'r', 'e', 'image/webp')).toBe('u/r/e.webp');
    expect(buildStoragePath('u', 'r', 'e', 'image/heic')).toBe('u/r/e.heic');
    expect(buildStoragePath('u', 'r', 'e', 'image/heif')).toBe('u/r/e.heif');
  });
});

describe('validateUpload', () => {
  it('rejects too large files', async () => {
    // Allocate a buffer with size > 20 MB without actually filling it
    const big = new File([new Uint8Array(21 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    expect(await validateUpload(big)).toEqual({ ok: false, reason: 'too_big' });
  });

  it('rejects unsupported mime', async () => {
    expect(await validateUpload(asFile(new Uint8Array([0]), 'application/pdf'))).toEqual({
      ok: false,
      reason: 'wrong_mime',
    });
  });

  it('rejects corrupt PNG (too short)', async () => {
    expect(await validateUpload(asFile(new Uint8Array([0x89, 0x50, 0x4e]), 'image/png'))).toEqual({
      ok: false,
      reason: 'corrupt',
    });
  });

  it('accepts valid JPEG and reports dims + EXIF', async () => {
    const result = await validateUpload(asFile(makeJpeg({ withExif: true, width: 1024, height: 768 }), 'image/jpeg'));
    expect(result).toMatchObject({ ok: true, width: 1024, height: 768, mime: 'image/jpeg', has_exif: true });
  });

  it('accepts valid PNG', async () => {
    const result = await validateUpload(asFile(makePng(500, 400), 'image/png'));
    expect(result).toMatchObject({ ok: true, width: 500, height: 400, mime: 'image/png', has_exif: false });
  });
});
