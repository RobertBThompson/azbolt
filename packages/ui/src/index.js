// Shared components are exported as SOURCE, not compiled output.
// Each app's Vite build compiles them via the "svelte" export condition,
// so there is no build step here and no watch-mode lag in dev.
export { default as AppShell } from './AppShell.svelte';
export { default as Card } from './Card.svelte';
export { default as Button } from './Button.svelte';
export { default as InstallPrompt } from './InstallPrompt.svelte';
