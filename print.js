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
  // Preview size
  const maxW  = Math.min(window.innerWidth * 0.5, 260);
  const maxH  = window.innerHeight * 0.3;
  const scale = Math.min(maxW / labelPxW, maxH / labelPxH, 2);

  const scaledW = Math.round(labelPxW * scale);
  const scaledH = Math.round(labelPxH * scale);

  const sizeText = selectedSize === 'large' ? '大標' : '小標';

  document.getElementById('preview-product-name').textContent = selectedProduct.商品名稱;

  document.getElementById('preview-labels-wrap').innerHTML =
    `<div style="width:${scaledW}px;height:${scaledH}px;overflow:hidden;border-radius:6px;box-shadow:0 2px 12px rgba(0,0,0,0.15);">
      <div style="display:inline-block;transform:scale(${scale});transform-origin:top left;">
        <div class="label-wrapper">${single}</div>
      </div>
    </div>`;

  document.getElementById('preview-info').innerHTML =
    `<div class="preview-info-item">
       <div class="preview-info-label">尺寸</div>
       <div class="preview-info-value">${sizeText}</div>
     </div>
     <div class="preview-info-divider"></div>
     <div class="preview-info-item">
       <div class="preview-info-label">列印張數</div>
       <div class="preview-info-value preview-info-qty">${qty} 張</div>
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
