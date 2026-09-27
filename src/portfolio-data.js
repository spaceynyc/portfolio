// Projects and assets migrated from spaceynyc/portfolio at 261f0cb83ce3d80083436d30afbca40664836d31.
// Descriptions rewritten for the Ideas in Orbit portfolio; original project facts and links retained.
// kind: what it is · status: honest public state · featured: gets a full launch stage · group: agents or worlds in the belt · story/alt: featured copy · frame: how the stage crops the screenshot.
// image: 16:9 card crop · detail: 16:10 dialog image · original: full-resolution screenshot.
export const projects = [
  {
    "id": "socionics-galaxy",
    "title": "Socionics Galaxy",
    "summary": "A 3D galaxy you can explore, mapping personality types and how they relate.",
    "blurb": "Personality, mapped into a universe you can explore. Navigate a 3D galaxy of types, trace the relationships between them, and move through spiral arms shaped by socionics quadras. Under the bloom and starlight, Model A function stacks calculate every connection. A command palette keeps the whole system within reach.",
    "tech": [
      "R3F",
      "Three.js",
      "TypeScript",
      "Zustand"
    ],
    "link": "https://socionics-galaxy.vercel.app/",
    "github": "https://github.com/spaceynyc/socionics-galaxy",
    "image": "/thumbs/socionics-galaxy.webp",
    "detail": "/thumbs/socionics-galaxy-full.webp",
    "original": "/screenshots/socionics-galaxy.jpg",
    "color": "#ff6b9d",
    "kind": "3D web world",
    "status": [
      "Live",
      "Code public"
    ],
    "featured": true,
    "group": "worlds",
    "frame": "--frame-scale:1.7;--frame-origin:50% 58%",
    "story": "Socionics sorts people into sixteen personality types and predicts how any two of them get along. I turned the theory into a place: each type is a star, colored by its family, or quadra. Hover a star and its relationships to the other fifteen are drawn; click to lock one in place, or press ⌘K to jump to any type.",
    "alt": "Socionics Galaxy: the sixteen personality types as glowing spheres in dark 3D space, colored by quadra"
  },
  {
    "id": "socionics-research-lab",
    "title": "Socionics Research Lab",
    "summary": "Four AI agents analyse one subject from different angles, then a validator challenges them.",
    "blurb": "A research space for thinking from more than one angle. Four specialist AI agents examine the same subject through different theoretical lenses. A validator then challenges their conclusions, making disagreement visible and giving every interpretation something to answer to.",
    "tech": [
      "AI Agents",
      "React",
      "Multi-Agent",
      "Socionics"
    ],
    "link": "https://socionics-web.vercel.app/",
    "github": "https://github.com/spaceynyc/socionics-panel",
    "image": "/thumbs/socionics-lab.webp",
    "detail": "/thumbs/socionics-lab-full.webp",
    "original": "/screenshots/socionics-lab.jpg",
    "color": "#ffa64d",
    "kind": "Multi-agent research tool",
    "status": [
      "Live",
      "Code public"
    ],
    "featured": true,
    "group": "agents",
    "story": "Name a subject and four specialist agents each read them through a different school of personality theory. A fifth agent, the validator, then argues with their conclusions. The disagreement stays on screen, so you can see where a reading holds up and where it is a guess.",
    "alt": "Socionics Research Lab: a “decode the psyche” landing page beside a sample analysis typing Walter White as LIE, quadra Gamma"
  },
  {
    "id": "drift",
    "title": "Drift",
    "summary": "A visual feed for saved links, with full-text search and a command palette.",
    "blurb": "A home for everything that catches your attention. Drift brings saved links into a visual masonry feed, with full-text search, source filters, and a command palette that gets you back to the right idea without breaking your flow.",
    "tech": [
      "React",
      "SQLite FTS5",
      "UI/UX"
    ],
    "image": "/thumbs/drift.webp",
    "detail": "/thumbs/drift-full.webp",
    "original": "/screenshots/drift.jpg",
    "color": "#5bb7ff",
    "kind": "Saved-links tool",
    "status": [
      "Not public"
    ],
    "group": "worlds"
  },
  {
    "id": "inner-system",
    "title": "inner-system",
    "summary": "An audio-reactive 3D world where sound reshapes geometry and light.",
    "blurb": "An immersive world that listens. Sound reshapes geometry and light inside an audio-reactive 3D environment, turning a track into something you can see and explore. An experiment in how an interface can be felt as much as used.",
    "tech": [
      "R3F",
      "Three.js",
      "Web Audio"
    ],
    "link": "https://inner-system-two.vercel.app/",
    "image": "/thumbs/inner-system.webp",
    "detail": "/thumbs/inner-system-full.webp",
    "original": "/screenshots/inner-system.jpg",
    "color": "#8b5dff",
    "kind": "Audio-reactive 3D world",
    "status": [
      "Live"
    ],
    "group": "worlds"
  },
  {
    "id": "aeroeden",
    "title": "AEROEDEN",
    "summary": "A solarpunk brand run by automated publishing and content pipelines.",
    "blurb": "A brighter future, with a system behind it. AEROEDEN brings a solarpunk identity to life through automated X publishing, reply scouting, and TikTok creative pipelines. Brand, content, and automation working toward the same world.",
    "tech": [
      "Brand Systems",
      "Content Automation",
      "Growth"
    ],
    "link": "https://x.com/enteraeroeden",
    "image": "/thumbs/aeroeden.webp",
    "detail": "/thumbs/aeroeden-full.webp",
    "original": "/screenshots/aeroeden.jpg",
    "color": "#72f7b8",
    "kind": "Automated brand",
    "status": [
      "Running on X"
    ],
    "group": "worlds"
  },
  {
    "id": "zipchair-ai-assistant",
    "title": "Zipchair AI Assistant",
    "summary": "A shopping agent that turns a 12,000-product catalog into a conversation.",
    "blurb": "From your favorite team to your next favorite seat. A conversational shopping agent helps fans explore more than 12,000 licensed sports furniture products, turning a sprawling catalog into a simple back-and-forth.",
    "tech": [
      "React",
      "AI Chat",
      "E-Commerce"
    ],
    "link": "https://zipchair-deploy.vercel.app/",
    "image": "/thumbs/zipchair.webp",
    "detail": "/thumbs/zipchair-full.webp",
    "original": "/screenshots/zipchair.jpg",
    "color": "#3b82f6",
    "kind": "Shopping agent",
    "status": [
      "Pitch for Zipchair",
      "Live demo"
    ],
    "featured": true,
    "group": "agents",
    "frame": "--frame-scale:1.75;--frame-origin:0 0",
    "story": "A pitch I built for Zipchair, which sells licensed sports furniture: more than 12,000 chairs, recliners, stools and sofas carrying team logos. Instead of paging through filters, a fan names their team and the agent narrows the catalog in a back-and-forth conversation.",
    "alt": "Zipchair AI Assistant: the agent asks which team you are a fan of, offering quick replies like Dallas Cowboys, Gaming Chairs and Under $500"
  },
  {
    "id": "zipchair-intel",
    "title": "Zipchair Intel",
    "summary": "A competitive-intelligence dashboard with daily AI insights and price alerts.",
    "blurb": "A clearer view of a moving market. Zipchair Intel brings daily AI insights, priority-ranked alerts, and a pricing radar into one competitive intelligence dashboard, helping the important changes rise above the noise.",
    "tech": [
      "React",
      "AI Agents",
      "Analytics"
    ],
    "link": "https://zipchair-deploy.vercel.app/intel/",
    "image": "/thumbs/zipchair-intel.webp",
    "detail": "/thumbs/zipchair-intel-full.webp",
    "original": "/screenshots/zipchair-intel.jpg",
    "color": "#f59e0b",
    "kind": "Market-intelligence dashboard",
    "status": [
      "Pitch for Zipchair",
      "Live demo"
    ],
    "group": "agents"
  },
  {
    "id": "openclaw-ecosystem",
    "title": "OpenClaw Ecosystem",
    "summary": "An operating layer that coordinates specialist agents, automations, and devices.",
    "blurb": "An operating layer for a connected cast of agents. OpenClaw coordinates specialist agents, scheduled automations, Discord bots, and device control, bringing separate capabilities into workflows that can move together.",
    "tech": [
      "TypeScript",
      "Node",
      "Agents"
    ],
    "color": "#72f7b8",
    "kind": "Agent operating layer",
    "status": [
      "Not public"
    ],
    "group": "agents"
  },
  {
    "id": "sue",
    "title": "SUE",
    "summary": "A local service that turns what’s on screen into information an agent can act on.",
    "blurb": "Giving agents a way to read the screen in front of them. SUE — Screen Understanding Engine — combines OCR and GPT-4o vision behind a local FastAPI service, translating an interface into information an agent can use for computer control.",
    "tech": [
      "Python",
      "FastAPI",
      "OCR",
      "Vision"
    ],
    "color": "#5bb7ff",
    "kind": "Screen-reading engine",
    "status": [
      "Not public"
    ],
    "group": "agents"
  },
  {
    "id": "phoneagent",
    "title": "PhoneAgent",
    "summary": "A bridge that lets agents inspect, tap, and type through an iPhone’s interface.",
    "blurb": "A bridge from an agent’s intent to an iPhone’s interface. PhoneAgent exposes UI inspection, taps, and typing through RPC, letting agents work through phone flows one interaction at a time.",
    "tech": [
      "iOS",
      "RPC",
      "Automation"
    ],
    "color": "#8b5dff",
    "kind": "iPhone control bridge",
    "status": [
      "Not public"
    ],
    "group": "agents"
  },
  {
    "id": "shader-gallery",
    "title": "Shader Gallery",
    "summary": "A sketchbook of GLSL and WebGL experiments in generative light and motion.",
    "blurb": "A sketchbook written in light. A collection of GLSL and WebGL experiments exploring generative textures, flowing motion fields, and surreal surfaces. A place to follow a visual idea and see where the mathematics takes it.",
    "tech": [
      "GLSL",
      "WebGL",
      "Creative Coding"
    ],
    "color": "#f0c674",
    "kind": "Generative light sketches",
    "status": [
      "Not public"
    ],
    "group": "worlds"
  }
];

export const technologies = [
  "React",
  "TypeScript",
  "Python",
  "Three.js",
  "R3F",
  "Tailwind",
  "Node",
  "FastAPI",
  "OpenAI",
  "Agents",
  "GLSL",
  "Framer Motion",
  "Zustand",
  "SQLite"
];
