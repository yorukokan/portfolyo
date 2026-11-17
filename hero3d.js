/* =========================================================
   Portfolyo — Hero 3D
   - Vertex shader ile noise kullanarak dalgalanan küre
   - Mobilde 800, masaüstünde 2000 parçacıklık yıldız alanı
   - Fareye göre küre eğilmesi ve kamera paralaksı
   ========================================================= */

import * as THREE from "three";

const MOBILE_QUERY = "(max-width: 720px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MAX_PIXEL_RATIO_DESKTOP = 2;
const MAX_PIXEL_RATIO_MOBILE = 1.5;
const SPHERE_RADIUS = 1.15;
const SPHERE_FIT_RADIUS = 1.45;

const mount = document.querySelector("[data-hero-scene]");

/* ---------------------------------------------------------
   Sahne
   --------------------------------------------------------- */

function initHeroScene(container) {
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

  const rootStyles = getComputedStyle(document.documentElement);
  const accent = readColor(rootStyles, "--accent", "#7c5cff");
  const accent2 = readColor(rootStyles, "--accent-2", "#00e5ff");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobileQuery.matches,
      powerPreference: "high-performance",
    });
  } catch {
    return; // WebGL kullanılamıyorsa sahne sessizce devre dışı kalır
  }

  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 140);

  /* --- Küre --- */

  const sphereUniforms = {
    uTime: { value: 0 },
    uShift: { value: 0 },
    uAmplitude: { value: 0.16 },
    uColorA: { value: accent },
    uColorB: { value: accent2 },
  };

  const segments = mobileQuery.matches ? 64 : 128;
  const rings = mobileQuery.matches ? 48 : 96;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(SPHERE_RADIUS, segments, rings),
    new THREE.ShaderMaterial({
      uniforms: sphereUniforms,
      vertexShader: SPHERE_VERTEX_SHADER,
      fragmentShader: SPHERE_FRAGMENT_SHADER,
    })
  );

  const sphereGroup = new THREE.Group();
  sphereGroup.add(sphere);
  scene.add(sphereGroup);

  /* --- Yıldız alanı --- */

  const stars = createStarField(
    mobileQuery.matches ? 800 : 2000,
    accent,
    accent2
  );
  scene.add(stars);

  /* --- Fare --- */

  const pointer = { x: 0, y: 0 };
  const pointerTarget = { x: 0, y: 0 };

  window.addEventListener(
    "pointermove",
    (event) => {
      pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  const resetPointer = () => {
    pointerTarget.x = 0;
    pointerTarget.y = 0;
  };

  window.addEventListener("pointerleave", resetPointer, { passive: true });
  window.addEventListener("blur", resetPointer);

  /* --- Döngü durumu --- */

  const clock = new THREE.Clock();
  let elapsed = 0;
  let frameId = 0;
  let inView = true;

  function renderFrame() {
    elapsed += Math.min(clock.getDelta(), 0.05);

    pointer.x += (pointerTarget.x - pointer.x) * 0.045;
    pointer.y += (pointerTarget.y - pointer.y) * 0.045;

    sphereUniforms.uTime.value = elapsed;
    sphereUniforms.uShift.value = 0.18 * Math.sin(elapsed * 0.35);

    // Yavaş dönüş + fareye göre hafif eğilme
    sphereGroup.rotation.y = elapsed * 0.16 + pointer.x * 0.4;
    sphereGroup.rotation.x = pointer.y * 0.26 + Math.sin(elapsed * 0.5) * 0.03;

    // Kamera paralaksı
    camera.position.x += (pointer.x * 0.45 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.3 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    stars.rotation.y = elapsed * 0.012 + pointer.x * 0.08;
    stars.rotation.x = pointer.y * 0.04;

    renderer.render(scene, camera);
  }

  function tick() {
    frameId = requestAnimationFrame(tick);
    renderFrame();
  }

  function start() {
    if (frameId || reducedMotionQuery.matches) return;
    clock.start();
    tick();
  }

  function stop() {
    if (!frameId) return;
    cancelAnimationFrame(frameId);
    frameId = 0;
    clock.stop();
  }

  function syncPlayback() {
    const shouldRun =
      !reducedMotionQuery.matches && inView && !document.hidden;

    if (shouldRun) {
      start();
    } else {
      stop();
    }
  }

  function renderStatic() {
    sphereUniforms.uTime.value = 1.4;
    sphereGroup.rotation.set(0.08, 0.35, 0);
    renderer.render(scene, camera);
  }

  /* --- Kaydırmaya bağlı dönüşüm --- */

  function setScrollProgress(value) {
    const progress = THREE.MathUtils.clamp(value, 0, 1);

    // Hero'dan aşağı inildikçe küre küçülür ve sağa kayar
    sphereGroup.scale.setScalar(1 - progress * 0.45);
    sphereGroup.position.x = progress * 1.5;
  }

  /* --- Boyutlandırma --- */

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;

    const maxPixelRatio = mobileQuery.matches
      ? MAX_PIXEL_RATIO_MOBILE
      : MAX_PIXEL_RATIO_DESKTOP;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio);

    camera.aspect = width / height;
    camera.position.z = getCameraDistance(camera.aspect);
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);

    stars.material.uniforms.uPixelRatio.value = pixelRatio;

    if (reducedMotionQuery.matches) {
      renderStatic();
    } else if (!frameId) {
      renderer.render(scene, camera);
    }
  }

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", resize);
  }

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      syncPlayback();
    });
    visibilityObserver.observe(container);
  }

  document.addEventListener("visibilitychange", syncPlayback);

  const onMotionPreferenceChange = () => {
    if (reducedMotionQuery.matches) {
      stop();
      renderStatic();
    } else {
      syncPlayback();
    }
  };

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", onMotionPreferenceChange);
  } else {
    reducedMotionQuery.addListener(onMotionPreferenceChange);
  }

  resize();
  syncPlayback();

  return { setScrollProgress };
}

/* ---------------------------------------------------------
   Yardımcılar
   --------------------------------------------------------- */

function getCameraDistance(aspect) {
  const halfFov = THREE.MathUtils.degToRad(45) / 2;
  const fitHeight = SPHERE_FIT_RADIUS / Math.tan(halfFov);
  const fitWidth = SPHERE_FIT_RADIUS / (Math.tan(halfFov) * aspect);
  return Math.max(fitHeight, fitWidth) * 1.45;
}

function readColor(styles, property, fallback) {
  const value = styles.getPropertyValue(property).trim() || fallback;
  const color = new THREE.Color();
  color.setStyle(value);
  return color;
}

function createStarField(count, colorA, colorB) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const index = i * 3;

    positions[index] = (Math.random() - 0.5) * 120;
    positions[index + 1] = (Math.random() - 0.5) * 55;
    positions[index + 2] = -4 - Math.random() * 60;

    const mix = Math.random();
    colors[index] = colorA.r + (colorB.r - colorA.r) * mix;
    colors[index + 1] = colorA.g + (colorB.g - colorA.g) * mix;
    colors[index + 2] = colorA.b + (colorB.b - colorA.b) * mix;

    sizes[i] = 0.9 + Math.random() * 1.8;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: 1 },
    },
    vertexShader: STAR_VERTEX_SHADER,
    fragmentShader: STAR_FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

/* ---------------------------------------------------------
   Shader'lar
   --------------------------------------------------------- */

const SPHERE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAmplitude;

  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vNoise;

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(
      permute(
        permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
        i.y + vec4(0.0, i1.y, i2.y, 1.0)
      ) +
      i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(
      vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3))
    );
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(
      0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)),
      0.0
    );
    m = m * m;

    return 42.0 * dot(
      m * m,
      vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3))
    );
  }

  void main() {
    float waveA = snoise(normal * 1.6 + vec3(0.0, 0.0, uTime * 0.28));
    float waveB = snoise(normal * 3.4 + vec3(uTime * 0.22, uTime * 0.18, 0.0));
    float noise = waveA * 0.75 + waveB * 0.25;

    vec3 displaced = position + normal * noise * uAmplitude;

    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vViewDirection = -viewPosition.xyz;
    vNoise = noise;

    gl_Position = projectionMatrix * viewPosition;
  }
`;

const SPHERE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uShift;

  varying vec3 vNormal;
  varying vec3 vViewDirection;
  varying float vNoise;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vViewDirection);

    float fresnel = pow(1.0 - clamp(dot(normal, viewDirection), 0.0, 1.0), 2.4);
    float mixValue = clamp(vNoise * 0.5 + 0.5 + uShift, 0.0, 1.0);

    vec3 color = mix(uColorA, uColorB, mixValue);
    color += fresnel * 0.35;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

const STAR_VERTEX_SHADER = /* glsl */ `
  uniform float uPixelRatio;

  attribute float aSize;
  attribute vec3 aColor;

  varying vec3 vColor;

  void main() {
    vColor = aColor;

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    float size = aSize * uPixelRatio * (26.0 / max(1.0, -viewPosition.z));

    gl_PointSize = clamp(size, uPixelRatio, 5.0 * uPixelRatio);
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const STAR_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    if (distanceFromCenter > 0.5) {
      discard;
    }

    float alpha = 1.0 - smoothstep(0.1, 0.5, distanceFromCenter);

    gl_FragColor = vec4(vColor, alpha * 0.9);
    #include <colorspace_fragment>
  }
`;

/* ---------------------------------------------------------
   Başlat
   --------------------------------------------------------- */

if (mount) {
  const heroController = initHeroScene(mount);

  if (heroController) {
    window.hero3D = heroController;
    window.dispatchEvent(
      new CustomEvent("hero3d:ready", { detail: heroController })
    );
  }
}
