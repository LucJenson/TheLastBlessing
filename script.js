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
}

function init() {
  populateSelect("species", Object.keys(speciesMods));
  populateSelect("job", Object.keys(jobMods));
  updateRaces();
  updateAll();

  document.getElementById("species").addEventListener("change", () => { updateRaces(); updateAll(); });
  document.getElementById("race").addEventListener("change", updateAll);
  document.getElementById("job").addEventListener("change", updateAll);
}

init();

