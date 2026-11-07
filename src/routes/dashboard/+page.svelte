<script>
  import { onMount } from 'svelte';
  import { AlertTriangle, Camera, Orbit, Rocket, Sparkles, Heart, ArrowRight } from 'lucide-svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa, todayISO } from '$lib/nasa.js';
  import { MISSIONS } from '$lib/space-data.js';
  import { favorites } from '$lib/favorites.js';

  let apod = $state(null);
  let neo = $state(null);
  let mars = $state(null);
  let neoLoading = $state(true);
  let marsLoading = $state(true);
  let favs = $state([]);
  favorites.subscribe((v) => (favs = v));

  onMount(async () => {
    nasa.apod().then((d) => (apod = d)).catch(() => {});
    nasa.neoFeed(todayISO(), todayISO()).then((d) => (neo = d)).finally(() => (neoLoading = false));
    nasa.search('Curiosity rover Mars', 'image').then((d) => (mars = d)).finally(() => (marsLoading = false));
  });

  const neoToday = $derived(neo ? Object.values(neo.near_earth_objects).flat() : []);
  const hazToday = $derived(neoToday.filter((a) => a.is_potentially_hazardous_asteroid).length);
  const activeMissions = MISSIONS.filter((m) => m.status === 'Active').length;
  const marsCount = $derived(mars?.collection?.metadata?.total_hits);
</script>

<svelte:head>
  <title>Space Dashboard | SpaceAtlas</title>
  <meta name="description" content="A live NASA dashboard: APOD, Mars photo count, near-Earth asteroids, active missions and your favorites." />
  <link rel="canonical" href="/dashboard" />
</svelte:head>

<PageHeader eyebrow="Live" title="Space Dashboard" description="A real-time overview of NASA's universe, powered by public APIs." />

<section class="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 pb-6 sm:grid-cols-4 sm:px-6">
  {#each [
    { icon: Orbit, label: 'Asteroids today', value: neoLoading ? '…' : neoToday.length.toString(), sub: neoLoading ? 'loading' : `${hazToday} hazardous` },
    { icon: Camera, label: 'Curiosity photos', value: marsLoading ? '…' : (marsCount?.toLocaleString() ?? 'N/A'), sub: 'NASA library' },
    { icon: Rocket, label: 'Active missions', value: activeMissions.toString(), sub: 'curated' },
    { icon: Heart, label: 'Your favorites', value: favs.length.toString(), sub: 'stored locally' }
  ] as s}
    <div class="glass rounded-2xl p-4">
      <div class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><s.icon class="h-3.5 w-3.5 text-primary" /> {s.label}</div>
      <div class="mt-2 font-display text-2xl font-bold text-gold sm:text-3xl">{s.value}</div>
      <div class="mt-1 text-xs text-muted-foreground">{s.sub}</div>
    </div>
  {/each}
</section>

<section class="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
  <div class="glass rounded-2xl p-5">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h3 class="flex items-center gap-2 font-display text-base font-semibold">
        <Heart class="h-4 w-4 text-gold" /> Your saved items
        <span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{favs.length}</span>
      </h3>
      <a href="/apod" class="text-xs text-accent hover:underline">Browse APOD →</a>
    </div>
    {#if favs.length === 0}
      <p class="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted-foreground">
        Nothing saved yet. Open the <a href="/apod" class="text-accent hover:underline">APOD</a> page and tap
        <span class="mx-1 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs"><Heart class="h-3 w-3" /> Save</span>
        on any image and it will show up here.
      </p>
    {:else}
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each favs.slice(0, 9) as f}
          <div class="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {#if f.thumb}<img src={f.thumb} alt={f.title} loading="lazy" class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" />{/if}
            <div class="p-3">
              <p class="line-clamp-1 text-sm font-medium">{f.title}</p>
              <div class="mt-1 flex items-center justify-between">
                <p class="text-[10px] text-muted-foreground">{f.meta}</p>
                <button onclick={() => favorites.remove(f.id)} class="text-[10px] text-muted-foreground hover:text-destructive">Remove</button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<section class="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 lg:grid-cols-3">
  <a href="/apod" class="glass group col-span-1 overflow-hidden rounded-2xl lg:col-span-2">
    <div class="relative aspect-[16/8]">
      {#if apod?.media_type === 'image'}
        <img src={apod.url} alt={apod.title} class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      {:else}
        <div class="h-full w-full animate-pulse bg-white/5"></div>
      {/if}
      <div class="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-5">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Astronomy Picture · {apod?.date ?? ''}</p>
        <h3 class="mt-1 font-display text-xl font-bold">{apod?.title ?? ''}</h3>
      </div>
    </div>
  </a>

  <div class="glass rounded-2xl p-5">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="font-display text-base font-semibold">Close approaches</h3>
      <a href="/asteroids" class="text-xs text-accent hover:underline">View all</a>
    </div>
    <ul class="space-y-2">
      {#each neoToday.slice(0, 5) as a}
        <li class="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 p-2 text-xs">
          {#if a.is_potentially_hazardous_asteroid}<AlertTriangle class="h-3.5 w-3.5 shrink-0 text-destructive" />{:else}<Sparkles class="h-3.5 w-3.5 shrink-0 text-primary" />{/if}
          <span class="min-w-0 flex-1 truncate">{a.name}</span>
          <span class="font-mono text-[10px] text-muted-foreground">{Math.round(Number(a.close_approach_data[0]?.miss_distance.lunar || 0))} LD</span>
        </li>
      {/each}
      {#if neoLoading}{#each Array(4) as _}<li class="h-8 animate-pulse rounded-lg bg-white/5"></li>{/each}{/if}
    </ul>
  </div>


  <div class="glass rounded-2xl p-5 lg:col-span-2">
    <h3 class="mb-4 font-display text-base font-semibold">Quick jump</h3>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {#each [
        { to: '/mars', label: 'Mars' },
        { to: '/earth', label: 'Earth' },
        { to: '/gallery', label: 'Gallery' },
        { to: '/solar-system', label: 'Solar System' },
        { to: '/missions', label: 'Missions' },
        { to: '/explore', label: 'Explore' }
      ] as l}
        <a href={l.to} class="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm hover:border-primary/40 hover:bg-white/5">{l.label} <ArrowRight class="h-3.5 w-3.5 text-muted-foreground" /></a>
      {/each}
    </div>
  </div>
</section>
