
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.join(__dirname, 'pdfs');
const CHUNK_SIZE = 500;
const OUTPUT_PATH = path.join(__dirname, 'embeddings.json');

async function chunkText(text: string, chunkSize: number): Promise<string[]> {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await axios.post(
      'http://localhost:11434/api/embeddings',
      {
        model: 'mxbai-embed-large',
        prompt: text,
      }
    );
    return response.data.embedding;
  } catch (err) {
    console.error('Embedding error for chunk:', err);
    return [];
  }
}

async function indexPDFs() {
  const files = fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
  const allChunks: any[] = [];
  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        console.warn(`Not a regular file, skipping: ${filePath}`);
        continue;
      }
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found, skipping: ${filePath}`);
        continue;
      }
      let data;
      try {
        data = fs.readFileSync(filePath);
      } catch (readErr) {
        console.warn(`Cannot read file, skipping: ${filePath}`);
        continue;
      }
      const pdfData = await pdfParse(data);
      const chunks = await chunkText(pdfData.text, CHUNK_SIZE);
      if (chunks.length === 0) {
        console.warn(`No text found in: ${file}`);
        continue;
      }
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await getEmbedding(chunk);
        allChunks.push({
          chunk,
          embedding,
          metadata: { source: file, chunk: i }
        });
        console.log(`Indexed chunk ${i + 1}/${chunks.length} from ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allChunks, null, 2));
  console.log(`Indexing complete. Saved to ${OUTPUT_PATH}`);
}

indexPDFs().catch(console.error);
