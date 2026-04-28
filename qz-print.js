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
    await qz.websocket.connect({ keepAlive: 60 });
    return true;
  } catch {
    return false;
  }
}

// Connect once on page load and auto-reconnect if dropped.
function qzAutoSetup() {
  if (typeof qz === 'undefined') return;
  qz.websocket.setClosedCallbacks(function() {
    setTimeout(function() {
      if (typeof qz !== 'undefined' && !qz.websocket.isActive()) {
        qz.websocket.connect({ keepAlive: 60 }).catch(function() {});
      }
    }, 3000);
  });
  qz.websocket.connect({ keepAlive: 60 }).catch(function() {});
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', qzAutoSetup);
} else {
  qzAutoSetup();
}

// Render label HTML to base64 PNG using the browser's own renderer.
// This guarantees the printed image matches the on-screen preview exactly.
async function renderLabelToBase64(labelHTML, size) {
  const isSmall = size === 'small';
  const w = isSmall ? 132 : 208;
  const h = isSmall ? 94  : 208;

    // Target: exactly 203 DPI dot count so QZ sends 1px = 1 dot (no scaling).
  // Supersampling at 2× then downsampling gives smoother greyscale values
  // before the B&W threshold, producing sharper edges than rendering at 1×.
  const mmW  = isSmall ? 35 : 55;
  const dotW = Math.round(mmW * 203 / 25.4);          // 280 (small) | 440 (large)
  const dotH = Math.round(h * (dotW / w));
  const scale = (dotW / w) * 2;                        // 2× supersampling ≈ 4.24

  const wrap = document.createElement('div');
  // Disable subpixel font rendering so text pixels are harder-edged going in.
  wrap.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px;overflow:hidden;background:#fff;-webkit-font-smoothing:none;`;
  wrap.innerHTML = labelHTML;
  document.body.appendChild(wrap);

  try {
    const canvas = await html2canvas(wrap.firstElementChild || wrap, {
      width:           w,
      height:          h,
      scale:           scale,
      useCORS:         true,
      backgroundColor: '#ffffff',
      logging:         false,
    });

    // Downsample 2× canvas to exact printer dots with high-quality interpolation.
    const ds = document.createElement('canvas');
    ds.width  = dotW;
    ds.height = dotH;
    const dsCtx = ds.getContext('2d');
    dsCtx.imageSmoothingEnabled = true;
    dsCtx.imageSmoothingQuality = 'high';
    dsCtx.drawImage(canvas, 0, 0, dotW, dotH);

    // Convert to pure B&W — threshold 160 keeps thin strokes intact.
    const img  = dsCtx.getImageData(0, 0, dotW, dotH);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
      const val = lum > 160 ? 255 : 0;
      data[i] = data[i+1] = data[i+2] = val;
      data[i+3] = 255;
    }
    dsCtx.putImageData(img, 0, 0);

    return ds.toDataURL('image/png').split(',')[1];
  } finally {
    document.body.removeChild(wrap);
  }
}

async function printWithLocalServer(size, labelHTML, qty) {
  const ps          = loadPrinterSettings();
  const printerName = size === 'large' ? ps.large : ps.small;
  if (!printerName) return false;
  try {
    const base64 = await renderLabelToBase64(labelHTML, size);
    const res    = await fetch('http://localhost:8765/print', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ image: base64, printer: printerName, copies: qty, size }),
    });
    if (!res.ok) return false;
    const result = await res.json();
    return result.ok === true;
  } catch {
    return false;
  }
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
    size:    isSmall ? { width: 35, height: 25 } : { width: 55, height: 56.5 },
    units:   'mm',
    margins: isSmall ? { top: 0,   right: 0, bottom: 0, left: 0 }
                     : { top: 1.5, right: 0, bottom: 0, left: 0 },
    copies:    qty,
  });

  try {
    const base64 = await renderLabelToBase64(labelHTML, size);
    await qz.print(config, [{ type: 'pixel', format: 'image', flavor: 'base64', data: base64 }]);
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
        <div style="display:flex;gap:6px;flex:1;max-width:280px;">
          <input class="settings-input" style="flex:1;" type="text"
            id="printer-large" value="${ps.large}" placeholder="TSC TDP225A"
            oninput="onPrinterChange()">
          <button class="btn" style="padding:4px 10px;font-size:12px;flex-shrink:0;"
            onclick="searchPrinters('large')">搜尋</button>
        </div>
      </div>
      <div id="printer-large-list" style="display:none;margin:4px 0 8px 0;"></div>
      <div class="settings-row">
        <span class="settings-label">小標印表機</span>
        <div style="display:flex;gap:6px;flex:1;max-width:280px;">
          <input class="settings-input" style="flex:1;" type="text"
            id="printer-small" value="${ps.small}" placeholder="TSC TDP225A"
            oninput="onPrinterChange()">
          <button class="btn" style="padding:4px 10px;font-size:12px;flex-shrink:0;"
            onclick="searchPrinters('small')">搜尋</button>
        </div>
      </div>
      <div id="printer-small-list" style="display:none;margin:4px 0 8px 0;"></div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;padding:0 2px;line-height:1.6;">
        按「搜尋」可列出電腦上所有印表機，點選即自動填入
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

async function searchPrinters(target) {
  const listEl = document.getElementById(`printer-${target}-list`);
  if (!listEl) return;

  listEl.style.display = 'block';
  listEl.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:4px 2px;">連線中…</div>';

  const connected = await qzConnect();
  if (!connected) {
    listEl.innerHTML = '<div style="font-size:12px;color:#dc2626;padding:4px 2px;">QZ Tray 未連線，請先測試連線</div>';
    return;
  }

  let printers;
  try {
    printers = await qz.printers.find();
  } catch (e) {
    listEl.innerHTML = `<div style="font-size:12px;color:#dc2626;padding:4px 2px;">搜尋失敗：${e.message}</div>`;
    return;
  }

  if (!printers || printers.length === 0) {
    listEl.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:4px 2px;">找不到任何印表機</div>';
    return;
  }

  const items = printers.map(name => `
    <div style="padding:6px 10px;font-size:13px;cursor:pointer;border-radius:4px;
      border:1px solid var(--border);background:var(--surface);margin-bottom:4px;"
      onmouseover="this.style.background='var(--bg)'"
      onmouseout="this.style.background='var(--surface)'"
      onclick="selectPrinter('${target}', this.dataset.name)"
      data-name="${name.replace(/"/g, '&quot;')}">${name}</div>
  `).join('');

  listEl.innerHTML = `<div style="max-height:160px;overflow-y:auto;">${items}</div>`;
}

function selectPrinter(target, name) {
  const input = document.getElementById(`printer-${target}`);
  if (input) { input.value = name; onPrinterChange(); }
  const listEl = document.getElementById(`printer-${target}-list`);
  if (listEl) listEl.style.display = 'none';
}

function onPrinterChange() {
  savePrinterSettings({
    large: document.getElementById('printer-large')?.value.trim() || '',
    small: document.getElementById('printer-small')?.value.trim() || '',
  });
}
