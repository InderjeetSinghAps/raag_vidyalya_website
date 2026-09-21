export const PROTECTED_ROUTES = [
  '/profile',
  '/wallet',
  '/courses/my-courses',
  '/courses/bookmarks',
  '/courses/bookmarks/[id]',
  '/courses/[id]',
  '/courses/[id]/lecture/[videoId]',
  '/videos',
  '/videos/[id]',
  '/upload-video',
  '/store',
  '/store/[id]',
];

export let API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:3000/api/v1';
export let MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  'http://localhost:3000';
export let DEVICE_TYPE = 2;
export let IS_MOCK_AUTH = false;
export let UPLOAD_VIDEO_URL = '';
export let LIVE_AMRITSAR_KIRTAN_URL = '';
export let YOUTUBE_CHANNEL_LINK = 'https://youtube.com/@raagvidyalya';

export function setConstants(data: Record<string, unknown>) {
  if (typeof data.base_url === 'string') API_BASE_URL = data.base_url;
  if (typeof data.media_base_url === 'string')
    MEDIA_BASE_URL = data.media_base_url;
  if (typeof data.DEVICE_TYPE === 'number')
    DEVICE_TYPE = data.DEVICE_TYPE;
  if (typeof data.IS_MOCK_AUTH === 'boolean')
    IS_MOCK_AUTH = data.IS_MOCK_AUTH;
  if (typeof data.upload_video_url === 'string')
    UPLOAD_VIDEO_URL = data.upload_video_url;
  if (typeof data.live_amritsar_kirtan_url === 'string')
    LIVE_AMRITSAR_KIRTAN_URL = data.live_amritsar_kirtan_url;
  if (typeof data.youtube_channel_link === 'string')
    YOUTUBE_CHANNEL_LINK = data.youtube_channel_link;
}
