import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'stratforge-proxy-middleware',
      configureServer(server) {
        server.middlewares.use('/api/stratforge/kingdom-map', async (req, res) => {
          const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
          const kid = urlObj.searchParams.get('kid') || '1870';
          const aid = urlObj.searchParams.get('aid') || '187900183';

          // Try to read cookie from headers, env, or scratch file
          let cookie = req.headers['x-stratforge-cookie'] as string | undefined;
          if (!cookie && process.env.STRATFORGE_COOKIE) {
            cookie = process.env.STRATFORGE_COOKIE;
          }
          if (!cookie) {
            const scratchCookiePath = 'C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\c65ea196-2e0c-40dc-83b4-ac38abb6dea3\\scratch\\cookies.txt';
            if (fs.existsSync(scratchCookiePath)) {
              cookie = fs.readFileSync(scratchCookiePath, 'utf-8').trim();
            }
          }

          const targetUrl = `https://stratforge.tools/dashboard/kingshot/tools/kingdom-map?kid=${kid}&aid=${aid}&c=520.19,716.98,1.13&layers=marches`;

          const fetchLive = () => {
            return new Promise<string>((resolve, reject) => {
              const options = {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  'Cookie': cookie || '',
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
              res.end(JSON.stringify(parsed));
              return;
            }
          } catch (e) {
            console.warn('[Proxy] Failed to fetch live RSC, using verified snapshot:', e);
          }

          // Fallback to verified local real snapshot
          try {
            const baseDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : process.cwd();
            const snapshotPath = path.resolve(baseDir, 'src/data/verifiedSnapshot1870.json');
            const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ packed: snapshot, isFallback: true }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to retrieve gathering data' }));
          }
        });
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
