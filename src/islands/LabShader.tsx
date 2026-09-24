import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion, webglAvailable } from './useMotionPrefs';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + 17.0; a *= 0.5; } return v; }
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time * 0.08;
  vec2 m = (u_mouse - 0.5) * 0.6;
  vec2 q = vec2(fbm(uv*1.6 + t), fbm(uv*1.6 - t*0.7 + m));
  vec2 r = vec2(fbm(uv*1.6 + 2.2*q + t*0.5), fbm(uv*1.6 + 2.2*q - t*0.3));
  float f = fbm(uv*1.6 + 2.6*r);
  vec3 c1 = vec3(0.02, 0.02, 0.04);
  vec3 c2 = vec3(0.545, 0.365, 1.0);   // violet
  vec3 c3 = vec3(0.776, 0.753, 1.0);   // lavender
  vec3 c4 = vec3(0.447, 0.969, 0.722); // mint
  vec3 col = mix(c1, c2 * 0.55, smoothstep(0.35, 0.95, f));
  col = mix(col, c3 * 0.8, smoothstep(0.6, 0.98, r.x) * 0.5);
  col = mix(col, c4, smoothstep(0.75, 1.0, q.y) * 0.18);
  float vign = smoothstep(1.2, 0.2, length(uv));
  col *= vign * 0.9;
  // chrome streak
  float streak = smoothstep(0.02, 0.0, abs(fract(uv.y*0.5 + r.y*0.4 + t) - 0.5) - 0.48);
  col += streak * 0.22 * c3;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function LabShader() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, '120px');
  const state = useRef({ mouse: [0.5, 0.5] as [number, number], reduced, inView });
  state.current.reduced = reduced;
  state.current.inView = inView;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !webglAvailable()) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'u_res'), uTime = gl.getUniformLocation(prog, 'u_time'), uMouse = gl.getUniformLocation(prog, 'u_mouse');

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1);
      const w = Math.floor(canvas.clientWidth * dpr * 0.6), h = Math.floor(canvas.clientHeight * dpr * 0.6);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const draw = (t: number) => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, state.current.mouse[0], state.current.mouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    let frame = 0, start = performance.now();
    const loop = (now: number) => {
      frame = 0;
      if (!state.current.inView) return;
      draw((now - start) / 1000 + 20);
      if (!state.current.reduced) frame = requestAnimationFrame(loop);
    };
    const kick = () => { if (!frame) frame = requestAnimationFrame(loop); };
    kick();
    const ro = new ResizeObserver(() => { resize(); if (state.current.reduced) draw(20); });
    ro.observe(canvas);
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      state.current.mouse = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    };
    const parent = canvas.parentElement!;
    parent.addEventListener('pointermove', move);
    const io = new IntersectionObserver(([e]) => { state.current.inView = e.isIntersecting; if (e.isIntersecting) kick(); }, { rootMargin: '120px' });
    io.observe(canvas);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); parent.removeEventListener('pointermove', move); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, []);

  return <canvas ref={ref} className="lab-shader" aria-hidden="true" />;
}
