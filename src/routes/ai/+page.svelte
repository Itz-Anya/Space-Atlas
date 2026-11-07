<script>
  import PageHeader from '$lib/components/PageHeader.svelte';
  import AiAssistant from '$lib/components/AiAssistant.svelte';
</script>

<svelte:head>
  <title>Nova AI | SpaceAtlas Assistant</title>
  <meta name="description" content="Chat with Nova, the SpaceAtlas AI guide. Ask anything about space, NASA missions, planets and how to use the app." />
</svelte:head>

<PageHeader eyebrow="Chapter · AI" title="Meet Nova." description="Your onboard AI guide to the cosmos and SpaceAtlas." meta="Powered by Anya APIs" />

<section class="mx-auto grid max-w-6xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
  <aside class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-muted-foreground">
    <img src="/assets/ai-robot.png" alt="Nova the SpaceAtlas AI robot" width="220" height="220" class="mx-auto mb-4 h-40 w-40 object-contain drop-shadow-[0_0_18px_rgba(255,200,80,0.35)]" />
    <p class="text-center font-display text-xl text-foreground">Nova</p>
    <p class="mt-4">Nova can help you understand NASA data, explain astronomy concepts, recommend which section of SpaceAtlas to explore, and answer follow-up questions with context.</p>
    <ul class="mt-4 space-y-1.5 text-xs">
      <li>• Explain APOD, orbits, missions</li>
      <li>• Help you navigate SpaceAtlas</li>
      <li>• Answer space trivia and facts</li>
    </ul>
  </aside>

  <div><AiAssistant embedded={true} /></div>
</section>
