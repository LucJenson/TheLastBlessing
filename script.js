/* Dream Game Stat Tester — script.js (drop-in)
   - Fixes placeholderText hard requirement (optional now)
   - Keeps SWG-style talents, novice auto-on, saves/loads
   - Town/Area Info panel support + Gate panel hooks
*/

(() => {
  // Guard against accidental double-loading (e.g., if script tag exists twice)
  if (window.__dreamGameInitialized) return;
  window.__dreamGameInitialized = true;
  let currentView = "area";
  // ─────────────────────────────────────────────
  // Stats / Core data
  // ─────────────────────────────────────────────
  const STATS = [
    "HP","SP","TP","MP",
    "PATK","PDEF","PHIT","PEVA",
    "MATK","MDEF","MHIT","MEVA",
    "FIR","WTR","AIR","ERT","LGT","DRK"
  ];

  // Display labels (so PHIT shows as PACC etc.)
  const STAT_LABEL = {
    HP: "HP",
    SP: "SP",
    MP: "MP",
    TP: "TP",
    PATK: "PATK",
    PDEF: "PDEF",
    PHIT: "PACC",
    PEVA: "PEVA",
    MATK: "MATK",
    MDEF: "MDEF",
    MHIT: "MACC",
    MEVA: "MEVA",
    FIR: "FIR",
    WTR: "WTR",
    AIR: "AIR",
    ERT: "ERT",
    LGT: "LGT",
    DRK: "DRK",
  };

  const base = {
    HP:100, SP:50, TP:50, MP:50,
    PATK:15, PDEF:10, PHIT:95, PEVA:5,
    MATK:15, MDEF:10, MHIT:95, MEVA:5,
    FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0
  };

  const speciesMods = {
    Human: { HP:0, SP:5, TP:5, MP:0, PATK:1, PDEF:1, PHIT:1, PEVA:1, MATK:1, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
    Elf:   { HP:-10, SP:0, TP:-5, MP:20, PATK:-2, PDEF:-2, PHIT:3, PEVA:3, MATK:4, MDEF:3, MHIT:4, MEVA:4, FIR:0, WTR:2, AIR:2, ERT:0, LGT:3, DRK:0 },
    Beast: { HP:20, SP:5, TP:0, MP:-10, PATK:4, PDEF:4, PHIT:0, PEVA:2, MATK:-2, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 }
  };

  const raceMods = {
    // ELF
    Fole: { species:"Elf",   HP:5,  SP:0, TP:0, MP:0,  PATK:0, PDEF:2, PHIT:0, PEVA:0, MATK:0, MDEF:1, MHIT:0, MEVA:0, FIR:0, WTR:3, AIR:0, ERT:2, LGT:0, DRK:0 },
    Nume: { species:"Elf",   HP:-5, SP:0, TP:0, MP:5,  PATK:0, PDEF:0, PHIT:1, PEVA:2, MATK:1, MDEF:0, MHIT:1, MEVA:2, FIR:0, WTR:0, AIR:3, ERT:0, LGT:2, DRK:0 },

    // HUMAN
    Kkyn: { species:"Human", HP:10, SP:0, TP:5, MP:0,  PATK:2, PDEF:1, PHIT:0, PEVA:1, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:1, WTR:0, AIR:0, ERT:1, LGT:0, DRK:0 },
    Oeld: { species:"Human", HP:0,  SP:0, TP:0, MP:10, PATK:0, PDEF:0, PHIT:0, PEVA:0, MATK:2, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:1, AIR:0, ERT:0, LGT:2, DRK:0 },

    // BEAST
    Tamo: { species:"Beast", HP:15, SP:0, TP:0, MP:0,  PATK:0, PDEF:3, PHIT:0, PEVA:-1, MATK:0, MDEF:1, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:2, LGT:0, DRK:0 },
    Wyld: { species:"Beast", HP:5,  SP:5, TP:0, MP:0,  PATK:3, PDEF:-1, PHIT:0, PEVA:2, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:1, WTR:0, AIR:0, ERT:0, LGT:0, DRK:3 }
  };

  function emptyStats() {
    return Object.fromEntries(STATS.map(s => [s, 0]));
  }

   //CHARACTER BASICS
   let character = {
      name: "",
      level: 1,
      exp: 0,
      gil: 0,
      inventory: {}
    };

   //ITEM TABLES
   const ITEMS = {
     // Consumables
     HP_POTION_I: { id: "HP_POTION_I", name: "Health Potion I", kind: "consumable" },
     EN_TONIC_I:  { id: "EN_TONIC_I",  name: "Energy Tonic I",  kind: "consumable" },

     // Weapons (starter examples)
     RUSTY_SWORD: {
       id: "RUSTY_SWORD", name: "Rusty Sword", kind: "weapon",
       slot: "weapon", tier: 1, weaponType: "Sword", damageType: "Slash",
       stats: { PATK: 2, PHIT: 1 }
     },
     TRAINING_DAGGER: {
       id: "TRAINING_DAGGER", name: "Training Dagger", kind: "weapon",
       slot: "weapon", tier: 1, weaponType: "Dagger", damageType: "Pierce",
       stats: { PATK: 1, PEVA: 1, PHIT: 1 }
     },

     // Armor (starter examples)
     CLOTH_CAP: { id: "CLOTH_CAP", name: "Cloth Cap", kind: "armor", slot: "head", tier: 1, stats: { HP: 2, PDEF: 1 } },
     LEATHER_VEST: { id: "LEATHER_VEST", name: "Leather Vest", kind: "armor", slot: "body", tier: 1, stats: { HP: 4, PDEF: 2 } },
     IRON_GREAVES: { id: "IRON_GREAVES", name: "Iron Greaves", kind: "armor", slot: "legs", tier: 1, stats: { HP: 3, PDEF: 2, PEVA: -1 } },

     // Accessories
     COPPER_RING: { id: "COPPER_RING", name: "Copper Ring", kind: "accessory", slot: "accessory1", tier: 1, stats: { PHIT: 1, MHIT: 1 } },
   };

   // ─────────────────────────────────────────────
   // Rarity + Elements (equipment instances)
   // ─────────────────────────────────────────────
   const RARITIES = [
     { key: "Common",    mult: 1.0, colorClass: "rarity-common" },
     { key: "Uncommon",  mult: 1.2, colorClass: "rarity-uncommon" },
     { key: "Rare",      mult: 1.5, colorClass: "rarity-rare" },
     { key: "Legendary", mult: 1.8, colorClass: "rarity-legendary" },
     { key: "Mythic",    mult: 2.0, colorClass: "rarity-mythic" },
   ];

   const ELEMENTS = [
     { key: "FIR", label: "Fire",  badgeClass: "elem-fir" },
     { key: "WTR", label: "Water", badgeClass: "elem-wtr" },
     { key: "AIR", label: "Air",   badgeClass: "elem-air" },
     { key: "ERT", label: "Earth", badgeClass: "elem-ert" },
     { key: "LGT", label: "Light", badgeClass: "elem-lgt" },
     { key: "DRK", label: "Dark",  badgeClass: "elem-drk" },
   ];

   const OPPOSITE_ELEMENT = {
     FIR: "WTR",
     WTR: "FIR",
     AIR: "ERT",
     ERT: "AIR",
     LGT: "DRK",
     DRK: "LGT",
   };

   function isOppositeElement(a, b) {
     return !!a && !!b && OPPOSITE_ELEMENT[a] === b;
   }

   function rarityByKey(key) {
     return RARITIES.find(r => r.key === key) ?? RARITIES[0];
   }

   function rollRarity(rng, lootTier = 1) {
     // Slightly better odds at higher tiers.
     // (Still simple and readable; tweak whenever.)
     const t = Math.max(1, Number(lootTier) || 1);
     const r = rng();
     if (t >= 4) {
       if (r < 0.02) return "Mythic";
       if (r < 0.10) return "Legendary";
       if (r < 0.30) return "Rare";
       if (r < 0.60) return "Uncommon";
       return "Common";
     }
     if (t === 3) {
       if (r < 0.01) return "Mythic";
       if (r < 0.06) return "Legendary";
       if (r < 0.22) return "Rare";
       if (r < 0.52) return "Uncommon";
       return "Common";
     }
     if (t === 2) {
       if (r < 0.005) return "Mythic";
       if (r < 0.03) return "Legendary";
       if (r < 0.14) return "Rare";
       if (r < 0.42) return "Uncommon";
       return "Common";
     }
     // tier 1
     if (r < 0.01) return "Legendary";
     if (r < 0.06) return "Rare";
     if (r < 0.30) return "Uncommon";
     return "Common";
   }

   function rollElement(rng, areaElementKey, itemKind) {
     // Equipment always gets an element (per your request), with a bias toward the dungeon element.
     const all = ELEMENTS.map(e => e.key);
     const bias = areaElementKey && all.includes(areaElementKey) ? areaElementKey : null;

     // Accessories are the "best" at element influence: higher chance to match area.
     const biasChance = itemKind === "accessory" ? 0.65 : (itemKind === "weapon" ? 0.50 : 0.40);
     if (bias && rng() < biasChance) return bias;
     return pick(rng, all);
   }

   function rollElementPower(rng, tier, rarityKey, itemKind) {
     const t = Math.max(1, Number(tier) || 1);
     const rar = rarityByKey(rarityKey);

     // Baseline element power scales with tier. Accessories scale higher.
     const base = (itemKind === "accessory" ? 3 : (itemKind === "weapon" ? 2 : 1));
     const roll = base + randInt(rng, 0, t + 1);
     return Math.max(1, Math.floor(roll * rar.mult));
   }

   // Inventory keys: consumables use base ID.
   // Gear uses a composite key so rarity/element/power are preserved.
   function makeItemKey(baseId, meta) {
     if (!meta) return baseId;
     const rarity = meta.rarity ?? "Common";
     const element = meta.element ?? "NONE";
     const power = Number(meta.elementPower ?? 0) || 0;
     return `${baseId}::${rarity}::${element}::${power}`;
   }

   function parseItemKey(invKey) {
     const s = String(invKey);
     if (!s.includes("::")) return { invKey: s, baseId: s, rarity: null, element: null, elementPower: 0 };
     const [baseId, rarity, element, power] = s.split("::");
     return {
       invKey: s,
       baseId,
       rarity: rarity || "Common",
       element: element && element !== "NONE" ? element : null,
       elementPower: Math.max(0, Number(power) || 0),
     };
   }

   function scaledStats(baseStats, rarityKey) {
     const rar = rarityByKey(rarityKey ?? "Common");
     const out = {};
     for (const k of Object.keys(baseStats || {})) {
       const v = Number(baseStats[k] ?? 0);
       // Round toward meaningful integers (avoid decimals clutter)
       out[k] = v === 0 ? 0 : Math.round(v * rar.mult);
     }
     return out;
   }

   function elementBadgeHTML(elementKey, elementPower) {
     if (!elementKey) return "";
     const e = ELEMENTS.find(x => x.key === elementKey);
     const label = e ? e.label : elementKey;
     const cls = e?.badgeClass ?? "elem-none";
     const pow = Number(elementPower || 0) > 0 ? `+${Number(elementPower || 0)}` : "";
     return `<span class="badge ${cls}">${label}${pow}</span>`;
   }

   function rarityBadgeHTML(rarityKey) {
     const rar = rarityByKey(rarityKey ?? "Common");
     return `<span class="badge ${rar.colorClass}">${rar.key}</span>`;
   }

   function getLootPoolsForTier(lootTier = 1) {
     const t = Math.max(1, Number(lootTier) || 1);
     const all = Object.values(ITEMS);
     const consumables = all.filter(it => it.kind === "consumable");
     const gearUpToTier = all.filter(it => isEquippable(it) && (Number(it.tier || 1) <= t));
     return { consumables, gearUpToTier };
   }

   //MONSTER TABLES
   const MONSTERS = [
     { id:"GOBLIN", name:"Goblin", tier:1, hp:22, patk:5, pdef:1, gilMin:3, gilMax:7 },
     { id:"WOLF",   name:"Wolf",   tier:1, hp:20, patk:6, pdef:1, gilMin:3, gilMax:8 },
     { id:"SLIME",  name:"Slime",  tier:1, hp:26, patk:4, pdef:2, gilMin:2, gilMax:6 },
   
     { id:"BANDIT", name:"Bandit", tier:2, hp:34, patk:8, pdef:3, gilMin:6, gilMax:14 },
     { id:"BOAR",   name:"Boar",   tier:2, hp:38, patk:7, pdef:4, gilMin:6, gilMax:12 },
   ];


   
  // IMPORTANT CHANGE:
  // Job stats are handled via the Novice talent (auto-active).
  const jobMods = {
    "Blade Brandier": emptyStats(),
    "Twin Blade": emptyStats(),
    "Wave User": emptyStats(),
    "Harvest Cleric": emptyStats()
  };

  function add(a, b) {
    const out = {};
    for (const s of STATS) out[s] = (a?.[s] ?? 0) + (b?.[s] ?? 0);
    return out;
  }

  function sumMany(...objs) {
    return objs.reduce((acc, o) => add(acc, o), emptyStats());
  }

  // ─────────────────────────────────────────────
  // Talent data
  // ─────────────────────────────────────────────
  // NOTE: This section is unchanged vs your current file — I’m keeping it exactly as-is.
  // (Talents arrays + merge)
  // To keep this “drop-in”, I’m pasting your existing talent arrays untouched.

  const bladeBrandierTalents = /* pasted from your file */ (window.__bbTalents ?? null);
  const twinBladeTalents     = (window.__tbTalents ?? null);
  const waveUserTalents      = (window.__wuTalents ?? null);
  const harvestClericTalents = (window.__hcTalents ?? null);

  // If you don't have those globals (you won’t), we fall back to the full arrays from your current script.
  // (This keeps the replacement truly drop-in without needing external globals.)
  // --- BEGIN FULL TALENT ARRAYS ---
  // (Yes, this is long. It’s the safest way to avoid “missing variable” issues.)

  const __bladeBrandierTalents = [
    { id:"BBNovice", name:"Novice Blade Brandier", job:"Blade Brandier",
      stats:{ HP:0, SP:14, TP:7, MP:0, PATK:4, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:[], col:2, row:0 },
    { id:"BBxoooI", name:"Sword Handling I", job:"Blade Brandier",
      stats:{ HP:0, SP:4, TP:4, MP:0, PATK:1, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBNovice"], col:0, row:1 },
    { id:"BBxoooII", name:"Sword Handling II", job:"Blade Brandier",
      stats:{ HP:0, SP:4, TP:6, MP:0, PATK:3, PDEF:1, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:0 },
      requires:["BBxoooI"], col:0, row:2 },
    { id:"BBxoooIII", name:"Sword Handling III", job:"Blade Brandier",
      stats:{ HP:7, SP:6, TP:7, MP:0, PATK:3, PDEF:3, PHIT:4, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
      requires:["BBxoooII"], col:0, row:3 },
    { id:"BBxoooIV", name:"Sword Handling IV", job:"Blade Brandier",
      stats:{ HP:7, SP:7, TP:9, MP:0, PATK:4, PDEF:3, PHIT:6, PEVA:3, MATK:0, MDEF:1, MHIT:3, MEVA:3, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
      requires:["BBxoooIII"], col:0, row:4 },

    { id:"BBoxooI", name:"Sword Techniques I", job:"Blade Brandier",
      stats:{ HP:0, SP:6, TP:6, MP:0, PATK:3, PDEF:1, PHIT:1, PEVA:1, MATK:0, MDEF:1, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBNovice"], col:1, row:1 },
    { id:"BBoxooII", name:"Sword Techniques II", job:"Blade Brandier",
      stats:{ HP:0, SP:7, TP:7, MP:0, PATK:4, PDEF:1, PHIT:1, PEVA:1, MATK:0, MDEF:1, MHIT:0, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBoxooI"], col:1, row:2 },
    { id:"BBoxooIII", name:"Sword Techniques III", job:"Blade Brandier",
      stats:{ HP:7, SP:9, TP:9, MP:0, PATK:4, PDEF:3, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:0, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBoxooII"], col:1, row:3 },
    { id:"BBoxooIV", name:"Sword Techniques IV", job:"Blade Brandier",
      stats:{ HP:7, SP:10, TP:10, MP:0, PATK:6, PDEF:3, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:0, MEVA:1, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBoxooIII"], col:1, row:4 },

    { id:"BBooxoI", name:"Sword Arts I", job:"Blade Brandier",
      stats:{ HP:0, SP:6, TP:4, MP:0, PATK:4, PDEF:2, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBNovice"], col:3, row:1 },
    { id:"BBooxoII", name:"Sword Arts II", job:"Blade Brandier",
      stats:{ HP:0, SP:7, TP:5, MP:0, PATK:4, PDEF:2, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBooxoI"], col:3, row:2 },
    { id:"BBooxoIII", name:"Sword Arts III", job:"Blade Brandier",
      stats:{ HP:7, SP:9, TP:6, MP:0, PATK:6, PDEF:2, PHIT:3, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBooxoII"], col:3, row:3 },
    { id:"BBooxoIV", name:"Sword Arts IV", job:"Blade Brandier",
      stats:{ HP:7, SP:10, TP:7, MP:0, PATK:6, PDEF:2, PHIT:3, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:0, ERT:0, LGT:0, DRK:0 },
      requires:["BBooxoIII"], col:3, row:4 },

    { id:"BBoooxI", name:"Slashing Blade I", job:"Blade Brandier",
      stats:{ HP:7, SP:6, TP:5, MP:0, PATK:4, PDEF:2, PHIT:3, PEVA:3, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:0 },
      requires:["BBNovice"], col:4, row:1 },
    { id:"BBoooxII", name:"Slashing Blade II", job:"Blade Brandier",
      stats:{ HP:7, SP:6, TP:6, MP:0, PATK:4, PDEF:2, PHIT:3, PEVA:3, MATK:0, MDEF:0, MHIT:0, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:0 },
      requires:["BBoooxI"], col:4, row:2 },
    { id:"BBoooxIII", name:"Slashing Blade III", job:"Blade Brandier",
      stats:{ HP:11, SP:7, TP:7, MP:0, PATK:6, PDEF:2, PHIT:4, PEVA:3, MATK:0, MDEF:0, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
      requires:["BBoooxII"], col:4, row:3 },
    { id:"BBoooxIV", name:"Slashing Blade IV", job:"Blade Brandier",
      stats:{ HP:11, SP:7, TP:8, MP:0, PATK:6, PDEF:2, PHIT:4, PEVA:3, MATK:0, MDEF:0, MHIT:1, MEVA:0, FIR:0, WTR:0, AIR:1, ERT:0, LGT:1, DRK:0 },
      requires:["BBoooxIII"], col:4, row:4 },

    { id:"BBMaster", name:"Master Blade Brandier", job:"Blade Brandier",
      stats:{ HP:22, SP:11, TP:10, MP:0, PATK:6, PDEF:4, PHIT:5, PEVA:4, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:2, DRK:0 },
      requires:["BBxoooIV","BBoxooIV","BBooxoIV","BBoooxIV"], col:2, row:4 }
  ];

  const __twinBladeTalents = [
    { id:"TBNovice", name:"Novice Twin Blade", job:"Twin Blade",
      stats:{ HP:12, SP:9, TP:9, MP:2, PATK:3, PDEF:1, PHIT:3, PEVA:2, MATK:1, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:[], col:2, row:0 },
    { id:"TBxoooI", name:"Aim I", job:"Twin Blade",
      stats:{ HP:6, SP:3, TP:5, MP:0, PATK:2, PDEF:0, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:0 },
      requires:["TBNovice"], col:0, row:1 },
    { id:"TBxoooII", name:"Aim II", job:"Twin Blade",
      stats:{ HP:6, SP:3, TP:5, MP:0, PATK:2, PDEF:0, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:0 },
      requires:["TBxoooI"], col:0, row:2 },
    { id:"TBxoooIII", name:"Aim III", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:6, MP:0, PATK:3, PDEF:0, PHIT:3, PEVA:1, MATK:0, MDEF:0, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBxoooII"], col:0, row:3 },
    { id:"TBxoooIV", name:"Aim IV", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:6, MP:0, PATK:3, PDEF:0, PHIT:5, PEVA:1, MATK:0, MDEF:0, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBxoooIII"], col:0, row:4 },

    { id:"TBoxooI", name:"Close Combat I", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:3, MP:0, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBNovice"], col:1, row:1 },
    { id:"TBoxooII", name:"Close Combat II", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:3, MP:0, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBoxooI"], col:1, row:2 },
    { id:"TBoxooIII", name:"Close Combat III", job:"Twin Blade",
      stats:{ HP:18, SP:6, TP:4, MP:0, PATK:4, PDEF:1, PHIT:2, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBoxooII"], col:1, row:3 },
    { id:"TBoxooIV", name:"Close Combat IV", job:"Twin Blade",
      stats:{ HP:18, SP:6, TP:4, MP:0, PATK:4, PDEF:1, PHIT:4, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:0, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBoxooIII"], col:1, row:4 },

    { id:"TBooxoI", name:"Stealth I", job:"Twin Blade",
      stats:{ HP:6, SP:4, TP:4, MP:0, PATK:2, PDEF:0, PHIT:2, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBNovice"], col:3, row:1 },
    { id:"TBooxoII", name:"Stealth II", job:"Twin Blade",
      stats:{ HP:6, SP:4, TP:4, MP:0, PATK:2, PDEF:0, PHIT:2, PEVA:3, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBooxoI"], col:3, row:2 },
    { id:"TBooxoIII", name:"Stealth III", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:5, MP:0, PATK:3, PDEF:0, PHIT:2, PEVA:4, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBooxoII"], col:3, row:3 },
    { id:"TBooxoIV", name:"Stealth IV", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:5, MP:0, PATK:3, PDEF:0, PHIT:4, PEVA:4, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBooxoIII"], col:3, row:4 },

    { id:"TBoooxI", name:"Tracking I", job:"Twin Blade",
      stats:{ HP:6, SP:3, TP:4, MP:1, PATK:2, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBNovice"], col:4, row:1 },
    { id:"TBoooxII", name:"Tracking II", job:"Twin Blade",
      stats:{ HP:6, SP:3, TP:4, MP:1, PATK:2, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:1, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBoooxI"], col:4, row:2 },
    { id:"TBoooxIII", name:"Tracking III", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:5, MP:1, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBoooxII"], col:4, row:3 },
    { id:"TBoooxIV", name:"Tracking IV", job:"Twin Blade",
      stats:{ HP:12, SP:5, TP:5, MP:1, PATK:3, PDEF:1, PHIT:2, PEVA:2, MATK:0, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:1 },
      requires:["TBoooxIII"], col:4, row:4 },

    { id:"TBMaster", name:"Master Twin Blade", job:"Twin Blade",
      stats:{ HP:24, SP:8, TP:8, MP:3, PATK:4, PDEF:2, PHIT:4, PEVA:4, MATK:1, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:1, DRK:2 },
      requires:["TBxoooIV","TBoxooIV","TBooxoIV","TBoooxIV"], col:2, row:4 }
  ];

  const __waveUserTalents = [
    { id:"WUNovice", name:"Novice Wave User", job:"Wave User",
      stats:{ HP:14, SP:6, TP:4, MP:16, PATK:1, PDEF:1, PHIT:3, PEVA:3, MATK:6, MDEF:5, MHIT:5, MEVA:4, FIR:1, WTR:3, AIR:3, ERT:0, LGT:3, DRK:0 },
      requires:[], col:2, row:0 },

    { id:"WUxoooI", name:"Wave Magic I", job:"Wave User",
      stats:{ HP:5, SP:2, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:4, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:1, ERT:0, LGT:1, DRK:0 },
      requires:["WUNovice"], col:0, row:1 },
    { id:"WUxoooII", name:"Wave Magic II", job:"Wave User",
      stats:{ HP:5, SP:2, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:5, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:1, ERT:0, LGT:1, DRK:0 },
      requires:["WUxoooI"], col:0, row:2 },
    { id:"WUxoooIII", name:"Wave Magic III", job:"Wave User",
      stats:{ HP:9, SP:3, TP:0, MP:8, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:6, MDEF:1, MHIT:3, MEVA:1, FIR:2, WTR:2, AIR:1, ERT:0, LGT:1, DRK:1 },
      requires:["WUxoooII"], col:0, row:3 },
    { id:"WUxoooIV", name:"Wave Magic IV", job:"Wave User",
      stats:{ HP:9, SP:3, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:0, MATK:7, MDEF:1, MHIT:3, MEVA:1, FIR:2, WTR:2, AIR:1, ERT:0, LGT:1, DRK:1 },
      requires:["WUxoooIII"], col:0, row:4 },

    { id:"WUoxooI", name:"Focus I", job:"Wave User",
      stats:{ HP:5, SP:1, TP:1, MP:6, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:3, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:2, DRK:0 },
      requires:["WUNovice"], col:1, row:1 },
    { id:"WUoxooII", name:"Focus II", job:"Wave User",
      stats:{ HP:5, SP:1, TP:1, MP:6, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:3, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:2, DRK:0 },
      requires:["WUoxooI"], col:1, row:2 },
    { id:"WUoxooIII", name:"Focus III", job:"Wave User",
      stats:{ HP:8, SP:2, TP:1, MP:7, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:4, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:3, DRK:0 },
      requires:["WUoxooII"], col:1, row:3 },
    { id:"WUoxooIV", name:"Focus IV", job:"Wave User",
      stats:{ HP:8, SP:2, TP:1, MP:8, PATK:0, PDEF:1, PHIT:1, PEVA:1, MATK:4, MDEF:3, MHIT:3, MEVA:3, FIR:0, WTR:1, AIR:2, ERT:0, LGT:3, DRK:0 },
      requires:["WUoxooIII"], col:1, row:4 },

    { id:"WUooxoI", name:"Summoning I", job:"Wave User",
      stats:{ HP:7, SP:2, TP:0, MP:7, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:1, DRK:1 },
      requires:["WUNovice"], col:3, row:1 },
    { id:"WUooxoII", name:"Summoning II", job:"Wave User",
      stats:{ HP:7, SP:2, TP:0, MP:8, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:1, DRK:1 },
      requires:["WUooxoI"], col:3, row:2 },
    { id:"WUooxoIII", name:"Summoning III", job:"Wave User",
      stats:{ HP:11, SP:3, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:4, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:2, DRK:1 },
      requires:["WUooxoII"], col:3, row:3 },
    { id:"WUooxoIV", name:"Summoning IV", job:"Wave User",
      stats:{ HP:11, SP:3, TP:0, MP:10, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:4, MDEF:1, MHIT:3, MEVA:1, FIR:1, WTR:3, AIR:2, ERT:0, LGT:2, DRK:1 },
      requires:["WUooxoIII"], col:3, row:4 },

    { id:"WUoooxI", name:"Elemental Studies I", job:"Wave User",
      stats:{ HP:5, SP:2, TP:0, MP:7, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:2, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:1, DRK:1 },
      requires:["WUNovice"], col:4, row:1 },
    { id:"WUoooxII", name:"Elemental Studies II", job:"Wave User",
      stats:{ HP:5, SP:2, TP:0, MP:8, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:2, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:1, DRK:1 },
      requires:["WUoooxI"], col:4, row:2 },
    { id:"WUoooxIII", name:"Elemental Studies III", job:"Wave User",
      stats:{ HP:9, SP:3, TP:0, MP:9, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:2, DRK:1 },
      requires:["WUoooxII"], col:4, row:3 },
    { id:"WUoooxIV", name:"Elemental Studies IV", job:"Wave User",
      stats:{ HP:9, SP:3, TP:0, MP:10, PATK:0, PDEF:0, PHIT:1, PEVA:1, MATK:3, MDEF:2, MHIT:3, MEVA:1, FIR:1, WTR:2, AIR:2, ERT:1, LGT:2, DRK:1 },
      requires:["WUoooxIII"], col:4, row:4 },

    { id:"WUMaster", name:"Master Wave User", job:"Wave User",
      stats:{ HP:22, SP:8, TP:5, MP:20, PATK:1, PDEF:2, PHIT:4, PEVA:4, MATK:8, MDEF:7, MHIT:6, MEVA:5, FIR:2, WTR:4, AIR:4, ERT:1, LGT:4, DRK:1 },
      requires:["WUxoooIV","WUoxooIV","WUooxoIV","WUoooxIV"], col:2, row:4 }
  ];

  const __harvestClericTalents = [
    { id:"HCNovice", name:"Novice Harvest Cleric", job:"Harvest Cleric",
      stats:{ HP:18, SP:5, TP:4, MP:11, PATK:2, PDEF:2, PHIT:3, PEVA:2, MATK:4, MDEF:4, MHIT:3, MEVA:3, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:1 },
      requires:[], col:2, row:0 },

    { id:"HCxoooI", name:"Healing Magic I", job:"Harvest Cleric",
      stats:{ HP:5, SP:2, TP:0, MP:5, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:3, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:0 },
      requires:["HCNovice"], col:0, row:1 },
    { id:"HCxoooII", name:"Healing Magic II", job:"Harvest Cleric",
      stats:{ HP:5, SP:2, TP:0, MP:6, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:3, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:3, DRK:0 },
      requires:["HCxoooI"], col:0, row:2 },
    { id:"HCxoooIII", name:"Healing Magic III", job:"Harvest Cleric",
      stats:{ HP:9, SP:3, TP:0, MP:7, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:4, MDEF:3, MHIT:3, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:4, DRK:0 },
      requires:["HCxoooII"], col:0, row:3 },
    { id:"HCxoooIV", name:"Healing Magic IV", job:"Harvest Cleric",
      stats:{ HP:9, SP:3, TP:0, MP:8, PATK:0, PDEF:1, PHIT:1, PEVA:0, MATK:4, MDEF:3, MHIT:3, MEVA:1, FIR:0, WTR:3, AIR:1, ERT:0, LGT:4, DRK:0 },
      requires:["HCxoooIII"], col:0, row:4 },

    { id:"HCoxooI", name:"Light Magic I", job:"Harvest Cleric",
      stats:{ HP:5, SP:2, TP:0, MP:4, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:2, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:3, DRK:0 },
      requires:["HCNovice"], col:1, row:1 },
    { id:"HCoxooII", name:"Light Magic II", job:"Harvest Cleric",
      stats:{ HP:5, SP:2, TP:0, MP:5, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:3, MDEF:2, MHIT:2, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:3, DRK:0 },
      requires:["HCoxooI"], col:1, row:2 },
    { id:"HCoxooIII", name:"Light Magic III", job:"Harvest Cleric",
      stats:{ HP:9, SP:3, TP:0, MP:6, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:4, MDEF:2, MHIT:3, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:4, DRK:0 },
      requires:["HCoxooII"], col:1, row:3 },
    { id:"HCoxooIV", name:"Light Magic IV", job:"Harvest Cleric",
      stats:{ HP:9, SP:3, TP:0, MP:7, PATK:1, PDEF:1, PHIT:2, PEVA:0, MATK:4, MDEF:2, MHIT:3, MEVA:1, FIR:0, WTR:2, AIR:1, ERT:0, LGT:4, DRK:0 },
      requires:["HCoxooIII"], col:1, row:4 },

    { id:"HCooxoI", name:"Dark Magic I", job:"Harvest Cleric",
      stats:{ HP:5, SP:2, TP:0, MP:3, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:2, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:2 },
      requires:["HCNovice"], col:3, row:1 },
    { id:"HCooxoII", name:"Dark Magic II", job:"Harvest Cleric",
      stats:{ HP:5, SP:2, TP:0, MP:4, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:2, MDEF:1, MHIT:2, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:2 },
      requires:["HCooxoI"], col:3, row:2 },
    { id:"HCooxoIII", name:"Dark Magic III", job:"Harvest Cleric",
      stats:{ HP:9, SP:3, TP:0, MP:5, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:3 },
      requires:["HCooxoII"], col:3, row:3 },
    { id:"HCooxoIV", name:"Dark Magic IV", job:"Harvest Cleric",
      stats:{ HP:9, SP:3, TP:0, MP:6, PATK:1, PDEF:0, PHIT:2, PEVA:1, MATK:3, MDEF:1, MHIT:3, MEVA:1, FIR:0, WTR:1, AIR:1, ERT:0, LGT:0, DRK:3 },
      requires:["HCooxoIII"], col:3, row:4 },

    { id:"HCoooxI", name:"Breathing I", job:"Harvest Cleric",
      stats:{ HP:7, SP:3, TP:2, MP:3, PATK:2, PDEF:1, PHIT:2, PEVA:3, MATK:1, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:1, DRK:1 },
      requires:["HCNovice"], col:4, row:1 },
    { id:"HCoooxII", name:"Breathing II", job:"Harvest Cleric",
      stats:{ HP:7, SP:3, TP:2, MP:4, PATK:2, PDEF:1, PHIT:2, PEVA:3, MATK:1, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:1, DRK:1 },
      requires:["HCoooxI"], col:4, row:2 },
    { id:"HCoooxIII", name:"Breathing III", job:"Harvest Cleric",
      stats:{ HP:11, SP:4, TP:3, MP:5, PATK:2, PDEF:1, PHIT:3, PEVA:3, MATK:2, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:2, DRK:1 },
      requires:["HCoooxII"], col:4, row:3 },
    { id:"HCoooxIV", name:"Breathing IV", job:"Harvest Cleric",
      stats:{ HP:11, SP:4, TP:3, MP:6, PATK:2, PDEF:1, PHIT:3, PEVA:3, MATK:2, MDEF:2, MHIT:2, MEVA:2, FIR:0, WTR:2, AIR:2, ERT:0, LGT:2, DRK:1 },
      requires:["HCoooxIII"], col:4, row:4 },

    { id:"HCMaster", name:"Master Harvest Cleric", job:"Harvest Cleric",
      stats:{ HP:28, SP:8, TP:5, MP:17, PATK:3, PDEF:3, PHIT:4, PEVA:4, MATK:7, MDEF:5, MHIT:4, MEVA:4, FIR:0, WTR:4, AIR:2, ERT:0, LGT:6, DRK:2 },
      requires:["HCxoooIV","HCoxooIV","HCooxoIV","HCoooxIV"], col:2, row:4 }
  ];
  // --- END FULL TALENT ARRAYS ---

  const talents = [
    ...__bladeBrandierTalents,
    ...__twinBladeTalents,
    ...__waveUserTalents,
    ...__harvestClericTalents
  ];

  const talentById = Object.fromEntries(talents.map(t => [t.id, t]));

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

  let activeTalents = new Set();
  let previewTalentId = null;

  // ─────────────────────────────────────────────
  // Talent helpers
  // ─────────────────────────────────────────────
  function canActivate(tid) {
    const t = talentById[tid];
    if (!t) return false;
    return t.requires.every(r => activeTalents.has(r));
  }

  function getAllDependentsClosure(rootId) {
    const out = new Set();
    const stack = [...(dependentsMap[rootId] ?? [])];
    while (stack.length) {
      const id = stack.pop();
      if (out.has(id)) continue;
      out.add(id);
      for (const k of (dependentsMap[id] ?? [])) stack.push(k);
    }
    return out;
  }

  function sumTalentStats() {
    let total = emptyStats();
    for (const tid of activeTalents) {
      const t = talentById[tid];
      if (t) total = add(total, t.stats);
    }
    return total;
  }

  function computeFinal() {
    const sp = el("species").value;
    const rc = el("race").value;

    const baseLayer = sumMany(
      base,
      speciesMods[sp] ?? emptyStats(),
      raceMods[rc] ?? emptyStats()
    );

    const talentLayer = sumTalentStats();
    const equipLayer = sumEquipmentStats();
    return sumMany(baseLayer, talentLayer, equipLayer);
  }

  // ─────────────────────────────────────────────
  // UI rendering
  // ─────────────────────────────────────────────
  function renderStatsPanel() {
    const statsTable = el("statsTable");
    const final = computeFinal();
    statsTable.innerHTML = "";

    for (const key of STATS) {
      const row = document.createElement("div");
      row.className = "stat-row";

      const k = document.createElement("div");
      k.className = "stat-key";
      k.textContent = STAT_LABEL[key] ?? key;

      const v = document.createElement("div");
      v.className = "stat-val";
      const maxVal = Number(final[key] ?? 0);
      
      if (["HP","MP","SP","TP"].includes(key)) {
        character = ensureEconomyFieldsOnCharacter(character);
        syncCurrentResourcesToMax({ fillMissing: true });
      
        const curVal = character.cur[key];
        v.textContent = `${curVal}/${maxVal}`;
      } else {
        v.textContent = String(maxVal);
      }



      row.appendChild(k);
      row.appendChild(v);
      statsTable.appendChild(row);
    }
  }

  function formatStats(statsObj) {
    const lines = [];
    for (const s of STATS) {
      const v = statsObj?.[s] ?? 0;
      if (v !== 0) lines.push(`${(STAT_LABEL[s] ?? s).padEnd(4)} ${String(v).padStart(4)}`);
    }
    return lines.length ? lines.join("\n") : "(no stat changes)";
  }

  function renderPreview() {
    const p = el("preview");
    if (!previewTalentId) {
      p.textContent = "(click a talent)";
      return;
    }
    const t = talentById[previewTalentId];
    if (!t) {
      p.textContent = "(unknown talent)";
      return;
    }

    p.textContent =
      `${t.name}\n\n` +
      `Requires: ${t.requires.length ? t.requires.join(", ") : "None"}\n\n` +
      `Stats:\n${formatStats(t.stats)}\n`;
  }

  function renderTree() {
    const jb = el("job").value;
    const treeEl = el("tree");
    treeEl.innerHTML = "";

    const visible = talents.filter(t => t.job === jb);
    for (const t of visible) {
      const node = document.createElement("div");
      node.className = "talent";

      const isActive = activeTalents.has(t.id);
      const isLocked = !isActive && !canActivate(t.id);

      if (isActive) node.classList.add("active");
      if (isLocked) node.classList.add("locked");

      node.style.gridColumn = (t.col ?? 0) + 1;
      node.style.gridRow = 5 - (t.row ?? 0); // invert so row 0 is bottom

      node.innerHTML = `<strong>${t.name}</strong>`;

      node.addEventListener("click", () => {
        previewTalentId = t.id;
        renderPreview();
      });

      node.addEventListener("dblclick", () => {
        toggleTalent(t.id);
      });

      treeEl.appendChild(node);
    }
  }

  function toggleTalent(tid) {
    const t = talentById[tid];
    if (!t) return;

    const jb = el("job").value;
    if (t.job !== jb) return;

    // Prevent turning off Novice (baseline)
    if (t.requires.length === 0 && t.name.startsWith("Novice")) return;

    if (activeTalents.has(tid)) {
      const dependents = getAllDependentsClosure(tid);
      activeTalents.delete(tid);
      for (const d of dependents) activeTalents.delete(d);
    } else {
      if (!canActivate(tid)) return;
      activeTalents.add(tid);
    }

    renderTree();
    renderPreview();
    renderStatsPanel();
    saveToBrowser();
  }

  function ensureNoviceForJob(jobName) {
    const novice = talents.find(t =>
      t.job === jobName &&
      t.requires.length === 0 &&
      t.name.startsWith("Novice")
    );
    if (novice) activeTalents.add(novice.id);
  }

  function onJobChanged() {
    const jb = el("job").value;

    for (const tid of [...activeTalents]) {
      const t = talentById[tid];
      if (!t || t.job !== jb) activeTalents.delete(tid);
    }

    ensureNoviceForJob(jb);

    if (previewTalentId && talentById[previewTalentId]?.job !== jb) {
      previewTalentId = null;
    }

    renderTree();
    renderPreview();
    renderStatsPanel();
    saveToBrowser();
  }

   // ─────────────────────────────────────────────
   // Deterministic seed + RNG (same keywords => same area)
   // ─────────────────────────────────────────────
   function hashStringToUint32(str) {
     // FNV-1a 32-bit
     let h = 0x811c9dc5;
     for (let i = 0; i < str.length; i++) {
       h ^= str.charCodeAt(i);
       h = Math.imul(h, 0x01000193);
     }
     return h >>> 0;
   }
   
   function mulberry32(seed) {
     return function () {
       let t = (seed += 0x6D2B79F5);
       t = Math.imul(t ^ (t >>> 15), t | 1);
       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
       return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
     };
   }
   
   function pick(rng, arr) {
     return arr[Math.floor(rng() * arr.length)];
   }
   
   function randInt(rng, min, max) {
     return Math.floor(rng() * (max - min + 1)) + min;
   }

   // ─────────────────────────────────────────────
   // Area generation
   // ─────────────────────────────────────────────
   function generateAreaFromKeywords(rootTownId, w1, w2, w3) {
     const phrase = `${rootTownId}::${w1}::${w2}::${w3}`.toLowerCase();
     const seed = hashStringToUint32(phrase);
     const rng = mulberry32(seed);
   
     const biomes = ["Ruins", "Forest", "Wetlands", "Cavern", "Highlands", "Coast"];
     const moods  = ["Quiet", "Haunted", "Feral", "Ancient", "Stormy", "Glittering"];
     const types  = ["Field", "Dungeon"]; // keep it simple for now
   
     const type = pick(rng, types);
     const biome = pick(rng, biomes);
     const mood = pick(rng, moods);

     // Dungeon/area element: enemies match this element.
     // (A simple mapping now; easy to tweak later.)
     const biomeToElem = {
       Ruins: "DRK",
       Forest: "ERT",
       Wetlands: "WTR",
       Cavern: "DRK",
       Highlands: "AIR",
       Coast: "WTR",
     };
     // Moods can override sometimes (e.g. Glittering => Light, Haunted => Dark)
     const moodToElem = { Glittering: "LGT", Haunted: "DRK", Stormy: "AIR" };
     const elementKey = (moodToElem[mood] ?? biomeToElem[biome] ?? pick(rng, ["FIR","WTR","AIR","ERT","LGT","DRK"]));
   
     // Later: tie this to player level + keyword tiers + town
     const level = randInt(rng, 1, 5);
     const rooms = type === "Dungeon" ? randInt(rng, 6, 12) : randInt(rng, 3, 6);
   
     const monsterTier = Math.max(1, Math.floor((level + randInt(rng, 0, 2)) / 2));
     const lootTier = Math.max(1, Math.floor((level + randInt(rng, 0, 2)) / 2));
   
     const areaId = `A_${seed.toString(16).padStart(8, "0")}`;
     
     const name = `${w1} ${w2} ${w3} — The ${mood} ${biome} (${type})`;

     const roomList = generateRoomsForArea(seed, rooms);
   
     return {
       id: areaId,
       seed,
       phrase,
       type,
       name,
       rootTownId,
       keywords: [w1, w2, w3],
       recommendedLevel: level,
       rooms,
       monsterTier,
       lootTier,
       elementKey,
       roomsTotal: rooms,
       rooms: roomList,
       roomIndex: 0,
       entered: false,
       roomResolved: false,

       // room-by-room comes next; this is enough to "arrive"
     };
   }
   
   function travelToArea(areaObj) {
     currentArea = areaObj;
     saveWorldState();

     // entering a new area: not entered yet, room not resolved
     currentArea.entered = false;
     currentArea.roomIndex = currentArea.roomIndex ?? 0;
     currentArea.roomResolved = false;
     // Automatically show Area Info when you travel
     setView("area");
     renderAreaInfo();
   }

   function generateRoomsForArea(seed, roomCount) {
     const rng = mulberry32(seed ^ 0xA5A5A5A5);
   
     const kinds = ["Encounter", "Chest", "Safe", "Event"];
     const rooms = [];
   
     rooms.push({ index: 0, kind: "Entry" });
   
     for (let i = 1; i < roomCount - 1; i++) {
       rooms.push({ index: i, kind: pick(rng, kinds) });
     }
   
     rooms.push({ index: roomCount - 1, kind: "Exit" });
   
     return rooms;
   }

   
   // ─────────────────────────────────────────────
   // World state storage (current area)
   // ─────────────────────────────────────────────
   const WORLD_KEY = "dreamGameWorld_v1";
   
   function saveWorldState() {
     try {
       localStorage.setItem(WORLD_KEY, JSON.stringify({ currentArea }));
     } catch {}
   }
   
   function loadWorldState() {
     try {
       const raw = localStorage.getItem(WORLD_KEY);
       if (!raw) return;
       const data = JSON.parse(raw);
       if (data?.currentArea?.id) currentArea = data.currentArea;
     } catch {}
   }

   function ensureEconomyFieldsOnCharacter(ch) {
     if (!ch) return ch;
   
     if (typeof ch.gil !== "number") ch.gil = 0;
     if (!ch.inventory || typeof ch.inventory !== "object") ch.inventory = {};
   
     // Current resource overlay (current values)
     if (!ch.cur || typeof ch.cur !== "object") ch.cur = {};
     for (const k of ["HP", "MP", "SP", "TP"]) {
       if (typeof ch.cur[k] !== "number") ch.cur[k] = null; // null = “not initialized yet”
     }

     // Equipment + XP pools (used for Equipment panel + talent requirements later)
     if (!ch.equipment || typeof ch.equipment !== "object") ch.equipment = {};
     if (!ch.expPools || typeof ch.expPools !== "object") ch.expPools = { weapon: {}, damage: {} };
     if (!ch.expPools.weapon || typeof ch.expPools.weapon !== "object") ch.expPools.weapon = {};
     if (!ch.expPools.damage || typeof ch.expPools.damage !== "object") ch.expPools.damage = {};
   
     return ch;
   }

   const EQUIPMENT_SLOTS = [
     { key: "weapon" },
     { key: "head" },
     { key: "body" },
     { key: "legs" },
     { key: "accessory1" },
   ];

   function slotLabel(slotKey) {
     const map = {
       weapon: "Weapon",
       head: "Head",
       body: "Body",
       legs: "Legs",
       accessory1: "Accessory",
     };
     return map[slotKey] ?? slotKey;
   }

   function isEquippable(item) {
     return !!item && (item.kind === "weapon" || item.kind === "armor" || item.kind === "accessory") && !!item.slot;
   }

   function equipItem(invKey) {
     character = ensureEconomyFieldsOnCharacter(character);
     const meta = parseItemKey(invKey);
     const item = ITEMS[meta.baseId];
     if (!isEquippable(item)) return;

     const qty = Number(character.inventory?.[invKey] ?? 0);
     if (qty <= 0) return;

     const slot = item.slot;
     const prev = character.equipment?.[slot];

     // Unequip previous item in that slot back to inventory
     if (prev) character.inventory[prev] = (character.inventory[prev] || 0) + 1;

     // Move item from inventory -> equipment
     character.inventory[invKey] = qty - 1;
     if (character.inventory[invKey] <= 0) delete character.inventory[invKey];
     character.equipment[slot] = invKey;

     saveToBrowser();
   }

   function unequipSlot(slotKey) {
     character = ensureEconomyFieldsOnCharacter(character);
     const cur = character.equipment?.[slotKey];
     if (!cur) return;

     character.inventory[cur] = (character.inventory[cur] || 0) + 1;
     delete character.equipment[slotKey];
     saveToBrowser();
   }

   function sumEquipmentStats() {
     character = ensureEconomyFieldsOnCharacter(character);
     const eq = character.equipment || {};

     let total = emptyStats();
     for (const slot of EQUIPMENT_SLOTS) {
       const invKey = eq[slot.key];
       if (!invKey) continue;
       const meta = parseItemKey(invKey);
       const item = ITEMS[meta.baseId];
       const st = item?.stats;
       const rarity = meta.rarity ? rarityByKey(meta.rarity) : rarityByKey("Common");
       const elemKey = meta.element;
       const elemPower = Number(meta.elementPower || 0) || 0;
       if (st) {
         // st may be partial; merge into STATS list
         const layer = emptyStats();
         for (const k of Object.keys(st)) {
           layer[k] = Math.round(Number(st[k] ?? 0) * (rarity.mult || 1));
         }

         // Element attached to gear: adds to the corresponding element stat (used for resistance)
         if (elemKey && STATS.includes(elemKey)) {
           layer[elemKey] = (layer[elemKey] || 0) + elemPower;
         }
         total = add(total, layer);
       }
     }

     return total;
   }

   function getEquippedWeaponInstance() {
     character = ensureEconomyFieldsOnCharacter(character);
     const invKey = character.equipment?.weapon;
     if (!invKey) return null;
     const meta = parseItemKey(invKey);
     const item = ITEMS[meta.baseId];
     if (!item || item.kind !== "weapon") return null;
     return { invKey, meta, item };
   }

   function syncCurrentResourcesToMax({ fillMissing = true } = {}) {
     character = ensureEconomyFieldsOnCharacter(character);
   
     const max = computeFinal(); // gives max HP/MP/SP/TP
     for (const k of ["HP", "MP", "SP", "TP"]) {
       const m = Math.max(1, Number(max[k] ?? 1));
   
       // initialize if missing
       if (fillMissing && (character.cur[k] === null || typeof character.cur[k] !== "number")) {
         character.cur[k] = m;
       }
   
       // clamp if above max
       if (typeof character.cur[k] === "number") {
         character.cur[k] = Math.min(character.cur[k], m);
         character.cur[k] = Math.max(character.cur[k], 0);
       }
     }
   }

   
   function addGil(amount) {
     character = ensureEconomyFieldsOnCharacter(character);
     character.gil = (character.gil || 0) + amount;
      
     saveToBrowser();
      if (currentView === "inventory") renderInventory();

   }
   
   function addItem(baseId, amount = 1, meta = null) {
     character = ensureEconomyFieldsOnCharacter(character);
     const key = makeItemKey(baseId, meta);
     character.inventory[key] = (character.inventory[key] || 0) + amount;
     saveToBrowser();
     if (currentView === "inventory") renderInventory();
   }
   
  // ─────────────────────────────────────────────
  // Area / Town state (starter)
  // ─────────────────────────────────────────────
  let currentArea = {
    id: "TownA",
    type: "Town",
    name: "TownA",
  };

   function renderAreaInfo() {
     const areaName = document.getElementById("areaName");
     const areaType = document.getElementById("areaType");
   
     const gatePanel = document.getElementById("gatePanel");
     const gateOutput = document.getElementById("gateOutput");
   
     const btnGate   = document.getElementById("btnAccessGate");
     const btnWeapon = document.getElementById("btnWeaponShop");
     const btnArmor  = document.getElementById("btnArmorShop");
     const btnItem   = document.getElementById("btnItemShop");
   
     const btnEnter  = document.getElementById("btnEnterArea");
     const btnNext   = document.getElementById("btnNextRoom");
     const btnReturn = document.getElementById("btnReturnTown");
   
     const roomCard  = document.getElementById("roomCard");
   
     if (areaName) areaName.textContent = currentArea?.name ?? "(unknown)";
     if (areaType) areaType.textContent = currentArea?.type ?? "(unknown)";
   
     const isTown = currentArea?.type === "Town";
     const isArea = !isTown;
   
     // Always collapse gate UI when re-rendering
     if (gatePanel) gatePanel.classList.add("hidden");
   
     // ── Town: Gate + shops ONLY ─────────────────
     if (isTown) {
       if (btnGate) btnGate.classList.remove("hidden");
       [btnWeapon, btnArmor, btnItem].forEach(b => b && b.classList.remove("hidden"));
   
       [btnEnter, btnNext, btnReturn].forEach(b => b && b.classList.add("hidden"));
       if (roomCard) roomCard.classList.add("hidden");
   
       if (gateOutput) gateOutput.textContent = "(enter 3 keywords)";
       return;
     }
   
     // ── Area: NEVER show Gate or Shops ──────────
     if (btnGate) btnGate.classList.add("hidden");
     [btnWeapon, btnArmor, btnItem].forEach(b => b && b.classList.add("hidden"));
   
     // Return to town is available in an area, except during an active fight
     if (btnReturn) btnReturn.classList.toggle("hidden", !!currentArea.currentEncounter);
   
     // If not entered yet: show Enter Area only
     if (!currentArea.entered) {
       if (btnEnter) btnEnter.classList.remove("hidden");
       if (btnNext) btnNext.classList.add("hidden");
       if (roomCard) roomCard.classList.add("hidden");
   
       if (gateOutput) {
         const kw = currentArea.keywords?.join(" / ") ?? "(unknown keywords)";
         gateOutput.textContent =
           `Keywords: ${kw}\n` +
           `Arrived: ${currentArea.name}\n` +
           `Ready to enter.`;
       }
       return;
     }
   
     // Entered: show Room Card. (We keep Next Room hidden; room resolution advances automatically.)
     if (btnEnter) btnEnter.classList.add("hidden");
     if (btnNext) btnNext.classList.add("hidden");
     if (roomCard) roomCard.classList.remove("hidden");

     // Next Room is optional debugging; keep it disabled unless room resolved.
     if (btnNext) btnNext.disabled = !currentArea.roomResolved;
   
     // Show area + room status
     if (gateOutput) {
       const kw = currentArea.keywords?.join(" / ") ?? "(unknown keywords)";
       const idx = currentArea.roomIndex ?? 0;
       const total = currentArea.roomsTotal ?? (currentArea.rooms?.length ?? 0);
       const kind = currentArea.rooms?.[idx]?.kind ?? "(unknown)";
       gateOutput.textContent =
         `Keywords: ${kw}\n` +
         `Progress: Room ${idx + 1} / ${total}\n` +
         `Current Room: ${kind}\n` +
         `Resolved: ${currentArea.roomResolved ? "Yes" : "No"}`;
     }
   
        renderRoomCard();        // updates resolve button text/visibility
   
      hookRoomResolveButton(); // ensures button is bound
      hookEncounterButtons();
   }


   function renderRoomCard() {
     const title = document.getElementById("roomTitle");
     const sub = document.getElementById("roomSubtitle");
     const log = document.getElementById("roomLog");
     const btn = document.getElementById("btnResolveRoom");
     const atk = document.getElementById("btnAttack");
     const flee = document.getElementById("btnFlee");
     const inFight = !!currentArea.currentEncounter;

      
      const awaiting = !!currentArea.awaitingContinue;
      if (btn) {
        const resolved = !!currentArea.roomResolved;
        // While waiting for "Continue", keep the button visible/enabled.
        btn.disabled = inFight || (resolved && !awaiting);
        btn.classList.toggle("hidden", inFight || (resolved && !awaiting));
      }
      
     if (!title || !sub || !log || !btn) return;
   
     if (!currentArea || currentArea.type === "Town") {
       title.textContent = "Room";
       sub.textContent = "(in town)";
       log.textContent = "(no room)";
       btn.disabled = true;
       return;
     }
   
     const idx = currentArea.roomIndex ?? 0;
     const total = currentArea.roomsTotal ?? (currentArea.rooms?.length ?? 0);
     const room = currentArea.rooms?.[idx];
   
     title.textContent = `Room ${idx + 1} / ${total}`;
     sub.textContent = `Type: ${room?.kind ?? "(unknown)"}`;
     btn.disabled = false;
   
     // Keep existing log if you want; only reset when room changes
     if (!currentArea._lastRenderedRoom || currentArea._lastRenderedRoom !== idx) {
       log.textContent =
         `Entered room ${idx + 1}.\n` +
         `This room is: ${room?.kind ?? "Unknown"}.\n`;
       currentArea._lastRenderedRoom = idx;
     }
   
     // Change button label by room kind
     const kind = room?.kind ?? "Unknown";
     if (btn && awaiting) {
       btn.textContent = "Continue";
     } else if (btn) btn.textContent =
       kind === "Entry" ? "Step Forward" :
       kind === "Encounter" ? "Fight" :
       kind === "Chest" ? "Open Chest" :
       kind === "Safe" ? "Rest" :
       kind === "Event" ? "Investigate" :
       kind === "Exit" ? "Leave Area" :
       "Resolve Room";

      if (atk) atk.classList.toggle("hidden", !inFight);
      if (flee) flee.classList.toggle("hidden", !inFight);

      // (button visibility/enablement handled at the top of this function)
      
   }

   
   function hookTownButtons() {
     const btnEnterArea  = document.getElementById("btnEnterArea");
     const btnNextRoom   = document.getElementById("btnNextRoom");
     const btnReturnTown = document.getElementById("btnReturnTown");
     const btnGate = document.getElementById("btnAccessGate");
     const btnWeapon = document.getElementById("btnWeaponShop");
     const btnArmor  = document.getElementById("btnArmorShop");
     const btnItem   = document.getElementById("btnItemShop");
   
     const gatePanel = document.getElementById("gatePanel");
     const btnOpenGate  = document.getElementById("btnOpenGate");
     const btnCloseGate = document.getElementById("btnCloseGate");
     const w1 = document.getElementById("gateWord1");
     const w2 = document.getElementById("gateWord2");
     const w3 = document.getElementById("gateWord3");
     const out = document.getElementById("gateOutput");
   
     function showPlaceholder(msg) {
       // If you're not in Area view, this still writes to gateOutput if it exists
       if (out) out.textContent = msg;
     }
   
     // Gate panel open/close
     if (btnGate && gatePanel) {
       btnGate.addEventListener("click", () => {
         gatePanel.classList.remove("hidden");
         if (out) out.textContent = "(enter 3 keywords)";
       });
     }
   
     if (btnCloseGate && gatePanel) {
       btnCloseGate.addEventListener("click", () => gatePanel.classList.add("hidden"));
     }
   
     // Placeholder shop buttons
     if (btnWeapon) btnWeapon.addEventListener("click", () => showPlaceholder("(weapon shop later)"));
     if (btnArmor)  btnArmor.addEventListener("click", () => showPlaceholder("(armor shop later)"));
     if (btnItem)   btnItem.addEventListener("click", () => showPlaceholder("(item shop later)"));

      if (btnEnterArea) {
        btnEnterArea.addEventListener("click", () => {
          if (currentArea?.type === "Town") return;

          currentArea.runNonce = (currentArea.runNonce || 0) + 1;
          currentArea.currentEncounter = null; // clear any old fight
          currentArea.entered = true;
          currentArea.roomResolved = false;
          currentArea._lastRenderedRoom = null;
      
          saveWorldState();
          renderAreaInfo();
        });
      }
      
      if (btnNextRoom) {
        btnNextRoom.addEventListener("click", () => {
          if (currentArea?.type === "Town") return;
          if (!currentArea.entered) return;
          if (!currentArea.roomResolved) return; // hard lock
      
          const total = currentArea.roomsTotal ?? (currentArea.rooms?.length ?? 0);
          if (!total) return;
      
          currentArea.roomIndex = Math.min((currentArea.roomIndex ?? 0) + 1, total - 1);
          currentArea.roomResolved = false;
          currentArea._lastRenderedRoom = null;
      
          saveWorldState();
          renderAreaInfo();
        });
      }

      
      if (btnReturnTown) {
        btnReturnTown.addEventListener("click", () => {
          const townId = currentArea?.rootTownId ?? "TownA";
          currentArea = { id: townId, type: "Town", name: townId };
      
          saveWorldState();
          setView("area");
        });
      }

      
     // Open Gate => generate + travel
     if (btnOpenGate && w1 && w2 && w3 && out) {
       btnOpenGate.addEventListener("click", () => {
         const a = (w1.value || "").trim();
         const b = (w2.value || "").trim();
         const c = (w3.value || "").trim();
   
         if (!a || !b || !c) {
           out.textContent = "(enter 3 keywords)";
           return;
         }
   
         const rootTownId =
           currentArea?.type === "Town"
             ? currentArea.id
             : (currentArea.rootTownId ?? "TownA");
   
         const area = generateAreaFromKeywords(rootTownId, a, b, c);
   
         out.textContent =
           `Gate Opened!\n` +
           `Destination: ${area.name}\n` +
           `ID: ${area.id}\n` +
           `Seed: ${area.seed}\n` +
           `Rooms: ${area.rooms}\n`;
   
         travelToArea(area);
       });
     }
   }

  const KO_GIL_COST = 100;

  function handleKnockout(returnReason = "knocked out") {
    character = ensureEconomyFieldsOnCharacter(character);

    const cost = Math.max(0, Number(KO_GIL_COST) || 0);
    if (cost > 0) character.gil = Math.max(0, (character.gil || 0) - cost);

    // Return to town + full restore
    const max = computeFinal();
    const townId = currentArea.rootTownId ?? "TownA";
    currentArea = { id: townId, type: "Town", name: townId };

    syncCurrentResourcesToMax({ fillMissing: true });
    character.cur.HP = max.HP;
    character.cur.MP = max.MP;
    character.cur.SP = max.SP;
    character.cur.TP = max.TP;
    saveToBrowser();

    saveWorldState();
    setView("area");
  }

  function advanceToNextRoom() {
    if (currentArea?.type === "Town") return;
    if (!currentArea.entered) return;

    const total = currentArea.roomsTotal ?? (currentArea.rooms?.length ?? 0);
    if (!total) return;

    const nextIdx = Math.min((currentArea.roomIndex ?? 0) + 1, total - 1);
    currentArea.roomIndex = nextIdx;
    currentArea.roomResolved = false;
    currentArea.awaitingContinue = false;
    currentArea._lastRenderedRoom = null;

    saveWorldState();
    renderAreaInfo();
  }

   function hookRoomResolveButton() {
     const btn = document.getElementById("btnResolveRoom");
     const log = document.getElementById("roomLog");
     if (!btn || !log) return;
   
     // Prevent double-binding if we call this multiple times
     if (btn.dataset.bound === "1") return;
     btn.dataset.bound = "1";
   
     btn.addEventListener("click", () => {
       if (!currentArea || currentArea.type === "Town") return;

       // "Continue" after resolving a room that shows a result (chest/rest/event/victory)
       if (currentArea.awaitingContinue) {
         currentArea.awaitingContinue = false;
         advanceToNextRoom();
         return;
       }
   
       const idx = currentArea.roomIndex ?? 0;
       const room = currentArea.rooms?.[idx];
       const kind = room?.kind ?? "Unknown";
   
       if (kind === "Entry") {
         log.textContent += "\nYou steady your breath and move deeper...";
         currentArea.roomResolved = true;
         saveWorldState();
         advanceToNextRoom();
         return;
       } else if (kind === "Encounter") {
           // Start fight (room not resolved until monster dies or flee)
           const m = spawnMonsterForRoom(currentArea, idx);
           currentArea.currentEncounter = { monster: m };
           log.textContent += `\nA ${m.name} appears! (${m.hp}/${m.maxHP})`;
           currentArea.roomResolved = false;
           saveWorldState();
           renderAreaInfo();
           return;
       } else if (kind === "Chest") {
           // Loot can be consumables OR gear.
           const seed = (currentArea.seed + (currentArea.runNonce||0) * 1337 + idx * 31) >>> 0;
           const rng = mulberry32(seed);

           const lootTier = currentArea.lootTier ?? 1;
           const { consumables, gearUpToTier } = getLootPoolsForTier(lootTier);

           // Chance to drop gear increases with loot tier
           // (tier 1: 25%, tier 2: 40%, tier 3: 55%, tier 4+: 65%)
           const gearChance = Math.min(0.25 + (Math.max(1, lootTier) - 1) * 0.15, 0.65);

           let baseItem;
           if (gearUpToTier.length > 0 && rng() < gearChance) {
             baseItem = pick(rng, gearUpToTier);
           } else {
             baseItem = pick(rng, consumables);
           }

           if (!baseItem) {
             log.textContent += `\nThe chest is empty. (rude)`;
             currentArea.roomResolved = true;
             currentArea.awaitingContinue = true;
             saveWorldState();
             renderAreaInfo();
             return;
           }

           // Gear drops get rarity + element.
           if (isEquippable(baseItem)) {
             const rarity = rollRarity(rng, lootTier);
             const element = rollElement(rng, currentArea.elementKey, baseItem.kind);
             const elementPower = rollElementPower(rng, baseItem.tier, rarity, baseItem.kind);
             addItem(baseItem.id, 1, { rarity, element, elementPower });
             log.textContent += `\nYou found: ${baseItem.name} (${rarity}) ${elementBadgeHTML(element, elementPower)} x1`;
           } else {
             addItem(baseItem.id, 1);
             log.textContent += `\nYou found: ${baseItem.name} x1`;
           }

           currentArea.roomResolved = true;
           currentArea.awaitingContinue = true;
           saveWorldState();
           renderAreaInfo();
           return;
       } else if (kind === "Safe") {
           const max = computeFinal();
           character = ensureEconomyFieldsOnCharacter(character);
         
           character.cur.HP = max.HP;
           character.cur.MP = max.MP;
           character.cur.SP = max.SP;
           character.cur.TP = max.TP;
         
           saveToBrowser();
           renderStatsPanel();
         
           log.textContent += `\nYou rest and recover. (HP/MP/SP/TP fully restored)`;
           currentArea.roomResolved = true;
           currentArea.awaitingContinue = true;
           saveWorldState();
           renderAreaInfo();
           return;
       } else if (kind === "Event") {
         log.textContent += "\n(placeholder) Something strange happens...";
         currentArea.roomResolved = true;
         currentArea.awaitingContinue = true;
         saveWorldState();
         renderAreaInfo();
         return;
       } else if (kind === "Exit") {
         log.textContent += "\nYou found the exit. Returning to town...";
         const townId = currentArea.rootTownId ?? "TownA";
         currentArea = { id: townId, type: "Town", name: townId };
         saveWorldState();
         setView("area"); // will re-render area info
         return;
       } else {
         log.textContent += "\n(placeholder) Nothing happens.";
       }
      currentArea.roomResolved = true;
      saveWorldState();
      renderAreaInfo();
     });
   }

   function hookEncounterButtons() {
     const atk = document.getElementById("btnAttack");
     const flee = document.getElementById("btnFlee");
     const log = document.getElementById("roomLog");
     if (!atk || !flee || !log) return;
   
     if (atk.dataset.bound === "1") return;
     atk.dataset.bound = "1";
     flee.dataset.bound = "1";
   
     atk.addEventListener("click", () => {
       const enc = currentArea?.currentEncounter;
       if (!enc) return;
   
       // Get player total stats from your existing stat calc
       const p = computeFinal();
       if (!p) return;
   
       // Player hits monster (with element bonuses)
       const wInst = getEquippedWeaponInstance();
       const weaponType = wInst?.item?.weaponType || "Unarmed";
       const damageType = wInst?.item?.damageType || "Blunt";
       const atkElem = wInst?.meta?.element || null;
       const atkElemPow = Number(wInst?.meta?.elementPower || 0) || 0;

       let dmg = Math.max(1, Math.floor((p.PATK || 1) - (enc.monster.pdef || 0) + 1));
       const monsterElem = enc.monster.elementKey || null;

       if (atkElem && monsterElem && isOppositeElement(atkElem, monsterElem)) {
         // Opposite element: strong bonus
         dmg = Math.floor(dmg * (1 + atkElemPow * 0.05)) + Math.floor(atkElemPow * 0.5);
       }

       enc.monster.hp = Math.max(0, enc.monster.hp - dmg);

       // XP pools (used later for talent buys)
       character = ensureEconomyFieldsOnCharacter(character);
       character.expPools.weapon[weaponType] = (character.expPools.weapon[weaponType] || 0) + 1;
       character.expPools.damage[damageType] = (character.expPools.damage[damageType] || 0) + 1;
       saveToBrowser();

       const elemTxt = atkElem ? ` (${atkElem}${atkElemPow ? `+${atkElemPow}` : ""})` : "";
       log.textContent += `\nYou hit ${enc.monster.name} for ${dmg}${elemTxt}. (${enc.monster.hp}/${enc.monster.maxHP})`;
   
       if (enc.monster.hp <= 0) {
         // Victory
         const gil = randInt(mulberry32((currentArea.seed + (currentArea.runNonce||0) + (currentArea.roomIndex||0))>>>0), enc.monster.gilMin, enc.monster.gilMax);
         addGil(gil);
         log.textContent += `\n${enc.monster.name} defeated! +${gil} GIL`;
   
         currentArea.currentEncounter = null;
         currentArea.roomResolved = true;
         currentArea.awaitingContinue = true;
         saveWorldState();
         renderAreaInfo();
         return;
       }
   
       // Monster hits back (monster element vs your resist)
       let mdmg = Math.max(1, Math.floor((enc.monster.patk || 1) - (p.PDEF || 0) + 1));
       const mElem = enc.monster.elementKey || null;
       if (mElem && typeof p[mElem] === "number") {
         const resist = Math.max(0, Number(p[mElem] || 0));
         const reduce = Math.min(0.60, resist * 0.02); // 2% per point, cap 60%
         mdmg = Math.max(1, Math.floor(mdmg * (1 - reduce)));
       }
       character = ensureEconomyFieldsOnCharacter(character);
         syncCurrentResourcesToMax({ fillMissing: true });
         
         character.cur.HP = Math.max(0, character.cur.HP - mdmg);
         saveToBrowser();
         
         const mElemTxt = mElem ? ` (${mElem})` : "";
         log.textContent += `\n${enc.monster.name} hits you for ${mdmg}${mElemTxt}. (HP ${character.cur.HP}/${p.HP})`;
         
         if (character.cur.HP <= 0) {
           log.textContent += `\nYou were knocked out… (-${KO_GIL_COST} GIL) returning to town.`;
           handleKnockout("knocked out");
         }

     });
   
     flee.addEventListener("click", () => {
       if (!currentArea?.currentEncounter) return;
       log.textContent += `\nYou try to run… but you get cut down. (-${KO_GIL_COST} GIL) returning to town.`;
       handleKnockout("fled");
     });
   }


   
  // ─────────────────────────────────────────────
  // Center views / right menu
  // ─────────────────────────────────────────────
  function setView(viewKey) {
    const title = el("centerTitle");
    const viewCreator = el("viewCreator");
    const viewTalents = el("viewTalents");
    const viewPlaceholder = el("viewPlaceholder");
    const areaPanel = document.getElementById("areaPanel");
    const inventoryPanel = document.getElementById("inventoryPanel");
    const equipmentPanel = document.getElementById("equipmentPanel");
    // placeholderText is now OPTIONAL (may not exist in your new Area panel)
    const placeholderText = document.getElementById("placeholderText");

    // hide all
    viewCreator.classList.add("hidden");
    viewTalents.classList.add("hidden");
    viewPlaceholder.classList.add("hidden");

    if (areaPanel) areaPanel.classList.add("hidden");
    if (inventoryPanel) inventoryPanel.classList.add("hidden");
    if (equipmentPanel) equipmentPanel.classList.add("hidden");
     
    if (viewKey === "back") {
      title.textContent = "—";
      viewPlaceholder.classList.remove("hidden");
      if (placeholderText) placeholderText.textContent = "(cleared)";
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

    if (viewKey === "area") {
      title.textContent = "Area Info";
      viewPlaceholder.classList.remove("hidden");

      if (inventoryPanel) inventoryPanel.classList.add("hidden");
      if (areaPanel) areaPanel.classList.remove("hidden");
      
      renderAreaInfo();
      hookRoomResolveButton();
      return;
    }

    if (viewKey === "inventory") {
        currentView = "inventory";
        title.textContent = "Inventory";
        viewPlaceholder.classList.remove("hidden");
      
        if (areaPanel) areaPanel.classList.add("hidden");
        if (inventoryPanel) inventoryPanel.classList.remove("hidden");
        if (equipmentPanel) equipmentPanel.classList.add("hidden");
      
        renderInventory();
        return;
    }

    if (viewKey === "equipment") {
        currentView = "equipment";
        title.textContent = "Equipment";
        viewPlaceholder.classList.remove("hidden");

        if (areaPanel) areaPanel.classList.add("hidden");
        if (inventoryPanel) inventoryPanel.classList.add("hidden");
        if (equipmentPanel) equipmentPanel.classList.remove("hidden");

        renderEquipment();
        return;
    }

     
    title.textContent =
      viewKey === "inventory" ? "Inventory" :
      viewKey === "equipment" ? "Equipment" :
      viewKey === "skills" ? "Skills / Tech / Magic" :
      viewKey === "party" ? "Party" :
      "—";

    viewPlaceholder.classList.remove("hidden");
    if (placeholderText) placeholderText.textContent = "(nothing here yet)";
  }

  function hookRightMenu() {
    document.querySelectorAll(".navbtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.view;
        setView(key);
      });
    });
  }

function renderInventory() {
  character = ensureEconomyFieldsOnCharacter(character);

  const invPanel = document.getElementById("inventoryPanel");
  if (!invPanel) return;

  const inv = character.inventory || {};
  const entries = Object.entries(inv)
    .filter(([, qty]) => Number(qty) > 0)
    .map(([invKey, qty]) => {
      const meta = parseItemKey(invKey);
      const item = ITEMS?.[meta.baseId];
      const rarity = meta.rarity ? rarityByKey(meta.rarity) : null;
      const elem = meta.element ? (ELEMENTS.find(e => e.key === meta.element) ?? null) : null;
      return { invKey, qty: Number(qty), meta, item, rarity, elem };
    })
    .sort((a, b) => {
      const an = (a.item?.name || a.meta.baseId || a.invKey);
      const bn = (b.item?.name || b.meta.baseId || b.invKey);
      return an.localeCompare(bn);
    });

  // Hard display cap (UI only): 28 rows, laid out 2 columns x 14 rows via CSS
  const capped = entries.slice(0, 28);
  const overflow = Math.max(0, entries.length - capped.length);

  const rowsHtml = capped.length
    ? capped.map(({ invKey, qty, meta, item, rarity, elem }) => {
        const baseName = item?.name || meta.baseId || invKey;
        const canEquip = isEquippable(item);
        const rarityBadge = rarity
          ? `<span class="badge ${rarity.colorClass}">${rarity.key}</span>`
          : ``;
        const elemBadge = elem
          ? `<span class="badge ${elem.badgeClass}">${elem.label}${meta.elementPower ? `+${meta.elementPower}` : ""}</span>`
          : ``;
        const equipBtn = canEquip
          ? `<button class="smallbtn" data-action="equip" data-key="${invKey}">Equip</button>`
          : ``;
        return `
          <div class="inv-row">
            <div class="name">${baseName} ${rarityBadge} ${elemBadge}</div>
            <div class="actions">
              <div class="qty">x${qty}</div>
              ${equipBtn}
            </div>
          </div>
        `;
      }).join("")
    : `<div class="placeholder">(Your bag is empty. Go beat up something adorable.)</div>`;

  invPanel.innerHTML = `
    <div class="inv-header">
      <div class="hint">Items you've collected (saved to browser)</div>
      <div class="inv-gil">GIL: ${character.gil ?? 0}</div>
    </div>
    <div class="inv-list">${rowsHtml}</div>
    ${overflow ? `<div class="hint" style="margin-top:10px;">(+${overflow} more items not shown)</div>` : ``}
  `;

  if (!invPanel.dataset.bound) {
    invPanel.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "equip") {
        const key = btn.dataset.key;
        if (!key) return;
        equipItem(key);
        renderInventory();
        renderEquipment();
        renderStatsPanel();
      }
    });
    invPanel.dataset.bound = "1";
  }
}

function renderEquipment() {
  character = ensureEconomyFieldsOnCharacter(character);

  const eqPanel = document.getElementById("equipmentPanel");
  if (!eqPanel) return;

  const eq = character.equipment || {};

  const slotRows = EQUIPMENT_SLOTS.map((slot) => {
    const invKey = eq[slot.key];
    const meta = invKey ? parseItemKey(invKey) : null;
    const item = meta ? ITEMS[meta.baseId] : null;
    const baseName = item ? item.name : "(empty)";
    const rarity = meta?.rarity ? rarityByKey(meta.rarity) : null;
    const elem = meta?.element ? (ELEMENTS.find(e => e.key === meta.element) ?? null) : null;
    const rarityBadge = rarity ? `<span class="badge ${rarity.colorClass}">${rarity.key}</span>` : ``;
    const elemBadge = elem ? `<span class="badge ${elem.badgeClass}">${elem.label}${meta.elementPower ? `+${meta.elementPower}` : ""}</span>` : ``;
    const name = item ? `${baseName} ${rarityBadge} ${elemBadge}` : baseName;
    const btn = invKey
      ? `<button class="smallbtn" data-action="unequip" data-slot="${slot.key}">Unequip</button>`
      : `<span class="hint">&nbsp;</span>`;

    return `
      <div class="eq-slot">
        <div class="slot">${slotLabel(slot.key)}</div>
        <div class="name">${name}</div>
        <div class="actions">${btn}</div>
      </div>
    `;
  }).join("");

  const wp = character.expPools?.weapon || {};
  const dp = character.expPools?.damage || {};
  const wpRows = Object.keys(wp).length
    ? Object.entries(wp).map(([k, v]) => `<div class="exp-row"><div>${k}</div><div>${Math.floor(v)}</div></div>`).join("")
    : `<div class="hint">(no weapon XP yet)</div>`;
  const dpRows = Object.keys(dp).length
    ? Object.entries(dp).map(([k, v]) => `<div class="exp-row"><div>${k}</div><div>${Math.floor(v)}</div></div>`).join("")
    : `<div class="hint">(no damage-type XP yet)</div>`;

  eqPanel.innerHTML = `
    <div class="inv-header">
      <div class="hint">What you're wearing / wielding</div>
      <div class="inv-gil">GIL: ${character.gil ?? 0}</div>
    </div>

    <div class="eq-grid">${slotRows}</div>

    <h3 style="margin-top:14px;">Experience Pools</h3>
    <div class="eq-exp">
      <div>
        <div class="hint" style="margin-bottom:6px;">Weapon Types</div>
        ${wpRows}
      </div>
      <div>
        <div class="hint" style="margin-bottom:6px;">Damage Types</div>
        ${dpRows}
      </div>
    </div>
  `;

  if (!eqPanel.dataset.bound) {
    eqPanel.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === "unequip") {
        const slot = btn.dataset.slot;
        if (!slot) return;
        unequipSlot(slot);
        renderEquipment();
        renderInventory();
        renderStatsPanel();
      }
    });
    eqPanel.dataset.bound = "1";
  }
}

   
  // ─────────────────────────────────────────────
  // Storage
  // ─────────────────────────────────────────────
  const STORAGE_KEY = "dreamGameCharacter_v2";

   function saveToBrowser() {
     character = ensureEconomyFieldsOnCharacter(character);
   
     // Pull from UI into character (authoritative)
     character.name = (el("charName").value ?? "").trim();
     character.level = Number(el("charLevel").value ?? 1);
     character.exp = Number(el("charExp").value ?? 0);
   
     // keep overlay sane before saving
     syncCurrentResourcesToMax({ fillMissing: true });
   
     const data = {
       name: character.name,
       level: character.level,
       exp: character.exp,
   
       gil: character.gil,
       inventory: character.inventory,
      equipment: character.equipment,
      expPools: character.expPools,
       cur: character.cur, // <-- save current resources
   
       species: el("species").value,
       race: el("race").value,
       job: el("job").value,
       activeTalents: [...activeTalents]
     };
   
     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
   }



  function loadFromBrowser() {
     const raw = localStorage.getItem(STORAGE_KEY);
     if (!raw) return false;
   
     try {
       const data = JSON.parse(raw);
   
       character = ensureEconomyFieldsOnCharacter({
         name: data.name ?? "",
         level: data.level ?? 1,
         exp: data.exp ?? 0,
         gil: data.gil,
         inventory: data.inventory,
        equipment: data.equipment,
        expPools: data.expPools,
         cur: data.cur // may be undefined; ensure function handles it
       });

   
       // UI restore (unchanged)
       el("charName").value = character.name;
       el("charLevel").value = character.level;
       el("charExp").value = character.exp;
   
       if (data.species && speciesMods[data.species]) el("species").value = data.species;
       updateRaces();
   
       if (data.race && raceMods[data.race]) el("race").value = data.race;
       if (data.job && jobMods[data.job]) el("job").value = data.job;
   
       const restored = (data.activeTalents ?? []).filter(id => talentById[id]);
       activeTalents = new Set(restored);
   
       ensureNoviceForJob(el("job").value);
       syncCurrentResourcesToMax({ fillMissing: true });
       renderStatsPanel();

       return true;
     } catch {
       return false;
     }
   }

  function hookSaveButtons() {
    el("btnSave").addEventListener("click", () => saveToBrowser());

    el("btnReset").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    ["charName","charLevel","charExp","species","race","job"].forEach(id => {
      el(id).addEventListener("change", saveToBrowser);
      el(id).addEventListener("input", saveToBrowser);
    });
  }

    function spawnMonsterForRoom(area, roomIndex) {
     const tier = area.monsterTier || 1;
   
     const seed = (area.seed ^ 0x9e3779b9) + (area.runNonce || 0) * 10007 + roomIndex * 97;
     const rng = mulberry32(seed >>> 0);
   
     const pool = MONSTERS.filter(m => m.tier <= tier);
     const base = pick(rng, pool);
   
     // Slight per-spawn variation without creating a “new monster type”
     const levelJitter = randInt(rng, 0, 2);
     const hp = base.hp + randInt(rng, 0, 6);
     const patk = base.patk + levelJitter;
     const pdef = base.pdef + (rng() < 0.35 ? 1 : 0);
   
     return {
       id: base.id,
       name: base.name,
       tier: base.tier,
       elementKey: area.elementKey ?? null,
       maxHP: hp,
       hp,
       patk,
       pdef,
       gilMin: base.gilMin,
       gilMax: base.gilMax,
     };
   }

   
  // ─────────────────────────────────────────────
  // Select population + change handlers
  // ─────────────────────────────────────────────
  function populateSelect(id, options) {
    const sel = el(id);
    sel.innerHTML = "";
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);
    }
  }

  function updateRaces() {
    const sp = el("species").value;
    const races = Object.keys(raceMods).filter(r => raceMods[r].species === sp);
    populateSelect("race", races);

    if (!races.includes(el("race").value)) {
      el("race").value = races[0] ?? "";
    }
  }

  function updateAll() {
    renderStatsPanel();

    if (!el("viewTalents").classList.contains("hidden")) {
      renderTree();
      renderPreview();
    }

    saveToBrowser();
  }

  // ─────────────────────────────────────────────
  // Init
  // ─────────────────────────────────────────────
  function init() {
    populateSelect("species", Object.keys(speciesMods));
    populateSelect("job", Object.keys(jobMods));

    updateRaces();
    loadFromBrowser();

    loadWorldState();
     
    ensureNoviceForJob(el("job").value);
   
    el("species").addEventListener("change", () => {
      updateRaces();
      updateAll();
    });

    el("race").addEventListener("change", updateAll);

    el("job").addEventListener("change", () => {
      onJobChanged();
    });

    hookRightMenu();
    hookSaveButtons();
    hookTownButtons();
     
    
    setView("creator");

    renderStatsPanel();
    saveToBrowser();
    hookRoomResolveButton();
  }

  function el(id) {
    const node = document.getElementById(id);
    if (!node) throw new Error(`Missing element #${id} in index.html`);
    return node;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
