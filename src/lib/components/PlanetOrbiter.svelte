<script>
  import { T, useTask } from '@threlte/core';
  import { HTML } from '@threlte/extras';
  import * as THREE from 'three';

  let { s, selectedSlug, onSelect, texture } = $props();

  let group = $state();
  let hovered = $state(false);
  let angle = s.angle0;

  useTask((delta) => {
    angle += delta * s.speed;
    if (group) {
      group.position.x = Math.cos(angle) * s.orbit;
      group.position.z = Math.sin(angle) * s.orbit;
    }
  });

  const selected = $derived(selectedSlug === s.planet.slug);

  function handleClick(e) {
    e?.stopPropagation?.();
    if (typeof onSelect === 'function') onSelect(s.planet);
  }
</script>

<T.Group bind:ref={group}>
  <T.Sprite
    scale={[s.size * 2, s.size * 2, 1]}
    onpointerenter={(e) => {
      e.stopPropagation();
      hovered = true;
      document.body.style.cursor = 'pointer';
    }}
    onpointerleave={() => {
      hovered = false;
      document.body.style.cursor = 'default';
    }}
    onpointerdown={handleClick}
    onclick={handleClick}
  >
    <T.SpriteMaterial map={texture} transparent color={selected ? '#dbeafe' : '#ffffff'} />
  </T.Sprite>


  {#if hovered || selected}
    <HTML position={[0, s.size * 1.6, 0]} center pointerEvents="none">
      <div
        class="whitespace-nowrap rounded-full border border-primary/40 bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary backdrop-blur"
      >
        {s.planet.name}
      </div>
    </HTML>
  {/if}
</T.Group>
