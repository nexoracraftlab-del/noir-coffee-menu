import QRCode from 'qrcode';
import { mkdir } from 'node:fs/promises';
const input = process.argv[2];
if (!input) { console.error('Usage: pnpm qr https://YOUR-PUBLISHED-URL/'); process.exit(1); }
let url;
try { url = new URL(input); } catch { console.error('Provide a valid absolute URL.'); process.exit(1); }
if (url.protocol !== 'https:' && url.protocol !== 'http:') { console.error('Only HTTP(S) menu URLs are supported.'); process.exit(1); }
await mkdir('docs', { recursive: true });
const options = { errorCorrectionLevel: 'M', margin: 4, width: 1200, color: { dark: '#211B18', light: '#FFFFFF' } };
await QRCode.toFile('docs/qr.svg', url.href, { ...options, type: 'svg' });
await QRCode.toFile('docs/qr.png', url.href, options);
console.log(`QR generated for ${url.href} in docs/qr.svg and docs/qr.png. Test on a real phone before printing.`);
