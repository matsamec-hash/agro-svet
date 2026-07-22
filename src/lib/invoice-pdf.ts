// PDF faktura pro NEPLÁTCE DPH (Samec Digital s.r.o., IČO 29547539).
// pdf-lib + vložený DejaVu font (base64) kvůli české diakritice.
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { DEJAVU_SANS_B64 } from './assets/font-dejavu';

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  planLabel: string;
  days: number;
  amountCzk: number;
  vs: number;
  buyerName?: string | null;
  buyerIco?: string | null;
  buyerAddress?: string | null;
  buyerEmail: string;
}

const SELLER = {
  name: 'Samec Digital s.r.o.',
  ico: '29547539',
  note: 'Zapsáno v obchodním rejstříku. Nejsme plátci DPH.',
};

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function buildInvoicePdf(d: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(b64ToBytes(DEJAVU_SANS_B64), { subset: true });
  const page = doc.addPage([595, 842]);
  const black = rgb(0.1, 0.1, 0.1);
  let y = 800;
  const line = (text: string, size = 11, dy = 18) => {
    page.drawText(text, { x: 50, y, size, font, color: black });
    y -= dy;
  };
  const dateCz = (dt: Date) => dt.toLocaleDateString('cs-CZ');

  line(`Faktura č. ${d.invoiceNumber}`, 18, 30);
  line(`Dodavatel: ${SELLER.name}, IČO: ${SELLER.ico}`);
  line(SELLER.note, 9, 22);
  line('Odběratel:', 11, 16);
  line(d.buyerName || d.buyerEmail, 11, 16);
  if (d.buyerIco) line(`IČO: ${d.buyerIco}`, 11, 16);
  if (d.buyerAddress) line(d.buyerAddress, 11, 22);
  line(`Datum vystavení / DUZP: ${dateCz(d.issueDate)}`);
  line(`Variabilní symbol: ${d.vs}`, 11, 26);
  line(`Položka: Topování inzerátu – ${d.days} dní (${d.planLabel})`, 12, 20);
  line(`Cena celkem: ${d.amountCzk} Kč`, 14, 26);
  line('Nejsme plátci DPH.', 10, 16);

  return doc.save();
}
