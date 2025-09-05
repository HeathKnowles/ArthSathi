import { ChromaClient } from 'chromadb';

async function checkChroma() {
    const client = new ChromaClient({ host: 'localhost', port: 8000, ssl: false });  const collections = await client.listCollections();
  console.log('Collections:', collections);

  const pdfCollection = collections.find((c: any) => c.name === 'pdf_knowledge');
  if (pdfCollection) {
    const collection = await client.getCollection({ name: 'pdf_knowledge' });
    const count = await collection.count();
    console.log('pdf_knowledge document count:', count);
  } else {
    console.log('pdf_knowledge collection not found.');
  }
}

checkChroma().catch(console.error);
