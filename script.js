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
  renderStatsPanel();
  saveToBrowser();

  document.getElementById("species").addEventListener("change", () => { updateRaces(); updateAll(); });
  document.getElementById("race").addEventListener("change", updateAll);
  document.getElementById("job").addEventListener("change", () => {
  onJobChanged();   // talent logic
  updateAll();      // stat logic
  renderStatsPanel();
  saveToBrowser();

  hookRightMenu();
  hookSaveButtons();

  loadFromBrowser();   // tries to restore prior character state
  renderStatsPanel();  // left panel always up to date

  setView("creator");  // default center view
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
// ─────────────────────────────────────────────
// Twin Blade — SWG-style 4 columns + novice + master
// Stat order: HP SP TP MP PATK PDEF PHIT PEVA MATK MDEF MHIT MEVA FIR WTR AIR ERT LGT DRK
// NOTE: Fixed ID typo: Close Combat II is TBoxooII (you pasted TBoxooIII twice).
// ─────────────────────────────────────────────

const twinBladeTalents = [
  // Center spine
  {
    id: "TBNovice",
    name: "Novice Twin Blade",
    job: "Twin Blade",
    stats: { HP:12, SP:9, TP:9, MP:2, PATK:3, PDEF:1, PHIT:3, PEVA:2, MATK:1, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: [],
    col: 2,
    row: 0
  },

  // Column 1 (xooo) — Aim
  {
    id: "TBxoooI",
    name: "Aim I",
    job: "Twin Blade",
    stats: { HP:6, SP:3, TP:5, MP:0, PATK:2, PDEF:0, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:0 },
    requires: ["TBNovice"],
    col: 0,
    row: 1
  },
  {
    id: "TBxoooII",
    name: "Aim II",
    job: "Twin Blade",
    stats: { HP:6, SP:3, TP:5, MP:0, PATK:2, PDEF:0, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:0 },
    requires: ["TBxoooI"],
    col: 0,
    row: 2
  },
  {
    id: "TBxoooIII",
    name: "Aim III",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:6, MP:0, PATK:3, PDEF:0, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBxoooII"],
    col: 0,
    row: 3
  },
  {
    id: "TBxoooIV",
    name: "Aim IV",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:6, MP:0, PATK:3, PDEF:0, PHIT:5, PEVA:1, MATK:0, MDEF:0, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBxoooIII"],
    col: 0,
    row: 4
  },

  // Column 2 (oxoo) — Close Combat
  {
    id: "TBoxooI",
    name: "Close Combat I",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:3, MP:0, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBNovice"],
    col: 1,
    row: 1
  },
  {
    id: "TBoxooII",
    name: "Close Combat II",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:3, MP:0, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBoxooI"],
    col: 1,
    row: 2
  },
  {
    id: "TBoxooIII",
    name: "Close Combat III",
    job: "Twin Blade",
    stats: { HP:18, SP:6, TP:4, MP:0, PATK:4, PDEF:1, PHIT:2, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBoxooII"],
    col: 1,
    row: 3
  },
  {
    id: "TBoxooIV",
    name: "Close Combat IV",
    job: "Twin Blade",
    stats: { HP:18, SP:6, TP:4, MP:0, PATK:4, PDEF:1, PHIT:4, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBoxooIII"],
    col: 1,
    row: 4
  },

  // Column 3 (ooxo) — Stealth
  {
    id: "TBooxoI",
    name: "Stealth I",
    job: "Twin Blade",
    stats: { HP:6, SP:4, TP:4, MP:0, PATK:2, PDEF:0, PHIT:2, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBNovice"],
    col: 3,
    row: 1
  },
  {
    id: "TBooxoII",
    name: "Stealth II",
    job: "Twin Blade",
    stats: { HP:6, SP:4, TP:4, MP:0, PATK:2, PDEF:0, PHIT:2, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBooxoI"],
    col: 3,
    row: 2
  },
  {
    id: "TBooxoIII",
    name: "Stealth III",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:5, MP:0, PATK:3, PDEF:0, PHIT:2, PEVA:4, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBooxoII"],
    col: 3,
    row: 3
  },
  {
    id: "TBooxoIV",
    name: "Stealth IV",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:5, MP:0, PATK:3, PDEF:0, PHIT:4, PEVA:4, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBooxoIII"],
    col: 3,
    row: 4
  },

  // Column 4 (ooox) — Tracking
  {
    id: "TBoooxI",
    name: "Tracking I",
    job: "Twin Blade",
    stats: { HP:6, SP:3, TP:4, MP:1, PATK:2, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBNovice"],
    col: 4,
    row: 1
  },
  {
    id: "TBoooxII",
    name: "Tracking II",
    job: "Twin Blade",
    stats: { HP:6, SP:3, TP:4, MP:1, PATK:2, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBoooxI"],
    col: 4,
    row: 2
  },
  {
    id: "TBoooxIII",
    name: "Tracking III",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:5, MP:1, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBoooxII"],
    col: 4,
    row: 3
  },
  {
    id: "TBoooxIV",
    name: "Tracking IV",
    job: "Twin Blade",
    stats: { HP:12, SP:5, TP:5, MP:1, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
    requires: ["TBoooxIII"],
    col: 4,
    row: 4
  },

  // Master (top center)
  {
    id: "TBMaster",
    name: "Master Twin Blade",
    job: "Twin Blade",
    stats: { HP:24, SP:8, TP:8, MP:3, PATK:4, PDEF:2, PHIT:4, PEVA:4, MATK:1, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:1, DRK:2 },
    requires: ["TBxoooIV", "TBoxooIV", "TBooxoIV", "TBoooxIV"],
    col: 2,
    row: 4
  }
];

// ─────────────────────────────────────────────
// Wave User — SWG-style 4 columns + novice + master
// Stat order: HP SP TP MP PATK PDEF PHIT PEVA MATK MDEF MHIT MEVA FIR WTR AIR ERT LGT DRK
// ─────────────────────────────────────────────

const waveUserTalents = [
  // Center spine
  {
    id: "WUNovice",
    name: "Novice Wave User",
    job: "Wave User",
    stats: { HP:14, SP:6, TP:4, MP:16, PATK:1, PDEF:1, PHIT:3, PEVA:3, MATK:6, MDEF:5, MHIT:5, MEVA:4, FIR:1, WTR:3, AIR:3, ERT:0, LGT:3, DRK:0 },
    requires: [],
    col: 2,
    row: 0
  },

  // Column 1 (xooo) — Wave Magic
  {
    id: "WUxoooI",
    name: "Wave Magic I",
    job: "Wave User",
    stats: { HP:5, SP:2, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:4, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:1, ERT:0, LGT:1, DRK:0 },
    requires: ["WUNovice"],
    col: 0,
    row: 1
  },
  {
    id: "WUxoooII",
    name: "Wave Magic II",
    job: "Wave User",
    stats: { HP:5, SP:2, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:5, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:1, ERT:0, LGT:1, DRK:0 },
    requires: ["WUxoooI"],
    col: 0,
    row: 2
  },
  {
    id: "WUxoooIII",
    name: "Wave Magic III",
    job: "Wave User",
    stats: { HP:9, SP:3, TP:0, MP:8, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:6, MDEF:1, MHIT:3, MEVA:1, FIR:2, WTR:2, AIR:1, ERT:0, LGT:1, DRK:1 },
    requires: ["WUxoooII"],
    col: 0,
    row: 3
  },
  {
    id: "WUxoooIV",
    name: "Wave Magic IV",
    job: "Wave User",
    stats: { HP:9, SP:3, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:7, MDEF:1, MHIT:3, MEVA:1, FIR:2, WTR:2, AIR:1, ERT:0, LGT:1, DRK:1 },
    requires: ["WUxoooIII"],
    col: 0,
    row: 4
  },

  // Column 2 (oxoo) — Focus
  {
    id: "WUoxooI",
    name: "Focus I",
    job: "Wave User",
    stats: { HP:5, SP:1, TP:1, MP:6, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:3, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:2, DRK:0 },
    requires: ["WUNovice"],
    col: 1,
    row: 1
  },
  {
    id: "WUoxooII",
    name: "Focus II",
    job: "Wave User",
    stats: { HP:5, SP:1, TP:1, MP:6, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:3, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:2, DRK:0 },
    requires: ["WUoxooI"],
    col: 1,
    row: 2
  },
  {
    id: "WUoxooIII",
    name: "Focus III",
    job: "Wave User",
    stats: { HP:8, SP:2, TP:1, MP:7, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:4, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:3, DRK:0 },
    requires: ["WUoxooII"],
    col: 1,
    row: 3
  },
  {
    id: "WUoxooIV",
    name: "Focus IV",
    job: "Wave User",
    stats: { HP:8, SP:2, TP:1, MP:8, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:4, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:3, DRK:0 },
    requires: ["WUoxooIII"],
    col: 1,
    row: 4
  },

  // Column 3 (ooxo) — Summoning
  {
    id: "WUooxoI",
    name: "Summoning I",
    job: "Wave User",
    stats: { HP:7, SP:2, TP:0, MP:7, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:1, DRK:1 },
    requires: ["WUNovice"],
    col: 3,
    row: 1
  },
  {
    id: "WUooxoII",
    name: "Summoning II",
    job: "Wave User",
    stats: { HP:7, SP:2, TP:0, MP:8, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:1, DRK:1 },
    requires: ["WUooxoI"],
    col: 3,
    row: 2
  },
  {
    id: "WUooxoIII",
    name: "Summoning III",
    job: "Wave User",
    stats: { HP:11, SP:3, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:4, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:2, DRK:1 },
    requires: ["WUooxoII"],
    col: 3,
    row: 3
  },
  {
    id: "WUooxoIV",
    name: "Summoning IV",
    job: "Wave User",
    stats: { HP:11, SP:3, TP:0, MP:10, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:4, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:2, DRK:1 },
    requires: ["WUooxoIII"],
    col: 3,
    row: 4
  },

  // Column 4 (ooox) — Elemental Studies
  {
    id: "WUoooxI",
    name: "Elemental Studies I",
    job: "Wave User",
    stats: { HP:5, SP:2, TP:0, MP:7, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:2, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:1, DRK:1 },
    requires: ["WUNovice"],
    col: 4,
    row: 1
  },
  {
    id: "WUoooxII",
    name: "Elemental Studies II",
    job: "Wave User",
    stats: { HP:5, SP:2, TP:0, MP:8, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:2, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:1, DRK:1 },
    requires: ["WUoooxI"],
    col: 4,
    row: 2
  },
  {
    id: "WUoooxIII",
    name: "Elemental Studies III",
    job: "Wave User",
    stats: { HP:9, SP:3, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:2, DRK:1 },
    requires: ["WUoooxII"],
    col: 4,
    row: 3
  },
  {
    id: "WUoooxIV",
    name: "Elemental Studies IV",
    job: "Wave User",
    stats: { HP:9, SP:3, TP:0, MP:10, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:2, DRK:1 },
    requires: ["WUoooxIII"],
    col: 4,
    row: 4
  },

  // Master (top center)
  {
    id: "WUMaster",
    name: "Master Wave User",
    job: "Wave User",
    stats: { HP:22, SP:8, TP:5, MP:20, PATK:1, PDEF:2, PHIT:4, PEVA:4, MATK:8, MDEF:7, MHIT:6, MEVA:5, FIR:2, WTR:4, AIR:4, ERT:1, LGT:4, DRK:1 },
    requires: ["WUxoooIV", "WUoxooIV", "WUooxoIV", "WUoooxIV"],
    col: 2,
    row: 4
  }
];

// ─────────────────────────────────────────────
// Harvest Cleric — SWG-style 4 columns + novice + master
// Stat order: HP SP TP MP PATK PDEF PHIT PEVA MATK MDEF MHIT MEVA FIR WTR AIR ERT LGT DRK
// ─────────────────────────────────────────────

const harvestClericTalents = [
  // Center spine
  {
    id: "HCNovice",
    name: "Novice Harvest Cleric",
    job: "Harvest Cleric",
    stats: { HP:18, SP:5, TP:4, MP:11, PATK:2, PDEF:2, PHIT:3, PEVA:2, MATK:4, MDEF:4, MHIT:3, MEVA:3, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:1 },
    requires: [],
    col: 2,
    row: 0
  },

  // Column 1 (xooo) — Healing Magic
  {
    id: "HCxoooI",
    name: "Healing Magic I",
    job: "Harvest Cleric",
    stats: { HP:5, SP:2, TP:0, MP:5, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:3, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:0 },
    requires: ["HCNovice"],
    col: 0,
    row: 1
  },
  {
    id: "HCxoooII",
    name: "Healing Magic II",
    job: "Harvest Cleric",
    stats: { HP:5, SP:2, TP:0, MP:6, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:3, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:0 },
    requires: ["HCxoooI"],
    col: 0,
    row: 2
  },
  {
    id: "HCxoooIII",
    name: "Healing Magic III",
    job: "Harvest Cleric",
    stats: { HP:9, SP:3, TP:0, MP:7, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:4, MDEF:3, MHIT:3, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:4, DRK:0 },
    requires: ["HCxoooII"],
    col: 0,
    row: 3
  },
  {
    id: "HCxoooIV",
    name: "Healing Magic IV",
    job: "Harvest Cleric",
    stats: { HP:9, SP:3, TP:0, MP:8, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:4, MDEF:3, MHIT:3, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:4, DRK:0 },
    requires: ["HCxoooIII"],
    col: 0,
    row: 4
  },

  // Column 2 (oxoo) — Light Magic
  {
    id: "HCoxooI",
    name: "Light Magic I",
    job: "Harvest Cleric",
    stats: { HP:5, SP:2, TP:0, MP:4, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:2, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:3, DRK:0 },
    requires: ["HCNovice"],
    col: 1,
    row: 1
  },
  {
    id: "HCoxooII",
    name: "Light Magic II",
    job: "Harvest Cleric",
    stats: { HP:5, SP:2, TP:0, MP:5, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:3, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:3, DRK:0 },
    requires: ["HCoxooI"],
    col: 1,
    row: 2
  },
  {
    id: "HCoxooIII",
    name: "Light Magic III",
    job: "Harvest Cleric",
    stats: { HP:9, SP:3, TP:0, MP:6, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:4, MDEF:2, MHIT:3, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:4, DRK:0 },
    requires: ["HCoxooII"],
    col: 1,
    row: 3
  },
  {
    id: "HCoxooIV",
    name: "Light Magic IV",
    job: "Harvest Cleric",
    stats: { HP:9, SP:3, TP:0, MP:7, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:4, MDEF:2, MHIT:3, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:4, DRK:0 },
    requires: ["HCoxooIII"],
    col: 1,
    row: 4
  },

  // Column 3 (ooxo) — Dark Magic
  {
    id: "HCooxoI",
    name: "Dark Magic I",
    job: "Harvest Cleric",
    stats: { HP:5, SP:2, TP:0, MP:3, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:2, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:2 },
    requires: ["HCNovice"],
    col: 3,
    row: 1
  },
  {
    id: "HCooxoII",
    name: "Dark Magic II",
    job: "Harvest Cleric",
    stats: { HP:5, SP:2, TP:0, MP:4, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:2, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:2 },
    requires: ["HCooxoI"],
    col: 3,
    row: 2
  },
  {
    id: "HCooxoIII",
    name: "Dark Magic III",
    job: "Harvest Cleric",
    stats: { HP:9, SP:3, TP:0, MP:5, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:3 },
    requires: ["HCooxoII"],
    col: 3,
    row: 3
  },
  {
    id: "HCooxoIV",
    name: "Dark Magic IV",
    job: "Harvest Cleric",
    stats: { HP:9, SP:3, TP:0, MP:6, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:3 },
    requires: ["HCooxoIII"],
    col: 3,
    row: 4
  },

  // Column 4 (ooox) — Breathing
  {
    id: "HCoooxI",
    name: "Breathing I",
    job: "Harvest Cleric",
    stats: { HP:7, SP:3, TP:2, MP:3, PATK:2, PDEF:1, PHIT:2, PEVA:3, MATK:1, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:1, DRK:1 },
    requires: ["HCNovice"],
    col: 4,
    row: 1
  },
  {
    id: "HCoooxII",
    name: "Breathing II",
    job: "Harvest Cleric",
    stats: { HP:7, SP:3, TP:2, MP:4, PATK:2, PDEF:1, PHIT:2, PEVA:3, MATK:1, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:1, DRK:1 },
    requires: ["HCoooxI"],
    col: 4,
    row: 2
  },
  {
    id: "HCoooxIII",
    name: "Breathing III",
    job: "Harvest Cleric",
    stats: { HP:11, SP:4, TP:3, MP:5, PATK:2, PDEF:1, PHIT:3, PEVA:3, MATK:2, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:2, DRK:1 },
    requires: ["HCoooxII"],
    col: 4,
    row: 3
  },
  {
    id: "HCoooxIV",
    name: "Breathing IV",
    job: "Harvest Cleric",
    stats: { HP:11, SP:4, TP:3, MP:6, PATK:2, PDEF:1, PHIT:3, PEVA:3, MATK:2, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:2, DRK:1 },
    requires: ["HCoooxIII"],
    col: 4,
    row: 4
  },

  // Master (top center)
  {
    id: "HCMaster",
    name: "Master Harvest Cleric",
    job: "Harvest Cleric",
    stats: { HP:28, SP:8, TP:5, MP:17, PATK:3, PDEF:3, PHIT:4, PEVA:4, MATK:7, MDEF:5, MHIT:4, MEVA:4, FIR:0, WTR:4, AIR:2, ERT:0, LGT:6, DRK:2 },
    requires: ["HCxoooIV", "HCoxooIV", "HCooxoIV", "HCoooxIV"],
    col: 2,
    row: 4
  }
];


const talents = [
  ...bladeBrandierTalents,
  ...twinBladeTalents,
  ...waveUserTalents,
  ...harvestClericTalents
  // later: 
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
  renderStatsPanel();
  saveToBrowser();
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

function setView(viewKey) {
  const title = document.getElementById("centerTitle");
  const viewCreator = document.getElementById("viewCreator");
  const viewTalents = document.getElementById("viewTalents");
  const viewPlaceholder = document.getElementById("viewPlaceholder");
  const placeholderText = document.getElementById("placeholderText");

  // hide all
  viewCreator.classList.add("hidden");
  viewTalents.classList.add("hidden");
  viewPlaceholder.classList.add("hidden");

  if (viewKey === "back") {
    title.textContent = "—";
    viewPlaceholder.classList.remove("hidden");
    placeholderText.textContent = "(cleared)";
    return;
  }

  if (viewKey === "talents") {
    title.textContent = "Talents";
    viewTalents.classList.remove("hidden");
    renderTree();
    renderPreview();
    return;
  }

  if (viewKey === "creator") {
    title.textContent = "Character Creator";
    viewCreator.classList.remove("hidden");
    return;
  }

  // placeholders
  title.textContent =
    viewKey === "inventory" ? "Inventory" :
    viewKey === "equipment" ? "Equipment" :
    viewKey === "area" ? "Area Info" :
    viewKey === "skills" ? "Skills / Tech / Magic" :
    viewKey === "party" ? "Party" :
    "—";

  viewPlaceholder.classList.remove("hidden");
  placeholderText.textContent = "(nothing here yet)";
}

function hookRightMenu() {
  document.querySelectorAll(".navbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.view;
      setView(key);
    });
  });
}
function setView(viewKey) {
  const title = document.getElementById("centerTitle");
  const viewCreator = document.getElementById("viewCreator");
  const viewTalents = document.getElementById("viewTalents");
  const viewPlaceholder = document.getElementById("viewPlaceholder");
  const placeholderText = document.getElementById("placeholderText");

  // hide all
  viewCreator.classList.add("hidden");
  viewTalents.classList.add("hidden");
  viewPlaceholder.classList.add("hidden");

  if (viewKey === "back") {
    title.textContent = "—";
    viewPlaceholder.classList.remove("hidden");
    placeholderText.textContent = "(cleared)";
    return;
  }

  if (viewKey === "talents") {
    title.textContent = "Talents";
    viewTalents.classList.remove("hidden");
    renderTree();
    renderPreview();
    return;
  }

  if (viewKey === "creator") {
    title.textContent = "Character Creator";
    viewCreator.classList.remove("hidden");
    return;
  }

  // placeholders
  title.textContent =
    viewKey === "inventory" ? "Inventory" :
    viewKey === "equipment" ? "Equipment" :
    viewKey === "area" ? "Area Info" :
    viewKey === "skills" ? "Skills / Tech / Magic" :
    viewKey === "party" ? "Party" :
    "—";

  viewPlaceholder.classList.remove("hidden");
  placeholderText.textContent = "(nothing here yet)";
}

function hookRightMenu() {
  document.querySelectorAll(".navbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.view;
      setView(key);
    });
  });
}
const STORAGE_KEY = "dreamGameCharacter_v1";

function saveToBrowser() {
  const data = {
    name: document.getElementById("charName").value ?? "",
    level: Number(document.getElementById("charLevel").value ?? 1),
    exp: Number(document.getElementById("charExp").value ?? 0),
    species: document.getElementById("species").value,
    race: document.getElementById("race").value,
    job: document.getElementById("job").value,
    activeTalents: [...activeTalents]
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromBrowser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    const data = JSON.parse(raw);

    document.getElementById("charName").value = data.name ?? "";
    document.getElementById("charLevel").value = data.level ?? 1;
    document.getElementById("charExp").value = data.exp ?? 0;

    if (data.species) document.getElementById("species").value = data.species;
    updateRaces(); // species affects race options
    if (data.race) document.getElementById("race").value = data.race;
    if (data.job) document.getElementById("job").value = data.job;

    // restore talents (only those that exist)
    activeTalents = new Set((data.activeTalents ?? []).filter(id => talentById[id]));
    // optional: ensure novice is present if you want it forced
    // onJobChanged();

    return true;
  } catch {
    return false;
  }
}

function hookSaveButtons() {
  document.getElementById("btnSave").addEventListener("click", () => {
    saveToBrowser();
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  // autosave on edits (optional, but feels good)
  ["charName","charLevel","charExp","species","race","job"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => saveToBrowser());
    document.getElementById(id).addEventListener("input", () => saveToBrowser());
  });
}
