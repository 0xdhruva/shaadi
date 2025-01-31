const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

if (!API_KEY) {
  throw new Error('YouTube API key is not configured. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to your environment variables.');
}

export interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
        query + ' song'
      )}&key=${API_KEY}&maxResults=5&videoCategoryId=10`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: decodeHtmlEntities(item.snippet.title),
      thumbnail: item.snippet.thumbnails.default.url,
      channelTitle: decodeHtmlEntities(item.snippet.channelTitle)
    }));
  } catch (error) {
    console.error('Error fetching from YouTube:', error);
    throw error;
  }
}

