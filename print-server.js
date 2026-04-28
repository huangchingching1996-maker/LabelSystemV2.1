const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { exec } = require('child_process');

const PORT   = 8765;
const ORIGIN = 'https://huangchingching1996-maker.github.io';

// Keep one persistent PowerShell process to avoid startup lag
let psProcess = null;
let psReady   = false;
const psQueue = [];

function startPersistentPS() {
  const { spawn } = require('child_process');
  psProcess = spawn('powershell', ['-NoExit', '-Command', '-'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  psProcess.stdout.on('data', d => {
    const s = d.toString();
    if (s.includes('__DONE__') && psQueue.length) {
      const { resolve } = psQueue.shift();
      resolve();
      runNext();
    }
  });
  psProcess.on('exit', () => { psProcess = null; psReady = false; });
  // warm up
  psProcess.stdin.write('Add-Type -AssemblyName System.Drawing\nWrite-Host "__DONE__"\n');
  psProcess.stdout.once('data', () => { psReady = true; runNext(); });
}

function runNext() {
  if (!psQueue.length || !psReady) return;
  const { script } = psQueue[0];
  psProcess.stdin.write(script + '\nWrite-Host "__DONE__"\n');
}

function runPS(script) {
  return new Promise((resolve, reject) => {
    if (!psProcess) startPersistentPS();
    psQueue.push({ script, resolve, reject });
    if (psReady && psQueue.length === 1) runNext();
  });
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { image, printer, copies, size } = JSON.parse(body);

        const imgFile = path.join(os.tmpdir(), `label_${Date.now()}.png`);
        fs.writeFileSync(imgFile, Buffer.from(image, 'base64'));

        const isSmall   = size === 'small';
        const landscape = isSmall ? '$true' : '$false';
        // margin top: 0 for small, 1.5mm for large (in hundredths of inch)
        const topMargin = isSmall ? 0 : 6;
        const imgPath   = imgFile.replace(/\\/g, '\\\\');

        const ps = `
$bmp = [System.Drawing.Bitmap]::new('${imgPath}')
$pd  = [System.Drawing.Printing.PrintDocument]::new()
$pd.PrinterSettings.PrinterName = '${printer}'
$pd.PrinterSettings.Copies      = ${copies || 1}
$pd.DefaultPageSettings.Landscape = ${landscape}
$pd.DefaultPageSettings.Margins   = [System.Drawing.Printing.Margins]::new(0,${topMargin},0,0)
$pd.add_PrintPage({
  param($s,$e)
  $e.Graphics.DrawImage($bmp, $e.PageBounds)
}.GetNewClosure())
$pd.Print()
$bmp.Dispose()
$pd.Dispose()
`;
        await runPS(ps);
        fs.unlink(imgFile, () => {});
        console.log(`列印完成：${printer} × ${copies || 1} 張`);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));

      } catch (e) {
        console.error('列印失敗:', e.message);
        res.writeHead(500);
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200);
    res.end('列印伺服器運作中');
    return;
  }

  res.writeHead(404); res.end();

}).listen(PORT, () => {
  startPersistentPS();
  console.log('============================');
  console.log(' 列印伺服器已啟動');
  console.log(` http://localhost:${PORT}`);
  console.log(' 關閉此視窗即停止列印');
  console.log('============================');
});
