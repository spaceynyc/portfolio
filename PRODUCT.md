# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: founders and small teams with a project in mind (freelance or contract work) who arrive from a link, an X post, or GitHub and decide within a minute whether Steven can build their thing. Secondary: hiring managers and recruiters evaluating him for applied-AI or creative-technology roles. Both are reached with one broad invitation; clients come first.

## Product Purpose

spaceynyc.dev is Steven Richardson's personal portfolio. It exists to show what he has built and to get the right people to email him. Success is a qualified email: someone who has seen the work, understands what kind of builder he is, and writes about a project or a role.

## Positioning

A solo builder who takes a project from idea to a working, shipped thing across two territories that rarely share one person: agents that see and act (multi-agent analysis, a screen-reading engine, an iPhone-driving bridge, a shopping agent) and immersive worlds (a 3D personality galaxy, an audio-reactive environment, shader experiments). Every project is designed and engineered by him alone.

## Operating Context

Visitors are mostly on desktop from a shared link, or on phones from X. The site is a single page with dialogs for project detail, plus static policy pages (`/hermes-sms/`, `/privacy/`, `/terms/`) that must keep their URLs and copy because they back a real SMS service registration.

## Capabilities and Constraints

- Static Vite site, vanilla JS, three.js available; deployed on Vercel from `spaceynyc/portfolio`.
- Project content lives in `src/portfolio-data.js` (11 projects).
- Project deep links (`#drift`, `#socionics-galaxy`, …) are shared externally and should keep working.
- Contact is `mailto:srich7x@gmail.com`; no form backend.

## Brand Commitments

- Name and identities: Steven Richardson, known as Space; the studio identity is spaceynyc. The chrome spaceynyc wordmark (`public/assets/logo.webp`) stays.
- "Ideas in Orbit" is the site's line.
- Neuropol is the display face tied to the chrome lettering.
- Voice: first person, plain, confident, no hype.

## Evidence on Hand

- 11 projects, all solo builds (design and engineering by Steven).
- Featured three: Socionics Galaxy, Socionics Research Lab, Zipchair AI Assistant.
- Screenshots for 7 projects (`public/screenshots/`, crops in `public/thumbs/`); drawn covers for OpenClaw, SUE, PhoneAgent, Shader Gallery (`src/covers.js`).
- Live links for Socionics Galaxy, Research Lab, inner-system, Zipchair AI, Zipchair Intel; AEROEDEN on X.
- Public code on GitHub for Socionics Galaxy and Socionics Research Lab (the repos linked in the data). Only say "code on GitHub" where a repo link exists.
- Zipchair AI Assistant and Zipchair Intel were built as a pitch to Zipchair, not contracted client work. Never describe them as client work.
- AEROEDEN is Steven's own brand; its automated publishing runs for real.
- Absent, never to be invented: client names, testimonials, user counts, revenue, project years, employers.

## Product Principles

1. Show the working thing before describing it.
2. Specific over atmospheric: name the project, the mechanism, and the status.
3. Honest status on every project: live, code public, pitch, private, or experiment.
4. One clear invitation: email Steven.
