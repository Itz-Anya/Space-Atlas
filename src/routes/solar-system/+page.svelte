<script>
  import { onMount } from 'svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { PLANETS } from '$lib/space-data.js';
  import { PLANET_IMAGES } from '$lib/planet-images.js';

  const SUN = {
    name: 'Sun',
    description:
      "The Sun is the star at the center of our Solar System, a nearly perfect ball of hot plasma. Its nuclear fusion produces the light and heat that make life on Earth possible, and its gravity holds every planet, asteroid, and comet in orbit.",
    radiusKm: 695700,
    distanceAU: '0 (center)',
    dayHours: '~609.12 (equator)',
    yearDays: '~225M (galactic)',
    moons: '0',
    temperatureC: '5,500 (surface) · 15M (core)'
  };

  let selected = $state(PLANETS[2]);
  const isSun = $derived(selected.slug === 'sun');

  let SolarSystem3D = $state(null);
  onMount(async () => {
    const mod = await import('$lib/components/SolarSystem3D.svelte');
    SolarSystem3D = mod.default;
  });
</script>

<svelte:head>
  <title>Interactive 3D Solar System | SpaceAtlas</title>
  <meta
    name="description"
    content="Explore the Sun and eight planets in an interactive 3D solar system. Zoom, rotate and click a body to learn more."
  />
  <link rel="canonical" href="/solar-system" />
</svelte:head>

<PageHeader
  eyebrow="Interactive 3D"
  title="Solar System"
  description="Drag to rotate, scroll or pinch to zoom, right-click to pan. Click the Sun or any planet to explore."
/>

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
    <div class="glass relative aspect-square w-full overflow-hidden rounded-3xl">
      {#if SolarSystem3D}
        <svelte:component
          this={SolarSystem3D}
          selectedSlug={selected.slug}
          onSelect={(b) => (selected = b)}
        />
      {:else}
        <div class="absolute inset-0 grid place-items-center text-xs uppercase tracking-widest text-muted-foreground">
          Loading 3D scene…
        </div>
      {/if}
      <div
        class="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur"
      >
        Drag · Zoom · Click a body
      </div>
    </div>

    <div class="glass rounded-3xl p-6 sm:p-8">
      <div class="mb-6 flex items-center gap-4">
        <img
          src={isSun ? PLANET_IMAGES.sun : PLANET_IMAGES[selected.slug]}
          alt={selected.name}
          class="h-20 w-20 shrink-0 rounded-full object-cover"
        />
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {isSun ? 'Star' : 'Planet'}
          </p>
          <h2 class="font-display text-3xl font-bold">{selected.name}</h2>
        </div>
      </div>

      {#if isSun}
        <p class="text-sm leading-relaxed text-muted-foreground">{SUN.description}</p>
        <dl class="mt-6 grid grid-cols-2 gap-3 text-sm">
          {#each [
            ['Radius', `${SUN.radiusKm.toLocaleString()} km`],
            ['Position', SUN.distanceAU],
            ['Rotation', `${SUN.dayHours} h`],
            ['Orbit', `${SUN.yearDays} yrs`],
            ['Moons', SUN.moons],
            ['Temperature', `${SUN.temperatureC} °C`]
          ] as [k, v]}
            <div class="rounded-xl border border-white/10 bg-white/5 p-3">
              <dt class="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
              <dd class="mt-1 font-mono text-sm">{v}</dd>
            </div>
          {/each}
        </dl>
      {:else}
        <p class="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
        <dl class="mt-6 grid grid-cols-2 gap-3 text-sm">
          {#each [
            ['Radius', `${selected.radiusKm.toLocaleString()} km`],
            ['Distance from Sun', `${selected.distanceAU} AU`],
            ['Day length', `${selected.dayHours} h`],
            ['Year length', `${selected.yearDays.toLocaleString()} days`],
            ['Moons', selected.moons.toString()],
            ['Temperature', `${selected.temperatureC} °C`]
          ] as [k, v]}
            <div class="rounded-xl border border-white/10 bg-white/5 p-3">
              <dt class="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
              <dd class="mt-1 font-mono text-sm">{v}</dd>
            </div>
          {/each}
        </dl>
      {/if}

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          onclick={() => (selected = { slug: 'sun', name: 'Sun' })}
          class="rounded-full border px-3 py-1 text-xs transition {isSun
            ? 'border-primary/60 bg-primary/10 text-primary'
            : 'border-white/10 text-muted-foreground hover:bg-white/5'}"
        >
          Sun
        </button>
        {#each PLANETS as p}
          <button
            onclick={() => (selected = p)}
            class="rounded-full border px-3 py-1 text-xs transition {selected.slug === p.slug
              ? 'border-primary/60 bg-primary/10 text-primary'
              : 'border-white/10 text-muted-foreground hover:bg-white/5'}"
          >
            {p.name}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>
