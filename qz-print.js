// ── QZ Tray Integration ──
const QZ_PRINTER_KEY = 'nls_printer_settings_v1';

// ── QZ Tray Certificate Signing ──
// Uses QZ Industries official demo cert — matches "QZ Tray Demo Cert" in Site Manager.
const QZ_CERT = `-----BEGIN CERTIFICATE-----
MIIE9TCCAt2gAwIBAgIQNzkyMDI0MTIyMDE5MDI0NDANBgkqhkiG9w0BAQsFADCB
mDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAk5ZMRswGQYDVQQKDBJRWiBJbmR1c3Ry
aWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMsIExMQzEZMBcGA1UEAwwQ
cXppbmR1c3RyaWVzLmNvbTEnMCUGCSqGSIb3DQEJARYYc3VwcG9ydEBxemluZHVz
dHJpZXMuY29tMB4XDTI0MTIyMDE5MDI0NFoXDTI5MTIyMDE4NTMxOVowga4xFjAU
BgNVBAYMDVVuaXRlZCBTdGF0ZXMxCzAJBgNVBAgMAk5ZMRIwEAYDVQQHDAlDYW5h
c3RvdGExGzAZBgNVBAoMElFaIEluZHVzdHJpZXMsIExMQzEbMBkGA1UECwwSUVog
SW5kdXN0cmllcywgTExDMRswGQYDVQQDDBJRWiBJbmR1c3RyaWVzLCBMTEMxHDAa
BgkqhkiG9w0BCQEMDXN1cHBvcnRAcXouaW8wggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQC+j6ewVhtLHbY3uBNgqNB5DSz+QX9Pz5Dm46bI9vt/Q1Q6BL8I
dhaxT2PA1AY0fqQgkzlSrwqNCjWZcrNZRw/e54FGM8zf3azbHrQif6d7Wo1JK5oN
kI3jdB54YVwHIAt6i3BcLIvyOHsPnrKjlpROz72Kx1kK5g0gLDuH5RYVM9KFK+HR
fBc3JSfeg8nUkTqYJVzlT5AGRWPXeDWloqQqSyuB1t8DihNBReWyJHQ7a4yerLOI
J6N0jAlLDx9yt9UznAxnoO+7tKBfxCbNJerGfePMOwRKq0gx+r8M/FTrAoj+yc+T
SOYtuY/VZ79HCTP/vLgm1pGyrta1we24fVezAgMBAAGjIzAhMB8GA1UdIwQYMBaA
FJCmULeE1LnqX/IFhBN4ReipdVRcMA0GCSqGSIb3DQEBCwUAA4ICAQAMvfp931Zt
PgfqGXSrsM+GAVBxcRVm14MyldWfRr+MVaFZ6cH7c+fSs8hUt2qNPwHrnpK9eev5
MPUL27hjfiTPwv1ojLJ180aMO0ZAfPfnKeLO8uTzY7GiPQeGK7Qh39kX9XxEOidG
rMwfllZ6jJReS0ZGaX8LUXhh9RHGSYJhxgyUV7clB/dJch8Bbcd+DOxwc1POUHx1
wWExKkoWzHCCYNvqxLC9p1eO2Elz9J9ynDjXtCBl7lssnoSUKtahBCKgN5tYmZZK
NErKPQpbYk5yTEK1gybxhup8i2sGEJXZ9HRJLAl0UxB+eCu1ExWv7eGbcbIZJbeh
bwRf03fatsqzCQbGboLWtMQfcxHrEu+5MdZwOFx8i+c0c2WYad2MkkzGYHBVHPtY
o+PR61uIwJC2mNkPpX94CIFxSHyZumttyVKF4AhIPm9IMGTHaIr5M39zesQpVc7N
VIgxmMuePBrLyh6vKvuqD7W3S2HWA/8IUX703tdhoXhv5lNo1j0oywSrrUkCvUvJ
FjPS8+VUtVZNl7SVetQTexdcUwoADj6c1UwL9QWItskJ5Myesco3ZY0O+3QbgCuQ
SRqN5D0qdaLNMdEwh1YekUp4i1jm0jzPzia+WvJrW1k1ZafV6ep+YkMBkC1SFYFw
1Mdy+fYGyXlSn/Mvou//SSb0fUMIpXE9NA==
-----END CERTIFICATE-----
--START INTERMEDIATE CERT--
-----BEGIN CERTIFICATE-----
MIIFEjCCA/qgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgawxCzAJBgNVBAYTAlVT
MQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYDVQQKDBJRWiBJ
bmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMsIExMQzEZMBcG
A1UEAwwQcXppbmR1c3RyaWVzLmNvbTEnMCUGCSqGSIb3DQEJARYYc3VwcG9ydEBx
emluZHVzdHJpZXMuY29tMB4XDTE1MDMwMjAwNTAxOFoXDTM1MDMwMjAwNTAxOFow
gZgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0
cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMM
EHF6aW5kdXN0cmllcy5jb20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1
c3RyaWVzLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANTDgNLU
iohl/rQoZ2bTMHVEk1mA020LYhgfWjO0+GsLlbg5SvWVFWkv4ZgffuVRXLHrwz1H
YpMyo+Zh8ksJF9ssJWCwQGO5ciM6dmoryyB0VZHGY1blewdMuxieXP7Kr6XD3GRM
GAhEwTxjUzI3ksuRunX4IcnRXKYkg5pjs4nLEhXtIZWDLiXPUsyUAEq1U1qdL1AH
EtdK/L3zLATnhPB6ZiM+HzNG4aAPynSA38fpeeZ4R0tINMpFThwNgGUsxYKsP9kh
0gxGl8YHL6ZzC7BC8FXIB/0Wteng0+XLAVto56Pyxt7BdxtNVuVNNXgkCi9tMqVX
xOk3oIvODDt0UoQUZ/umUuoMuOLekYUpZVk4utCqXXlB4mVfS5/zWB6nVxFX8Io1
9FOiDLTwZVtBmzmeikzb6o1QLp9F2TAvlf8+DIGDOo0DpPQUtOUyLPCh5hBaDGFE
ZhE56qPCBiQIc4T2klWX/80C5NZnd/tJNxjyUyk7bjdDzhzT10CGRAsqxAnsjvMD
2KcMf3oXN4PNgyfpbfq2ipxJ1u777Gpbzyf0xoKwH9FYigmqfRH2N2pEdiYawKrX
6pyXzGM4cvQ5X1Yxf2x/+xdTLdVaLnZgwrdqwFYmDejGAldXlYDl3jbBHVM1v+uY
5ItGTjk+3vLrxmvGy5XFVG+8fF/xaVfo5TW5AgMBAAGjUDBOMB0GA1UdDgQWBBSQ
plC3hNS56l/yBYQTeEXoqXVUXDAfBgNVHSMEGDAWgBQDRcZNwPqOqQvagw9BpW0S
BkOpXjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAJIO8SiNr9jpLQ
eUsFUmbueoxyI5L+P5eV92ceVOJ2tAlBA13vzF1NWlpSlrMmQcVUE/K4D01qtr0k
gDs6LUHvj2XXLpyEogitbBgipkQpwCTJVfC9bWYBwEotC7Y8mVjjEV7uXAT71GKT
x8XlB9maf+BTZGgyoulA5pTYJ++7s/xX9gzSWCa+eXGcjguBtYYXaAjjAqFGRAvu
pz1yrDWcA6H94HeErJKUXBakS0Jm/V33JDuVXY+aZ8EQi2kV82aZbNdXll/R6iGw
2ur4rDErnHsiphBgZB71C5FD4cdfSONTsYxmPmyUb5T+KLUouxZ9B0Wh28ucc1Lp
rbO7BnjW
-----END CERTIFICATE-----`;

const QZ_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0z9FeMynsC8+u
dvX+LciZxnh5uRj4C9S6tNeeAlIGCfQYk0zUcNFCoCkTknNQd/YEiawDLNbxBqut
bMDZ1aarys1a0lYmUeVLCIqvzBkPJTSQsCopQQ9V8WuT252zzNzs68dVGNdCJd5J
NRQykpwexmnjPPv0mvj7i8XgG379TyW6P+WWV5okeUkXJ9eJS2ouDYdR2SM9BoVW
+FgxDu6BmXhozW5EfsnajFp7HL8kQClI0QOc79yuKl3492rH6bzFsFn2lfwWy9ic
7cP8EpCTeFp1tFaD+vxBhPZkeTQ1HKx6hQ5zeHIB5ySJJZ7af2W8r4eTGYzbdRW2
4DDHCPhZAgMBAAECggEATvofR3gtrY8TLe+ET3wMDS8l3HU/NMlmKA9pxvjYfw7F
8h4VBw4oOWPfzU7A07syWJUR72kckbcKMfw42G18GbnBrRQG0UIgV3/ppBQQNg9Y
QILSR6bFXhLPnIvm/GxVa58pOEBbdec4it2Gbvie/MpJ4hn3K8atTqKk0djwxQ+b
QNBWtVgTkyIqMpUTFDi5ECiVXaGWZ5AOVK2TzlLRNQ5Y7US8lmGxVWzt0GONjXSE
iO/eBk8A7wI3zknMx5o1uZa/hFCPQH33uKeuqU5rmphi3zS0BY7iGY9EoKu/o+BO
HPwLQJ3wCDA3O9APZ3gmmbHFPMFPr/mVGeAeGP/BAQKBgQDaPELRriUaanWrZpgT
VnKKrRSqPED3anAVgmDfzTQwuR/3oD506F3AMBzloAo3y9BXmDfe8qLn6kgdZQKy
SFNLz888at96oi+2mEKPpvssqiwE6F3OtEM6yv4DP9KJHaHmXaWv+/sjwjzpFNjs
wGThBxFvrTWRJqBYsM1XNJJ2EQKBgQDUGbTSwHKqRCYWhQ1GPCZKE98l5UtMKvUb
hyWWOXoyoeYbJEMfG1ynX4JeXIkl6YtBjYCqszv9PjHa1rowTZaAPJ0V70zyhTcF
t581ii9LpiejIGrELHvJnW87QmjjStkjwGIqgKLp7Qe6CDjHI9HP1NM0uav/IQLW
pB6wyEz1yQKBgQCuxPut+Ax2rzM05KB9PAnWzO1zt3U/rtm8IAF8uVVGf7r+EDJ0
ZXJO6zj5G8WTEYHz5E86GI4ltBW0lKQoKouqdu27sMrv5trXG/CSImOcTVubQot9
chc1CkOKTp5IeJajafO6j817wZ4N+0gNsbYYEBUCnm/7ojdfT5ficpOoQQKBgQDB
PgKPmaNfGeQR1Ht5qEfCakR/RF/ML79Nq15FdmytQPBjfjBhYQ6Tt+MRkgGqtxOX
UBMQc2iOnGHT3puYcrhScec1GufidhjhbqDxqMrag7HNYDWmMlk+IeA7/4+Mtp8L
gbZuvvCvbLQDfIYueaYpUuBzQ08/jZYGdVU4/+WOcQKBgAGUN0kIB6EM1K/iZ0TN
jlt8P5UEV3ZCyATWFiGZRhhE2WAh8gv1jx4J26pcUs1n8sd2a1h6ZuBSqsyIlNSp
xtKsm3bqQFDHRrPcsBX4nanrw9DzkpH1k/I3WMSdGqkDAR3DtL7yXTJXJo2Sbrp5
EjzSn7DcDE1tL2En/tSVXeUY
-----END PRIVATE KEY-----`;

function pemToArrayBuffer(pem) {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const bin = atob(b64);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

const QZ_KEY_STORAGE = 'nls_qz_keys_v1';

function loadQZKeys() {
  try { return JSON.parse(localStorage.getItem(QZ_KEY_STORAGE)) || {}; } catch { return {}; }
}
function saveQZKeys(obj) {
  localStorage.setItem(QZ_KEY_STORAGE, JSON.stringify(obj));
}

function qzSetupSecurity() {
  const keys = loadQZKeys();
  const cert = keys.cert || QZ_CERT;
  const pkey = keys.privateKey || QZ_PRIVATE_KEY;

  qz.security.setSignatureAlgorithm('SHA512');
  qz.security.setCertificatePromise(function(resolve) {
    resolve(cert);
  });
  qz.security.setSignaturePromise(function(toSign) {
    return function(resolve, reject) {
      crypto.subtle.importKey(
        'pkcs8', pemToArrayBuffer(pkey),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' },
        false, ['sign']
      ).then(key =>
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
  qzSetupSecurity();
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
  const ps   = loadPrinterSettings();
  const keys = loadQZKeys();
  return `
    <div class="settings-section">
      <div class="settings-section-title">QZ Tray 簽名金鑰</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;line-height:1.7;">
        將 <code style="background:var(--bg);padding:1px 5px;border-radius:3px;">%APPDATA%\\qz\\digital-certificate.pem</code> 的內容貼到「憑證」欄位，<br>
        將 <code style="background:var(--bg);padding:1px 5px;border-radius:3px;">%APPDATA%\\qz\\private-key.pem</code> 的內容貼到「私鑰」欄位，<br>
        儲存後重新整理頁面即可解決 Action Required 對話框。
      </div>
      <div class="settings-row" style="align-items:flex-start;">
        <span class="settings-label" style="padding-top:4px;">憑證</span>
        <textarea id="qz-cert-input" rows="4"
          style="flex:1;font-size:10px;font-family:monospace;resize:vertical;padding:6px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text-primary);"
          placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
        >${keys.cert || ''}</textarea>
      </div>
      <div class="settings-row" style="align-items:flex-start;margin-top:8px;">
        <span class="settings-label" style="padding-top:4px;">私鑰</span>
        <textarea id="qz-key-input" rows="4"
          style="flex:1;font-size:10px;font-family:monospace;resize:vertical;padding:6px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text-primary);"
          placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
        >${keys.privateKey || ''}</textarea>
      </div>
      <div style="margin-top:8px;display:flex;gap:8px;">
        <button class="btn btn-primary" style="padding:5px 16px;font-size:12px;" onclick="saveQZKeysFromUI()">儲存金鑰</button>
        <span id="qz-keys-saved" style="font-size:12px;color:var(--text-muted);align-self:center;"></span>
      </div>
    </div>

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

function saveQZKeysFromUI() {
  const cert = document.getElementById('qz-cert-input')?.value.trim() || '';
  const key  = document.getElementById('qz-key-input')?.value.trim() || '';
  saveQZKeys({ cert, privateKey: key });
  const msg = document.getElementById('qz-keys-saved');
  if (msg) { msg.textContent = '已儲存，請重新整理頁面'; }
  if (typeof qz !== 'undefined') qzSetupSecurity();
}
