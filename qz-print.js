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

// ── Printer Settings Page ──
function renderPrinterSettingsPage() {
  const ps = loadPrinterSettings();
  return `
    <div class="settings-section">
      <div class="settings-section-title">QZ Tray 連線</div>
      <div class="settings-row">
        <span class="settings-label">連線狀態</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <span id="qz-status-dot" style="font-size:16px;line-height:1;">●</span>
          <span id="qz-status-text" style="font-size:13px;color:var(--text-secondary);">未偵測</span>
          <button class="btn" style="padding:4px 12px;font-size:12px;" onclick="testQZConnection()">測試連線</button>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:2px;padding:0 2px;">
        需先在電腦安裝並執行 QZ Tray，列印才能直接送出至印表機
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">印表機名稱</div>
      <div class="settings-row">
        <span class="settings-label">大標印表機</span>
        <input class="settings-input" style="flex:1;max-width:220px;" type="text"
          id="printer-large" value="${ps.large}" placeholder="TSC TDP225A"
          oninput="onPrinterChange()">
      </div>
      <div class="settings-row">
        <span class="settings-label">小標印表機</span>
        <input class="settings-input" style="flex:1;max-width:220px;" type="text"
          id="printer-small" value="${ps.small}" placeholder="TSC TDP225A"
          oninput="onPrinterChange()">
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px;padding:0 2px;line-height:1.6;">
        名稱需與 Windows「印表機與掃描器」內完全一致（大小寫也要相同）
      </div>
    </div>`;
}

async function testQZConnection() {
  const dot  = document.getElementById('qz-status-dot');
  const text = document.getElementById('qz-status-text');
  if (!dot || !text) return;

  if (typeof qz === 'undefined') {
    dot.style.color  = '#9ca3af';
    text.textContent = 'QZ Tray 未載入（請確認網路可存取 cdn.qz.io）';
    return;
  }

  dot.style.color  = '#9ca3af';
  text.textContent = '連線中…';
  const ok = await qzConnect();
  if (ok) {
    dot.style.color  = '#16a34a';
    text.textContent = '已連線';
  } else {
    dot.style.color  = '#dc2626';
    text.textContent = '連線失敗（請確認 QZ Tray 已安裝並執行）';
  }
}

function onPrinterChange() {
  savePrinterSettings({
    large: document.getElementById('printer-large')?.value.trim() || '',
    small: document.getElementById('printer-small')?.value.trim() || '',
  });
}
