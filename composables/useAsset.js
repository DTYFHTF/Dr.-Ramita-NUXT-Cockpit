export function useAsset(id, isImage = false) {
  const baseUrl = 'http://localhost:9000/api/assets';
  const headers = {
    Authorization: 'API-339c8918fd2c4c50066d54e630d95c92bced36af',
  };
  const endpoint = isImage ? `${baseUrl}/image/${id}` : `${baseUrl}/${id}`;

  return useFetch(endpoint, { headers });
}