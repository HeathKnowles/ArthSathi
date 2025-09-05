import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = path.join(__dirname, 'pdfs');

const files = fs.readdirSync(PDF_DIR);

console.log('Checking files in backend/pdfs...');

files.forEach(file => {
  const filePath = path.join(PDF_DIR, file);
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      console.log(`NOT A FILE: ${file}`);
      return;
    }
    if (stat.size < 1024) {
      console.log(`WARNING: Very small file (possible shortcut or broken): ${file}`);
    }
    // Try to open and read a small chunk
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(4);
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    console.log(`OK: ${file}`);
  } catch (err) {
    console.log(`BROKEN OR INACCESSIBLE: ${file} (${err.message})`);
  }
});
