/**
 * Hades Build Guide — Interactive App
 */

const ASSETS = 'assets/images';

const SLOT_LABELS = {
  attack: 'Ataque',
  special: 'Especial',
  cast: 'Conjuração',
  dash: 'Arrancada',
  call: 'Chamado',
  other: 'Passiva'
};

const GOD_NAMES = {
  zeus: 'Zeus',
  poseidon: 'Poseidon',
  athena: 'Atena',
  ares: 'Ares',
  artemis: 'Ártemis',
  aphrodite: 'Afrodite',
  dionysus: 'Dionísio',
  demeter: 'Deméter',
  hermes: 'Hermes',
  chaos: 'Caos'
};

const DUO_ICON_MAP = {
  'Heart Rend': 'Heart_Rend_I.png',
  'Merciful End': 'Merciful_End_I.png',
  'Hunting Blades': 'Hunting_Blades_I.png',
  'Sea Storm': 'Sea_Storm_I.png',
  'Smoldering Air': 'Smoldering_Air_I.png',
  'Cold Fusion': 'Cold_Fusion_I.png',
  'Mirage Shot': 'Mirage_Shot_I.png',
  'Curse of Longing': 'Curse_of_Longing_I.png',
  'Curse of Nausea': 'Curse_of_Nausea_I.png',
  'Ice Wine': 'Ice_Wine_I.png',
  'Scintillating Feast': 'Scintillating_Feast_I.png',
  'Crystal Clarity': 'Crystal_Clarity_I.png',
  'Stubborn Roots': 'Stubborn_Roots_I.png',
  'Low Tolerance': 'Low_Tolerance_I.png',
  'Exclusive Access': 'Exclusive_Access_I.png',
  'Sweet Nectar': 'Sweet_Nectar_I.png',
  'Calculated Risk': 'Calculated_Risk_I.png',
  'Parting Shot': 'Parting_Shot_I.png',
  'Lightning Phalanx': 'Lightning_Phalanx_I.png',
  'Wave Pounding': 'Wave_Pounding_I.png',
  'Deadly Reversal': 'Deadly_Reversal_I.png',
  'Lightning Rod': 'Lightning_Rod_I.png',
  'Curse of Drowning': 'Curse_of_Drowning_I.png',
  'Freezing Vortex': 'Freezing_Vortex_I.png',
  'Blizzard Shot': 'Blizzard_Shot_I.png',
  'Unshakable Mettle': 'Unshakable_Mettle_I.png',
  'Vengeful Mood': 'Vengeful_Mood_I.png'
};

const LEGENDARY_ICON_MAP = {
  'Splitting Bolt': 'zeus/Splitting_Bolt_I.png',
  'Vicious Cycle': 'ares/Vicious_Cycle_I.png',
  'Fully Loaded': 'artemis/Fully_Loaded_I.png',
  'Black Out': 'dionysus/Black_Out_I.png',
  'Divine Protection': 'athena/Deathless_Stand_I.png'
};

function calculateDamage(math) {
  if (!math) return null;
  const sumAdditives = math.additives.reduce((acc, curr) => acc + curr.value, 0);
  const prodMultipliers = math.multipliers.reduce((acc, curr) => acc * curr.value, 1);
  const normalHit = (math.base_damage * (1 + sumAdditives)) * prodMultipliers;
  const avgHit = normalHit * (1 + (math.crit_chance * (math.crit_multiplier - 1)));
  const avgCombo = avgHit * math.hits_per_combo;
  const dps = avgCombo * math.combos_per_sec;
  // HADES_HP comes from data.js
  const ttk = HADES_HP / dps;
  
  return {
    normalHit: normalHit.toFixed(0),
    avgHit: avgHit.toFixed(0),
    avgCombo: avgCombo.toFixed(0),
    dps: dps.toFixed(0),
    ttk: ttk.toFixed(1)
  };
}

let builds = [];
let activeFilters = {
  tier: 'all',
  weapon: 'all',
  god: 'all',
  difficulty: 'all'
};

function init() {
  builds = typeof BUILDS_DATA !== 'undefined' ? BUILDS_DATA : [];
  updateStats();
  renderBuilds();
  setupFilters();
}

function updateStats() {
  const sCount = builds.filter(b => b.tier === 'S').length;
  document.getElementById('stat-builds').textContent = builds.length;
  document.getElementById('stat-s-tier').textContent = sCount;
  document.getElementById('stat-weapons').textContent = new Set(builds.map(b => b.weapon)).size;
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const value = btn.dataset.value;

      document.querySelectorAll(`.filter-btn[data-group="${group}"]`).forEach(b =>
        b.classList.remove('active')
      );
      btn.classList.add('active');

      activeFilters[group] = value;
      renderBuilds();
    });
  });
}

function filterBuilds() {
  return builds.filter(build => {
    if (activeFilters.tier !== 'all' && build.tier !== activeFilters.tier) return false;
    if (activeFilters.difficulty !== 'all' && build.difficulty !== activeFilters.difficulty) return false;

    if (activeFilters.weapon !== 'all') {
      const weaponMap = {
        'blade': 'Stygian Blade',
        'bow': 'Coronacht',
        'shield': 'Aegis',
        'spear': 'Varatha',
        'rail': 'Exagryph',
        'fists': 'Twin Fists'
      };
      if (!build.weapon.toLowerCase().includes(weaponMap[activeFilters.weapon]?.toLowerCase() || '')) return false;
    }

    if (activeFilters.god !== 'all') {
      if (!build.gods_involved.includes(activeFilters.god)) return false;
    }

    return true;
  });
}

function renderBuilds() {
  const grid = document.getElementById('builds-grid');
  const filtered = filterBuilds();

  document.getElementById('builds-count').textContent =
    `${filtered.length} build${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>Nenhuma build encontrada</h3>
        <p>Tente ajustar os filtros acima.</p>
      </div>`;
    return;
  }

  // Sort: S > A > B > C, then by name
  const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
  filtered.sort((a, b) => (tierOrder[a.tier] ?? 9) - (tierOrder[b.tier] ?? 9));

  grid.innerHTML = filtered.map(build => renderCard(build)).join('');

  // Card click handlers
  grid.querySelectorAll('.build-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const wasExpanded = card.classList.contains('expanded');
      grid.querySelectorAll('.build-card.expanded').forEach(c => c.classList.remove('expanded'));
      if (!wasExpanded) {
        card.classList.add('expanded');
        setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
    });
  });
}

function renderCard(build) {
  const diffLabel = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
  const weaponImg = build.weapon_icon
    ? `<img src="${ASSETS}/weapons/${build.weapon_icon}" alt="${build.weapon}">`
    : `<span style="font-size:1.5rem">⚔</span>`;

  const boonChips = build.core_boons.map(boon => `
    <div class="boon-chip boon-god-${boon.god} ${boon.desc ? 'tooltip' : ''}" data-tooltip="${boon.desc || boon.boon_name_pt}">
      <img src="${ASSETS}/boons/${boon.god}/${boon.icon}" alt="${boon.boon_name}" loading="lazy">
      <div class="boon-chip-text">
        <span class="boon-chip-name">${boon.boon_name_pt || boon.boon_name}</span>
        <span class="boon-chip-slot">${SLOT_LABELS[boon.slot] || boon.slot}</span>
      </div>
    </div>
  `).join('');

  const godPortraits = build.gods_involved.map(god => `
    <div class="tooltip" data-tooltip="${GOD_NAMES[god]}" style="display:inline-block; border-radius:50%;">
      <img class="god-portrait-mini" src="${ASSETS}/boons/${god}/${god}_portrait.png"
           alt="${GOD_NAMES[god]}" loading="lazy">
    </div>
  `).join('');

  // Duo boons
  let duoHTML = '';
  if (build.duo_boons.length > 0) {
    duoHTML = `
      <div class="detail-section">
        <h4>Duo Boons</h4>
        <div class="detail-duos">
          ${build.duo_boons.map(duo => {
            const icon = DUO_ICON_MAP[duo];
            const iconImg = icon ? `<img src="${ASSETS}/boons/duo/${icon}" alt="${duo}">` : '';
            return `<div class="duo-badge">${iconImg}${duo}</div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // Legendary boons
  let legendaryHTML = '';
  if (build.legendary_boons.length > 0) {
    legendaryHTML = `
      <div class="detail-section">
        <h4>Legendary Boons</h4>
        <div class="detail-duos">
          ${build.legendary_boons.map(leg => {
            const icon = LEGENDARY_ICON_MAP[leg];
            const iconImg = icon ? `<img src="${ASSETS}/boons/${icon}" alt="${leg}">` : '';
            return `<div class="duo-badge legendary-badge">${iconImg}${leg}</div>`;
          }).join('')}
        </div>
      </div>`;
  }

  // Mirror Talents
  let mirrorTalentsHTML = '';
  if (build.mirror_talents && build.mirror_talents.length > 0) {
    mirrorTalentsHTML = `
      <div class="detail-section">
        <h4>Espelho da Noite</h4>
        <div class="detail-duos">
          ${build.mirror_talents.map(talent => `
            <div class="duo-badge" style="border-color: #8b1a2b; color: #e8e4df;">
              <span style="font-size:1rem; margin-right:4px;">🔮</span> ${talent}
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Keepsakes
  let keepsakeHTML = '';
  if (build.keepsake_icons && build.keepsake_icons.length > 0) {
    keepsakeHTML = `
      <div class="detail-section">
        <h4>Keepsake</h4>
        <div class="keepsake-row">
          ${build.keepsake_icons.map((icon, i) => `
            <img class="keepsake-icon" src="${ASSETS}/keepsakes/${icon}" alt="${build.keepsakes[i]}" loading="lazy">
            <span class="keepsake-name">${build.keepsakes[i]}</span>
          `).join('')}
        </div>
      </div>`;
  }

  return `
    <div class="build-card" data-id="${build.id}">
      <div class="card-header">
        <div class="weapon-icon-wrapper">${weaponImg}</div>
        <div class="card-title-area">
          <div class="card-title-row">
            <span class="build-name">${build.build_name}</span>
            <span class="tier-badge tier-${build.tier}">TIER ${build.tier}</span>
          </div>
          <div class="card-subtitle">
            <span class="weapon-name">${build.weapon}</span> · <span class="aspect-name">${build.aspect}</span>
          </div>
        </div>
      </div>

      <div class="card-tags">
        <span class="tag tag-difficulty-${build.difficulty}">${diffLabel[build.difficulty]}</span>
        ${build.heat_level ? `<span class="tag tag-heat">Heat ${build.heat_level}</span>` : ''}
      </div>

      ${(() => {
        if (!build.math) return '';
        const stats = calculateDamage(build.math);
        const tooltipText = `Fórmula: Média Crítica no Combo [${build.math.combo_name}]&#10;${build.math.explanation}`;
        return `
        <div class="math-stats-row">
          <div class="math-stat tooltip" data-tooltip="${tooltipText}">
            <span class="math-value">⚔️ ${stats.dps}</span>
            <span class="math-label">DPS Estimado</span>
          </div>
          <div class="math-stat tooltip" data-tooltip="Dano médio de um ciclo cheio (${build.math.hits_per_combo} hits/projetéis)">
            <span class="math-value">💥 ${stats.avgCombo}</span>
            <span class="math-label">Max Hit / Burst</span>
          </div>
          <div class="math-stat tooltip" data-tooltip="Tempo estimado (segundos) para destruir 34.000 HP (Hades Total) sem considerar as imunidades dele">
            <span class="math-value">⏱️ ${stats.ttk}s</span>
            <span class="math-label">TTK</span>
          </div>
        </div>`;
      })()}

      <div class="boons-row">${boonChips}</div>
      <div class="gods-row">${godPortraits}</div>

      <div class="card-details">
        <div class="detail-section">
          <h4>Como Jogar</h4>
          <p>${build.playstyle_notes}</p>
        </div>
        <div class="detail-section">
          <h4>Sinergia</h4>
          <p>${build.synergy_explanation}</p>
        </div>
        ${duoHTML}
        ${legendaryHTML}
        ${mirrorTalentsHTML}
        ${keepsakeHTML}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', init);
