<script>
  import { page } from '$app/stores';
  import { Search, Play, X, Download } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa } from '$lib/nasa.js';
  import { MISSIONS, PLANETS } from '$lib/space-data.js';

  const initial = $page.url.searchParams.get('q') ?? 'moon';
  let q = $state(initial);
  let input = $state(initial);
  let images = $state(null);
  let videos = $state(null);

  let modal = $state(null);
  let modalLoading = $state(false);

  $effect(() => {
    const query = q;
    if (!query) return;
    nasa.search(query, 'image').then((d) => (images = d));
    nasa.search(query, 'video').then((d) => (videos = d));
  });

  function submit(e) { e.preventDefault(); q = input.trim() || 'moon'; }

  async function openVideo(item, thumb) {
    const title = item.data?.[0]?.title ?? 'Video';
    modal = { type: 'video', src: null, title, poster: thumb };
    modalLoading = true;
    try {
      const res = await fetch(item.href);
      const list = await res.json();
      const mp4s = list.filter((u) => typeof u === 'string' && u.endsWith('.mp4'));
      const pick = mp4s.find((u) => /~orig\.mp4$/i.test(u))
        || mp4s.find((u) => /~large\.mp4$/i.test(u))
        || mp4s.find((u) => /~medium\.mp4$/i.test(u))
        || mp4s[0];
      if (pick) modal = { type: 'video', src: pick, title, poster: thumb };
      else modal = null;
    } catch {
      modal = null;
    } finally {
      modalLoading = false;
    }
  }

  function openImage(thumb, title) {
    modal = { type: 'image', src: thumb, title };
  }

  function closeModal() { modal = null; }

  const lower = $derived(q.toLowerCase());
  const matchedMissions = $derived(MISSIONS.filter((m) => m.name.toLowerCase().includes(lower) || m.description.toLowerCase().includes(lower)));
  const matchedPlanets = $derived(PLANETS.filter((p) => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower)));
</script>

<svelte:head>
  <title>Explore | SpaceAtlas</title>
  <meta name="description" content="Unified search across NASA imagery, missions and planetary data." />
  <link rel="canonical" href="/explore" />
</svelte:head>

<PageHeader eyebrow="Search" title="Explore the cosmos" description="One search across NASA imagery, video, planets and missions." />

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  <form onsubmit={submit} class="mb-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-xl">
    <Search class="ml-3 h-4 w-4 text-muted-foreground" />
    <input bind:value={input} placeholder="Try: Jupiter, Apollo, Andromeda…" class="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" aria-label="Search" />
    <button class="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Search</button>
  </form>

  {#if matchedPlanets.length || matchedMissions.length}
    <div class="mb-10 grid gap-6 lg:grid-cols-2">
      {#if matchedPlanets.length}
        <div>
          <h2 class="mb-3 font-display text-lg font-semibold">Planets</h2>
          <div class="grid gap-2">
            {#each matchedPlanets as p}
              <a href="/solar-system" class="glass flex items-center gap-3 rounded-xl p-3 hover:border-primary/40">
                <span class="h-8 w-8 shrink-0 rounded-full" style="background: {p.color}"></span>
                <div class="min-w-0"><p class="font-medium">{p.name}</p><p class="truncate text-xs text-muted-foreground">{p.description}</p></div>
              </a>
            {/each}
          </div>
        </div>
      {/if}
      {#if matchedMissions.length}
        <div>
          <h2 class="mb-3 font-display text-lg font-semibold">Missions</h2>
          <div class="grid gap-2">
            {#each matchedMissions.slice(0, 4) as m}
              <a href={m.link} target="_blank" rel="noreferrer" class="glass block rounded-xl p-3 hover:border-primary/40">
                <p class="font-medium">{m.name}</p><p class="truncate text-xs text-muted-foreground">{m.description}</p>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <h2 class="mb-4 font-display text-lg font-semibold">Images ({images?.collection.metadata.total_hits ?? 0})</h2>
  <div class="columns-2 gap-3 sm:columns-3 lg:columns-4">
    {#each images?.collection.items?.slice(0, 32) ?? [] as it}
      {@const thumb = it.links?.[0]?.href}
      {@const meta = it.data[0]}
      {#if thumb && meta}
        <button
          type="button"
          onclick={() => openImage(thumb, meta.title)}
          class="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-white/10 text-left transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
        >
          <img src={thumb} alt={meta.title} loading="lazy" class="w-full transition-transform duration-500 group-hover:scale-105" />
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div class="p-2 text-xs">{meta.title}</div>
        </button>
      {/if}
    {/each}
  </div>

  {#if videos?.collection.items?.length}
    <h2 class="mb-4 mt-10 font-display text-lg font-semibold">Videos</h2>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each videos.collection.items.slice(0, 6) as it}
        {@const thumb = it.links?.[0]?.href}
        {@const meta = it.data[0]}
        {#if meta}
          <button
            type="button"
            onclick={() => openVideo(it, thumb)}
            class="group glass relative overflow-hidden rounded-xl text-left transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            {#if thumb}
              <div class="relative aspect-video overflow-hidden bg-black">
                <img src={thumb} alt={meta.title} loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div class="absolute inset-0 grid place-items-center bg-black/30 opacity-90 transition-opacity group-hover:bg-black/45">
                  <span class="grid h-12 w-12 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                    <Play class="h-5 w-5 fill-current" />
                  </span>
                </div>
              </div>
            {/if}
            <div class="p-3 text-sm">{meta.title}</div>
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</section>

{#if modal}
  <div class="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 backdrop-blur-xl" role="dialog" aria-modal="true">
    <button type="button" onclick={closeModal} class="absolute inset-0 -z-10 h-full w-full cursor-default" aria-label="Close"></button>
    <div class="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-background/95 shadow-2xl">
      <div class="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
        <p class="line-clamp-1 text-sm font-medium">{modal.title}</p>
        <div class="flex items-center gap-2">
          {#if modal.src}
            <a href={modal.src} download target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground hover:border-white/30 hover:text-foreground">
              <Download class="h-3 w-3" /> Open
            </a>
          {/if}
          <button type="button" onclick={closeModal} class="grid h-8 w-8 place-items-center rounded-full border border-white/10 hover:bg-white/10" aria-label="Close">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div class="bg-black">
        {#if modal.type === 'video'}
          {#if modalLoading}
            <div class="grid aspect-video place-items-center text-xs uppercase tracking-widest text-muted-foreground">Loading video…</div>
          {:else if modal.src}
            <video src={modal.src} poster={modal.poster} controls autoplay class="max-h-[75vh] w-full"></video>
          {:else}
            <div class="grid aspect-video place-items-center text-xs text-destructive">No playable MP4 found.</div>
          {/if}
        {:else}
          <img src={modal.src} alt={modal.title} class="mx-auto max-h-[80vh] w-auto" />
        {/if}
      </div>
    </div>
  </div>
{/if}
