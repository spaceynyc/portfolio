import { motion, useInView } from 'framer-motion'
import {
  ArrowUpRight,
  ExternalLink,
  Expand,
  Github,
  Mail,
  Radio,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Project = {
  title: string
  blurb: string
  tech: string[]
  accent: string
  link?: string
  github?: string
  image?: string
}

const projects: Project[] = [
  {
    title: 'Socionics Galaxy',
    blurb:
      'Interactive 3D visualization of 16 socionics personality types as a galaxy. Spiral quadra arms, algorithmically computed intertype relations, bloom postprocessing, and ⌘K search.',
    tech: ['R3F', 'Three.js', 'TypeScript', 'Zustand'],
    accent: 'from-[#ff6b9d]/20 to-transparent',
    link: 'https://socionics-galaxy.vercel.app/',
    github: 'https://github.com/spaceynyc/socionics-galaxy',
    image: '/screenshots/socionics-galaxy.jpg',
  },
  {
    title: 'Socionics Research Lab',
    blurb:
      'Multi-agent cognitive modeling for precise socionics typing. Scout → Council → Validator → Synthesis pipeline with adversarial review and calibrated confidence scores.',
    tech: ['AI Agents', 'React', 'Socionics', 'Multi-Agent'],
    accent: 'from-[#ffa64d]/20 to-transparent',
    link: 'https://socionics-web.vercel.app/',
    github: 'https://github.com/spaceynyc/socionics-panel',
    image: '/screenshots/socionics-lab.jpg',
  },
  {
    title: 'Drift',
    blurb:
      'Personal feed aggregator and bookmark manager with dark-mode masonry UI, FTS5 instant search, source filtering, and a ⌘K command palette for thought-speed retrieval.',
    tech: ['React', 'SQLite FTS5', 'UI/UX'],
    accent: 'from-[#5bb7ff]/20 to-transparent',
    image: '/screenshots/drift.jpg',
  },
  {
    title: 'inner-system',
    blurb:
      'Audio-reactive 3D world built in R3F/Three.js. Experimental, atmospheric, and tuned for immersive visual rhythm.',
    tech: ['R3F', 'Three.js', 'Web Audio'],
    accent: 'from-[#8b5dff]/20 to-transparent',
    link: 'https://inner-system-two.vercel.app/',
    image: '/screenshots/inner-system.jpg',
  },
  {
    title: 'AEROEDEN',
    blurb:
      'Solarpunk media engine with automated X posting, reply scouting, and TikTok-ready creative pipelines. Brand systems + growth loops.',
    tech: ['Brand Systems', 'Content Automation', 'Growth'],
    accent: 'from-[#72f7b8]/20 to-transparent',
    link: 'https://x.com/enteraeroeden',
    image: '/screenshots/aeroeden.jpg',
  },
  {
    title: 'Zipchair AI Assistant',
    blurb:
      'Conversational shopping agent connected to a 12K+ product catalog across NFL, MLB, NHL, AEW, and NCAA licensed furniture. Natural language search with smart suggestion chips.',
    tech: ['React', 'AI Chat', 'E-Commerce', 'NLP'],
    accent: 'from-[#3b82f6]/20 to-transparent',
    link: 'https://zipchair-deploy.vercel.app/',
    image: '/screenshots/zipchair.jpg',
  },
  {
    title: 'Zipchair Intel',
    blurb:
      'AI-powered competitive intelligence dashboard for a licensed sports furniture brand. Daily insights, severity-ranked alerts, competitor pricing radar, and actionable recommendations.',
    tech: ['React', 'AI Agents', 'Analytics', 'Dashboard'],
    accent: 'from-[#f59e0b]/20 to-transparent',
    link: 'https://zipchair-deploy.vercel.app/intel/',
    image: '/screenshots/zipchair-intel.jpg',
  },
  {
    title: 'OpenClaw Ecosystem',
    blurb:
      'Agent orchestration platform for sub-agents, cron automations, Discord bots, and device control. Built for speed, autonomy, and clean operator UX.',
    tech: ['TypeScript', 'Node', 'Agents', 'Automation'],
    accent: 'from-[#72f7b8]/20 to-transparent',
  },
  {
    title: 'SUE · Screen Understanding Engine',
    blurb:
      'Local FastAPI brain for autonomous computer control using OCR + GPT-4o vision. It reads the screen, plans, verifies, and executes.',
    tech: ['Python', 'FastAPI', 'OCR', 'Vision'],
    accent: 'from-[#5bb7ff]/20 to-transparent',
  },
  {
    title: 'PhoneAgent',
    blurb:
      'RPC bridge that lets AI agents operate iPhone flows programmatically: inspect UI trees, tap elements, type, and automate end-to-end tasks.',
    tech: ['iOS', 'RPC', 'Xcode', 'Automation'],
    accent: 'from-[#8b5dff]/20 to-transparent',
  },
  {
    title: 'Shader Gallery',
    blurb:
      'Collection of GLSL/WebGL experiments exploring generative texture, motion fields, and surreal light behavior.',
    tech: ['GLSL', 'WebGL', 'Creative Coding'],
    accent: 'from-[#72f7b8]/20 to-transparent',
  },
]

const marqueeItems = [
  'React', 'TypeScript', 'Python', 'Three.js', 'R3F', 'Tailwind', 'Node',
  'FastAPI', 'OpenAI', 'Agents', 'GLSL', 'Framer Motion', 'Zustand', 'SQLite',
]

function DotField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let mouseX = 0.5
    let mouseY = 0.5

    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005,
      r: Math.random() * 1.2 + 0.3,
    }))

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      particles.forEach((p) => {
        p.x += p.vx + (mouseX - 0.5) * 0.00015
        p.y += p.vy + (mouseY - 0.5) * 0.00015
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        p.x = Math.max(0, Math.min(1, p.x))
        p.y = Math.max(0, Math.min(1, p.y))
        const px = p.x * window.innerWidth
        const py = p.y * window.innerHeight
        ctx.fillStyle = 'rgba(200, 230, 255, 0.5)'
        ctx.beginPath()
        ctx.arc(px, py, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-60" />
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X size={20} />
      </button>
      <motion.img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  )
}

function App() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="grain relative overflow-hidden">
      <DotField />
      <div className="aurora-bg fixed z-0" />

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        {/* — NAV — */}
        <motion.nav
          className="mb-16 flex items-center justify-between px-1 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="display-font text-base font-bold tracking-wide text-[#d9f1ff]">
            steven richardson <span className="text-[#72f7b8]">/ spaceynyc</span>
          </div>
          <div className="mono-font hidden gap-8 text-xs tracking-wider text-[#7a95b0] sm:flex">
            <a href="#work" className="transition-colors hover:text-white">work</a>
            <a href="#about" className="transition-colors hover:text-white">about</a>
            <a href="#contact" className="transition-colors hover:text-white">contact</a>
          </div>
        </motion.nav>

        {/* — HERO — asymmetric, editorial */}
        <section className="mb-32 grid min-h-[65vh] items-end gap-8 pt-4 lg:grid-cols-[1.6fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mono-font mb-6 text-xs tracking-[0.2em] text-[#72f7b8] uppercase">
              Creative Technologist — NYC
            </p>
            <h1 className="display-font text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-tight text-[#f0f8ff]">
              I build
              <br />
              <span className="italic text-[#72f7b8]">agents</span>, tools
              <br />
              & weird beautiful
              <br />
              systems.
            </h1>
          </motion.div>

          <motion.div
            className="self-end pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="mb-6 text-base leading-relaxed text-[#a8c0d8] sm:text-lg">
              Steven Richardson — aka <span className="font-semibold text-white">Space</span>. I ship AI infrastructure
              with personality. Autonomous workflows, screen intelligence, phone control, and solarpunk creative
              machinery.
            </p>
            <div className="flex gap-3">
              <a
                href="#work"
                className="mono-font rounded-lg bg-[#72f7b8] px-4 py-2.5 text-xs font-semibold text-[#050a0e] transition-transform hover:scale-[1.03]"
              >
                View work ↓
              </a>
              <a
                href="#contact"
                className="mono-font rounded-lg border border-white/15 px-4 py-2.5 text-xs text-[#c0d4e8] transition-colors hover:border-white/30 hover:text-white"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        </section>

        {/* — MARQUEE — tech stack as editorial element */}
        <div className="mb-24 overflow-hidden border-y border-white/[0.06] py-4">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="mono-font whitespace-nowrap text-sm tracking-wider text-[#4a6580]">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* — PROJECTS — */}
        <section id="work" className="mb-28 scroll-mt-24">
          <Reveal>
            <div className="mb-12 flex items-baseline justify-between">
              <div>
                <p className="mono-font mb-2 text-xs tracking-[0.2em] text-[#5a7a96] uppercase">Selected work</p>
                <h2 className="display-font text-4xl font-bold sm:text-5xl">Builds</h2>
              </div>
              <span className="mono-font text-xs text-[#4a6580]">{projects.length} projects</span>
            </div>
          </Reveal>

          <div className="columns-1 gap-5 sm:columns-2">
            {projects.map((project, idx) => (
              <Reveal key={project.title}>
                <motion.article
                  whileHover={{ y: -3 }}
                  className={`group relative mb-5 overflow-hidden break-inside-avoid rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition-colors hover:border-white/[0.15] ${project.image ? 'accent-line pl-7' : ''}`}
                >
                  <div className="relative">
                    {project.image && (
                      <div className="relative mb-4 overflow-hidden rounded-lg border border-white/[0.06]">
                        <img
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setLightbox({ src: project.image!, alt: project.title })
                          }}
                          className="absolute right-2 top-2 rounded-md bg-black/50 p-1.5 text-white/60 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/70 hover:text-white group-hover:opacity-100"
                        >
                          <Expand size={13} />
                        </button>
                      </div>
                    )}

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="display-font text-xl font-semibold text-[#f0f8ff]">{project.title}</h3>
                      <span className="mono-font mt-1 shrink-0 text-[10px] text-[#4a6580]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <p className="mb-4 text-[15px] leading-relaxed text-[#9ab4cf]">{project.blurb}</p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="mono-font rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-[#6b8ba8]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mono-font inline-flex items-center gap-1.5 text-xs text-[#72f7b8] transition-colors hover:text-[#b8ffd9]"
                        >
                          live <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="mono-font inline-flex items-center gap-1.5 text-xs text-[#4a6580]">
                          details on request <ArrowUpRight size={12} />
                        </span>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="mono-font inline-flex items-center gap-1.5 text-xs text-[#6b8ba8] transition-colors hover:text-white"
                        >
                          source <Github size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* — ABOUT — editorial two-column */}
        <section id="about" className="mb-28 scroll-mt-24">
          <Reveal>
            <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
              <div>
                <p className="mono-font mb-2 text-xs tracking-[0.2em] text-[#5a7a96] uppercase">About</p>
                <h2 className="display-font mb-6 text-4xl font-bold">
                  Where agents, architecture
                  <br className="hidden lg:block" />
                  & design collide.
                </h2>
                <p className="mb-4 text-base leading-[1.8] text-[#9ab4cf] sm:text-lg">
                  ILE creative technologist. I move fast, prototype aggressively, and care about building systems
                  that actually do things — not just demo theater. If it can be automated, I'll automate it. If it
                  can be made beautiful, I'll push it way past "good enough."
                </p>
                <p className="text-base leading-[1.8] text-[#6b8ba8] sm:text-lg">
                  My zone is operator tools, autonomous workflows, and interfaces that feel alive.
                  I think the best software has personality — so that's what I build.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <p className="mono-font mb-4 text-[10px] tracking-[0.2em] text-[#5a7a96] uppercase">Philosophy</p>
                <ul className="space-y-4">
                  {[
                    ['Ship fast', 'Perfect is the enemy of done. Iterate in public.'],
                    ['Automate taste', 'AI should amplify creativity, not replace judgment.'],
                    ['Design is function', 'Beautiful systems work better. Ugly prototypes are unacceptable.'],
                    ['Build the tool', "If it doesn't exist, make it. Then make it good."],
                  ].map(([title, desc]) => (
                    <li key={title}>
                      <p className="text-sm font-medium text-[#e0edf8]">{title}</p>
                      <p className="text-sm text-[#6b8ba8]">{desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="section-divider" />

        {/* — CONTACT — */}
        <section id="contact" className="mb-12 scroll-mt-24">
          <Reveal>
            <div className="max-w-3xl">
              <p className="mono-font mb-2 text-xs tracking-[0.2em] text-[#5a7a96] uppercase">Contact</p>
              <h2 className="display-font mb-4 text-4xl font-bold">
                Let's build something<br />unreasonably good.
              </h2>
              <p className="mb-8 text-base text-[#7a95b0]">
                Open for collaborations, weird experiments, and products that deserve ambition.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/spaceynyc"
                  target="_blank"
                  rel="noreferrer"
                  className="mono-font inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs text-[#c0d4e8] transition-colors hover:border-white/[0.25] hover:text-white"
                >
                  <Github size={14} /> GitHub
                </a>
                <a
                  href="https://x.com/spaceynyc"
                  target="_blank"
                  rel="noreferrer"
                  className="mono-font inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs text-[#c0d4e8] transition-colors hover:border-white/[0.25] hover:text-white"
                >
                  <Radio size={14} /> @spaceynyc
                </a>
                <a
                  href="mailto:srich7x@gmail.com"
                  className="mono-font inline-flex items-center gap-2 rounded-lg border border-white/[0.1] px-4 py-2.5 text-xs text-[#c0d4e8] transition-colors hover:border-white/[0.25] hover:text-white"
                >
                  <Mail size={14} /> Email
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mono-font flex items-center justify-between border-t border-white/[0.06] px-1 pt-6 text-[11px] text-[#4a6580]">
          <span>© {year} Steven Richardson</span>
          <span>spaceynyc.dev</span>
        </footer>
      </main>

      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}

export default App
