// Dynamic OG image renderer for shared contest entries.
// Returns a 1200×630 PNG via satori (SVG) + resvg-wasm (PNG rasterize).
//
// We use the WASM build of resvg because the native (@resvg/resvg-js) binary
// does not run on the Cloudflare Workers runtime. The wasm module must be
// initialised once per isolate before render() can be called — the API route
// handles that with module-scope state.
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import type { ContestEntry } from './contest-supabase';

const ACCENT = '#FFFF00';
const WIDTH = 1200;
const HEIGHT = 630;

export interface OgInput {
  photo_url: string;
  title: string;
  author: string;
  vote_count: number;
}

let wasmInitialized = false;
export async function ensureResvgWasm(wasmModule: WebAssembly.Module | ArrayBuffer): Promise<void> {
  if (wasmInitialized) return;
  await initWasm(wasmModule);
  wasmInitialized = true;
}

export async function renderContestOg(input: OgInput, fontData: ArrayBuffer): Promise<Uint8Array> {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: WIDTH,
          height: HEIGHT,
          position: 'relative',
          backgroundColor: '#000',
        },
        children: [
          {
            type: 'img',
            props: {
              src: input.photo_url,
              style: { width: '100%', height: '100%', objectFit: 'cover' },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 55%)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: 40,
                left: 40,
                right: 40,
                display: 'flex',
                flexDirection: 'column',
                color: 'white',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 56, fontWeight: 900, lineHeight: 1.1 },
                    children: input.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 28, marginTop: 8, opacity: 0.85 },
                    children: `Foto: ${input.author}`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 40, color: ACCENT, marginTop: 24, fontWeight: 700 },
                    children: `Fotosoutěž Agro-svět — ${input.vote_count} hlasů — HLASUJ!`,
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Chakra Petch', data: fontData, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
  return resvg.render().asPng();
}

export function entryToOgInput(entry: ContestEntry, photoUrl: string): OgInput {
  return {
    photo_url: photoUrl,
    title: entry.title,
    author: entry.author_display_name,
    vote_count: entry.vote_count,
  };
}
