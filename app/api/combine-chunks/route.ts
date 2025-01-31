import { NextRequest, NextResponse } from 'next/server'
import { put, list, del } from '@vercel/blob';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('BLOB_READ_WRITE_TOKEN is not set')
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, uniqueSuffix, totalChunks } = await request.json()

    if (!name || !uniqueSuffix || !totalChunks) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const prefix = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${uniqueSuffix}`
    const { blobs } = await list({ prefix, token: process.env.BLOB_READ_WRITE_TOKEN })

    if (blobs.length !== totalChunks) {
      return NextResponse.json({ error: 'Mismatch in chunk count' }, { status: 400 })
    }

    // Sort chunks by their index
    blobs.sort((a, b) => {
      const indexA = parseInt(a.pathname.split('-chunk-')[1])
      const indexB = parseInt(b.pathname.split('-chunk-')[1])
      return indexA - indexB
    })

    // Combine chunks
    const chunks = await Promise.all(blobs.map(blob => fetch(blob.url).then(res => res.arrayBuffer())))
    const combinedBlob = new Blob(chunks, { type: 'video/mp4' })

    // Upload combined video
    const finalFilename = `${prefix}.mp4`
    const { url } = await put(finalFilename, combinedBlob, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    })

    // Delete individual chunks
    await Promise.all(blobs.map(blob => del(blob.url, { token: process.env.BLOB_READ_WRITE_TOKEN })))

    return NextResponse.json({ videoUrl: url })
  } catch (error) {
    console.error('Error combining chunks:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

