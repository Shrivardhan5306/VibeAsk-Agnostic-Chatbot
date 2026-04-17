import { Router } from 'express'
import multer from 'multer'
import { Storage } from '../db/storage.js'

export const ragRouter = Router()

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

/**
 * POST /api/rag/upload
 * Upload a PDF for RAG ingestion
 */
ragRouter.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    // For MVP: simple text extraction (pdf-parse)
    let textContent = ''
    try {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(req.file.buffer)
      textContent = data.text
    } catch {
      textContent = 'PDF parsing unavailable. Install pdf-parse for full RAG support.'
    }

    // Chunk the text into segments
    const chunks = chunkText(textContent, 500)

    const docId = `doc_${Date.now()}`
    const document = {
      id: docId,
      name: req.file.originalname,
      chunks: chunks.map((chunk, i) => ({
        id: `${docId}_chunk_${i}`,
        text: chunk,
        metadata: { source: req.file.originalname, chunkIndex: i },
      })),
      uploadedAt: new Date().toISOString(),
    }

    await Storage.addDocument(document)

    res.json({
      id: docId,
      name: req.file.originalname,
      chunks: chunks.length,
      message: `Document processed: ${chunks.length} chunks extracted`,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to process document', message: err.message })
  }
})

/**
 * POST /api/rag/search
 * Search uploaded documents for relevant content
 */
ragRouter.post('/search', async (req, res) => {
  try {
    const { query, limit = 3 } = req.body

    if (!query) {
      return res.status(400).json({ error: 'No search query provided' })
    }

    const documentStore = await Storage.getAllDocuments()

    // Simple keyword-based search (replace with vector similarity in production)
    const queryWords = query.toLowerCase().split(/\s+/)
    const results = []

    for (const doc of documentStore) {
      for (const chunk of doc.chunks) {
        const chunkLower = chunk.text.toLowerCase()
        const score = queryWords.reduce((s, word) => s + (chunkLower.includes(word) ? 1 : 0), 0)
        if (score > 0) {
          results.push({ ...chunk, score, source: doc.name })
        }
      }
    }

    results.sort((a, b) => b.score - a.score)

    res.json({
      results: results.slice(0, limit),
      totalDocuments: documentStore.length,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to search documents' })
  }
})

/**
 * GET /api/rag/documents
 * List all uploaded documents
 */
ragRouter.get('/documents', async (req, res) => {
  try {
    const documentStore = await Storage.getAllDocuments()
    res.json({
      documents: documentStore.map(d => ({
        id: d.id,
        name: d.name,
        chunks: d.chunks ? d.chunks.length : 0,
        uploadedAt: d.uploadedAt,
      })),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to list documents' })
  }
})

// ===== Helpers =====

function chunkText(text, chunkSize = 500) {
  const sentences = text.split(/[.!?]+/)
  const chunks = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + sentence).length > chunkSize && current) {
      chunks.push(current.trim())
      current = ''
    }
    current += sentence + '. '
  }

  if (current.trim()) chunks.push(current.trim())
  return chunks
}
