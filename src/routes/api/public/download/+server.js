export async function GET({ url }) {
  const target = url.searchParams.get('url');
  const filename = url.searchParams.get('filename') || 'download';
  if (!target || !/^https?:\/\//.test(target)) {
    return new Response('Invalid url', { status: 400 });
  }
  const res = await fetch(target);
  if (!res.ok) return new Response('Upstream error', { status: res.status });
  const contentType = res.headers.get('content-type') || 'application/octet-stream';
  const body = await res.arrayBuffer();
  return new Response(body, {
    status: 200,
    headers: {
      'content-type': contentType,
      'content-disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
      'cache-control': 'public, max-age=300'
    }
  });
}
