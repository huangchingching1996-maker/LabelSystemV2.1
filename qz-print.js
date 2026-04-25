// ── QZ Tray Integration ──
const QZ_PRINTER_KEY = 'nls_printer_settings_v1';

function loadPrinterSettings() {
  const saved = localStorage.getItem(QZ_PRINTER_KEY);
  if (saved) { try { return JSON.parse(saved); } catch {} }
  return { large: 'TSC TDP225A', small: 'TSC TDP225A' };
}

function savePrinterSettings(s) {
  localStorage.setItem(QZ_PRINTER_KEY, JSON.stringify(s));
}

async function qzConnect() {
  if (typeof qz === 'undefined') return false;
  if (qz.websocket.isActive()) return true;
  try {
    await qz.websocket.connect();
    return true;
  } catch {
    return false;
  }
}

async function buildPrintDoc(labelHTML) {
  const styleLink = document.querySelector('link[rel=stylesheet]');
  const cssURL = styleLink ? styleLink.href : 'style.css';
  let css = '';
  try {
    const r = await fetch(cssURL);
    css = await r.text();
  } catch {}

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${css}
body { margin:0; padding:0; }
* { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
</style>
</head>
<body>${labelHTML}</body>
</html>`;
}

async function printWithQZ(size, labelHTML, qty) {
  const connected = await qzConnect();
  if (!connected) return false;

  const ps = loadPrinterSettings();
  const printerName = size === 'large' ? ps.large : ps.small;

  if (!printerName) {
    showToast('請先在設定頁填入印表機名稱', 'error');
    return false;
  }

  const isSmall = size === 'small';
  const config = qz.configs.create(printerName, {
    size:        isSmall ? { width: 35, height: 25 } : { width: 55, height: 56.5 },
    units:       'mm',
    orientation: isSmall ? 'landscape' : 'portrait',
    margins:     size === 'large' ? { top: 1.5, right: 0, bottom: 0, left: 0 }
                                  : { top: 0,   right: 0, bottom: 0, left: 0 },
    colorType:   'blackwhite',
    copies:      qty,
  });

  try {
    const doc = await buildPrintDoc(labelHTML);
    await qz.print(config, [{ type: 'html', format: 'plain', data: doc }]);
    return true;
  } catch (e) {
    showToast('QZ Tray 列印失敗：' + e.message, 'error');
    return false;
  }
}

// ── Printer Settings UI ──
function renderPrinterSettings() {
  const ps = loadPrinterSettings();
  return `
    <div class="settings-section">
      <div class="settings-section-title">印表機（QZ Tray）</div>
      <div class="settings-row">
        <span class="settings-label">大標印表機名稱</span>
        <input class="settings-input" style="flex:1;max-width:200px" type="text"
          id="printer-large" value="${ps.large}"
          oninput="onPrinterChange()">
      </div>
      <div class="settings-row">
        <span class="settings-label">小標印表機名稱</span>
        <input class="settings-input" style="flex:1;max-width:200px" type="text"
          id="printer-small" value="${ps.small}"
          oninput="onPrinterChange()">
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;padding:0 2px">
        名稱需與 Windows「印表機與掃描器」內完全一致
      </div>
    </div>`;
}

function onPrinterChange() {
  savePrinterSettings({
    large: document.getElementById('printer-large')?.value.trim() || '',
    small: document.getElementById('printer-small')?.value.trim() || '',
  });
}
