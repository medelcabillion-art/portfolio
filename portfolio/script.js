// ===== project modal data =====
const projects = {
  taskflow: {
    title: "TaskFlow",
    tagline: "HCI course project · Vercel + Supabase",
    body: "A task management web app built with cross-device sync in mind. Tasks stay scoped per account, and a live admin view watches activity in real time through Supabase Realtime — built to explore how much of the interaction design shows up in the little details, not just the feature list.",
    tags: ["Supabase", "JavaScript", "HTML/CSS"]
  },
  pos: {
    title: "Thirteen: Eight POS",
    tagline: "Point-of-sale system · Node.js + thermal printer bridge",
    body: "A point-of-sale system built for a coffee shop, handling cash and QR payments through one toggle, computing VAT automatically, tracking inventory as items sell, and printing receipts straight to a thermal printer. Deployed via Vercel.",
    tags: ["Node.js", "JavaScript"]
  },
  agripulse: {
    title: "AgriPulse",
    tagline: "Capstone project · AIoT + ML for rice crop monitoring",
    body: "A hybrid IoT and computer vision system for smallholder rice farmers. Soil sensors feed live readings while a MobileNetV2 image classifier checks rice leaves for disease, so a farmer gets a fast, concrete signal instead of guessing.",
    tags: ["Supabase", "Python", "HTML/CSS"]
  },
  fgc: {
    title: "FGC Athlete Ledger",
    tagline: "Web app · pickleball match-making + ledger",
    body: "Built for pickleball groups where setting up matches and settling the money side usually happen as two separate, annoying steps. This tool keeps a running ledger alongside the match-maker itself — pair players for a match and see who owes who resolved at the same time, backed by Supabase so the ledger stays consistent across everyone in the group.",
    tags: ["HTML/CSS", "JavaScript", "Supabase"]
  }
};

const overlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

function openModal(key){
  const p = projects[key];
  if(!p) return;
  modalContent.innerHTML = `
    <div class="termbar">
      <span class="termdot r"></span><span class="termdot y"></span><span class="termdot g"></span>
      <span class="termtitle">~/projects/${key} — zsh</span>
      <button class="modal-close" id="modalCloseBtn" aria-label="Close">✕</button>
    </div>
    <div class="modal-inner">
      <div class="tag" style="color:var(--text-dim); font-family:'JetBrains Mono',monospace; font-size:0.78rem; margin-bottom:10px;">${p.tagline}</div>
      <h3>${p.title}</h3>
      <p>${p.body}</p>
      <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
    </div>
  `;
  overlay.classList.add('open');
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
}
function closeModal(){ overlay.classList.remove('open'); }
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.project));
});
overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// mobile nav
const navToggle = document.getElementById('navToggle');
const navlinks = document.querySelector('.navlinks');
navToggle.addEventListener('click', () => {
  const showing = navlinks.style.display === 'flex';
  navlinks.style.display = showing ? 'none' : 'flex';
  Object.assign(navlinks.style, {
    flexDirection:'column', position:'absolute', top:'60px', right:'28px',
    background:'#10160F', border:'1px solid #223026', padding:'16px 22px', gap:'16px'
  });
});

// resume button placeholder notice
document.getElementById('resumeBtn').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Add your resume PDF link to the "resumeBtn" href in the code — this button is a placeholder for now.');
});

// ===== animated circuit background =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let w, h, cols, rows, spacing = 46;
let nodes = [];
let pulses = [];

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  cols = Math.ceil(w / spacing) + 1;
  rows = Math.ceil(h / spacing) + 1;
  buildGrid();
}

function buildGrid(){
  nodes = [];
  for(let i=0;i<cols;i++){
    nodes[i] = [];
    for(let j=0;j<rows;j++){
      // randomly drop some nodes for a less rigid, more "circuit" feel
      nodes[i][j] = Math.random() > 0.22;
    }
  }
  pulses = [];
  const pulseCount = Math.max(6, Math.floor((cols*rows)/90));
  for(let k=0;k<pulseCount;k++){
    pulses.push(spawnPulse());
  }
}

function spawnPulse(){
  const startCol = Math.floor(Math.random()*cols);
  const startRow = Math.floor(Math.random()*rows);
  const horizontal = Math.random() > 0.5;
  const dir = Math.random() > 0.5 ? 1 : -1;
  const colors = ['62,255,160', '82,199,242', '255,184,104'];
  return {
    col: startCol, row: startRow,
    x: startCol*spacing, y: startRow*spacing,
    horizontal, dir,
    speed: 0.6 + Math.random()*0.9,
    color: colors[Math.floor(Math.random()*colors.length)],
    life: 0, maxLife: 300 + Math.random()*300
  };
}

function drawGrid(){
  ctx.strokeStyle = 'rgba(62,255,160,0.055)';
  ctx.lineWidth = 1;
  for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
      if(!nodes[i][j]) continue;
      if(i+1<cols && nodes[i+1][j]){
        ctx.beginPath();
        ctx.moveTo(i*spacing, j*spacing);
        ctx.lineTo((i+1)*spacing, j*spacing);
        ctx.stroke();
      }
      if(j+1<rows && nodes[i][j+1]){
        ctx.beginPath();
        ctx.moveTo(i*spacing, j*spacing);
        ctx.lineTo(i*spacing, (j+1)*spacing);
        ctx.stroke();
      }
    }
  }
}

function drawPulses(){
  pulses.forEach((p, idx) => {
    if(p.horizontal){
      p.x += p.speed * p.dir;
    } else {
      p.y += p.speed * p.dir;
    }
    p.life++;

    ctx.save();
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${p.color},0.9)`;
    ctx.fillStyle = `rgba(${p.color},0.85)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    if(p.life > p.maxLife || p.x < -50 || p.x > w+50 || p.y < -50 || p.y > h+50){
      pulses[idx] = spawnPulse();
    }
  });
}

function loop(){
  ctx.clearRect(0,0,w,h);
  drawGrid();
  drawPulses();
  requestAnimationFrame(loop);
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.addEventListener('resize', resize);
resize();
if(!prefersReduced){ loop(); } else { drawGrid(); }