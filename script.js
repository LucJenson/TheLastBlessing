const STATS = ["HP","SP","TP","MP","PATK","PDEF","PHIT","PEVA","MATK","MDEF","MHIT","MEVA","FIR","WTR","AIR","ERT","LGT","DRK"];

const base = { HP:100, SP:50, TP:50, MP:50, PATK:15, PDEF:10, PHIT:95, PEVA:5, MATK:15, MDEF:10, MHIT:95, MEVA:5, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 };

const speciesMods = {
  "Human": {
    HP:0, SP:5, TP:5, MP:0, PATK:1, PDEF:1, PHIT:1, PEVA:1, MATK:1, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0
  },
  
  "Elf": {
    HP:-10, SP:0, TP:-5, MP:20, PATK:-2, PDEF:-2, PHIT:3, PEVA:3, MATK:4, MDEF:3, MHIT:4, MEVA:4, FIR:0, WTR:2, AIR:2, ERT:0, LGT:3, DRK:0
  },

  "Beast": {
    HP:20, SP:5, TP:0, MP:-10, PATK:4, PDEF:4, PHIT:0, PEVA:2, MATK:-2, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0
  }
};


const raceMods = {
  // ─── ELF ─────────────────────────
  "Fole": {
    species: "Elf",
    HP:5, SP:0, TP:0, MP:0, PATK:0, PDEF:2, PHIT:0, PEVA:0, MATK:0, MDEF:1, MHIT:0, MEVA:0, FIR:0, WTR:3, AIR:0, ERT:2, LGT:0, DRK:0
  },

  "Nume": {
    species: "Elf",
    HP:-5, SP:0, TP:0, MP:5, PATK:0, PDEF:0, PHIT:1, PEVA:2, MATK:1, MDEF:0, MHIT:1, MEVA:2, FIR:0, WTR:0, AIR:3, ERT:0, LGT:2, DRK:0
  },

  // ─── HUMAN ───────────────────────
  "Kkyn": {
    species: "Human",
    HP:10, SP:0, TP:5, MP:0, PATK:2, PDEF:1, PHIT:0, PEVA:1, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:1, WTR:0, AIR:0, ERT:1, LGT:0, DRK:0
  },

  "Oeld": {
    species: "Human",
    HP:0, SP:0, TP:0, MP:10, PATK:0, PDEF:0, PHIT:0, PEVA:0, MATK:2, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:1, AIR:0, ERT:0, LGT:2, DRK:0
  },

  // ─── BEAST ───────────────────────
  "Tamo": {
    species: "Beast",
    HP:15, SP:0, TP:0, MP:0, PATK:0, PDEF:3, PHIT:0, PEVA:-1, MATK:0, MDEF:1, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:2, LGT:0, DRK:0
  },

  "Wyld": {
    species: "Beast",
    HP:5, SP:5, TP:0, MP:0, PATK:3, PDEF:-1, PHIT:0, PEVA:2, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:1, WTR:0, AIR:0, ERT:0, LGT:0, DRK:3
  }
};


// placeholder until you add your 4 starting classes
const jobMods = {
  "Blade Brandier": {
    // Novice Blade Brandier (auto on job selection)
    HP:0,  SP:14, TP:7,  MP:0, PATK:4, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0
  },

  "Twin Blade": {
    // Novice Twin Blade (auto on job selection)
    HP:12, SP:9, TP:9, MP:2, PATK:3, PDEF:1, PHIT:3, PEVA:2, MATK:1, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1
  },

  "Wave User": {
    // Novice Wave User (auto on job selection)
    HP:14, SP:6, TP:4, MP:16, PATK:1, PDEF:1, PHIT:3, PEVA:3, MATK:6, MDEF:5, MHIT:5, MEVA:4, FIR:1, WTR:3, AIR:3, ERT:0, LGT:3, DRK:0
  },

  "Harvest Cleric": {
    // Novice Harvest Cleric (auto on job selection)
    HP:18, SP:5, TP:4, MP:11, PATK:2, PDEF:2, PHIT:3, PEVA:2, MATK:4, MDEF:4, MHIT:3, MEVA:3, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:1
  }
};


function emptyStats() {
  return Object.fromEntries(STATS.map(s => [s, 0]));
}

function add(a, b) {
  const out = {};
  for (const s of STATS) out[s] = (a[s] ?? 0) + (b[s] ?? 0);
  return out;
}

function sumMany(...objs) {
  return objs.reduce((acc, o) => add(acc, o), emptyStats());
}

function render(stats) {
  const lines = STATS.map(s => `${s.padEnd(4)} ${String(stats[s]).padStart(4)}`);
  document.getElementById("output").textContent = lines.join("\n");
}

function populateSelect(id, options) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  for (const opt of options) {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = opt;
    el.appendChild(o);
  }
}

function updateRaces() {
  const sp = document.getElementById("species").value;
  const races = Object.keys(raceMods).filter(r => raceMods[r].species === sp);
  populateSelect("race", races);
}

function updateAll() {
  const sp = document.getElementById("species").value;
  const rc = document.getElementById("race").value;
  const jb = document.getElementById("job").value;
  

  const final = sumMany(base, speciesMods[sp] ?? emptyStats(), raceMods[rc] ?? emptyStats(), jobMods[jb] ?? emptyStats());
  render(final);
  renderTree();
  renderTotals();
  renderPreview();
}

function init() {
  populateSelect("species", Object.keys(speciesMods));
  populateSelect("job", Object.keys(jobMods));
  updateRaces();
  updateAll();
  document.getElementById("species").addEventListener("change", () => { updateRaces(); updateAll(); });
  document.getElementById("race").addEventListener("change", updateAll);
  document.getElementById("job").addEventListener("change", () => {
  onJobChanged();   // talent logic
  updateAll();      // stat logic
  });
}

// ─────────────────────────────────────────────
// Talent tree data (START SMALL, then expand)
// ─────────────────────────────────────────────

  // ─────────────────────────────────────────────
// Blade Brandier — SWG-style 4 columns + novice + master
// Stat order: HP SP TP MP PATK PDEF PHIT PEVA MATK MDEF MHIT MEVA FIR WTR AIR ERT LGT DRK
// ─────────────────────────────────────────────

const bladeBrandierTalents = [
  // Center spine
  {
    id: "BBNovice",
    name: "Novice Blade Brandier",
    job: "Blade Brandier",
    stats: { HP:0, SP:14, TP:7, MP:0, PATK:4, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: [],
    col: 2,
    row: 0
  },

  // Column 1 (xooo) — Sword Handling
  {
    id: "BBxoooI",
    name: "Sword Handling I",
    job: "Blade Brandier",
    stats: { HP:0, SP:4, TP:4, MP:0, PATK:1, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBNovice"],
    col: 0,
    row: 1
  },
  {
    id: "BBxoooII",
    name: "Sword Handling II",
    job: "Blade Brandier",
    stats: { HP:0, SP:4, TP:6, MP:0, PATK:3, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:0 },
    requires: ["BBxoooI"],
    col: 0,
    row: 2
  },
  {
    id: "BBxoooIII",
    name: "Sword Handling III",
    job: "Blade Brandier",
    stats: { HP:7, SP:6, TP:7, MP:0, PATK:3, PDEF:3, PHIT:4, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
    requires: ["BBxoooII"],
    col: 0,
    row: 3
  },
  {
    id: "BBxoooIV",
    name: "Sword Handling IV",
    job: "Blade Brandier",
    stats: { HP:7, SP:7, TP:9, MP:0, PATK:4, PDEF:3, PHIT:6, PEVA:3, MATK:0, MDEF:1, MHIT:3, MEVA:3, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
    requires: ["BBxoooIII"],
    col: 0,
    row: 4
  },

  // Column 2 (oxoo) — Sword Techniques
  {
    id: "BBoxooI",
    name: "Sword Techniques I",
    job: "Blade Brandier",
    stats: { HP:0, SP:6, TP:6, MP:0, PATK:3, PDEF:1, PHIT:1, PEVA:1, MATK:0, MDEF:1, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBNovice"],
    col: 1,
    row: 1
  },
  {
    id: "BBoxooII",
    name: "Sword Techniques II",
    job: "Blade Brandier",
    stats: { HP:0, SP:7, TP:7, MP:0, PATK:4, PDEF:1, PHIT:1, PEVA:1, MATK:0, MDEF:1, MHIT:0, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBoxooI"],
    col: 1,
    row: 2
  },
  {
    id: "BBoxooIII",
    name: "Sword Techniques III",
    job: "Blade Brandier",
    stats: { HP:7, SP:9, TP:9, MP:0, PATK:4, PDEF:3, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:0, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBoxooII"],
    col: 1,
    row: 3
  },
  {
    id: "BBoxooIV",
    name: "Sword Techniques IV",
    job: "Blade Brandier",
    stats: { HP:7, SP:10, TP:10, MP:0, PATK:6, PDEF:3, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:0, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBoxooIII"],
    col: 1,
    row: 4
  },

  // Column 3 (ooxo) — Sword Arts
  {
    id: "BBooxoI",
    name: "Sword Arts I",
    job: "Blade Brandier",
    stats: { HP:0, SP:6, TP:4, MP:0, PATK:4, PDEF:2, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBNovice"],
    col: 3,
    row: 1
  },
  {
    id: "BBooxoII",
    name: "Sword Arts II",
    job: "Blade Brandier",
    stats: { HP:0, SP:7, TP:5, MP:0, PATK:4, PDEF:2, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBooxoI"],
    col: 3,
    row: 2
  },
  {
    id: "BBooxoIII",
    name: "Sword Arts III",
    job: "Blade Brandier",
    stats: { HP:7, SP:9, TP:6, MP:0, PATK:6, PDEF:2, PHIT:3, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBooxoII"],
    col: 3,
    row: 3
  },
  {
    id: "BBooxoIV",
    name: "Sword Arts IV",
    job: "Blade Brandier",
    stats: { HP:7, SP:10, TP:7, MP:0, PATK:6, PDEF:2, PHIT:3, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    requires: ["BBooxoIII"],
    col: 3,
    row: 4
  },

  // Column 4 (ooox) — Slashing Blade
  {
    id: "BBoooxI",
    name: "Slashing Blade I",
    job: "Blade Brandier",
    stats: { HP:7, SP:6, TP:5, MP:0, PATK:4, PDEF:2, PHIT:3, PEVA:3, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:0 },
    requires: ["BBNovice"],
    col: 4,
    row: 1
  },
  {
    id: "BBoooxII",
    name: "Slashing Blade II",
    job: "Blade Brandier",
    stats: { HP:7, SP:6, TP:6, MP:0, PATK:4, PDEF:2, PHIT:3, PEVA:3, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:0 },
    requires: ["BBoooxI"],
    col: 4,
    row: 2
  },
  {
    id: "BBoooxIII",
    name: "Slashing Blade III",
    job: "Blade Brandier",
    stats: { HP:11, SP:7, TP:7, MP:0, PATK:6, PDEF:2, PHIT:4, PEVA:3, MATK:0, MDEF:0, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
    requires: ["BBoooxII"],
    col: 4,
    row: 3
  },
  {
    id: "BBoooxIV",
    name: "Slashing Blade IV",
    job: "Blade Brandier",
    stats: { HP:11, SP:7, TP:8, MP:0, PATK:6, PDEF:2, PHIT:4, PEVA:3, MATK:0, MDEF:0, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
    requires: ["BBoooxIII"],
    col: 4,
    row: 4
  },

  // Master (top center)
  {
    id: "BBMaster",
    name: "Master Blade Brandier",
    job: "Blade Brandier",
    stats: { HP:22, SP:11, TP:10, MP:0, PATK:6, PDEF:4, PHIT:5, PEVA:4, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:2, DRK:0 },
    // Requires the TOP talent of all 4 columns (IV)
    requires: ["BBxoooIV", "BBoxooIV", "BBooxoIV", "BBoooxIV"],
    col: 2,
    row: 4
  }
];


// Twin Blade sample chain
const twinBladeTalents = [
  { id:"tb_novice", name:"Novice Twin Blade", job:"Twin Blade",
    stats:{ HP:12, SP:9, TP:9, MP:2, PATK:3, PDEF:1, PHIT:3, PEVA:2, MATK:1, MDEF:1, MHIT:1, MEVA:1, WTR:1, AIR:1, DRK:1 },
    requires:[] },

  { id:"tb_1", name:"Twin Blade I", job:"Twin Blade",
    stats:{ PEVA:1 }, requires:["tb_novice"] },
];


const talents = [
  ...bladeBrandierTalents,
  ...twinBladeTalents
  // later: ...waveUserTalents, ...harvestClericTalents
];

// Quick lookup maps
const talentById = Object.fromEntries(talents.map(t => [t.id, t]));

// Reverse graph: prereq -> dependents
const dependentsMap = (() => {
  const m = {};
  for (const t of talents) {
    for (const req of t.requires) {
      if (!m[req]) m[req] = [];
      m[req].push(t.id);
    }
  }
  return m;
})();

// Active talents (IDs)
let activeTalents = new Set();

// Current preview
let previewTalentId = null;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function canActivate(tid) {
  const t = talentById[tid];
  return t.requires.every(r => activeTalents.has(r));
}

function getAllDependentsClosure(rootId) {
  // all nodes that (directly/indirectly) depend on rootId
  const out = new Set();
  const stack = [...(dependentsMap[rootId] ?? [])];
  while (stack.length) {
    const id = stack.pop();
    if (out.has(id)) continue;
    out.add(id);
    const kids = dependentsMap[id] ?? [];
    for (const k of kids) stack.push(k);
  }
  return out;
}

function statAdd(a, b) {
  const out = {};
  for (const s of STATS) out[s] = (a[s] ?? 0) + (b[s] ?? 0);
  return out;
}

function formatStats(statsObj) {
  const lines = [];
  for (const s of STATS) {
    const v = statsObj[s] ?? 0;
    if (v !== 0) lines.push(`${s.padEnd(4)} ${String(v).padStart(4)}`);
  }
  return lines.length ? lines.join("\n") : "(no stat changes)";
}

function sumTalentStats() {
  let total = emptyStats();
  for (const tid of activeTalents) {
    total = statAdd(total, talentById[tid].stats);
  }
  return total;
}

// ─────────────────────────────────────────────
// Integrate with your existing character calc
// ─────────────────────────────────────────────
function computeFinalWithTalents() {
  const sp = document.getElementById("species").value;
  const rc = document.getElementById("race").value;
  const jb = document.getElementById("job").value;

  // base/species/race/job as before
  const baseLayer = sumMany(
    base,
    speciesMods[sp] ?? emptyStats(),
    raceMods[rc] ?? emptyStats(),
    jobMods[jb] ?? emptyStats()
  );

  // talents on top
  const talentLayer = sumTalentStats();
  return statAdd(baseLayer, talentLayer);
}

// ─────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────
function renderTree() {
  const jb = document.getElementById("job").value;
  const treeEl = document.getElementById("tree");
  treeEl.innerHTML = "";

  const visible = talents.filter(t => t.job === jb);

  for (const t of visible) {
    const el = document.createElement("div");
    el.className = "talent";

    const isActive = activeTalents.has(t.id);
    const isLocked = !isActive && !canActivate(t.id);

    if (isActive) el.classList.add("active");
    if (isLocked) el.classList.add("locked");

    el.style.gridColumn = t.col + 1;
    el.style.gridRow = 5 - t.row; // invert so row 0 is bottom

    el.innerHTML = `<strong>${t.name}</strong>`;

    el.addEventListener("click", () => {
      previewTalentId = t.id;
      renderPreview();
    });

    el.addEventListener("dblclick", () => {
      toggleTalent(t.id);
    });

    treeEl.appendChild(el);
  }
}

function renderPreview() {
  const p = document.getElementById("preview");
  if (!previewTalentId) {
    p.textContent = "(click a talent)";
    return;
  }
  const t = talentById[previewTalentId];
  p.textContent =
    `${t.name}\n\n` +
    `Requires: ${t.requires.length ? t.requires.join(", ") : "None"}\n\n` +
    `Stats:\n${formatStats(t.stats)}\n`;
}

function renderTotals() {
  const totalsEl = document.getElementById("totals");
  const final = computeFinalWithTalents();
  const lines = STATS.map(s => `${s.padEnd(4)} ${String(final[s]).padStart(4)}`);
  totalsEl.textContent = lines.join("\n");
}

// Main toggle behavior (SWG style)
function toggleTalent(tid) {
  const t = talentById[tid];
  const jb = document.getElementById("job").value;

  // Safety: only allow toggling talents in current job group
  if (t.job !== jb) return;

  if (activeTalents.has(tid)) {
    // Deactivate this + everything that depends on it
    const dependents = getAllDependentsClosure(tid);
    activeTalents.delete(tid);
    for (const d of dependents) activeTalents.delete(d);
  } else {
    // Activate only if prereqs are met
    if (!canActivate(tid)) return;
    activeTalents.add(tid);
  }

  renderTree();
  renderTotals();
  renderPreview();
}

// When job changes: auto-grant novice talent, clear other job talents
function onJobChanged() {
  const jb = document.getElementById("job").value;
  
  // Remove talents not belonging to this job
  for (const tid of [...activeTalents]) {
    if (talentById[tid]?.job !== jb) activeTalents.delete(tid);
  }

  // Auto-grant novice talent for this job (if you want that behavior)
  const novice = talents.find(t => t.job === jb && t.requires.length === 0 && t.name.startsWith("Novice"));
  if (novice) activeTalents.add(novice.id);

  previewTalentId = null;
  renderTree();
  renderTotals();
  renderPreview();
  
}



init();

