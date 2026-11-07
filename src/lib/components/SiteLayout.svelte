<script>
  import { page } from '$app/stores';
  import { LayoutGrid, X, Github, ExternalLink, ArrowUpRight, Info } from 'lucide-svelte';
  import AiAssistant from '$lib/components/AiAssistant.svelte';

  let { children } = $props();

  const NAV = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/apod', label: 'APOD' },
    { to: '/mars', label: 'Mars' },
    { to: '/earth', label: 'Earth' },
    { to: '/asteroids', label: 'Asteroids' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/solar-system', label: 'Solar System' },
    { to: '/iss', label: 'ISS Tracker' },
    { to: '/missions', label: 'Missions' },
    { to: '/explore', label: 'Explore' },
    { to: '/ai', label: 'Nova AI' },
    { to: '/about', label: 'About' }
  ];

  const LOGO_URL = '/assets/logo.png';
  let open = $state(false);

  const pathname = $derived($page.url.pathname);
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));
</script>

<div class="relative min-h-screen">
  <div class="stars" aria-hidden="true"></div>
  <div class="relative z-10 flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div class="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-6 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-4">
        <a href="/" class="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span class="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 bg-background sm:h-10 sm:w-10">
            <img src={LOGO_URL} alt="SpaceAtlas logo" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="eager" decoding="async" />
            <span class="pointer-events-none absolute inset-[-3px] rounded-full border border-dashed border-white/10 transition-transform duration-[3000ms] group-hover:rotate-180"></span>
          </span>
          <span class="flex min-w-0 flex-col leading-none">
            <span class="truncate font-display text-base tracking-tight sm:text-lg">Space<span class="text-gold">Atlas</span></span>
            <span class="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:block">NASA Data Atlas</span>
          </span>
        </a>

        <nav class="hidden justify-center gap-0.5 xl:flex">
          {#each NAV as item (item.to)}
            <a href={item.to} class="relative rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors {isActive(item.to) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}">
              {item.label}
              {#if isActive(item.to)}<span class="absolute inset-x-2.5 -bottom-[1px] h-px bg-gold"></span>{/if}
            </a>
          {/each}
        </nav>

        <div class="flex items-center gap-1.5 justify-self-end sm:gap-2">
          <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer noopener" class="hidden items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground sm:inline-flex">
            <Github class="h-3 w-3" /> Open Source
          </a>
          <a
            href="/about"
            aria-label="About SpaceAtlas"
            class="group relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.04] transition-all hover:border-gold/50 hover:bg-white/10 xl:hidden"
          >
            <span class="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
            <Info class="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          </a>
          <button
            onclick={() => (open = !open)}
            class="group relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/15 bg-white/[0.04] transition-all hover:border-gold/50 hover:bg-white/10 xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span class="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
            <span class="relative grid place-items-center transition-transform duration-300 {open ? 'rotate-180 scale-90' : 'rotate-0'}">
              {#if open}<X class="h-4 w-4 text-gold" />{:else}<LayoutGrid class="h-4 w-4" />{/if}
            </span>
          </button>
        </div>
      </div>

      {#if open}
        <div class="fixed inset-0 top-16 z-30 bg-black/85 backdrop-blur-3xl xl:hidden" onclick={() => (open = false)} role="presentation"></div>
        <nav class="menu-sheet fixed inset-x-0 top-16 z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/10 bg-background/95 shadow-2xl shadow-black/70 backdrop-blur-3xl xl:hidden">
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.white/0.08),transparent_60%)]"></div>
          <div class="relative mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Navigate</p>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {#each NAV as item, i (item.to)}
                <a
                  href={item.to}
                  onclick={() => (open = false)}
                  style="animation-delay: {i * 40}ms"
                  class="menu-item group relative flex items-center justify-between gap-2 overflow-hidden rounded-xl border px-3.5 py-3.5 text-sm transition-all {isActive(item.to) ? 'border-gold/50 bg-gold/10 text-gold' : 'border-white/10 bg-white/[0.03] text-foreground/85 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-white/[0.07] hover:text-foreground'}"
                >
                  <span class="relative z-10 font-medium">{item.label}</span>
                  <ArrowUpRight class="relative z-10 h-3.5 w-3.5 shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  <span class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
                </a>
              {/each}
            </div>
          </div>
        </nav>
      {/if}
    </header>

    <main class="relative flex-1">{@render children()}</main>

    <AiAssistant />


    <footer class="mt-16 border-t border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-3">
          <p class="font-display text-base">Space<span class="text-gold">Atlas</span></p>
          <span class="text-[10px] uppercase tracking-widest text-muted-foreground">NASA Data Atlas</span>
        </div>
        <p class="text-xs text-muted-foreground">
          Crafted by <a href="/about" class="font-semibold text-foreground hover:text-gold">Anya</a>
          &amp; <a href="/about" class="font-semibold text-foreground hover:text-gold">Murali</a>
        </p>
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <a href="/about" class="hover:text-foreground">About</a>
          <a href="/dashboard" class="hover:text-foreground">Dashboard</a>
          <a href="https://api.nasa.gov/" target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1 hover:text-gold">api.nasa.gov <ExternalLink class="h-3 w-3" /></a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  </div>
</div>

<style>
  .menu-sheet { animation: sheet-in 260ms cubic-bezier(0.22, 1, 0.36, 1); }
  @keyframes sheet-in {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .menu-item { opacity: 0; animation: item-in 380ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  @keyframes item-in {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>
