<script>
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { nasa } from '$lib/nasa.js';

  const ROVERS = [
    { slug: 'curiosity', label: 'Curiosity', query: 'Curiosity rover Mars' },
    { slug: 'perseverance', label: 'Perseverance', query: 'Perseverance rover Mars' },
    { slug: 'opportunity', label: 'Opportunity', query: 'Opportunity rover Mars' },
    { slug: 'spirit', label: 'Spirit', query: 'Spirit rover Mars' },
    { slug: 'ingenuity', label: 'Ingenuity', query: 'Ingenuity helicopter Mars' }
  ];
  const TOPICS = ['landscape', 'selfie', 'sample', 'drilling', 'wheel tracks', 'sunset', 'panorama'];

  let rover = $state('curiosity');
  let topic = $state('');
  let data = $state(null);
  let loading = $state(false);

  const query = $derived.by(() => {
    const r = ROVERS.find((x) => x.slug === rover);
    return topic ? `${r.query} ${topic}` : r.query;
  });

  $effect(() => {
    const q = query;
    loading = true; data = null;
    nasa.search(q, 'image').then((d) => { data = d; }).finally(() => (loading = false));
  });

  const items = $derived(data?.collection?.items ?? []);
  const total = $derived(data?.collection?.metadata?.total_hits ?? 0);
</script>

<svelte:head>
  <title>Mars Rover Photos | SpaceAtlas</title>
  <meta name="description" content="Explore imagery from NASA's Mars rovers Curiosity, Perseverance, Opportunity and Spirit." />
  <link rel="canonical" href="/mars" />
</svelte:head>

<PageHeader eyebrow="Chapter 02 · Red Planet" meta="NASA / Image Library" title="Postcards from Mars." description="Curated imagery from NASA's Mars rovers, pulled live from the NASA Image and Video Library." heroImage="/assets/mars-hero.jpg" />

<section class="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
  <div class="glass mb-6 rounded-2xl p-4">
    <p class="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Rover</p>
    <div class="flex flex-wrap gap-2">
      {#each ROVERS as r}
        <button onclick={() => (rover = r.slug)} class="rounded-full border px-4 py-1.5 text-xs font-medium transition {rover === r.slug ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}">{r.label}</button>
      {/each}
    </div>
    <p class="mb-2 mt-4 text-[10px] uppercase tracking-widest text-muted-foreground">Topic</p>
    <div class="flex flex-wrap gap-2">
      <button onclick={() => (topic = '')} class="rounded-full border px-3 py-1 text-xs transition {topic === '' ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}">All</button>
      {#each TOPICS as t}
        <button onclick={() => (topic = t)} class="rounded-full border px-3 py-1 text-xs capitalize transition {topic === t ? 'border-primary/60 bg-primary/10 text-primary' : 'border-white/10 text-muted-foreground hover:bg-white/5'}">{t}</button>
      {/each}
    </div>
    {#if !loading}<p class="mt-3 text-xs text-muted-foreground">{total.toLocaleString()} results · showing latest {Math.min(items.length, 60)}</p>{/if}
  </div>

  {#if loading}
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(9) as _}<div class="aspect-square animate-pulse rounded-xl bg-white/5"></div>{/each}
    </div>
  {/if}

  {#if data && items.length === 0}
    <p class="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-muted-foreground">No photos for these filters. Try another topic.</p>
  {/if}

  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {#each items.slice(0, 60) as item}
      {@const thumb = item.links?.[0]?.href}
      {@const meta = item.data[0]}
      {#if thumb && meta}
        <div class="group glass relative overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
          <div class="aspect-square overflow-hidden bg-white/5">
            <img src={thumb} alt={meta.title} loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
          <div class="p-3">
            <p class="line-clamp-2 text-xs font-medium">{meta.title}</p>
            <p class="mt-1 text-[10px] text-muted-foreground">{meta.date_created?.slice(0, 10)}</p>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</section>
