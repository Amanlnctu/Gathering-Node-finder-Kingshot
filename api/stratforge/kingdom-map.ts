import type { IncomingMessage, ServerResponse } from 'http';
import https from 'https';
import verifiedSnapshot1870 from '../../src/data/verifiedSnapshot1870.json';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-stratforge-cookie'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const kid = urlObj.searchParams.get('kid') || '1870';
  const aid = urlObj.searchParams.get('aid') || '187900183';

  // Read cookie from headers or environment variable
  const cookie =
    (req.headers['x-stratforge-cookie'] as string) ||
    process.env.STRATFORGE_COOKIE ||
    '__Secure-better-auth.session_token=XzfSGVgTZaJYwVFKj5g0LNFzoP7W0br7.Ke0uMuQeDYnHTi5mkuDqTPfNLLQy8zS%2B5dn8Q6ZkewA%3D';

  const targetUrl = `https://stratforge.tools/dashboard/kingshot/tools/kingdom-map?kid=${kid}&aid=${aid}&c=520.19,716.98,1.13&layers=marches`;

  const fetchLive = () => {
    return new Promise<string>((resolve, reject) => {
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Cookie': cookie,
          'RSC': '1',
          'Accept': 'text/x-component'
        },
        timeout: 10000
      };

      https.get(targetUrl, options, (resp) => {
        let data = '';
        resp.on('data', chunk => { data += chunk; });
        resp.on('end', () => { resolve(data); });
      }).on('error', err => reject(err));
    });
  };

  try {
    const rawRsc = await fetchLive();
    const idx = rawRsc.indexOf('{"packed":');
    if (idx !== -1) {
      let depth = 0;
      let endIdx = idx;
      for (let i = idx; i < rawRsc.length; i++) {
        if (rawRsc[i] === '{') depth++;
        else if (rawRsc[i] === '}') {
          depth--;
          if (depth === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }
      const parsed = JSON.parse(rawRsc.substring(idx, endIdx));
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(parsed));
      return;
    }
  } catch (e) {
    console.warn('[Vercel Serverless] Live RSC fetch failed, serving verified snapshot:', e);
  }

  // Fallback to verified local real snapshot of Kingdom 1870
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ packed: verifiedSnapshot1870, isFallback: true }));
}
