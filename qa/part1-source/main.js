import { applyLettering } from "./lettering.js";
import { mountHeroMotion } from "./hero-motion.js";
applyLettering();
mountHeroMotion();
void import("./service-icons.js").then((module) => module.mountServiceIcons());
const dialog = document.querySelector("#detail-dialog");
const content = document.querySelector("#dialog-content");
let disposeViewer = null;
let lastFocus = null;
const projects = {
  orbital: {
    name: "Orbital",
    number: "01",
    type: "Brand identity",
    image: "orbital",
    description:
      "An identity built around possibility. A sculptural orbital system brings a distinctive visual language to life across the brand’s digital and physical worlds.",
    tags: ["Visual identity", "Art direction", "Brand systems"],
    model: "orbital.glb",
  },
  chroma: {
    name: "Chroma",
    number: "02",
    type: "Digital experience",
    image: "chroma",
    description:
      "A fluid exploration of form, light and interaction. An expressive digital world where every surface responds and every detail becomes part of the experience.",
    tags: ["Digital design", "Creative development", "Motion design"],
    model: "chroma.glb",
  },
  nexus: {
    name: "Nexus",
    number: "03",
    type: "Product launch",
    image: "nexus",
    description:
      "A new perspective, made tangible. A dimensional visual world of polished black chrome, designed to connect a bold product story across every touchpoint.",
    tags: ["Launch strategy", "3D design", "Art direction"],
    model: "nexus.glb",
  },
};
const services = {
  brand: {
    title: "Brand",
    text: "A clear idea. An unmistakable identity. We connect creative strategy with expressive visual systems to help brands find their place in the world.",
    tags: [
      "Identity systems",
      "Creative strategy",
      "Art direction",
      "Brand guidelines",
    ],
  },
  digital: {
    title: "Digital",
    text: "Digital experiences with a point of view. We bring design and technology together to build considered websites and products that feel intuitive, expressive and alive.",
    tags: [
      "Web experiences",
      "Product design",
      "Creative development",
      "Interaction design",
    ],
  },
  content: {
    title: "Content",
    text: "Ideas that move. We create dimensional imagery, motion and editorial worlds that make a brand’s story feel immediate, wherever it lives.",
    tags: [
      "3D & motion",
      "Social & editorial",
      "Campaign concepts",
      "Visual storytelling",
    ],
  },
  experience: {
    title: "Experience",
    text: "Beyond the screen. We explore emerging technology and spatial storytelling to create experiences that bring people and ideas together.",
    tags: [
      "Installations",
      "Emerging technology",
      "Spatial design",
      "Interactive experiences",
    ],
  },
};
const tags = (list) =>
  `<div class="detail-tags">${list.map((t) => `<span>${t}</span>`).join("")}</div>`;

function show(markup) {
  disposeViewer?.();
  disposeViewer = null;
  if (!dialog.open) lastFocus = document.activeElement;
  content.innerHTML = markup;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("no-scroll");
  dialog.scrollTop = 0;
  document.querySelector(".dialog-close").focus();
}
function close() {
  dialog.close();
}
dialog.addEventListener("close", () => {
  disposeViewer?.();
  disposeViewer = null;
  document.body.classList.remove("no-scroll");
  lastFocus?.focus();
});
document.querySelector(".dialog-close").addEventListener("click", close);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      close();
  }
});

async function showProject(key) {
  const p = projects[key];
  show(
    `<p class="dialog-eyebrow">SELECTED WORK / ${p.number} / ${p.type.toUpperCase()}</p><h2 class="dialog-title" id="dialog-title">${p.name}</h2><div class="viewer" aria-label="Interactive ${p.name} 3D artwork"><img class="viewer-poster" src="/assets/${p.image}.png" alt="Custom ${p.name} chrome sculpture"/><span class="viewer-hint">LOADING THE EXPERIENCE</span></div><p class="dialog-text">${p.description}</p>${tags(p.tags)}<button class="dialog-action" data-modal="contact">Have something in mind? Let’s create ↗</button>`,
  );
  const container = content.querySelector(".viewer");
  try {
    const { mountViewer } = await import("./viewer.js");
    if (!container.isConnected || !dialog.open) return;
    const cleanup = await mountViewer(container, `/assets/${p.model}`);
    if (!container.isConnected || !dialog.open) cleanup();
    else disposeViewer = cleanup;
  } catch {
    if (container.isConnected)
      container.querySelector(".viewer-hint").textContent =
        "SCULPTED IN BLENDER · SPACEYNYC";
  }
}
function showContact(service = "") {
  show(
    `<p class="dialog-eyebrow">LET’S MAKE WHAT’S NEXT</p><h2 class="dialog-title" id="dialog-title">An idea starts<br />a conversation.</h2><p class="dialog-text">Tell us a little about your world, and what you’d like to create.</p><form class="contact-form"><label>Your name<input name="name" required autocomplete="name" placeholder="Alex Taylor" maxlength="100" /></label><label>Email address<input name="email" type="email" required autocomplete="email" placeholder="alex@yourstudio.com" maxlength="254" /></label><label class="wide">What are you thinking?<select name="service"><option value="">Select a service</option><option ${service === "brand" ? "selected" : ""}>Brand</option><option ${service === "digital" ? "selected" : ""}>Digital</option><option ${service === "content" ? "selected" : ""}>Content</option><option ${service === "experience" ? "selected" : ""}>Experience</option><option>Something else</option></select></label><label class="wide">Your idea<textarea name="message" required placeholder="The project, the possibility, the big what if…" maxlength="5000"></textarea></label><p class="form-note wide">Create a project brief to download and share. Your information stays in this browser.</p><button class="dialog-action wide" type="submit">Create my project brief ↗</button><p class="form-status" aria-live="polite"></p></form>`,
  );
  content.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `SPACEYNYC — PROJECT BRIEF\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nService: ${data.get("service") || "To explore"}\n\nTHE IDEA\n${data.get("message")}\n`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "spaceynyc-project-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    content.querySelector(".form-status").textContent =
      "Your project brief is ready. It has been downloaded to your device.";
  });
}
function showModal(name) {
  if (name === "contact") return showContact();
  if (name === "work")
    return show(
      `<p class="dialog-eyebrow">SELECTED PROJECTS</p><h2 class="dialog-title" id="dialog-title">Our orbit.</h2><p class="dialog-text">Brand worlds. Digital experiences. New perspectives.</p><div class="modal-projects">${Object.entries(
        projects,
      )
        .map(
          ([key, p]) =>
            `<button data-project="${key}"><img src="/assets/${p.image}.png" alt="${p.name} artwork"/><h3>${p.name}</h3><p>${p.type}</p></button>`,
        )
        .join("")}</div>`,
    );
  if (name === "about")
    show(
      `<p class="dialog-eyebrow">INDEPENDENT BY DESIGN</p><h2 class="dialog-title" id="dialog-title">Ideas without<br />boundaries.</h2><p class="dialog-text">Spaceynyc is a creative studio at the intersection of design, technology and culture. We build bold brands, immersive digital experiences, and what’s next.</p><p class="dialog-text">Our practice moves between strategy, identity, digital products and dimensional worlds. Different disciplines, one shared ambition: a brighter tomorrow, together.</p>${tags(["Brand", "Digital", "Content", "Experience"])}<button class="dialog-action" data-modal="contact">Let’s create together ↗</button>`,
    );
}
document.addEventListener("click", (e) => {
  const project = e.target.closest("[data-project]");
  if (project) return showProject(project.dataset.project);
  const modal = e.target.closest("[data-modal]");
  if (modal) return showModal(modal.dataset.modal);
  const service = e.target.closest("[data-service]");
  if (service) {
    const key = service.dataset.service,
      s = services[key];
    show(
      `<p class="dialog-eyebrow">WHAT WE DO</p><h2 class="dialog-title" id="dialog-title">${s.title}</h2><p class="dialog-text">${s.text}</p>${tags(s.tags)}<button class="dialog-action" data-inquire="${key}">Let’s talk ${s.title.toLowerCase()} ↗</button>`,
    );
    return;
  }
  const inquire = e.target.closest("[data-inquire]");
  if (inquire) return showContact(inquire.dataset.inquire);
  const social = e.target.closest("[data-social]");
  if (social)
    show(
      `<p class="dialog-eyebrow">STAY IN OUR ORBIT</p><h2 class="dialog-title" id="dialog-title">${social.dataset.social}</h2><p class="dialog-text">Our social links are coming soon. In the meantime, bring us your next big idea.</p><button class="dialog-action" data-modal="contact">Let’s connect ↗</button>`,
    );
});
const menu = document.querySelector(".menu-toggle"),
  nav = document.querySelector(".main-nav");
function closeMenu() {
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  nav.classList.toggle("is-open", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.closest("a,button")) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
