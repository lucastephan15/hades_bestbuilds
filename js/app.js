const ASSETS = 'assets/images';

let currentLang = 'pt';

const I18N = {
  pt: {
    heroTitle: 'Hades Build Guide',
    heroSubtitle: 'O Compêndio das Melhores Composições',
    heroDesc: 'Descubra as sinergias mais poderosas (duos, lendárias e combos) para dominar o submundo com todas as armas e aspectos. Siga as orientações para se tornar imbatível.',
    statBuilds: 'Builds',
    statWeapons: 'Armas',
    filterWeapon: 'Arma',
    filterAllW: 'Todas',
    weaponBlade: 'Espada',
    weaponSpear: 'Lança',
    weaponShield: 'Escudo',
    weaponBow: 'Arco',
    weaponFists: 'Luvas',
    weaponRail: 'Canhão',
    filterTier: 'Tier',
    filterAllT: 'Todos',
    filterDifficulty: 'Dificuldade',
    filterAllD: 'Todas',
    diffEasy: 'Fácil',
    diffMed: 'Médio',
    diffHard: 'Difícil',
    footer1: 'Projeto pessoal e interativo para explorar as melhores sinergias e cálculos do submundo.',
    footer2: 'Hades é uma marca registrada da Supergiant Games.',
    
    diff_easy: 'Fácil', diff_medium: 'Médio', diff_hard: 'Difícil',
    slot_attack: 'Ataque', slot_special: 'Especial', slot_cast: 'Conjuração',
    slot_dash: 'Arrancada', slot_call: 'Chamado', slot_other: 'Passiva',
    
    lbl_howtoplay: 'Como Jogar',
    lbl_synergy: 'Sinergia (Por que funciona?)',
    lbl_mirror: 'Espelho da Noite (Recomendado)',
    lbl_ttk_title: 'TTK Base Mínimo (Chefões)',
    tooltip_furies: 'Fúrias (Meg/Alecto/Tis)\n4.400 HP',
    tooltip_hydra: 'Hidra de Ossos\n9.500 HP (Sem imunidades)',
    tooltip_theseus: 'Teseu\n9.000 HP',
    tooltip_asterius: 'Astérios\n14.000 HP',
    tooltip_hades: 'Hades\n34.000 HP (Fases 1 e 2)',
    lbl_ttk_max: 'TTK Máx',
    lbl_burst: 'Max Hit / Burst',
    lbl_dps: 'DPS Estimado',
    tooltip_dps: (n, exp) => `Fórmula: Média Crítica no Combo [${n}]\n${exp}`,
    tooltip_burst: (n) => `Dano médio de um ciclo cheio (${n} hits/projetéis)`,
    tooltip_ttk: 'Tempo estimado (segundos) para destruir 34.000 HP sem considerar imunidades',
    lbl_found: (n) => `${n} build${n!==1?'s':''} encontrada${n!==1?'s':''}`,
    lbl_none: 'Nenhuma build encontrada. Tente ajustar os filtros.'
  },
  en: {
    heroTitle: 'Hades Build Compendium',
    heroSubtitle: 'The Compendium of Best Compositions',
    heroDesc: 'Discover the most powerful synergies (duos, legendaries, and combos) to dominate the underworld with every weapon and aspect. Follow the guides to become unbeatable.',
    statBuilds: 'Builds',
    statWeapons: 'Weapons',
    filterWeapon: 'Weapon',
    filterAllW: 'All',
    weaponBlade: 'Sword',
    weaponSpear: 'Spear',
    weaponShield: 'Shield',
    weaponBow: 'Bow',
    weaponFists: 'Fists',
    weaponRail: 'Rail',
    filterTier: 'Tier',
    filterAllT: 'All',
    filterDifficulty: 'Difficulty',
    filterAllD: 'All',
    diffEasy: 'Easy',
    diffMed: 'Medium',
    diffHard: 'Hard',
    footer1: 'A personal, interactive project to explore the best synergies and math of the underworld.',
    footer2: 'Hades is a registered trademark of Supergiant Games.',
    
    diff_easy: 'Easy', diff_medium: 'Medium', diff_hard: 'Hard',
    slot_attack: 'Attack', slot_special: 'Special', slot_cast: 'Cast',
    slot_dash: 'Dash', slot_call: 'Call', slot_other: 'Passive',
    
    lbl_howtoplay: 'How to Play',
    lbl_synergy: 'Synergy (Why it works)',
    lbl_mirror: 'Mirror of Night (Recommended)',
    lbl_ttk_title: 'Minimum Base TTK (Bosses)',
    tooltip_furies: 'Furies (Meg/Alecto/Tis)\n4,400 HP',
    tooltip_hydra: 'Bone Hydra\n9,500 HP (No immunities)',
    tooltip_theseus: 'Theseus\n9,000 HP',
    tooltip_asterius: 'Asterius\n14,000 HP',
    tooltip_hades: 'Hades\n34,000 HP (Phases 1 & 2)',
    lbl_ttk_max: 'Max TTK',
    lbl_burst: 'Max Hit / Burst',
    lbl_dps: 'Est. DPS',
    tooltip_dps: (n, exp) => `Formula: Critical Average in Combo [${n}]\n${exp}`,
    tooltip_burst: (n) => `Average damage of a full cycle (${n} hits)`,
    tooltip_ttk: 'Estimated time (seconds) to destroy 34,000 HP ignoring immunities',
    lbl_found: (n) => `${n} build${n!==1?'s':''} found`,
    lbl_none: 'No builds found. Try adjusting the filters.'
  }
};

const GOD_NAMES = {
  aphrodite: 'Aphrodite', ares: 'Ares', artemis: 'Artemis', athena: 'Athena',
  demeter: 'Demeter', dionysus: 'Dionysus', hermes: 'Hermes', poseidon: 'Poseidon', zeus: 'Zeus'
};

function calculateDamage(math) {
  if (!math) return null;
  const sumAdditives = math.additives.reduce((acc, curr) => acc + curr.value, 0);
  const prodMultipliers = math.multipliers.reduce((acc, curr) => acc * curr.value, 1);
  const normalHit = (math.base_damage * (1 + sumAdditives)) * prodMultipliers;
  const avgHit = normalHit * (1 + (math.crit_chance * (math.crit_multiplier - 1)));
  const avgCombo = avgHit * math.hits_per_combo;
  const dps = avgCombo * math.combos_per_sec;
  const ttk = HADES_HP / dps;
  const bossTTK = {
    furies: (4400 / dps).toFixed(1),
    hydra: (9500 / dps).toFixed(1),
    theseus: (9000 / dps).toFixed(1),
    asterius: (14000 / dps).toFixed(1),
    hades: ttk.toFixed(1)
  };
  return {
    normalHit: normalHit.toFixed(0),
    avgHit: avgHit.toFixed(0),
    avgCombo: avgCombo.toFixed(0),
    dps: dps.toFixed(0),
    ttk: ttk.toFixed(1),
    bossTTK
  };
}

let builds = [];
let activeFilters = { tier: 'all', weapon: 'all', difficulty: 'all' };

window.setLanguage = function(lang) {
  currentLang = lang;
  document.querySelectorAll('.flag-icon').forEach(f => f.classList.remove('active-lang'));
  document.getElementById(`flag-${lang}`).classList.add('active-lang');
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key]) el.innerText = I18N[lang][key];
  });
  
  filterBuilds();
}

function init() {
  builds = BUILDS_DATA;
  setupFilters();
  setupCards();
  updateStats();
  
  setLanguage(currentLang);
}

function updateStats() {
  document.getElementById('stat-builds').innerText = builds.length;
  document.getElementById('stat-s-tier').innerText = builds.filter(b => b.tier === 'S' || b.tier === 'S+').length;
  const uniqueWeapons = new Set(builds.map(b => b.weapon));
  document.getElementById('stat-weapons').innerText = uniqueWeapons.size;
}

function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const group = e.target.dataset.group;
      const value = e.target.dataset.value;
      
      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      activeFilters[group] = value;
      filterBuilds();
    });
  });
}

function filterBuilds() {
  const filtered = builds.filter(build => {
    let matchTier = activeFilters.tier === 'all' || build.tier.includes(activeFilters.tier);
    let matchDiff = activeFilters.difficulty === 'all' || build.difficulty === activeFilters.difficulty;
    
    let matchWeapon = true;
    if (activeFilters.weapon !== 'all') {
      const weaponMap = {
        'blade': 'Stygian Blade', 'bow': 'Coronacht', 'shield': 'Aegis',
        'spear': 'Varatha', 'rail': 'Exagryph', 'fists': 'Twin Fists'
      };
      matchWeapon = build.weapon.includes(weaponMap[activeFilters.weapon]);
    }
    
    return matchTier && matchDiff && matchWeapon;
  });
  renderBuilds(filtered);
}

function renderBuilds(dataToRender = builds) {
  const grid = document.getElementById('builds-grid');
  const countLabel = document.getElementById('builds-count');
  
  if (dataToRender.length === 0) {
    grid.innerHTML = '';
    countLabel.innerText = I18N[currentLang].lbl_none;
    return;
  }
  
  countLabel.innerText = I18N[currentLang].lbl_found(dataToRender.length);
  grid.innerHTML = dataToRender.map(build => renderCard(build)).join('');
}

function renderCard(build) {
  const t = I18N[currentLang];
  
  const bName = currentLang === 'en' ? (build.build_name_en || build.build_name) : build.build_name;
  const diffLabel = t['diff_' + build.difficulty] || build.difficulty;
  
  const boonChips = build.core_boons.map(boon => {
    const desc = currentLang === 'en' ? (boon.desc_en || boon.desc) : boon.desc;
    const name = currentLang === 'en' ? boon.boon_name : (boon.boon_name_pt || boon.boon_name);
    const slot = t['slot_' + boon.slot] || boon.slot;
    return `
    <div class="boon-chip boon-god-${boon.god} ${desc ? 'tooltip' : ''}" data-tooltip="${desc || name}">
      <img src="${ASSETS}/boons/${boon.god}/${boon.icon}" alt="${name}" loading="lazy">
      <div class="boon-chip-text">
        <span class="boon-chip-name">${name}</span>
        <span class="boon-chip-slot">${slot}</span>
      </div>
    </div>
  `}).join('');

  const godPortraits = build.gods_involved.map(god => `
    <div class="tooltip" data-tooltip="${GOD_NAMES[god]}" style="display:inline-block; border-radius:50%;">
      <img class="god-portrait-mini" src="${ASSETS}/boons/${god}/${god}_portrait.png" alt="${GOD_NAMES[god]}" loading="lazy">
    </div>
  `).join('');

  const duoHTML = build.duo_boons.length ? build.duo_boons.map(d => `<span class="tag tag-tier-S">Duo: ${d}</span>`).join('') : '';
  const legHTML = build.legendary_boons.map(l => `<span class="tag tag-tier-S">Leg: ${l}</span>`).join('');
  const legendaryHTML = (duoHTML || legHTML) ? `<div style="margin-bottom: 0.8rem">${duoHTML} ${legHTML}</div>` : '';

  const mirrorTalentsHTML = build.mirror_talents ? `
    <div class="detail-section">
      <h4>${t.lbl_mirror}</h4>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        ${build.mirror_talents.map(tal => `<span class="tag" style="background: rgba(138, 43, 226, 0.15); border-color: rgba(138, 43, 226, 0.3); color: #d8b4fe;">${tal}</span>`).join('')}
      </div>
    </div>` : '';

  const keepsakeHTML = build.keepsakes ? `
    <div class="detail-section" style="border-bottom: none; padding-bottom: 0;">
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        ${build.keepsake_icons ? build.keepsake_icons.map(k => `<img src="${ASSETS}/keepsakes/${k}" style="width: 24px; height: 24px;">`).join('') : ''}
        <span style="font-size: 0.8rem; color: var(--text-muted);">${build.keepsakes.join(' ➔ ')}</span>
      </div>
    </div>` : '';

  let mathHTML = '';
  let bossRowHTML = '';
  
  if (build.math) {
    const stats = calculateDamage(build.math);
    const mCombo = currentLang === 'en' ? (build.math.combo_name_en || build.math.combo_name) : build.math.combo_name;
    const mExp = currentLang === 'en' ? (build.math.explanation_en || build.math.explanation) : build.math.explanation;
    
    mathHTML = `
      <div class="math-stats-row">
        <div class="math-stat tooltip" data-tooltip="${t.tooltip_dps(mCombo, mExp)}">
          <span class="math-value">⚔️ ${stats.dps}</span>
          <span class="math-label">${t.lbl_dps}</span>
        </div>
        <div class="math-stat tooltip" data-tooltip="${t.tooltip_burst(build.math.hits_per_combo)}">
          <span class="math-value">💥 ${stats.avgCombo}</span>
          <span class="math-label">${t.lbl_burst}</span>
        </div>
        <div class="math-stat tooltip" data-tooltip="${t.tooltip_ttk}">
          <span class="math-value">⏱️ ${stats.ttk}s</span>
          <span class="math-label">${t.lbl_ttk_max}</span>
        </div>
      </div>
    `;
    
    bossRowHTML = `
      <div class="detail-section">
        <h4>${t.lbl_ttk_title}</h4>
        <div class="boss-ttk-row">
          <div class="boss-ttk-item tooltip" data-tooltip="${t.tooltip_furies}">
            <img src="${ASSETS}/bosses/furies.png" onerror="this.src='${ASSETS}/keepsakes/Skull_Earring.png'">
            <span>${stats.bossTTK.furies}s</span>
          </div>
          <div class="boss-ttk-item tooltip" data-tooltip="${t.tooltip_hydra}">
            <img src="${ASSETS}/bosses/hydra.png" onerror="this.src='${ASSETS}/keepsakes/Bone_Hourglass.png'">
            <span>${stats.bossTTK.hydra}s</span>
          </div>
          <div class="boss-ttk-item tooltip" data-tooltip="${t.tooltip_theseus}">
            <img src="${ASSETS}/bosses/theseus.png" onerror="this.src='${ASSETS}/keepsakes/Broken_Spearpoint.png'">
            <span>${stats.bossTTK.theseus}s</span>
          </div>
          <div class="boss-ttk-item tooltip" data-tooltip="${t.tooltip_asterius}">
            <img src="${ASSETS}/bosses/asterius.png" onerror="this.src='${ASSETS}/keepsakes/Cosmic_Egg.png'">
            <span>${stats.bossTTK.asterius}s</span>
          </div>
          <div class="boss-ttk-item tooltip" data-tooltip="${t.tooltip_hades}">
            <img src="${ASSETS}/bosses/hades.png" onerror="this.src='${ASSETS}/keepsakes/Sigil_of_the_Dead.png'">
            <span>${stats.bossTTK.hades}s</span>
          </div>
        </div>
      </div>
    `;
  }

  const notes = currentLang === 'en' ? (build.playstyle_notes_en || build.playstyle_notes) : build.playstyle_notes;
  const synergy = currentLang === 'en' ? (build.synergy_explanation_en || build.synergy_explanation) : build.synergy_explanation;

  const weaponImg = build.weapon_icon
    ? `<img src="${ASSETS}/weapons/${build.weapon_icon}" alt="${build.weapon}" class="weapon-icon" loading="lazy">`
    : `<span style="font-size:1.5rem">⚔</span>`;

  return `
    <div class="build-card" data-id="${build.id}">
      <div class="card-header">
        <div class="weapon-icon-wrapper">${weaponImg}</div>
        <div class="card-title-area">
          <div class="card-title-row">
            <span class="build-name">${bName}</span>
            <span class="tier-badge tier-${build.tier.charAt(0)}">TIER ${build.tier}</span>
          </div>
          <div class="card-subtitle">
            <span class="weapon-name">${build.weapon}</span> · <span class="aspect-name">${build.aspect}</span>
          </div>
        </div>
      </div>

      <div class="card-tags">
        <span class="tag tag-difficulty-${build.difficulty}">${diffLabel}</span>
        ${build.heat_level ? `<span class="tag tag-heat">Heat ${build.heat_level}</span>` : ''}
      </div>
      
      ${mathHTML}

      <div class="boons-row">${boonChips}</div>
      <div class="gods-row">${godPortraits}</div>

      <!-- Detail Expansion -->
      <div class="card-details">
        <div class="detail-section">
          <h4>${t.lbl_howtoplay}</h4>
          <p>${notes}</p>
        </div>
        
        <div class="detail-section">
          <h4>${t.lbl_synergy}</h4>
          <p>${synergy}</p>
        </div>

        ${legendaryHTML}
        ${mirrorTalentsHTML}
        ${keepsakeHTML}
        ${bossRowHTML}
      </div>
    </div>
  `;
}

function setupCards() {
  document.getElementById('builds-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.build-card');
    if (card) {
      card.classList.toggle('expanded');
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
