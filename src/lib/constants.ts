export let API_BASE_URL = 'http://187.127.160.207:3000/api/v1'
export let MEDIA_BASE_URL = ''
export let DEVICE_TYPE = 2
export let IS_MOCK_AUTH = false
export let UPLOAD_VIDEO_URL = ''
export let LIVE_AMRITSAR_KIRTAN_URL = ''

export function setConstants(data: Record<string, unknown>) {
  if (typeof data.base_url === 'string') API_BASE_URL = data.base_url
  if (typeof data.media_base_url === 'string') MEDIA_BASE_URL = data.media_base_url
  if (typeof data.DEVICE_TYPE === 'number') DEVICE_TYPE = data.DEVICE_TYPE
  if (typeof data.IS_MOCK_AUTH === 'boolean') IS_MOCK_AUTH = data.IS_MOCK_AUTH
  if (typeof data.upload_video_url === 'string') UPLOAD_VIDEO_URL = data.upload_video_url
  if (typeof data.live_amritsar_kirtan_url === 'string') LIVE_AMRITSAR_KIRTAN_URL = data.live_amritsar_kirtan_url
}
