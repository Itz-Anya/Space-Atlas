<script>
  import { onMount } from 'svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa } from '$lib/nasa.js';

  let images = $state(null);
  let loading = $state(true);
  let error = $state(null);
  let idx = $state(0);

  onMount(async () => {
    try { images = await nasa.epic(); } catch (e) { error = e; } finally { loading = false; }
  });

  const current = $derived(images?.[idx]);
</script>

<svelte:head>
  <title>Earth from Space | SpaceAtlas</title>
  <meta name="description" content="Full-disk EPIC imagery of Earth from NASA's DSCOVR satellite, one million miles away." />
  <link rel="canonical" href="/earth" />
</svelte:head>

<PageHeader eyebrow="Chapter 04 · Home Planet" meta="NASA / EPIC · DSCOVR" title="One million miles from home." description="Natural-color images of the full Earth disk, captured by NASA's EPIC camera aboard DSCOVR from Lagrange point L1." heroImage="/assets/earth-hero.jpg" />

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  {#if loading}
    <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div class="aspect-square animate-pulse rounded-3xl bg-white/5"></div>
      <div class="space-y-4">
        <div class="h-4 w-24 animate-pulse rounded bg-white/5"></div>
        <div class="h-8 w-2/3 animate-pulse rounded bg-white/5"></div>
        <div class="h-24 animate-pulse rounded-xl bg-white/5"></div>
      </div>
    </div>
  {/if}
  {#if error}
    <p class="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">Could not load EPIC imagery from NASA. Try again shortly.</p>
  {/if}
  {#if current}
    <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div class="glass overflow-hidden rounded-3xl">
        <img src={nasa.epicImageUrl(current.image, current.date)} alt={current.caption || 'Full-disk Earth from EPIC / DSCOVR'} class="w-full" loading="lazy" />
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{current.date}</p>
        <h2 class="mt-2 font-display text-2xl font-bold">Earth from DSCOVR / EPIC</h2>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
          {current.caption?.trim() ? current.caption : "This image was taken by NASA's EPIC camera onboard the NOAA DSCOVR spacecraft, orbiting one million miles from Earth at the L1 Lagrange point."}
        </p>
        <dl class="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div class="glass rounded-xl p-3"><dt class="text-xs text-muted-foreground">Latitude</dt><dd class="font-mono">{current.centroid_coordinates.lat.toFixed(2)}°</dd></div>
          <div class="glass rounded-xl p-3"><dt class="text-xs text-muted-foreground">Longitude</dt><dd class="font-mono">{current.centroid_coordinates.lon.toFixed(2)}°</dd></div>
        </dl>
        <div class="mt-6">
          <p class="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Timeline · {images?.length ?? 0} captures</p>
          <div class="flex flex-wrap gap-1.5">
            {#each images?.slice(0, 24) ?? [] as img, i}
              <button onclick={() => (idx = i)} class="h-2 flex-1 min-w-[8px] rounded-full transition {i === idx ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'}" aria-label={`View image ${i + 1}`}></button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
