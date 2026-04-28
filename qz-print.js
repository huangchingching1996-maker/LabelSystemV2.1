// ── QZ Tray Integration ──
const QZ_PRINTER_KEY = 'nls_printer_settings_v1';

// ── Certificate signing (bypasses "Action Required" dialog) ──
const QZ_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApUKxJW64LEaEmFqW6wXV
ySn5B/DP0MNPaK2W0nsJgMObfjmsh3bZ5/x3mtnCkrqv++hJAVoe87bojXhYJTnw
v7K4VCoSqHYa0yFIb64fryUytvdxjdzLdQhJsg2fFt7C2qjM2a9/1PaJKpkSH4DL
YmWavlz71FhwOFcjeenorR+nrzwaf6AoP3tF6BFyuCa3B8qrymHHbYMZrPaGl0aO
kWasWXkc6wj/oe2QWT0MMR3yt1UwFrrBpJTCEe3yv83h7QocrD8a4+KE60VCiVq6
HWTTN8PoUhjPToq45FJANDYIW0V0FbLLHcjEHNILorKRpgMyq0GSVV17jrF92tr1
owIDAQAB
-----END PUBLIC KEY-----`;

const QZ_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQClQrElbrgsRoSY
WpbrBdXJKfkH8M/Qw09orZbSewmAw5t+OayHdtnn/Hea2cKSuq/76EkBWh7ztuiN
eFglOfC/srhUKhKodhrTIUhvrh+vJTK293GN3Mt1CEmyDZ8W3sLaqMzZr3/U9okq
mRIfgMtiZZq+XPvUWHA4VyN56eitH6evPBp/oCg/e0XoEXK4JrcHyqvKYcdtgxms
9oaXRo6RZqxZeRzrCP+h7ZBZPQwxHfK3VTAWusGklMIR7fK/zeHtChysPxrj4oTr
RUKJWrodZNM3w+hSGM9OirjkUkA0NghbRXQVsssdyMQc0guispGmAzKrQZJVXXuO
sX3a2vWjAgMBAAECggEAHyHTMVQMSfr226SlLZ0pyv2nNkG9RHympvecpAYdoi43
Sq4evF49aqB6/6bqKq4UnQYDSsfpcMwSPyReppSlr9dBNkm+vhGRuBhbBv7sZRhC
14kB0VG42lE3YN2EDNDmMD8AaDnRgRL4gBfZ/ClNJzowzo/BuRz39wUjX8Ia3RH9
kZGiM+9/4AZ1yanrGEDhRogcrhAWx8CmOsu5r3jcC9e5/GWSrpf52C27EYY+OCeH
IlP+3vYvP1tH8oZmr97SJu8lLsAbLHxa6etXUj0P9dIE6dNCA47TmvilVw19NGal
Lc6RIHRHfrIKUMs+6sbzrK+Y7fp1jIefSJf7PcWtAQKBgQDl0k9fM5QNrrcJu8Fi
ilkFHwKQwR8YkWEn9vDRQjdumKXf4Rp7M9D4/s4iS8g7USgw8r5Swqr6iTNObYKH
Cu8s3Nd1+U5olw5mlQzXfx0Y+zwrYEl7yOKu3MAvXuCA5317ttWixfliytmEa/Uf
8adInBCQMhbnLRqmyG+2vqvYQQKBgQC4FcGl6DEETjLiIxy/eRLg0zq/Yb5U9EfO
uJgsdBFqcFwm/6gtwnGetTaA2rXOYNtazHIDdjY3i0y7DyiWAFDVtLpCN5Q3yGFW
5b73LdCZJxgijrF1j0pMiENgg0VI/EU6OvCl/p6Trq2JsvyxgeT08X67PYCwZ1Bl
YQqqlU004wKBgQCVjVj3M6I5kSMtI1ABptOtAHPz7KgmnZwinJAzLCrUPmNan6pS
1/I5xd4v9S6UYwiLabsuMd1/cT7A34RcCmJ/yCoxbA15BCtr17xmkyJFOl/6Pgsz
kRLqBV7OtKfVWk6O7fhxlvDlN+l6QaJeqitYla41l1LOFszMEYyY19UNwQKBgQCO
SIqv0IMqf8LGlTsgJ9XWno2W5Va21UU3W+iK23+mlIg1wH9eNx+Y+xnQiLvjc2u4
h7NMR69qSSoan4HQRxgzxgf9LHZMk33hK5zp8qh76AK4mzBA3GsiMmRZkb0Yx5w+
gNYGh4JMRcRuXUEBdpPgW1SIJuZz8rbqVRJofRP63wKBgQC9MccrH/QnTyR73scR
CEkSxSDGtvtooFyuzeDUMpKCQq2ujf6hx2ylRzFAmoZ1ucP+LYnchNf7kDntlvCK
GGrjy7FpTIFxdkEdQSzkLdorSO89tuvOsNKWJ4/DcBFpptSCEkQpQ2cEpWJxwwYM
lybL36bJqraDQu9T23lhuDXihQ==
-----END PRIVATE KEY-----`;

let _qzPrivateKey = null;
async function getQZPrivateKey() {
  if (_qzPrivateKey) return _qzPrivateKey;
  const pem = QZ_PRIVATE_KEY.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  _qzPrivateKey = await crypto.subtle.importKey(
    'pkcs8', der.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' },
    false, ['sign']
  );
  return _qzPrivateKey;
}

function setupQZSecurity() {
  qz.security.setCertificatePromise(function(resolve) {
    resolve(QZ_PUBLIC_KEY);
  });
  qz.security.setSignatureAlgorithm('SHA512');
  qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
      getQZPrivateKey().then(key =>
        crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(toSign))
      ).then(sig =>
        resolve(btoa(String.fromCharCode(...new Uint8Array(sig))))
      ).catch(reject);
    };
  });
}

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
  setupQZSecurity();
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

  const wrap = document.createElement('div');
  wrap.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px;overflow:hidden;background:#fff;`;
  wrap.innerHTML = labelHTML;
  document.body.appendChild(wrap);

  try {
    const canvas = await html2canvas(wrap.firstElementChild || wrap, {
      width:           w,
      height:          h,
      scale:           3,
      useCORS:         true,
      backgroundColor: '#ffffff',
      logging:         false,
    });
    return canvas.toDataURL('image/png').split(',')[1];
  } finally {
    document.body.removeChild(wrap);
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
    colorType: 'blackwhite',
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
