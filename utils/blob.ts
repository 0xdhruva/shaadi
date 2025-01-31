import { put, del } from '@vercel/blob';

export async function uploadToBlob(file: File, filename: string) {
  const { url } = await put(filename, file, { access: 'public' });
  return url;
}

export async function deleteFromBlob(url: string) {
  await del(url);
}

