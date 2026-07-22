// SPAYD string → QR kód jako data-URI (PNG). Renderuje se do <img> na platební stránce.
import QRCode from 'qrcode';
export async function spaydToQrDataUri(spayd: string): Promise<string> {
  return QRCode.toDataURL(spayd, { errorCorrectionLevel: 'M', margin: 1, width: 320 });
}
