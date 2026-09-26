// Drawn covers for projects without a public screenshot. Each motif describes what the project does.
// All share one 320×180 canvas and one stroke weight; color comes from --project-color.

function shaderField() {
  // Flowing field lines: stacked sine waves whose phase drifts with depth.
  const lines = [];
  for (let row = 0; row < 11; row++) {
    const points = [];
    for (let x = -10; x <= 330; x += 10) {
      const y = 30 + row * 12 + Math.sin(x / 38 + row * 0.55) * (10 + row * 1.4) + Math.sin(x / 13 + row) * 1.5;
      points.push(`${x},${y.toFixed(1)}`);
    }
    lines.push(`<polyline class="${row % 3 ? 'soft' : ''}" points="${points.join(' ')}"/>`);
  }
  return lines.join('');
}

function agentNetwork() {
  // A coordinator with specialist agents in orbit, linked to one another.
  const nodes = [[160, 90, 9], [82, 50, 5], [238, 46, 5], [262, 122, 5], [184, 150, 5], [70, 128, 5], [120, 22, 3], [214, 98, 3]];
  const links = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 7], [3, 7], [5, 1], [4, 3]];
  return `<ellipse class="soft" cx="160" cy="90" rx="112" ry="52"/><ellipse class="soft" cx="160" cy="90" rx="62" ry="30"/>`
    + links.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}"/>`).join('')
    + nodes.map(([x, y, r], i) => `<circle class="${i ? 'fill' : ''}" cx="${x}" cy="${y}" r="${r}"/>`).join('')
    + `<circle cx="160" cy="90" r="16" class="soft"/>`;
}

function screenReader() {
  // An interface being read: a window, recognized regions, and a scanning reticle.
  return `<rect x="58" y="26" width="204" height="128" rx="8"/><line x1="58" y1="44" x2="262" y2="44"/>`
    + `<circle class="fill" cx="70" cy="35" r="2.5"/><circle class="fill" cx="80" cy="35" r="2.5"/>`
    + `<rect class="soft" x="72" y="56" width="84" height="10" rx="2"/><rect class="soft" x="72" y="74" width="120" height="6" rx="2"/><rect class="soft" x="72" y="86" width="100" height="6" rx="2"/>`
    + `<rect class="soft" x="72" y="106" width="56" height="34" rx="4"/><rect class="soft" x="138" y="106" width="56" height="34" rx="4"/>`
    + `<rect x="66" y="50" width="96" height="22" rx="3" stroke-dasharray="4 4"/><rect x="132" y="100" width="68" height="46" rx="4" stroke-dasharray="4 4"/>`
    + `<circle cx="226" cy="84" r="18"/><line x1="226" y1="58" x2="226" y2="74"/><line x1="226" y1="94" x2="226" y2="110"/><line x1="200" y1="84" x2="216" y2="84"/><line x1="236" y1="84" x2="252" y2="84"/>`;
}

function phoneTaps() {
  // A phone driven by an agent: a path of taps across its screen.
  return `<rect x="122" y="14" width="76" height="152" rx="14"/><line x1="148" y1="24" x2="172" y2="24"/>`
    + `<rect class="soft" x="132" y="38" width="56" height="10" rx="3"/><rect class="soft" x="132" y="56" width="56" height="26" rx="4"/><rect class="soft" x="132" y="90" width="56" height="10" rx="3"/><rect class="soft" x="132" y="108" width="36" height="10" rx="3"/>`
    + `<path d="M60 150 C 90 140, 110 110, 146 69 S 170 100, 150 113" stroke-dasharray="3 5"/>`
    + [[146, 69], [176, 95], [150, 113]].map(([x, y]) => `<circle class="fill" cx="${x}" cy="${y}" r="3"/><circle cx="${x}" cy="${y}" r="9" class="soft"/>`).join('')
    + `<circle cx="60" cy="150" r="6"/><circle cx="264" cy="40" r="4" class="soft"/><circle cx="252" cy="140" r="3" class="soft"/>`;
}

const motifs = {
  'shader-gallery': shaderField,
  'openclaw-ecosystem': agentNetwork,
  'sue': screenReader,
  'phoneagent': phoneTaps,
};

export function cover(project) {
  const draw = motifs[project.id];
  return `<span class="cover" style="--project-color:${project.color}" aria-hidden="true"><svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">${draw ? draw() : ''}</svg></span>`;
}
