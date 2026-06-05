// ============================================================
// PHYS 4B Review — Shared Helpers
// See SPEC.md for design intent.
// ============================================================

// ---- Progress tracking via localStorage ----
const PROGRESS_KEY = 'phys4b-review-progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch {
    return {};
  }
}

function setProgress(fileName, status) {
  const data = getProgress();
  data[fileName] = { status, ts: Date.now() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function cycleStatus(fileName) {
  const cycles = ['todo', 'reviewing', 'done'];
  const cur = (getProgress()[fileName] || {}).status || 'todo';
  const next = cycles[(cycles.indexOf(cur) + 1) % cycles.length];
  setProgress(fileName, next);
  return next;
}

function statusLabel(s) {
  return ({
    todo: '○ 未开始',
    reviewing: '◐ 阅读中',
    done: '✓ 已复习',
  })[s] || '○ 未开始';
}

// On page load, mark current page as 'reviewing' if it was 'todo' or unset.
function markCurrentReviewing(fileName) {
  const cur = (getProgress()[fileName] || {}).status;
  if (!cur || cur === 'todo') setProgress(fileName, 'reviewing');
}

// ---- Index page tile rendering ----
function renderIndexTile(num, slug, title, meta) {
  const file = `${num}_${slug}.html`;
  const status = (getProgress()[file] || {}).status || 'todo';
  return `
    <a class="tile" href="${file}">
      <div class="tile-num">${num}</div>
      <div class="tile-title">${title}</div>
      <div class="tile-meta">${meta}</div>
      <span class="tile-status ${status}" data-file="${file}">${statusLabel(status)}</span>
    </a>
  `;
}

// Wire up status-pill clicks: cycle without navigating.
function wireStatusPills(rerenderFn) {
  document.querySelectorAll('.tile-status').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const file = pill.dataset.file;
      cycleStatus(file);
      rerenderFn();
    });
  });
}

// ---- Canvas helpers ----
function setupCanvas(id, w = 600, h = 320) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { canvas, ctx, w, h };
}

function drawAxes(ctx, w, h, opts = {}) {
  const { padL = 50, padR = 20, padT = 20, padB = 35,
          xLabel = '', yLabel = '' } = opts;
  ctx.save();
  ctx.strokeStyle = '#9ca3af';
  ctx.fillStyle = '#374151';
  ctx.lineWidth = 1;
  ctx.font = "12px -apple-system, 'PingFang SC', sans-serif";
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, h - padB);
  ctx.lineTo(w - padR, h - padB);
  ctx.stroke();
  if (xLabel) {
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, (padL + w - padR) / 2, h - padB / 4);
  }
  if (yLabel) {
    ctx.save();
    ctx.translate(padL / 3, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

// Map data coords -> canvas pixel coords
function makeMap(opts) {
  const { padL = 50, padR = 20, padT = 20, padB = 35,
          w, h, xMin, xMax, yMin, yMax } = opts;
  const xToPx = (x) => padL + (x - xMin) / (xMax - xMin) * (w - padL - padR);
  const yToPx = (y) => h - padB - (y - yMin) / (yMax - yMin) * (h - padT - padB);
  return { xToPx, yToPx };
}

// Slider helper: bind input event, update readout, call callback with parsed float.
function bindSlider(id, readoutId, callback, formatter = (v) => v.toFixed(2)) {
  const slider = document.getElementById(id);
  const readout = readoutId ? document.getElementById(readoutId) : null;
  if (!slider) return;
  const update = () => {
    const v = parseFloat(slider.value);
    if (readout) readout.textContent = formatter(v);
    callback(v);
  };
  slider.addEventListener('input', update);
  update();
}

// Multi-slider: bind several at once and call a single callback with the
// current parsed values keyed by id.
function bindSliders(specs, callback) {
  const values = {};
  function update() { callback(values); }
  specs.forEach(({ id, readoutId, format }) => {
    const slider = document.getElementById(id);
    const readout = readoutId ? document.getElementById(readoutId) : null;
    if (!slider) return;
    const refresh = () => {
      const v = parseFloat(slider.value);
      values[id] = v;
      if (readout) readout.textContent = (format || ((x) => x.toFixed(2)))(v);
      update();
    };
    slider.addEventListener('input', refresh);
    refresh();
  });
}
