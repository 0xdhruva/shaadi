import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob';
import { PutBlobResult } from '@vercel/blob';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('BLOB_READ_WRITE_TOKEN is not set')
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const chunk = formData.get('video') as File
    const name = formData.get('name') as string
    const chunkIndex = parseInt(formData.get('chunkIndex') as string)
    const totalChunks = parseInt(formData.get('totalChunks') as string)
    const mimeType = formData.get('mimeType') as string
    const uniqueSuffix = formData.get('uniqueSuffix') as string

    console.log(`Received chunk ${chunkIndex + 1}/${totalChunks} for ${name}`)

    if (!chunk) {
      console.error('No video chunk uploaded')
      return NextResponse.json({ error: 'No video chunk uploaded' }, { status: 400 })
    }

    if (!name || !uniqueSuffix) {
      console.error('Name and uniqueSuffix are required')
      return NextResponse.json({ error: 'Name and uniqueSuffix are required' }, { status: 400 })
    }

    const filename = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${uniqueSuffix}-chunk-${chunkIndex}.webm`

    console.log('Uploading chunk:', {
      filename,
      contentType: mimeType,
      chunkSize: chunk.size,
      totalChunks,
      currentChunk: chunkIndex + 1
    })

    let blob: PutBlobResult;
    try {
      blob = await put(filename, chunk, {
        access: 'public',
        contentType: mimeType,
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      console.log('Blob upload successful:', blob.url)
    } catch (blobError) {
      console.error('Error uploading to Vercel Blob:', blobError);
      return NextResponse.json({ 
        error: 'Blob storage error', 
        details: `Failed to upload to Blob storage. Error: ${blobError instanceof Error ? blobError.message : 'Unknown error'}` 
      }, { status: 500 });
    }

    console.log(`Chunk ${chunkIndex + 1}/${totalChunks} uploaded to ${blob.url}`)

    return NextResponse.json({ 
      message: 'Chunk uploaded successfully', 
      chunkIndex: chunkIndex,
      blobUrl: blob.url
    })
  } catch (error) {
    console.error('Error in upload-wish API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

