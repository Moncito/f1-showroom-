import { useEffect, useRef } from 'react'

// ── Vertex shader — fullscreen quad, nothing fancy ──────────────────────────
const VERT = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// ── Fragment shader ─────────────────────────────────────────────────────────
// Layers:
//  1. fbm (fractal brownian motion) — 5 octaves of value noise
//     gives the organic fractal texture
//  2. Slow time drift — the whole pattern moves gently
//  3. Mouse lens distortion — sharp magnify/warp at cursor position
//  4. Team color tint — multiplied over the fractal
//  5. Vignette — keeps edges dark so car stays the focus
const FRAG = `
  precision highp float;

  uniform vec2  u_resolution;
  uniform vec2  u_mouse;       // 0..1 normalized, y flipped
  uniform float u_time;
  uniform vec3  u_color;       // team accent color (0..1)
  uniform float u_colorMix;   // 0..1 blend for color transition

  // ── Hash & value noise ────────────────────────────────────────
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep

    float a = fract(sin(dot(i,               vec2(127.1, 311.7))) * 43758.5453);
    float b = fract(sin(dot(i + vec2(1,0),   vec2(127.1, 311.7))) * 43758.5453);
    float c = fract(sin(dot(i + vec2(0,1),   vec2(127.1, 311.7))) * 43758.5453);
    float d = fract(sin(dot(i + vec2(1,1),   vec2(127.1, 311.7))) * 43758.5453);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // ── fbm — 5 octaves ───────────────────────────────────────────
  float fbm(vec2 p) {
    float value = 0.0;
    float amp   = 0.5;
    float freq  = 1.0;
    mat2  rot   = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

    for (int i = 0; i < 5; i++) {
      value += amp * valueNoise(p * freq);
      p      = rot * p;   // rotate each octave to break axis-alignment
      freq  *= 2.1;
      amp   *= 0.48;
    }
    return value;
  }

  // ── Sharp lens distortion ─────────────────────────────────────
  // Magnifies / warps the UV field around the mouse position.
  // strength controls how sharp. radius controls how wide.
  vec2 lensDistort(vec2 uv, vec2 center, float strength, float radius) {
    vec2  delta = uv - center;
    float dist  = length(delta);
    float ratio = u_resolution.x / u_resolution.y;
    // Correct for aspect so distortion is circular
    vec2  deltaCorr = vec2(delta.x * ratio, delta.y);
    float distCorr  = length(deltaCorr);

    float falloff = 1.0 - smoothstep(0.0, radius, distCorr);
    float warp    = strength * falloff * falloff;

    // Pull UVs toward / away from center
    return uv - delta * warp * (1.0 / (distCorr + 0.001)) * 0.12;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    // ── Slow ambient drift ──────────────────────────────────────
    float t = u_time * 0.09;

    // ── Mouse lens distortion applied to UV before fbm sample ──
    // Strength 2.8 = more dynamic edge warping
    vec2 warpedUV = lensDistort(uv, u_mouse, 2.8, 0.42);

    // ── Sample fbm with drifting + warped coords ────────────────
    vec2  fbmCoord = warpedUV * 3.2 + vec2(t * 0.6, t * 0.4);
    float n1 = fbm(fbmCoord);
    float n2 = fbm(fbmCoord + vec2(n1 * 1.2, n1 * 0.8) + vec2(t, -t * 0.5));

    // Domain-warp second pass gives more organic complexity
    float n  = fbm(fbmCoord + vec2(n2 * 1.8, n1 * 1.4));

    // ── Contrast & lift ─────────────────────────────────────────
    n = pow(n, 1.4);            // increase contrast
    n = n * 0.55 + 0.05;        // scale down so it's dark overall

    // ── Team color tint ─────────────────────────────────────────
    // Base is near-black; color is added proportionally to noise
    vec3 dark  = vec3(0.02, 0.02, 0.02);
    vec3 tint  = u_color * 0.35;  // 0.35 keeps it medium, not garish
    vec3 col   = mix(dark, tint, n * 2.2);

    // ── Clamp so it never gets too bright ───────────────────────
    col = clamp(col, 0.0, 0.18);  // hard cap at ~18% brightness

    // ── Vignette ────────────────────────────────────────────────
    float ratio   = u_resolution.x / u_resolution.y;
    vec2  uvC     = (uv - 0.5) * vec2(ratio, 1.0);
    float vignette = 1.0 - smoothstep(0.3, 1.1, length(uvC));
    col *= vignette;

    // ── Mouse proximity glow ─────────────────────────────────────
    // Very subtle brightening right at the cursor — makes the lens
    // feel like it's actually illuminating the surface.
    float ratio2  = u_resolution.x / u_resolution.y;
    vec2  mDelta  = (uv - u_mouse) * vec2(ratio2, 1.0);
    float mDist   = length(mDelta);
    float glow    = smoothstep(0.18, 0.0, mDist) * 0.08;
    col += u_color * glow;
    col  = clamp(col, 0.0, 0.22);

    gl_FragColor = vec4(col, 1.0);
  }
`

// ── Hex color → [r, g, b] floats 0..1 ──────────────────────────────────────
function hexToVec3(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    return [r, g, b]
}

// ── Lerp between two vec3 arrays ────────────────────────────────────────────
function lerpColor(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
    ]
}

export default function ShaderBackground({ accentColor }) {
    const canvasRef = useRef(null)
    const glRef = useRef(null)
    const progRef = useRef(null)
    const uniformsRef = useRef({})
    const mouseRef = useRef({ x: 0.5, y: 0.5 })
    const colorRef = useRef(hexToVec3(accentColor))
    const targetColorRef = useRef(hexToVec3(accentColor))
    const rafRef = useRef(null)
    const startRef = useRef(performance.now())

    // ── Init WebGL once ────────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current
        const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
        if (!gl) return
        glRef.current = gl

        // Compile shaders
        function compile(type, src) {
            const s = gl.createShader(type)
            gl.shaderSource(s, src)
            gl.compileShader(s)
            return s
        }
        const prog = gl.createProgram()
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
        gl.linkProgram(prog)
        gl.useProgram(prog)
        progRef.current = prog

        // Fullscreen quad
        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1,
        ]), gl.STATIC_DRAW)
        const loc = gl.getAttribLocation(prog, 'a_position')
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

        // Cache uniform locations
        uniformsRef.current = {
            resolution: gl.getUniformLocation(prog, 'u_resolution'),
            mouse: gl.getUniformLocation(prog, 'u_mouse'),
            time: gl.getUniformLocation(prog, 'u_time'),
            color: gl.getUniformLocation(prog, 'u_color'),
        }

        // Resize handler
        function resize() {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            gl.viewport(0, 0, canvas.width, canvas.height)
        }
        resize()
        window.addEventListener('resize', resize)

        // Mouse tracker — smooth lerp applied in render loop
        const smoothMouse = { x: 0.5, y: 0.5 }
        function onMouseMove(e) {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: 1.0 - e.clientY / window.innerHeight, // flip Y for GL
            }
        }
        window.addEventListener('mousemove', onMouseMove)

        // ── Render loop ─────────────────────────────────────────────
        function render() {
            const t = (performance.now() - startRef.current) / 1000
            const u = uniformsRef.current

            // Smooth mouse (lerp at ~6% per frame ≈ nice lag)
            smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * 0.06
            smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * 0.06

            // Smooth color transition
            colorRef.current = lerpColor(colorRef.current, targetColorRef.current, 0.025)

            gl.uniform2f(u.resolution, canvas.width, canvas.height)
            gl.uniform2f(u.mouse, smoothMouse.x, smoothMouse.y)
            gl.uniform1f(u.time, t)
            gl.uniform3f(u.color, ...colorRef.current)

            gl.drawArrays(gl.TRIANGLES, 0, 6)
            rafRef.current = requestAnimationFrame(render)
        }
        render()

        return () => {
            cancelAnimationFrame(rafRef.current)
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', onMouseMove)
        }
    }, []) // runs once — color updates via targetColorRef

    // ── Update target color when car changes ───────────────────────────────────
    useEffect(() => {
        targetColorRef.current = hexToVec3(accentColor)
    }, [accentColor])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                display: 'block',
            }}
        />
    )
}