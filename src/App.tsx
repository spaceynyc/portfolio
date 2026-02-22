import { AnimatePresence, LazyMotion, domAnimation, m, useInView } from 'framer-motion'
import {
  ArrowUpRight,
  ExternalLink,
  Expand,
  Github,
  Mail,
  Menu,
  Radio,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Project = {
  title: string
  blurb: string
  tech: string[]
  link?: string
  github?: string
  image?: string
  color?: string // unique accent per card
}

const featured: Project[] = [
  {
    title: 'Socionics Galaxy',
    blurb:
      'An interactive 3D galaxy where each star is a personality type. Spiral quadra arms, algorithmically computed intertype relations from Model A function stacks, bloom postprocessing, and a ⌘K search palette. Not a lookup table — a living, navigable system.',
    tech: ['R3F', 'Three.js', 'TypeScript', 'Zustand'],
    link: 'https://socionics-galaxy.vercel.app/',
    github: 'https://github.com/spaceynyc/socionics-galaxy',
    image: '/screenshots/socionics-galaxy.jpg',
    color: '#ff6b9d',
  },
  {
    title: 'Socionics Research Lab',
    blurb:
      'What if personality typing used adversarial AI instead of vibes? Four specialist agents analyze the same subject through different theoretical lenses, then a validator challenges their conclusions. Disagreement is surfaced, not hidden.',
    tech: ['AI Agents', 'React', 'Multi-Agent', 'Socionics'],
    link: 'https://socionics-web.vercel.app/',
    github: 'https://github.com/spaceynyc/socionics-panel',
    image: '/screenshots/socionics-lab.jpg',
    color: '#ffa64d',
  },
]

const projects: Project[] = [
  {
    title: 'Drift',
    blurb:
      'A bookmark manager that actually feels fast. Masonry feed, FTS5 search, source filtering, and a ⌘K palette.',
    tech: ['React', 'SQLite FTS5', 'UI/UX'],
    image: '/screenshots/drift.jpg',
    color: '#5bb7ff',
  },
  {
    title: 'inner-system',
    blurb:
      'Audio-reactive 3D world. Sound becomes geometry, light becomes feeling.',
    tech: ['R3F', 'Three.js', 'Web Audio'],
    link: 'https://inner-system-two.vercel.app/',
    image: '/screenshots/inner-system.jpg',
    color: '#8b5dff',
  },
  {
    title: 'AEROEDEN',
    blurb:
      'Solarpunk media engine — automated X posting, reply scouting, TikTok creative pipelines. Brand systems + growth loops.',
    tech: ['Brand Systems', 'Content Automation', 'Growth'],
    link: 'https://x.com/enteraeroeden',
    image: '/screenshots/aeroeden.jpg',
    color: '#72f7b8',
  },
  {
    title: 'Zipchair AI Assistant',
    blurb:
      'Conversational shopping agent across 12K+ licensed sports furniture products. Pick your team, find your chair.',
    tech: ['React', 'AI Chat', 'E-Commerce'],
    link: 'https://zipchair-deploy.vercel.app/',
    image: '/screenshots/zipchair.jpg',
    color: '#3b82f6',
  },
  {
    title: 'Zipchair Intel',
    blurb:
      'Competitive intelligence dashboard. Daily AI insights, severity-ranked alerts, pricing radar.',
    tech: ['React', 'AI Agents', 'Analytics'],
    link: 'https://zipchair-deploy.vercel.app/intel/',
    image: '/screenshots/zipchair-intel.jpg',
    color: '#f59e0b',
  },
  {
    title: 'OpenClaw Ecosystem',
    blurb:
      'Agent orchestration for sub-agents, cron automations, Discord bots, and device control.',
    tech: ['TypeScript', 'Node', 'Agents'],
    color: '#72f7b8',
  },
  {
    title: 'SUE',
    blurb:
      'Screen Understanding Engine — local FastAPI for autonomous computer control via OCR + GPT-4o vision.',
    tech: ['Python', 'FastAPI', 'OCR', 'Vision'],
    color: '#5bb7ff',
  },
  {
    title: 'PhoneAgent',
    blurb:
      'RPC bridge for AI agents to operate iPhone flows: inspect UI trees, tap, type, automate.',
    tech: ['iOS', 'RPC', 'Automation'],
    color: '#8b5dff',
  },
  {
    title: 'Shader Gallery',
    blurb:
      'GLSL/WebGL experiments in generative texture, motion fields, and surreal light.',
    tech: ['GLSL', 'WebGL', 'Creative Coding'],
    color: '#f0c674',
  },
]

const marqueeItems = [
  'React', 'TypeScript', 'Python', 'Three.js', 'R3F', 'Tailwind', 'Node',
  'FastAPI', 'OpenAI', 'Agents', 'GLSL', 'Framer Motion', 'Zustand', 'SQLite',
]

const navLinks = [
  { href: '#work', label: 'work' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
]

/* ---- Hooks ---- */

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])
  return active
}

/* ---- Components ---- */

function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className="scroll-progress-track">
      <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div ref={ref} className="cursor-glow hidden lg:block" />
}

function DotField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    const particles = Array.from({ length: 45 }).map(() => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      r: Math.random() * 1.0 + 0.3,
    }))
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        p.x = Math.max(0, Math.min(1, p.x))
        p.y = Math.max(0, Math.min(1, p.y))
        ctx.fillStyle = 'rgba(200, 230, 255, 0.4)'
        ctx.beginPath()
        ctx.arc(p.x * window.innerWidth, p.y * window.innerHeight, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    resize(); draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-50" />
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <m.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}>
      {children}
    </m.div>
  )
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <m.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button onClick={onClose} className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
        <X size={20} />
      </button>
      <m.img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} />
    </m.div>
  )
}

/* Sticky glass nav */
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const active = useActiveSection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      <m.nav className={`nav-glass ${scrolled ? 'nav-scrolled' : ''}`}
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-12">
          <a href="#" className="display-font text-base font-bold tracking-wide text-[#d9f1ff]">
            steven richardson <span className="text-[#72f7b8]">/ spaceynyc</span>
          </a>

          {/* Desktop links */}
          <div className="mono-font hidden gap-8 text-xs tracking-wider text-[#6b8ba8] sm:flex">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href}
                className={`nav-link transition-colors hover:text-white ${active === href ? 'nav-active' : ''}`}>
                {label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-[#8ea8c4] transition-colors hover:bg-white/5 hover:text-white sm:hidden">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <m.div className="mobile-menu sm:hidden" initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}>
              <div className="flex flex-col gap-1 px-5 pb-4">
                {navLinks.map(({ href, label }) => (
                  <a key={href} href={href} onClick={closeMobile}
                    className={`mono-font rounded-lg px-4 py-3 text-sm tracking-wider transition-colors hover:bg-white/5 ${
                      active === href ? 'text-[#72f7b8]' : 'text-[#8ea8c4]'
                    }`}>
                    {label}
                  </a>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.nav>
    </>
  )
}

/* Pattern background for no-image cards */
function CardPattern({ color }: { color: string }) {
  return (
    <div className="card-pattern mb-4 rounded-lg border border-white/[0.06]"
      style={{
        background: `
          linear-gradient(135deg, ${color}08 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${color}12, transparent 60%),
          linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)
        `,
      }}>
      <svg className="h-full w-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${color}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={color} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${color})`} />
      </svg>
    </div>
  )
}

/* Featured project — full-width, alternating layout */
function FeaturedCard({
  project, index, onExpand,
}: { project: Project; index: number; onExpand: (src: string, alt: string) => void }) {
  const reverse = index % 2 === 1
  return (
    <Reveal>
      <div className="featured-card group grid gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:p-8"
        style={{ '--card-accent': project.color } as React.CSSProperties}>
        {/* Image */}
        <div className={`relative overflow-hidden rounded-xl border border-white/[0.06] ${reverse ? 'lg:order-2' : ''}`}>
          {project.image && (
            <>
              <img src={project.image} alt={project.title}
                className="featured-img w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060b]/60 via-transparent to-[#05060b]/20 pointer-events-none" />
              <button onClick={() => onExpand(project.image!, project.title)}
                className="absolute right-3 top-3 rounded-md bg-black/50 p-1.5 text-white/60 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 hover:text-white group-hover:opacity-100">
                <Expand size={14} />
              </button>
            </>
          )}
          {/* Colored accent dot */}
          <div className="absolute bottom-3 left-3 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: project.color }} />
        </div>

        {/* Content */}
        <div className={`flex flex-col justify-center ${reverse ? 'lg:order-1' : ''}`}>
          <span className="mono-font mb-3 text-[10px] tracking-[0.25em] uppercase"
            style={{ color: project.color }}>
            Featured · {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="display-font mb-3 text-3xl font-bold text-[#f0f8ff] sm:text-4xl">{project.title}</h3>
          <p className="serif-font mb-5 text-base leading-[1.85] text-[#9ab4cf] italic sm:text-lg">
            {project.blurb}
          </p>
          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="mono-font rounded-md px-2 py-0.5 text-[10px]"
                style={{ color: project.color, backgroundColor: `${project.color}15` }}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer"
                className="mono-font inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                style={{ color: project.color }}>
                launch live <ExternalLink size={12} />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                className="mono-font inline-flex items-center gap-1.5 text-xs text-[#6b8ba8] transition-colors hover:text-white">
                source <Github size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/* Grid project card */
function ProjectCard({
  project, index, onExpand,
}: { project: Project; index: number; onExpand: (src: string, alt: string) => void }) {
  return (
    <Reveal>
      <m.article whileHover={{ y: -4 }}
        className="project-card group relative mb-5 overflow-hidden break-inside-avoid rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-300"
        style={{ '--card-accent': project.color } as React.CSSProperties}>
        {/* Top color bar */}
        <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ backgroundColor: project.color }} />

        {project.image ? (
          <div className="relative mb-4 overflow-hidden rounded-lg border border-white/[0.06]">
            <img src={project.image} alt={project.title}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060b]/50 via-transparent to-[#05060b]/10 pointer-events-none" />
            <button onClick={(e) => { e.stopPropagation(); onExpand(project.image!, project.title) }}
              className="absolute right-2 top-2 rounded-md bg-black/50 p-1.5 text-white/60 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 hover:text-white group-hover:opacity-100">
              <Expand size={13} />
            </button>
          </div>
        ) : (
          <CardPattern color={project.color || '#5a7a96'} />
        )}

        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="display-font text-xl font-semibold text-[#f0f8ff]">{project.title}</h3>
          <span className="mono-font mt-1 shrink-0 text-[10px] text-[#4a6a85]">
            {String(index + 3).padStart(2, '0')}
          </span>
        </div>

        <p className="serif-font mb-4 text-[15px] leading-relaxed text-[#94b0cc] italic">{project.blurb}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="mono-font rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-[#6b8ba8]">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noreferrer"
              className="mono-font inline-flex items-center gap-1.5 text-xs transition-colors hover:text-white"
              style={{ color: project.color }}>
              live <ExternalLink size={12} />
            </a>
          ) : (
            <span className="mono-font inline-flex items-center gap-1.5 text-xs text-[#4a6a85]">
              details on request <ArrowUpRight size={12} />
            </span>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
              className="mono-font inline-flex items-center gap-1.5 text-xs text-[#6b8ba8] transition-colors hover:text-white">
              source <Github size={12} />
            </a>
          )}
        </div>
      </m.article>
    </Reveal>
  )
}

/* ---- App ---- */

function App() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const year = useMemo(() => new Date().getFullYear(), [])
  const onExpand = (src: string, alt: string) => setLightbox({ src, alt })

  const heroLines = [
    { text: 'I build', className: '' },
    { text: 'agents,', className: 'hero-shimmer italic text-[#72f7b8]' },
    { text: 'tools', className: '' },
    { text: <><span className="serif-font font-normal italic text-[#f0c674]">&</span> weird beautiful</>, className: '' },
    { text: 'systems.', className: '' },
  ]

  return (
    <LazyMotion features={domAnimation}>
    <div className="grain relative">
      <ScrollProgress />
      <DotField />
      <CursorGlow />
      <div className="aurora-bg fixed z-0" />
      <NavBar />

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-8 pt-20 sm:px-8 lg:px-12">
        {/* HERO */}
        <section id="hero" className="mb-32 grid min-h-[60vh] items-end gap-8 pt-4 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <m.p className="mono-font mb-6 text-xs tracking-[0.2em] uppercase text-[#72f7b8]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="hero-cursor">Creative Technologist — NYC</span>
            </m.p>
            <h1 className="display-font text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-tight text-[#f0f8ff]">
              {heroLines.map((line, i) => (
                <m.span key={i} className={`inline-block ${line.className}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  style={{ display: i > 0 ? 'block' : undefined }}>
                  {line.text}
                </m.span>
              ))}
            </h1>
          </div>

          <m.div className="self-end pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}>
            <p className="serif-font mb-6 text-base leading-[1.8] text-[#a8c0d8] italic sm:text-lg">
              Steven Richardson — aka <span className="font-semibold not-italic text-white">Space</span>. I ship AI
              infrastructure with personality. Autonomous workflows, screen intelligence, phone control, and
              solarpunk creative machinery.
            </p>
            <div className="flex gap-3">
              <a href="#work"
                className="mono-font cta-primary rounded-lg bg-[#72f7b8] px-4 py-2.5 text-xs font-semibold text-[#050a0e] transition-all hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(114,247,184,0.3)]">
                View work ↓
              </a>
              <a href="#contact"
                className="mono-font rounded-lg border border-white/15 px-4 py-2.5 text-xs text-[#c0d4e8] transition-all hover:border-white/30 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                Get in touch
              </a>
            </div>
          </m.div>
        </section>

        {/* MARQUEE */}
        <div className="mb-28 overflow-hidden border-y border-white/[0.06] py-4">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={`${item}-${i}`} className="mono-font whitespace-nowrap text-sm tracking-wider text-[#4a6a85]">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* WORK */}
        <section id="work" className="mb-28 scroll-mt-24">
          <Reveal>
            <div className="mb-12 flex items-baseline justify-between">
              <div>
                <p className="mono-font mb-2 text-xs tracking-[0.2em] uppercase text-[#6b8ba8]">Selected work</p>
                <h2 className="display-font text-4xl font-bold sm:text-5xl">Builds</h2>
              </div>
              <span className="mono-font text-xs text-[#4a6a85]">{featured.length + projects.length} projects</span>
            </div>
          </Reveal>

          {/* Featured — full width, alternating */}
          <div className="mb-10 space-y-6">
            {featured.map((p, i) => (
              <FeaturedCard key={p.title} project={p} index={i} onExpand={onExpand} />
            ))}
          </div>

          {/* Grid — masonry */}
          <Reveal>
            <p className="mono-font mb-6 text-[10px] tracking-[0.2em] uppercase text-[#4a6a85]">
              More builds
            </p>
          </Reveal>
          <div className="columns-1 gap-5 sm:columns-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.title} project={p} index={i} onExpand={onExpand} />
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* ABOUT */}
        <section id="about" className="mb-28 scroll-mt-24">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
              <div>
                <p className="mono-font mb-2 text-xs tracking-[0.2em] uppercase text-[#6b8ba8]">About</p>
                <h2 className="display-font mb-6 text-4xl font-bold">
                  Where agents, architecture
                  <br className="hidden lg:block" />
                  & design collide.
                </h2>
                <p className="serif-font mb-4 text-base leading-[1.85] text-[#9ab4cf] italic sm:text-lg">
                  ILE creative technologist. I move fast, prototype aggressively, and care about building systems
                  that actually do things — not just demo theater. If it can be automated, I'll automate it. If it
                  can be made beautiful, I'll push it way past "good enough."
                </p>
                <p className="text-base leading-[1.8] text-[#6b8ba8] sm:text-lg">
                  My zone is operator tools, autonomous workflows, and interfaces that feel alive.
                  The best software has personality — so that's what I build.
                </p>

                {/* Stats row */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {([
                    ['11+', 'Projects shipped', '#72f7b8'],
                    ['14+', 'Technologies', '#5bb7ff'],
                    ['∞', 'Curiosity', '#f0c674'],
                  ] as const).map(([val, label, color]) => (
                    <Reveal key={label} delay={0.1}>
                      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                        <p className="display-font text-2xl font-bold" style={{ color }}>{val}</p>
                        <p className="mono-font mt-1 text-[10px] tracking-wider text-[#6b8ba8]">{label}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <p className="mono-font mb-4 text-[10px] tracking-[0.2em] uppercase text-[#6b8ba8]">Philosophy</p>
                <ul className="space-y-5">
                  {([
                    ['Ship fast', 'Perfect is the enemy of done. Iterate in public.', '#72f7b8'],
                    ['Automate taste', 'AI should amplify creativity, not replace judgment.', '#f0c674'],
                    ['Design is function', 'Beautiful systems work better. Ugly prototypes are unacceptable.', '#5bb7ff'],
                    ['Build the tool', "If it doesn't exist, make it. Then make it good.", '#8b5dff'],
                  ] as const).map(([title, desc, color], i) => (
                    <Reveal key={title} delay={i * 0.08}>
                      <li className="flex gap-3">
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                        <div>
                          <p className="text-sm font-medium text-[#e0edf8]">{title}</p>
                          <p className="serif-font text-sm text-[#7a9ab8] italic">{desc}</p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="section-divider" />

        {/* CONTACT */}
        <section id="contact" className="mb-12 scroll-mt-24">
          <Reveal>
            <div className="max-w-3xl">
              <p className="mono-font mb-2 text-xs tracking-[0.2em] uppercase text-[#6b8ba8]">Contact</p>
              <h2 className="display-font mb-2 text-4xl font-bold">
                Let's build something
              </h2>
              <h2 className="contact-glow-text serif-font mb-6 text-4xl italic text-[#f0c674]">
                unreasonably good.
              </h2>
              <p className="mb-8 text-base text-[#7a9ab8]">
                Open for collaborations, weird experiments, and products that deserve ambition.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { href: 'https://github.com/spaceynyc', icon: Github, label: 'GitHub', color: '#72f7b8' },
                  { href: 'https://x.com/spaceynyc', icon: Radio, label: '@spaceynyc', color: '#5bb7ff' },
                  { href: 'mailto:srich7x@gmail.com', icon: Mail, label: 'Email', color: '#f0c674' },
                ].map(({ href, icon: Icon, label, color }) => (
                  <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="contact-btn mono-font inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xs transition-all duration-300"
                    style={{ '--btn-accent': color, borderColor: `${color}25`, color: `${color}cc` } as React.CSSProperties}>
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mono-font flex items-center justify-between border-t border-white/[0.06] px-1 py-4 text-[11px] text-[#4a6a85]">
          <span>© {year} Steven Richardson</span>
          <span>spaceynyc.dev</span>
        </footer>
      </main>

      <AnimatePresence>
        {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
    </LazyMotion>
  )
}

export default App
