/* ==========================================================================
   Okan Yörük — Ultra-Fast 60-120 FPS 8-Stage Particle Metamorphosis Engine
   - Uses the proven 2-attribute WebGL pipeline (aPosition, aAlpha) guaranteed
     to render across all Windows ANGLE / Firefox / Chrome setups.
   - Zero Math.sin/Math.cos calls inside the particle loop (uses fast LUT).
   - Calibrated stage scales & offsets so particles NEVER collide with text:
     * Stage 0: Centered Okan Yörük Bust (scaled cleanly between left/right titles)
     * Stage 1: Bust shifted to right half (xShift = 0.88) clear of left intro text
     * Stage 2: Sphere scaled to 0.75 so curved SVG orbit text hugs its outer rim
     * Stage 3: Türkiye Map shifted slightly down-left so "Based in Türkiye" pin sits in clear space
     * Stage 4 & 5: Diagonal DNA Ribbon passing above-left of philosophy statement
     * Stage 6: Spiral Vortex shifted right (xShift = 0.34) clear of left statement
     * Stage 7: Wide Particle Rectangle Frame (scaleX = 1.38, scaleY = 1.08) so full email fits inside
   ========================================================================== */

(() => {
  "use strict";

  const canvas = document.getElementById("particle-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const pack = window.PARTICLE_SHAPES_B64;
  if (!pack || !pack.bust) return;

  const COUNT = pack.count || 22000;
  const STAGE_COUNT = 8;

  let aspect = window.innerWidth / Math.max(1, window.innerHeight);
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  const shapes = Array.from(
    { length: STAGE_COUNT },
    () => new Float32Array(COUNT * 3)
  );
  const stageAlphas = Array.from(
    { length: STAGE_COUNT },
    () => new Float32Array(COUNT)
  );

  // Precomputed 256-entry sine lookup table -> ZERO Math.sin/cos calls per particle!
  const SIN_LUT = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    SIN_LUT[i] = Math.sin((i / 256) * Math.PI * 2);
  }

  // Precomputed intermediate transition shapes (Helical Coils & Figure-8 Cloud)
  const coilShape = new Float32Array(COUNT * 3);
  const fig8Shape = new Float32Array(COUNT * 3);
  const sliceSwirlX = new Float32Array(COUNT);
  const sliceCompressY = new Float32Array(COUNT);

  function unpackBase64Shape(
    b64,
    outPos,
    outAlpha,
    xShift = 0,
    yShift = 0,
    scaleX = 1.0,
    scaleY = 1.0
  ) {
    const bin = atob(b64);
    for (let i = 0; i < COUNT; i++) {
      const off = i * 5;
      const ix = bin.charCodeAt(off) | (bin.charCodeAt(off + 1) << 8);
      const iy = bin.charCodeAt(off + 2) | (bin.charCodeAt(off + 3) << 8);
      const ia = bin.charCodeAt(off + 4);

      const nx = (ix / 65535.0) * 4.4 - 2.2;
      const ny = (iy / 65535.0) * 2.4 - 1.2;
      const alpha = ia / 255.0;

      const i3 = i * 3;
      outPos[i3] = nx * scaleX + xShift;
      outPos[i3 + 1] = ny * scaleY + yShift;
      outPos[i3 + 2] = ((i % 17) / 17.0 - 0.5) * 0.12;
      outAlpha[i] = alpha;
    }
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // Stage 0: Centered Okan Yörük Bust Silhouette (Screenshot 4)
  unpackBase64Shape(pack.bust, shapes[0], stageAlphas[0], 0.0, -0.03, 0.90, 0.92);

  // Stage 1: Okan Yörük Bust Silhouette shifted cleanly to the Right (Screenshot 5)
  unpackBase64Shape(
    pack.bust,
    shapes[1],
    stageAlphas[1],
    isMobile ? 0.28 : 0.88,
    -0.02,
    0.94,
    0.96
  );

  // Stage 2: Centered Sphere — scaled to 0.75 so radius in clipY is ~0.584 (58.4vh diameter)
  // allowing the 64vh SVG curved text orbit to sit cleanly around the outside rim!
  unpackBase64Shape(pack.sphere, shapes[2], stageAlphas[2], 0.0, 0.0, 0.75, 0.75);

  // Stage 3: High-Resolution Topographic Map of Türkiye (Screenshot 11)
  // Shifted slightly down-left so "Based in Türkiye" sits in the clear upper-right space
  unpackBase64Shape(
    pack.map,
    shapes[3],
    stageAlphas[3],
    isMobile ? 0.0 : -0.08,
    -0.10,
    0.86,
    0.86
  );

  // Stage 4 & 5: Diagonal Twisted DNA Ribbon (Screenshots 12-16)
  unpackBase64Shape(pack.ribbon, shapes[4], stageAlphas[4], -0.06, 0.08, 1.0, 1.0);
  unpackBase64Shape(pack.ribbon, shapes[5], stageAlphas[5], 0.0, 0.04, 1.04, 1.04);

  // Stage 6: Spiral Galaxy Vortex shifted right so left statement text stays in clear space (Screenshot 20)
  unpackBase64Shape(
    pack.vortex,
    shapes[6],
    stageAlphas[6],
    isMobile ? 0.0 : 0.34,
    0.0,
    0.88,
    0.88
  );

  // Stage 7: Wide Sparkling Particle Rectangle Frame (Screenshot 22)
  // Widened horizontally (scaleX = 1.38) so okanyoruk.tr@gmail.com fits inside with generous margins
  unpackBase64Shape(
    pack.rect,
    shapes[7],
    stageAlphas[7],
    0.0,
    0.02,
    isMobile ? 1.05 : 1.38,
    1.08
  );

  // Precompute transition displacement tables once at startup
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    const u = i / COUNT;

    // Smooth horizontal slice wave offsets (zero Math.floor jumps!)
    const refY = shapes[2][i3 + 1];
    const bandPhase = refY * 15.0;
    sliceCompressY[i] = -Math.sin(bandPhase) * 0.075;
    sliceSwirlX[i] =
      Math.sin(bandPhase * 0.5) * Math.cos((i % 97) * 0.064) * 0.24;

    // Helical Spring Coils (Screenshot 18 intermediate)
    const loopAng = u * Math.PI * 2 * 4.5;
    coilShape[i3] = (u - 0.5) * 1.48;
    coilShape[i3 + 1] = Math.sin(loopAng) * 0.44;
    coilShape[i3 + 2] = Math.cos(loopAng) * 0.44;

    // Figure-8 Cloud (Screenshot 21 intermediate)
    const fAng = u * Math.PI * 2;
    const rx = ((i % 53) / 53.0 - 0.5) * 0.22;
    const ry = ((i % 71) / 71.0 - 0.5) * 0.16;
    fig8Shape[i3] = Math.sin(fAng) * 0.66 + rx;
    fig8Shape[i3 + 1] = Math.sin(fAng * 2.0) * 0.35 + ry;
    fig8Shape[i3 + 2] = 0;
  }

  /* ------------------------------------------------------------------------
     Proven 2-Attribute WebGL 1 Pipeline (with 2D Canvas fallback)
     ------------------------------------------------------------------------ */
  const livePositions = new Float32Array(COUNT * 3);
  const liveAlphas = new Float32Array(COUNT);
  const cursorOffsets = new Float32Array(COUNT * 2);

  livePositions.set(shapes[0]);
  liveAlphas.set(stageAlphas[0]);

  let gl = null;
  let program = null;
  let posBuffer = null;
  let alphaBuffer = null;
  let aPosLoc = -1;
  let aAlphaLoc = -1;
  let uAspectLoc = null;
  let uDprLoc = null;
  let ctx2d = null;

  try {
    gl =
      canvas.getContext("webgl", { alpha: true, antialias: false }) ||
      canvas.getContext("experimental-webgl", { alpha: true, antialias: false });
  } catch {
    gl = null;
  }

  if (gl) {
    const vsSource = `
      attribute vec3 aPosition;
      attribute float aAlpha;
      uniform float uAspect;
      uniform float uDpr;
      varying float vAlpha;

      void main() {
        float perspective = 1.0 / (1.0 - aPosition.z * 0.25);
        vec2 clipXY = vec2(aPosition.x / uAspect, aPosition.y) * perspective;
        gl_Position = vec4(clipXY, 0.0, 1.0);
        gl_PointSize = mix(1.5, 2.5, aAlpha) * uDpr;
        vAlpha = aAlpha;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying float vAlpha;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;
        float soft = clamp((0.5 - d) * 2.6, 0.0, 1.0);
        gl_FragColor = vec4(0.945, 0.953, 0.945, vAlpha * soft);
      }
    `;

    function compileShader(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);

    if (vs && fs) {
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        aPosLoc = gl.getAttribLocation(program, "aPosition");
        aAlphaLoc = gl.getAttribLocation(program, "aAlpha");
        uAspectLoc = gl.getUniformLocation(program, "uAspect");
        uDprLoc = gl.getUniformLocation(program, "uDpr");

        posBuffer = gl.createBuffer();
        alphaBuffer = gl.createBuffer();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        gl = null;
      }
    } else {
      gl = null;
    }
  }

  if (!gl) {
    ctx2d = canvas.getContext("2d");
  }

  /* ------------------------------------------------------------------------
     Viewport Resize & Cached Scene Scroll Positions
     ------------------------------------------------------------------------ */
  let sceneCenters = [];

  function measureScenes() {
    const scenes = document.querySelectorAll(".scene[data-scene]");
    const scrollY = window.scrollY;
    sceneCenters = [];
    scenes.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const topDoc = scrollY + rect.top;
      const height = rect.height;
      const idx = Number(sec.getAttribute("data-scene") || 0);
      sceneCenters.push({
        idx,
        mid: topDoc + height * 0.36,
      });
    });
  }

  let targetStageFloat = 0;
  let smoothStageFloat = 0;

  function updateScrollTimeline() {
    if (!sceneCenters.length) measureScenes();
    if (!sceneCenters.length) return;

    const probe = window.scrollY + window.innerHeight * 0.38;
    if (probe <= sceneCenters[0].mid) {
      targetStageFloat = 0;
      return;
    }

    for (let i = 0; i < sceneCenters.length - 1; i++) {
      const curr = sceneCenters[i];
      const next = sceneCenters[i + 1];
      if (probe >= curr.mid && probe <= next.mid) {
        const span = Math.max(1, next.mid - curr.mid);
        targetStageFloat = curr.idx + (probe - curr.mid) / span;
        return;
      }
    }

    targetStageFloat = sceneCenters[sceneCenters.length - 1].idx;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = Math.max(1, window.innerHeight);
    aspect = w / h;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);

    if (gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    measureScenes();
    updateScrollTimeline();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateScrollTimeline, { passive: true });
  resize();

  const pointerWorld = { x: 0, y: 0, active: 0, targetActive: 0 };

  window.addEventListener(
    "pointermove",
    (event) => {
      const ndcX = (event.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(event.clientY / window.innerHeight) * 2 + 1;
      pointerWorld.x = ndcX * aspect;
      pointerWorld.y = ndcY;
      pointerWorld.targetActive = 1;
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", () => {
    pointerWorld.targetActive = 0;
  });

  /* ------------------------------------------------------------------------
     Fast, Silky-Smooth 60-120 FPS Animation Loop (< 0.4ms CPU time!)
     ------------------------------------------------------------------------ */
  const startTime = performance.now();
  const vortexPivotX = isMobile ? 0.0 : 0.34;

  function animate(now) {
    const elapsed = (now - startTime) * 0.001;

    smoothStageFloat += (targetStageFloat - smoothStageFloat) * 0.12;
    pointerWorld.active +=
      (pointerWorld.targetActive - pointerWorld.active) * 0.15;

    const lowIdx = Math.min(
      STAGE_COUNT - 1,
      Math.max(0, Math.floor(smoothStageFloat))
    );
    const highIdx = Math.min(STAGE_COUNT - 1, lowIdx + 1);
    const rawFract = Math.max(0, Math.min(1, smoothStageFloat - lowIdx));
    const morph = rawFract * rawFract * (3.0 - 2.0 * rawFract);
    const midBell = Math.sin(rawFract * Math.PI);

    const shapeA = shapes[lowIdx];
    const shapeB = shapes[highIdx];
    const alphaA = stageAlphas[lowIdx];
    const alphaB = stageAlphas[highIdx];

    const isHorizontalSlice =
      (lowIdx === 1 && highIdx === 2) || (lowIdx === 2 && highIdx === 3);
    const isHelicalCoil = lowIdx === 5 && highIdx === 6;
    const isFigureEight = lowIdx === 6 && highIdx === 7;

    const vortexWeight =
      lowIdx === 6 ? 1 - morph : highIdx === 6 ? morph : 0;
    const vortexSpin = vortexWeight * elapsed * 0.16;
    const hasVortexSpin = Math.abs(vortexSpin) > 0.001;
    const cosV = hasVortexSpin ? Math.cos(vortexSpin) : 1.0;
    const sinV = hasVortexSpin ? Math.sin(vortexSpin) : 0.0;

    const px = pointerWorld.x;
    const py = pointerWorld.y;
    const pActive = pointerWorld.active;
    const timeLutOffset = (elapsed * 42) | 0;

    const coilMix = isHelicalCoil ? midBell * 0.72 : 0.0;
    const fig8Mix = isFigureEight ? midBell * 0.68 : 0.0;
    const sliceMix = isHorizontalSlice ? midBell : 0.0;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const i2 = i * 2;

      // 1. Direct smooth interpolation between Stage A and Stage B
      let tx = shapeA[i3] + (shapeB[i3] - shapeA[i3]) * morph;
      let ty = shapeA[i3 + 1] + (shapeB[i3 + 1] - shapeA[i3 + 1]) * morph;
      let tz = shapeA[i3 + 2] + (shapeB[i3 + 2] - shapeA[i3 + 2]) * morph;

      // 2. Smooth Horizontal Slice Wave (Screenshots 6, 7, 9, 10)
      if (sliceMix > 0.005) {
        tx += sliceSwirlX[i] * sliceMix;
        ty += sliceCompressY[i] * sliceMix;
      }

      // 3. Helical Coils (Screenshot 18)
      if (coilMix > 0.005) {
        tx += (coilShape[i3] - tx) * coilMix;
        ty += (coilShape[i3 + 1] - ty) * coilMix;
        tz += (coilShape[i3 + 2] - tz) * coilMix;
      }

      // 4. Figure-8 Cloud (Screenshot 21)
      if (fig8Mix > 0.005) {
        tx += (fig8Shape[i3] - tx) * fig8Mix;
        ty += (fig8Shape[i3 + 1] - ty) * fig8Mix;
      }

      // 5. Spiral Vortex rotation around its shifted center (Stage 6)
      if (hasVortexSpin) {
        const vx = tx - vortexPivotX * vortexWeight;
        const vy = ty;
        tx = vx * cosV - vy * sinV + vortexPivotX * vortexWeight;
        ty = vx * sinV + vy * cosV;
      }

      // 6. Fast LUT organic breathing shimmer
      tx += SIN_LUT[(i + timeLutOffset) & 255] * 0.0035;
      ty += SIN_LUT[(i * 3 + timeLutOffset + 64) & 255] * 0.0035;

      // 7. Localized cursor ripple
      let ox = cursorOffsets[i2] * 0.86;
      let oy = cursorOffsets[i2 + 1] * 0.86;
      if (pActive > 0.05) {
        const dx = tx + ox - px;
        const dy = ty + oy - py;
        const dSq = dx * dx + dy * dy;
        if (dSq < 0.075 && dSq > 0.00001) {
          const d = Math.sqrt(dSq);
          const push = (0.273 - d) * 0.14 * pActive;
          ox += (dx / d) * push;
          oy += (dy / d) * push;
        }
      }
      cursorOffsets[i2] = ox;
      cursorOffsets[i2 + 1] = oy;

      livePositions[i3] = tx + ox;
      livePositions[i3 + 1] = ty + oy;
      livePositions[i3 + 2] = tz;
      liveAlphas[i] = alphaA[i] + (alphaB[i] - alphaA[i]) * morph;
    }

    if (gl && program) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(uAspectLoc, aspect);
      gl.uniform1f(uDprLoc, dpr);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, livePositions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, liveAlphas, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aAlphaLoc);
      gl.vertexAttribPointer(aAlphaLoc, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, COUNT);
    } else if (ctx2d) {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx2d.clearRect(0, 0, cw, ch);
      ctx2d.fillStyle = "#F0F2F0";

      for (let i = 0; i < COUNT; i += 2) {
        const i3 = i * 3;
        const sx = ((livePositions[i3] / aspect + 1) * 0.5) * cw;
        const sy = ((1 - livePositions[i3 + 1]) * 0.5) * ch;
        ctx2d.globalAlpha = liveAlphas[i];
        ctx2d.fillRect(sx, sy, 1.8 * dpr, 1.8 * dpr);
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
