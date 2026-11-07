<script>
  import { onMount } from 'svelte';
  import { Search, X } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa } from '$lib/nasa.js';

  const CATEGORIES = ['galaxy', 'nebula', 'mars', 'moon', 'earth', 'hubble', 'webb', 'aurora', 'supernova'];

  let q = $state('nebula');
  let input = $state('nebula');
  let viewer = $state(null);
  let data = $state(null);
  let loading = $state(false);

  $effect(() => {
    const query = q;
    loading = true; data = null;
    nasa.search(query, 'image').then((d) => { data = d; }).finally(() => (loading = false));
  });

  function submit(e) { e.preventDefault(); q = input.trim() || 'nebula'; }

  onMount(() => {
    const onKey = (e) => { if (e.key === 'Escape') viewer = null; };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
</script>

<svelte:head>
  <title>Space Gallery | SpaceAtlas</title>
  <meta name="description" content="Browse and search NASA's massive image and video library." />
  <link rel="canonical" href="/gallery" />
</svelte:head>

<PageHeader eyebrow="Image Library" title="Space Gallery" description="Search over a million NASA images from every mission and observatory." />

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  <form onsubmit={submit} class="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
    <Search class="ml-3 h-4 w-4 text-muted-foreground" />
    <input bind:value={input} placeholder="Search NASA image library…" class="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" aria-label="Search NASA images" />
    <button class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Search</button>
  </form>

  <div class="mb-6 flex flex-wrap gap-2">
    {#each CATEGORIES as c}
      <button onclick={() => { input = c; q = c; }} class="rounded-full border px-3 py-1 text-xs capitalize transition {q === c ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}">{c}</button>
    {/each}
  </div>

  {#if loading}
    <div class="columns-2 gap-3 sm:columns-3 lg:columns-4">
      {#each Array(12) as _, i}<div class="mb-3 animate-pulse rounded-xl bg-white/5" style="height: {120 + (i % 4) * 60}px"></div>{/each}
    </div>
  {/if}

  <div class="columns-2 gap-3 sm:columns-3 lg:columns-4">
    {#each data?.collection?.items?.slice(0, 60) ?? [] as item}
      {@const thumb = item.links?.[0]?.href}
      {@const meta = item.data[0]}
      {#if thumb && meta}
        <button onclick={() => (viewer = item)} class="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition-transform hover:-translate-y-0.5">
          <img src={thumb} alt={meta.title} loading="lazy" class="w-full" />
          <div class="p-3">
            <p class="line-clamp-2 text-xs font-medium">{meta.title}</p>
            <p class="mt-1 text-[10px] text-muted-foreground">{meta.date_created.slice(0, 10)}</p>
          </div>
        </button>
      {/if}
    {/each}
  </div>
</section>

{#if viewer}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-xl" onclick={() => (viewer = null)} role="presentation">
    <button onclick={() => (viewer = null)} class="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10" aria-label="Close"><X class="h-4 w-4" /></button>
    <div class="glass grid max-h-[90vh] max-w-6xl gap-0 overflow-hidden rounded-2xl lg:grid-cols-[2fr_1fr]" onclick={(e) => e.stopPropagation()} role="presentation">
      <img src={viewer.links?.[0]?.href} alt={viewer.data[0].title} class="max-h-[90vh] w-full object-contain bg-black" />
      <div class="max-h-[40vh] overflow-y-auto p-5 lg:max-h-[90vh]">
        <h3 class="font-display text-lg font-bold">{viewer.data[0].title}</h3>
        <p class="mt-1 text-xs text-muted-foreground">{viewer.data[0].date_created.slice(0, 10)}{viewer.data[0].center ? ` · ${viewer.data[0].center}` : ''}</p>
        {#if viewer.data[0].description}<p class="mt-4 text-sm leading-relaxed text-muted-foreground">{viewer.data[0].description}</p>{/if}
      </div>
    </div>
  </div>
{/if}
