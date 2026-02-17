import { motion, useInView } from 'framer-motion'
import {
  ArrowUpRight,
  Bot,
  Cpu,
  ExternalLink,
  Github,
  Layers,
  Mail,
  Radio,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

type Project = {
  title: string
  blurb: string
  tech: string[]
  accent: string
  link?: string
  github?: string
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
  },
  {
    title: 'Socionics Research Lab',
    blurb:
      'Multi-agent cognitive modeling for precise socionics typing. Scout → Council → Validator → Synthesis pipeline with adversarial review and calibrated confidence scores.',
    tech: ['AI Agents', 'React', 'Socionics', 'Multi-Agent'],
    accent: 'from-[#ffa64d]/20 to-transparent',
    link: 'https://socionics-web.vercel.app/',
  },
  {
    title: 'inner-system',
    blurb:
      'Audio-reactive 3D world built in R3F/Three.js. Experimental, atmospheric, and tuned for immersive visual rhythm.',
    tech: ['R3F', 'Three.js', 'Web Audio'],
    accent: 'from-[#8b5dff]/20 to-transparent',
    link: 'https://inner-system-two.vercel.app/',
  },
  {
    title: 'AEROEDEN',
    blurb:
      'Solarpunk media engine with automated X posting, reply scouting, and TikTok-ready creative pipelines. Brand systems + growth loops.',
    tech: ['Brand Systems', 'Content Automation', 'Growth'],
    accent: 'from-[#72f7b8]/20 to-transparent',
    link: 'https://x.com/enteraeroeden',
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
    title: 'Drift',
    blurb:
      'Bookmark manager with glassmorphism UI, FTS5 instant search, and a rapid ⌘K command palette for thought-speed retrieval.',
    tech: ['React', 'SQLite FTS5', 'UI/UX'],
    accent: 'from-[#5bb7ff]/20 to-transparent',
  },
  {
    title: 'Shader Gallery',
    blurb:
      'Collection of GLSL/WebGL experiments exploring generative texture, motion fields, and surreal light behavior.',
    tech: ['GLSL', 'WebGL', 'Creative Coding'],
    accent: 'from-[#72f7b8]/20 to-transparent',
  },
]

const stack = [
  'React',
  'TypeScript',
  'Python',
  'Three.js / R3F',
  'Tailwind CSS',
  'Node',
  'FastAPI',
  'OpenAI APIs',
]

function DotField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let mouseX = 0
    let mouseY = 0

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0007,
      vy: (Math.random() - 0.5) * 0.0007,
      r: Math.random() * 1.5 + 0.4,
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
        p.x += p.vx + (mouseX - 0.5) * 0.0002
        p.y += p.vy + (mouseY - 0.5) * 0.0002

        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1

        p.x = Math.max(0, Math.min(1, p.x))
        p.y = Math.max(0, Math.min(1, p.y))

        const px = p.x * window.innerWidth
        const py = p.y * window.innerHeight
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.r * 12)
        glow.addColorStop(0, 'rgba(114,247,184,0.35)')
        glow.addColorStop(1, 'rgba(114,247,184,0)')

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(px, py, p.r * 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'rgba(200, 230, 255, 0.8)'
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

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-80" />
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="grain relative overflow-hidden">
      <DotField />
      <div className="aurora-bg fixed z-0" />

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8 lg:px-10">
        <motion.nav
          className="glass mb-10 flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="display-font text-lg font-bold tracking-wide text-[#d9f1ff]">steven richardson <span className="text-[#72f7b8]">/ spaceynyc</span></div>
          <div className="mono-font hidden gap-6 text-xs text-[#9ab4cf] sm:flex">
            <a href="#projects" className="cursor-pointer hover:text-white">
              projects
            </a>
            <a href="#about" className="cursor-pointer hover:text-white">
              about
            </a>
            <a href="#contact" className="cursor-pointer hover:text-white">
              contact
            </a>
          </div>
        </motion.nav>

        <section className="relative mb-24 min-h-[70vh] pt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <p className="mono-font mb-5 inline-flex items-center gap-2 rounded-full border border-[#72f7b8]/40 bg-[#72f7b8]/10 px-3 py-1 text-xs text-[#c9ffe6]">
              <Sparkles size={14} />
              creative technologist · ai-first builder · solarpunk lens
            </p>
            <h1 className="display-font text-5xl font-extrabold leading-[0.95] tracking-tight text-[#e8f5ff] sm:text-7xl lg:text-8xl">
              I build agents,
              <br />
              tools, and weird
              <br />
              beautiful systems.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#aec3db] sm:text-xl">
              Steven Richardson — aka <span className="text-[#72f7b8]">Space</span>. I ship AI infrastructure with personality. Autonomous workflows, screen intelligence,
              phone control, and solarpunk creative machinery. No fluff, just ambitious execution.
            </p>
          </motion.div>

          <motion.div
            className="glass mt-10 inline-flex items-center gap-4 rounded-2xl px-5 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Bot className="text-[#72f7b8]" size={20} />
            <p className="mono-font text-xs text-[#c6d8eb] sm:text-sm">
              currently: crafting autonomous ecosystems for fintech + creative brands
            </p>
          </motion.div>
        </section>

        <section id="projects" className="mb-24 scroll-mt-28">
          <Reveal>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="display-font text-4xl font-bold sm:text-5xl">Selected Builds</h2>
              <span className="mono-font text-xs text-[#8aa3bf]">{projects.length} live experiments</span>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project, idx) => (
              <Reveal key={project.title}>
                <motion.article
                  whileHover={{ y: -4 }}
                  className="glass group relative overflow-hidden rounded-2xl p-5"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.accent} opacity-70`} />
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="display-font text-2xl font-semibold text-[#f0f8ff]">{project.title}</h3>
                      <span className="mono-font text-xs text-[#99b2ca]">0{idx + 1}</span>
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-[#bdd0e4]">{project.blurb}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="mono-font rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] text-[#d7e7f7]"
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
                          className="mono-font inline-flex cursor-pointer items-center gap-2 text-xs text-[#72f7b8] hover:text-[#b8ffd9]"
                        >
                          launch live <ExternalLink size={14} />
                        </a>
                      ) : (
                        <span className="mono-font inline-flex items-center gap-2 text-xs text-[#90a8c2]">
                          private build details available on request <ArrowUpRight size={14} />
                        </span>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="mono-font inline-flex cursor-pointer items-center gap-2 text-xs text-[#9ab4cf] hover:text-white"
                        >
                          source <Github size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="about" className="mb-24 scroll-mt-24">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <article className="glass rounded-3xl p-6 sm:p-8">
                <h2 className="display-font mb-4 text-4xl font-bold">About</h2>
                <p className="text-base leading-relaxed text-[#bdd0e4] sm:text-lg">
                  ILE creative technologist. I move fast, prototype aggressively, and care about building systems
                  that actually do things - not just demo theater. If it can be automated, I'll automate it. If it
                  can be made beautiful, I'll push it way past "good enough."
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#9db3ca] sm:text-lg">
                  My zone is where AI agents, software architecture, and design collide. Think operator tools,
                  autonomous workflows, and interfaces that feel alive.
                </p>
              </article>

              <article className="glass rounded-3xl p-6 sm:p-8">
                <h3 className="display-font mb-4 text-3xl font-bold">Tech Stack</h3>
                <ul className="space-y-2">
                  {stack.map((item) => (
                    <li key={item} className="mono-font flex items-center gap-2 text-sm text-[#d4e4f3]">
                      <Layers size={14} className="text-[#5bb7ff]" /> {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-24">
          <Reveal>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <h2 className="display-font mb-3 text-4xl font-bold">Let's build something unreasonably good.</h2>
              <p className="mb-6 max-w-2xl text-[#a9c0d8]">
                Open for collaborations, weird experiments, and products that deserve ambition.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://github.com/spaceynyc"
                  target="_blank"
                  rel="noreferrer"
                  className="mono-font glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm text-[#e6f5ff] hover:border-[#72f7b8]/60"
                >
                  <Github size={16} /> github.com/spaceynyc
                </a>
                <a
                  href="https://x.com/spaceynyc"
                  target="_blank"
                  rel="noreferrer"
                  className="mono-font glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm text-[#e6f5ff] hover:border-[#5bb7ff]/60"
                >
                  <Radio size={16} /> @spaceynyc
                </a>
                <a
                  href="mailto:srich7x@gmail.com"
                  className="mono-font glass inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm text-[#e6f5ff] hover:border-[#8b5dff]/60"
                >
                  <Mail size={16} /> srich7x@gmail.com
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mono-font mt-10 flex items-center justify-between px-2 text-xs text-[#7e94ac]">
          <span>© {year} steven richardson</span>
          <span>crafted with intent · react + framer motion</span>
        </footer>
      </main>

      <a
        href="#"
        className="glass mono-font fixed bottom-5 right-5 z-20 inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-2 text-xs text-[#d6e7f8]"
      >
        top <Cpu size={13} />
      </a>
    </div>
  )
}

export default App
