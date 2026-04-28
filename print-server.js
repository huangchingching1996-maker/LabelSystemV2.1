const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { exec } = require('child_process');

const PORT   = 8765;
const ORIGIN = 'https://huangchingching1996-maker.github.io';

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { image, printer, copies } = JSON.parse(body);

        // Save PNG to temp file
        const imgFile = path.join(os.tmpdir(), `label_${Date.now()}.png`);
        fs.writeFileSync(imgFile, Buffer.from(image, 'base64'));

        // PowerShell script to print the image
        const psFile = imgFile.replace('.png', '.ps1');
        const ps = `
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new('${imgFile.replace(/\\/g, '\\\\')}')
$pd  = [System.Drawing.Printing.PrintDocument]::new()
$pd.PrinterSettings.PrinterName = '${printer}'
$pd.PrinterSettings.Copies      = ${copies || 1}
$pd.add_PrintPage({
  param($s, $e)
  $e.Graphics.DrawImage($bmp, $e.MarginBounds)
}.GetNewClosure())
$pd.Print()
$bmp.Dispose()
$pd.Dispose()
`;
        fs.writeFileSync(psFile, ps);

        exec(`powershell -ExecutionPolicy Bypass -File "${psFile}"`, (err) => {
          fs.unlink(imgFile, () => {});
          fs.unlink(psFile,  () => {});
          if (err) {
            console.error('列印失敗:', err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ ok: false, error: err.message }));
          } else {
            console.log(`列印完成：${printer} × ${copies || 1} 張`);
            res.writeHead(200);
            res.end(JSON.stringify({ ok: true }));
          }
        });

      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200);
    res.end('列印伺服器運作中');
    return;
  }

  res.writeHead(404); res.end();

}).listen(PORT, () => {
  console.log('============================');
  console.log(' 列印伺服器已啟動');
  console.log(` http://localhost:${PORT}`);
  console.log(' 關閉此視窗即停止列印');
  console.log('============================');
});
