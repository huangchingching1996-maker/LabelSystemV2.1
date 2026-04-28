const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');
const { execFile } = require('child_process');

const PORT   = 8765;
const ORIGIN = 'https://huangchingching1996-maker.github.io';

function printImage(imgFile, printer, copies, size) {
  return new Promise((resolve, reject) => {
    const isSmall = size === 'small';
    // Draw at exact physical size in mm, so no stretching regardless of paper config
    const drawCmd = isSmall
      ? `$g.DrawImage($bmp, [float]0, [float]0, [float]35, [float]25)`
      : `$g.DrawImage($bmp, [float]0, [float]1.5, [float]55, [float]55)`;

    const psFile = imgFile.replace('.png', '.ps1');
    const imgPath = imgFile.replace(/\\/g, '\\\\');

    const script = `
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new('${imgPath}')
$pd  = [System.Drawing.Printing.PrintDocument]::new()
$pd.PrinterSettings.PrinterName = '${printer}'
$pd.PrinterSettings.Copies      = ${copies}
$pd.add_PrintPage({
  param($s, $e)
  $g = $e.Graphics
  $g.PageUnit = [System.Drawing.GraphicsUnit]::Millimeter
  ${drawCmd}
}.GetNewClosure())
$pd.Print()
$bmp.Dispose()
$pd.Dispose()
Write-Host "ok"
`;
    fs.writeFileSync(psFile, script, 'utf8');

    execFile('powershell', ['-ExecutionPolicy', 'Bypass', '-File', psFile], (err, stdout) => {
      fs.unlink(imgFile, () => {});
      fs.unlink(psFile,  () => {});
      if (err) reject(err);
      else resolve();
    });
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

        await printImage(imgFile, printer, copies || 1, size || 'large');
        console.log(`✓ 列印完成：${printer} × ${copies || 1} 張`);
        res.writeHead(200);
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error('✗ 列印失敗:', e.message);
        res.writeHead(500);
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200); res.end('列印伺服器運作中'); return;
  }

  res.writeHead(404); res.end();

}).listen(PORT, () => {
  console.log('============================');
  console.log(' 列印伺服器已啟動');
  console.log(` http://localhost:${PORT}`);
  console.log(' 關閉此視窗即停止列印');
  console.log('============================');
});
