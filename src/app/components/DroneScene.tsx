import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

// ─── Exponential-decay damper ─────────────────────────────────────────────────
function damp(cur: number, tgt: number, lambda: number, dt: number): number {
  return THREE.MathUtils.lerp(cur, tgt, 1 - Math.exp(-lambda * dt));
}

// ─── Scroll-driven waypoints (8 points across page sections) ─────────────────
// Camera is at z=14, FOV=38°. Visible range at z=0: x ≈ ±4.2, y ≈ ±2.8
// Waypoints create a cinematic sweeping S-curve from hero → contact
const WAYPOINTS = [
  { x:  0.0,  y:  1.6 },  // 0  – Hero centre-top
  { x:  3.2,  y:  0.4 },  // 1  – Hero right sweep
  { x: -3.0,  y:  0.9 },  // 2  – Services left arc
  { x:  2.6,  y: -0.3 },  // 3  – Services→About crossing
  { x: -2.2,  y:  0.7 },  // 4  – About left
  { x:  2.8,  y: -0.5 },  // 5  – Portfolio/Pricing right
  { x: -2.6,  y:  1.1 },  // 6  – Pricing→Contact left
  { x:  1.8,  y:  2.0 },  // 7  – Contact – ascends top-right
];

/** Smooth-step interpolation between WAYPOINTS based on 0-1 scroll progress */
function getScrollTarget(progress: number) {
  const n = WAYPOINTS.length - 1;
  const t = Math.max(0, Math.min(1, progress)) * n;
  const i = Math.min(Math.floor(t), n - 1);
  const frac = t - i;
  // Hermite smooth-step: feels more cinematic than linear
  const s = frac * frac * (3 - 2 * frac);
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  return { x: a.x + (b.x - a.x) * s, y: a.y + (b.y - a.y) * s };
}

// ─── DroneScene — fixed overlay, vanilla Three.js, no R3F Canvas ─────────────
export function DroneScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.2;
    Object.assign(renderer.domElement.style, {
      position: 'absolute', top: '0', left: '0',
      width: '100%', height: '100%', pointerEvents: 'none',
    });
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 300);
    camera.position.set(0, 0.5, 14);

    // ── Static lights ────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 2.8));

    const key = new THREE.DirectionalLight(0xffffff, 7.0);
    key.position.set(5, 10, 6);
    scene.add(key);

    // Side fill — slightly dimmed to reduce overexposure on lens
    const fill = new THREE.DirectionalLight(0xffffff, 3.5);
    fill.position.set(0, 8, 5);
    scene.add(fill);

    const cyan = new THREE.DirectionalLight(0x00e5ff, 6.0);
    cyan.position.set(-6, 3, -4);
    scene.add(cyan);

    const warm = new THREE.DirectionalLight(0xff9900, 4.0);
    warm.position.set(4, -4, -5);
    scene.add(warm);

    // Orbiting rim light (animated in tick)
    const rim = new THREE.DirectionalLight(0x88ccff, 6.0);
    scene.add(rim);

    // Belly cyan underglow
    const belly = new THREE.PointLight(0x00f3ff, 6.0, 12, 2);
    belly.position.set(0, -2, 1);
    scene.add(belly);

    // Red nav strobe
    const redStrobe = new THREE.PointLight(0xff2200, 0, 6, 2);
    redStrobe.position.set(0, 0.5, 1.5);
    scene.add(redStrobe);

    // NOTE: The front white PointLight has been intentionally removed.
    // It caused the camera lens (glassMat sphere) to appear as a bright
    // white glowing disc — the "lens glow" is now eliminated.

    // ── Materials ────────────────────────────────────────────────────────────
    const bodyMat  = new THREE.MeshStandardMaterial({ color: 0x2e2e3e, roughness: 0.18, metalness: 0.92 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x3c3c52, roughness: 0.35, metalness: 0.80 });
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x4a4a62, roughness: 0.50, metalness: 0.70, transparent: true, opacity: 0.88 });

    // LED materials — emissiveIntensity animated each frame
    const ledBlue   = new THREE.MeshStandardMaterial({ color: 0x00f3ff, emissive: new THREE.Color(0x00f3ff), emissiveIntensity: 6, toneMapped: false });
    const ledOrange = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: new THREE.Color(0xffaa00), emissiveIntensity: 6, toneMapped: false });
    const ledRed    = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: new THREE.Color(0xff2200), emissiveIntensity: 6, toneMapped: false });

    // Lens glass — FIXED: higher roughness + lower metalness eliminates white disc glare
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x001133,
      roughness: 0.55,   // was 0.05 — specular highlight removed
      metalness: 0.15,   // was 0.30 — less chrome-like
      transparent: true,
      opacity: 0.80,
    });

    const allMats: THREE.Material[] = [bodyMat, panelMat, rotorMat, ledBlue, ledOrange, ledRed, glassMat];
    const allGeos: THREE.BufferGeometry[] = [];

    function mk(
      geo: THREE.BufferGeometry, mat: THREE.Material,
      pos?: [number, number, number], rot?: [number, number, number],
    ): THREE.Mesh {
      allGeos.push(geo);
      const m = new THREE.Mesh(geo, mat);
      if (pos) m.position.set(...pos);
      if (rot) m.rotation.set(...rot);
      return m;
    }

    // ── Build drone ──────────────────────────────────────────────────────────
    const drone = new THREE.Group();
    // Desktop (≥1024 px) gets a noticeably larger drone; mobile stays compact
    const getScale = () => window.innerWidth >= 1024 ? 0.62 : 0.30;
    drone.scale.setScalar(getScale());
    scene.add(drone);

    const add = (m: THREE.Mesh, p: THREE.Object3D = drone) => { p.add(m); return m; };

    // Fuselage
    add(mk(new THREE.BoxGeometry(1.15, 0.22, 1.7),  bodyMat));
    add(mk(new THREE.BoxGeometry(0.75, 0.12, 0.95), panelMat, [0,  0.17, 0]));
    add(mk(new THREE.BoxGeometry(0.6,  0.08, 0.12), glassMat, [0,  0.04, 0.86], [0.3, 0, 0]));
    add(mk(new THREE.BoxGeometry(0.08, 0.015, 0.6), ledRed,   [0,  0.25, 0]));   // top beacon strip
    add(mk(new THREE.BoxGeometry(0.015, 0.18, 1.3), panelMat, [ 0.58, 0, 0]));
    add(mk(new THREE.BoxGeometry(0.015, 0.18, 1.3), panelMat, [-0.58, 0, 0]));
    add(mk(new THREE.BoxGeometry(0.85,  0.08, 1.2), panelMat, [0, -0.16, 0]));

    // Gimbal camera — glassMat lens now uses darker, diffuse material (no glow disc)
    const gimbal = new THREE.Group();
    gimbal.position.set(0, -0.2, 0.9);
    drone.add(gimbal);
    add(mk(new THREE.BoxGeometry(0.22, 0.12, 0.14), panelMat, [0, 0.05, 0]), gimbal);
    add(mk(new THREE.SphereGeometry(0.14, 24, 24),  panelMat),                gimbal); // was bodyMat — panelMat is darker/less metallic
    add(mk(new THREE.CylinderGeometry(0.07, 0.05, 0.06, 24), glassMat, [0, 0, 0.14], [Math.PI / 2, 0, 0]), gimbal);
    add(mk(new THREE.TorusGeometry(0.055, 0.008, 16, 48), ledBlue,   [0, 0, 0.16], [Math.PI / 2, 0, 0]), gimbal);

    // Arms, motors, rotors, LEDs
    const ARM_POS: [number, number, number][] = [
      [-1.25, 0.18, -1.25],
      [ 1.25, 0.18, -1.25],
      [-1.25, 0.18,  1.25],
      [ 1.25, 0.18,  1.25],
    ];
    const rotorGroups: THREE.Group[] = [];

    ARM_POS.forEach((pos, i) => {
      const angle = Math.atan2(pos[0], pos[2]);
      add(mk(new THREE.CylinderGeometry(0.038, 0.065, 1.65, 8), panelMat,
        [pos[0] * 0.5, -0.04, pos[2] * 0.5], [0, angle, Math.PI / 2]));
      add(mk(new THREE.CylinderGeometry(0.175, 0.155, 0.26, 16), bodyMat, pos));
      add(mk(new THREE.CylinderGeometry(0.12, 0.175, 0.04, 16), panelMat, [pos[0], pos[1] + 0.14, pos[2]]));

      const rg = new THREE.Group();
      rg.position.set(pos[0], pos[1] + 0.17, pos[2]);
      drone.add(rg);
      rotorGroups.push(rg);

      const b1 = mk(new THREE.BoxGeometry(1.45, 0.012, 0.065), rotorMat);
      const b2 = mk(new THREE.BoxGeometry(1.45, 0.012, 0.065), rotorMat, undefined, [0, Math.PI / 2, 0]);
      const rn = mk(new THREE.TorusGeometry(0.72, 0.016, 16, 64), rotorMat, undefined, [Math.PI / 2, 0, 0]);
      rg.add(b1, b2, rn);
      allGeos.push(b1.geometry, b2.geometry, rn.geometry);

      // Arm-tip LED: front arms orange, rear arms blue
      add(mk(new THREE.SphereGeometry(0.055, 12, 12),
        i < 2 ? ledOrange : ledBlue,
        [pos[0], pos[1] - 0.15, pos[2]]));
    });

    // Landing gear
    ([-0.42, 0.42] as number[]).forEach(x => {
      const g = new THREE.Group();
      g.position.set(x, -0.22, 0);
      drone.add(g);
      add(mk(new THREE.BoxGeometry(0.04, 0.22, 0.04), panelMat), g);
      add(mk(new THREE.BoxGeometry(0.04, 0.04, 1.1),  panelMat, [0, -0.13, 0]), g);
    });

    // ── Animation state ──────────────────────────────────────────────────────
    let flightT     = 0;
    let rimT        = 0;
    let mouseX      = 0;
    let mouseY      = 0;
    let touchActive = false;
    let scrollProgress = 0;

    // Smoothed drone world-space position
    let sX = 0, sY = 1.6;
    // Smoothed attitude
    let sRX = 0, sRY = 0, sRZ = 0;
    // Previous frame position — used to derive velocity for banking/pitching
    let prevSX = 0, prevSY = 1.6;
    let currentSpeed = 0;

    let lastTime = performance.now();
    let animId: number;

    function tick() {
      animId = requestAnimationFrame(tick);

      const now = performance.now();
      const dt  = Math.min((now - lastTime) / 1000, 0.05);
      lastTime  = now;

      flightT += dt;
      rimT    += dt;

      // Decay pointer back to centre when not touched
      if (!touchActive) {
        mouseX = damp(mouseX, 0, 2.2, dt);
        mouseY = damp(mouseY, 0, 2.2, dt);
      }

      // ── Scroll-driven target position ──────────────────────────────────────
      const scrollTarget = getScrollTarget(scrollProgress);

      // Micro hover-bob overlaid on scroll position (keeps drone "alive")
      const hoverX = Math.sin(flightT * 0.65) * 0.18;
      const hoverY = Math.sin(flightT * 0.45 + 0.8) * 0.12;

      const tX = scrollTarget.x + hoverX + mouseX * 0.9;
      const tY = scrollTarget.y + hoverY + mouseY * 0.6;

      // Save previous position for velocity calculation
      prevSX = sX;
      prevSY = sY;

      // Cinematic slow damping (lambda=1.5) for smooth section-to-section travel
      sX = damp(sX, tX, 1.5, dt);
      sY = damp(sY, tY, 1.5, dt);
      drone.position.set(sX, sY, 0);

      // ── Physics-based attitude from actual velocity ────────────────────────
      // Derive velocity from frame-to-frame displacement
      const safeDt = Math.max(dt, 0.001);
      const velX   = (sX - prevSX) / safeDt;
      const velY   = (sY - prevSY) / safeDt;
      
      const rawSpeed = Math.sqrt(velX * velX + velY * velY);
      currentSpeed = damp(currentSpeed, rawSpeed, 4.0, dt);
      (window as any).__droneSpeed = currentSpeed;

      const targetRZ = -velX * 0.45 - mouseX * 0.20;   // bank into turns
      const targetRX =  velY * 0.30 + mouseY * 0.16;   // pitch up/down
      const targetRY =  velX * 0.18 + mouseX * 0.26;   // yaw with travel

      sRX = damp(sRX, targetRX, 4.5, dt);
      sRY = damp(sRY, targetRY, 4.5, dt);
      sRZ = damp(sRZ, targetRZ, 4.5, dt);
      drone.rotation.set(sRX, sRY, sRZ);

      // ── Rotor spin ─────────────────────────────────────────────────────────
      rotorGroups.forEach(rg => { rg.rotation.y += dt * 38; });

      // ── LED light animations ───────────────────────────────────────────────

      // Blue: slow breathe (0.7 Hz)
      const breathe = Math.sin(flightT * 0.7 * Math.PI * 2) * 0.5 + 0.5;
      ledBlue.emissiveIntensity = 4 + breathe * 10;
      belly.intensity           = 3 + breathe * 5;

      // Orange: medium pulse (1.1 Hz, offset phase)
      const pulse = Math.sin(flightT * 1.1 * Math.PI * 2 + 1.0) * 0.5 + 0.5;
      ledOrange.emissiveIntensity = 3 + pulse * 9;

      // Red: sharp nav strobe (~1.3 s cycle, 7% on)
      const strobePhase = (flightT % 1.3) / 1.3;
      const strobe      = strobePhase < 0.07 ? 1 : 0;
      ledRed.emissiveIntensity = strobe * 14 + (1 - strobe) * 1.5;
      redStrobe.intensity      = strobe * 8;

      // ── Orbiting rim light ─────────────────────────────────────────────────
      rim.position.set(
        Math.sin(rimT * 0.5) * 10,
        6,
        Math.cos(rimT * 0.5) * 8,
      );

      renderer.render(scene, camera);
    }

    tick();

    // ── Event listeners ──────────────────────────────────────────────────────

    // ── Scroll: prefer Lenis progress (accurate with smooth scroll) ──────────
    // Lenis stores itself on window.__lenis. We subscribe to its scroll event
    // which fires every RAF tick and provides { progress } (0→1) directly,
    // avoiding the timing mismatch of reading window.scrollY after a synthetic
    // scroll dispatch.
    const onLenisScroll = ({ progress }: { progress: number }) => {
      scrollProgress = progress;
    };

    // Fallback: plain window scroll for environments without Lenis
    const onWindowScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll > 0) scrollProgress = window.scrollY / maxScroll;
    };

    // Attach to Lenis immediately if ready, or retry once it mounts
    let lenisDetached = false;
    const attachLenis = () => {
      const lenis = (window as any).__lenis;
      if (lenis && !lenisDetached) {
        lenis.on('scroll', onLenisScroll);
        // Seed with current scroll position right away
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = maxScroll > 0 ? (lenis.scroll ?? window.scrollY) / maxScroll : 0;
        return true;
      }
      return false;
    };

    if (!attachLenis()) {
      // Lenis not ready yet (DroneScene mounts before SmoothScroll effect)
      // — retry after one frame
      const retryRaf = requestAnimationFrame(() => {
        if (!attachLenis()) {
          // Still not ready: fall back to native window scroll
          window.addEventListener('scroll', onWindowScroll, { passive: true });
          onWindowScroll();
        }
      });
      // Store retryRaf for cleanup reference (not cancellable after the fact,
      // but the callback safely no-ops if lenisDetached is true)
    }

    const onMouse = (e: MouseEvent) => {
      mouseX =  (e.clientX / window.innerWidth)  * 2 - 1;
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      mouseX =  (t.clientX / window.innerWidth)  * 2 - 1;
      mouseY = -((t.clientY / window.innerHeight) * 2 - 1);
      touchActive = true;
    };
    const onTouchEnd = () => { touchActive = false; };
    const onResize   = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // Responsive drone scale
      drone.scale.setScalar(getScale());
    };

    window.addEventListener('mousemove',   onMouse,     { passive: true });
    window.addEventListener('touchstart',  onTouch,     { passive: true });
    window.addEventListener('touchmove',   onTouch,     { passive: true });
    window.addEventListener('touchend',    onTouchEnd,  { passive: true });
    window.addEventListener('touchcancel', onTouchEnd,  { passive: true });
    window.addEventListener('resize',      onResize);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      lenisDetached = true;
      cancelAnimationFrame(animId);
      // Detach Lenis listener
      const lenis = (window as any).__lenis;
      if (lenis) lenis.off('scroll', onLenisScroll);
      // Detach fallback listener (no-op if never attached)
      window.removeEventListener('scroll',      onWindowScroll);
      window.removeEventListener('mousemove',   onMouse);
      window.removeEventListener('touchstart',  onTouch);
      window.removeEventListener('touchmove',   onTouch);
      window.removeEventListener('touchend',    onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('resize',      onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
      allMats.forEach(m => m.dispose());
      allGeos.forEach(g => g.dispose());
    };
  }, []);

  return (
    <div
      ref={mountRef}
      // z-25 → above all page sections (z-20) but below HUD (z-50) & Nav
      className="fixed inset-0 w-full h-full pointer-events-none z-25"
    />
  );
}