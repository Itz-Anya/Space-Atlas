import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const KEY = 'spaceatlas:favorites';

function load() {
  if (!browser) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function createFavorites() {
  const { subscribe, update, set } = writable(load());
  const save = (items) => {
    if (browser) localStorage.setItem(KEY, JSON.stringify(items));
    return items;
  };
  return {
    subscribe,
    add: (item) => update((items) => save(items.some((i) => i.id === item.id) ? items : [item, ...items])),
    remove: (id) => update((items) => save(items.filter((i) => i.id !== id))),
    toggle: (item) =>
      update((items) => save(items.some((i) => i.id === item.id) ? items.filter((i) => i.id !== item.id) : [item, ...items])),
    has: (id, items) => items.some((i) => i.id === id),
    clear: () => set(save([]))
  };
}

export const favorites = createFavorites();
