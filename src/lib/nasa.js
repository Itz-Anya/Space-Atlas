const BASE = '/api/public/nasa';

async function get(path, query = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== '') params.set(k, String(v));
  }
  const qs = params.toString();
  const res = await fetch(`${BASE}/${path}${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`NASA API ${res.status}: ${res.statusText}`);
  return res.json();
}

export const nasa = {
  apod: (date) => get('planetary/apod', { date }),
  apodRange: (start, end) => get('planetary/apod', { start_date: start, end_date: end }),
  marsPhotos: (rover, sol, camera) =>
    get(`mars-photos/api/v1/rovers/${rover}/photos`, {
      sol,
      camera: camera && camera !== 'all' ? camera : undefined
    }),
  marsManifest: (rover) => get(`mars-photos/api/v1/manifests/${rover}`),
  neoFeed: (start, end) => get('neo/rest/v1/feed', { start_date: start, end_date: end }),
  epic: () => get('EPIC/api/natural'),
  epicImageUrl: (image, date) => {
    const [y, m, d] = date.split(' ')[0].split('-');
    return `${BASE}/EPIC/archive/natural/${y}/${m}/${d}/png/${image}.png`;
  },
  search: async (query, mediaType = 'image', page = 1) => {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=${mediaType}&page=${page}`
    );
    if (!res.ok) throw new Error(`NASA Library ${res.status}`);
    return res.json();
  }
};

export function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}
