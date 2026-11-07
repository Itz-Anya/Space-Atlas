<script>
  import { T } from '@threlte/core';
  import { OrbitControls, interactivity } from '@threlte/extras';
  import * as THREE from 'three';
  import { PLANETS } from '$lib/space-data.js';
  import { PLANET_IMAGES } from '$lib/planet-images.js';
  import PlanetOrbiter from './PlanetOrbiter.svelte';

  interactivity();

  let { selectedSlug = 'earth', onSelect } = $props();

  const loader = new THREE.TextureLoader();
  const textures = Object.fromEntries(
    Object.entries(PLANET_IMAGES).map(([k, url]) => {
      const t = loader.load(url);
      t.colorSpace = THREE.SRGBColorSpace;
      return [k, t];
    })
  );

  function radialTexture(inner = '#fff2c4', outer = 'rgba(255,140,40,0)') {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, 'rgba(255,180,80,0.8)');
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const sunGlow = radialTexture();
  const sunDisc = radialTexture('#ffe38a', 'rgba(255,180,60,0)');

  const SCENE = PLANETS.map((p, i) => ({
    planet: p,
    orbit: 4 + i * 2.2,
    size: Math.max(0.6, Math.min(2.2, p.size / 14)),
    speed: 0.25 / Math.sqrt(i + 1),
    angle0: Math.random() * Math.PI * 2
  }));

  const STAR_COUNT = 2500;
  const starPositions = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 60 + Math.random() * 60;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

  const SUN = { slug: 'sun', name: 'Sun' };

  function selectBody(body) {
    if (typeof onSelect === 'function') onSelect(body);
  }
</script>

<T.PerspectiveCamera makeDefault position={[0, 14, 28]} fov={55} />
<OrbitControls enablePan enableZoom enableRotate minDistance={4} maxDistance={120} />

<T.Color attach="background" args={['#04060f']} />
<T.AmbientLight intensity={0.5} />
<T.PointLight position={[0, 0, 0]} intensity={3} distance={200} decay={0.4} color="#fff2c4" />

<T.Points geometry={starGeometry}>
  <T.PointsMaterial size={0.25} color="#ffffff" sizeAttenuation transparent opacity={0.85} />
</T.Points>
<T.Points geometry={starGeometry} scale={2.2}>
  <T.PointsMaterial size={0.15} color="#8ab4ff" sizeAttenuation transparent opacity={0.35} />
</T.Points>

<T.Sprite
  scale={[3.6, 3.6, 1]}
  onpointerenter={(e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }}
  onpointerleave={() => (document.body.style.cursor = 'default')}
  onpointerdown={(e) => {
    e.stopPropagation();
    selectBody(SUN);
  }}
  onclick={(e) => {
    e.stopPropagation();
    selectBody(SUN);
  }}
>
  <T.SpriteMaterial map={sunDisc} transparent depthWrite={false} />
</T.Sprite>

<T.Sprite scale={[9, 9, 1]}>
  <T.SpriteMaterial
    map={sunGlow}
    transparent
    opacity={0.75}
    blending={THREE.AdditiveBlending}
    depthWrite={false}
  />
</T.Sprite>

{#each SCENE as s (s.planet.slug)}
  <T.Mesh rotation.x={-Math.PI / 2}>
    <T.RingGeometry args={[s.orbit - 0.015, s.orbit + 0.015, 128]} />
    <T.MeshBasicMaterial
      color={selectedSlug === s.planet.slug ? '#60a5fa' : '#3b82f6'}
      transparent
      opacity={selectedSlug === s.planet.slug ? 0.5 : 0.18}
      side={THREE.DoubleSide}
    />
  </T.Mesh>

  <PlanetOrbiter {s} {selectedSlug} onSelect={selectBody} texture={textures[s.planet.slug]} />
{/each}