import { env } from '$env/dynamic/private';

const NASA_BASE = 'https://api.nasa.gov';

export async function GET({ params, url }) {
  const key = env.NASA_API_KEY || 'DEMO_KEY';
  const target = new URL(`${NASA_BASE}/${params.path}`);
  url.searchParams.forEach((v, k) => target.searchParams.set(k, v));
  target.searchParams.set('api_key', key);

  const res = await fetch(target.toString());
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=300, s-maxage=1800'
    }
  });
}
