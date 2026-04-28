const PX_PER_MM = 96 / 25.4;
const LABEL_MM = {
  large: { w: 55, h: 55 },
  small: { w: 35, h: 25 },
};

// ── Preview ──
function doPreview() {
  if(!selectedProduct) return;
  const qty    = parseInt(document.getElementById('qty-input').value) || 1;
  const single = buildLabelHTML(selectedProduct, selectedSize);
  const mm     = LABEL_MM[selectedSize];

  const labelPxW = mm.w * PX_PER_MM;
  const labelPxH = mm.h * PX_PER_MM;
  // Smaller preview: max 200px wide
  const maxW  = Math.min(window.innerWidth * 0.5, 200);
  const maxH  = window.innerHeight * 0.3;
  const scale = Math.min(maxW / labelPxW, maxH / labelPxH, 2);

  const scaledW = Math.round(labelPxW * scale);
  const scaledH = Math.round(labelPxH * scale);

  const sizeText = selectedSize === 'large' ? '大標' : '小標';
  const dimText  = `${mm.w}×${mm.h} mm`;

  document.getElementById('preview-label').innerHTML =
    `<div class="preview-product-name">${selectedProduct.商品名稱}</div>
     <div class="preview-meta">
       <span class="preview-badge">${sizeText}<span class="preview-dim">${dimText}</span></span>
       <span class="preview-qty">${qty}<span class="preview-qty-label">張</span></span>
     </div>`;

  document.getElementById('preview-labels-wrap').innerHTML =
    `<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
      <div style="width:${scaledW}px;height:${scaledH}px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.2);border-radius:4px;">
        <div style="display:inline-block;transform:scale(${scale});transform-origin:top left;">
          <div class="label-wrapper">${single}</div>
        </div>
      </div>
      ${qty > 1 ? `<div style="font-size:12px;color:#888;width:100%;text-align:center;">預覽第 1 張，共 ${qty} 張</div>` : ''}
    </div>`;

  document.getElementById('preview-overlay').classList.add('open');
}

function closePreview() {
  document.getElementById('preview-overlay').classList.remove('open');
}

// ── Print ──
function setPaperStyle() {
  const mm = LABEL_MM[selectedSize];
  let s = document.getElementById('_page_style');
  if(!s) { s = document.createElement('style'); s.id = '_page_style'; document.head.appendChild(s); }
  const orient = (selectedSize === 'small') ? ' landscape' : '';
  const topBleed = (selectedSize === 'large') ? 1.5 : 0;
  const pageH = mm.h + topBleed;
  const marginTop = topBleed ? `${topBleed}mm` : '0';
  s.textContent = `@media print { @page { size: ${mm.w}mm ${pageH}mm${orient}; margin: ${marginTop} 0 0 0; } }`;
}

function doPrint() {
  if(!selectedProduct) return;
  // Show confirmation preview before printing
  doPreview();
}

async function doPrintFromPreview() {
  if(!selectedProduct) return;
  const qtyInput = document.getElementById('qty-input');
  const qty    = parseInt(qtyInput.value) || 1;
  const single = buildLabelHTML(selectedProduct, selectedSize);

  const qzOk = await printWithQZ(selectedSize, single, qty);
  if (qzOk) {
    closePreview();
    qtyInput.value = 1;
    return;
  }

  // fallback: browser print
  const area = document.getElementById('print-area');
  area.innerHTML = Array(qty).fill(`<div class="label-wrapper">${single}</div>`).join('');
  setPaperStyle();
  window.print();
  setTimeout(() => {
    area.innerHTML = '';
    closePreview();
    qtyInput.value = 1;
  }, 1000);
}
