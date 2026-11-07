<script>
  let { eyebrow = '', meta = '', title, description = '', heroImage = null } = $props();
</script>

<section class="relative overflow-hidden border-b border-white/[0.06]">
  {#if heroImage}
    <div class="absolute inset-0 -z-10">
      <img src={heroImage} alt="" class="h-full w-full object-cover opacity-30" />
      <div class="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
    </div>
  {/if}
  <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
    {#if eyebrow || meta}
      <div class="flex flex-wrap items-center gap-4">
        {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
        {#if meta}<span class="h-px w-10 bg-white/20"></span><span class="font-mono text-[11px] uppercase tracking-widest text-muted-foreground tabular">{meta}</span>{/if}
      </div>
    {/if}
    <h1 class="mt-4 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
    {#if description}<p class="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>{/if}
  </div>
</section>
