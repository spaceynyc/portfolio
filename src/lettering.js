import hero from "./assets/hero-title.svg?raw";
import featured from "./assets/featured-work.svg?raw";
import services from "./assets/what-we-do.svg?raw";

// Source-derived vector outlines preserve the reference's bespoke lettering.
// Surrounding headings retain their semantic roles and accessible labels.
export function applyLettering() {
  document.querySelector("h1").innerHTML = hero;
  for (const [selector, artwork] of [
    [".section-heading h2", featured],
    [".services-section h2", services],
  ]) {
    const heading = document.querySelector(selector);
    if (!heading) continue;
    heading.setAttribute("aria-label", heading.textContent);
    heading.innerHTML = artwork;
    heading.classList.add("vector-lettering");
  }
}
