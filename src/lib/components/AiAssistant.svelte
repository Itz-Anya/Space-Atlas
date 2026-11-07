<script>
  import { onMount, tick } from 'svelte';
  import { X, Send, Loader2, Bot } from 'lucide-svelte';
  import { AI_SYSTEM_PROMPT, askAnya } from '$lib/ai.js';

  let { embedded = false } = $props();

  let open = $state(false);
  let input = $state('');
  let loading = $state(false);
  let error = $state('');
  let messages = $state([
    { role: 'assistant', content: "Hi, I'm Nova, your SpaceAtlas guide. Ask me anything about the cosmos or this app." }
  ]);
  let scrollRef;

  const SUGGESTIONS = [
    'What is APOD?',
    'Where is the ISS right now?',
    'Tell me a Mars fact',
    'How do I search NASA images?'
  ];

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    input = '';
    error = '';
    messages = [...messages, { role: 'user', content }];
    loading = true;
    await tick();
    scrollBottom();
    try {
      const payload = [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content }))
      ];
      const reply = await askAnya(payload);
      messages = [...messages, { role: 'assistant', content: reply || '…' }];
    } catch (e) {
      error = e.message || 'Something went wrong.';
    } finally {
      loading = false;
      await tick();
      scrollBottom();
    }
  }

  function scrollBottom() {
    if (scrollRef) scrollRef.scrollTop = scrollRef.scrollHeight;
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  onMount(() => { if (embedded) open = true; });
</script>

{#if !embedded}
  <button
    onclick={() => (open = !open)}
    aria-label="Open Nova AI assistant"
    class="fixed bottom-5 right-5 z-40 hidden h-16 w-16 place-items-center overflow-visible rounded-full border border-gold/40 bg-background/80 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all hover:scale-105 hover:border-gold md:grid"
  >
    <span class="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-gold/20 blur-xl"></span>
    <img src="/assets/ai-robot.png" alt="" width="56" height="56" class="relative h-14 w-14 object-contain drop-shadow-[0_0_10px_rgba(255,200,80,0.35)]" />
    <span class="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-black">AI</span>
  </button>
{/if}

{#if open || embedded}
  <div
    class="{embedded ? 'relative w-full' : 'fixed bottom-24 right-5 z-50 hidden w-[min(380px,calc(100vw-2.5rem))] md:block'}"
  >
    <div class="{embedded ? 'h-[70vh] min-h-[520px]' : 'h-[560px] max-h-[70vh]'} flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-background/95 shadow-2xl shadow-black/70 backdrop-blur-2xl">
      <div class="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div class="flex items-center gap-2.5">
          <span class="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-gold/40 bg-white/5">
            <img src="/assets/ai-robot.png" alt="" class="h-8 w-8 object-contain" />
          </span>
          <div class="leading-tight">
            <p class="text-sm font-semibold">Nova <span class="text-[10px] font-normal uppercase tracking-widest text-gold">AI</span></p>
            <p class="text-[11px] text-muted-foreground">Your SpaceAtlas guide</p>
          </div>
        </div>
        {#if !embedded}
          <button onclick={() => (open = false)} aria-label="Close" class="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-muted-foreground hover:text-foreground">
            <X class="h-4 w-4" />
          </button>
        {/if}
      </div>

      <div bind:this={scrollRef} class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {#each messages as m, i (i)}
          <div class="flex gap-2 {m.role === 'user' ? 'justify-end' : 'justify-start'}">
            {#if m.role === 'assistant'}
              <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/30 bg-white/5">
                <Bot class="h-3.5 w-3.5 text-gold" />
              </span>
            {/if}
            <div class="max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed {m.role === 'user' ? 'bg-gold/15 text-foreground border border-gold/30' : 'bg-white/[0.04] border border-white/10 text-foreground/90'}">
              {m.content}
            </div>
          </div>
        {/each}
        {#if loading}
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 class="h-3.5 w-3.5 animate-spin" /> Nova is thinking…
          </div>
        {/if}
        {#if error}
          <p class="text-xs text-red-400">{error}</p>
        {/if}
      </div>

      {#if messages.length <= 1}
        <div class="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-2.5">
          {#each SUGGESTIONS as s}
            <button onclick={() => send(s)} class="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-gold/40 hover:text-foreground">
              {s}
            </button>
          {/each}
        </div>
      {/if}

      <form onsubmit={(e) => { e.preventDefault(); send(); }} class="flex items-center gap-2 border-t border-white/10 px-3 py-3">
        <input
          bind:value={input}
          onkeydown={onKey}
          placeholder="Ask Nova about the cosmos…"
          class="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-gold/50"
        />
        <button type="submit" disabled={loading || !input.trim()} aria-label="Send" class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-black transition hover:brightness-110 disabled:opacity-40">
          {#if loading}<Loader2 class="h-4 w-4 animate-spin" />{:else}<Send class="h-4 w-4" />{/if}
        </button>
      </form>
    </div>
  </div>
{/if}
