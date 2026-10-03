import fs from 'node:fs';
const source = fs.readFileSync('src/app/page.tsx', 'utf8');
const paths = [...new Set([...source.matchAll(/url:\s*RS\s*\+\s*'([^']+)'/g)].map((match) => match[1]))];
(async () => {
  const failed = [];
  for (let i = 0; i < paths.length; i += 4) {
    await Promise.all(paths.slice(i, i + 4).map(async (path) => {
      try {
        const response = await fetch(`https://www.robotsepeti.com/${path}`, { signal: AbortSignal.timeout(20000) });
        if (response.status !== 200 || new URL(response.url).pathname !== `/${path}`) failed.push(`${response.status} ${path} -> ${response.url}`);
        if (process.argv.includes('--titles')) {
          const html = await response.text();
          const title = (html.match(/<title[^>]*>([^<]+)/i) || [])[1] || '(başlık bulunamadı)';
          console.log(`${path} :: ${title}`);
        }
      } catch (error) { failed.push(`${path}: ${error.message}`); }
    }));
  }
  console.log(`Checked ${paths.length} RobotSepeti product URLs`);
  for (const entry of failed) console.log(`FAILED ${entry}`);
  if (failed.length) process.exitCode = 1;
})();
