// Chief's v3 kit. These are app-local for now: the tone language is
// proven on Chief only. If a second app adopts it, move this folder to
// packages/ui rather than copying it.
//
// HOW A SCREEN IS LAID OUT (Robert, 16 Nov 2026)
//
// Five kinds of thing go on a screen. Each has one look, and no other
// kind borrows it, so what a thing is can be told before it is read.
//
//   1. Headline: the figure the screen is for. Lead, once, at the top.
//      It adds up exactly what the screen shows under it.
//   2. Main action: what is most often done here. A lit Btn, straight
//      under the headline, or straight after the one list it adds to
//      when that list is what the headline totals. Rarer actions are
//      unlit Btns.
//   3. Switch or filter: changes what this screen shows and goes
//      nowhere. Tabs, LensSwitch or Filter, never a Row. It opens on
//      everything, says how many each choice holds, and is not drawn
//      when it would show nothing different. A switch between whole
//      views of a screen (the Asset tab's Focus, Work, Activity and
//      Worth) comes first, above the headline, because it decides what
//      the headline is (Robert, 19 Nov). A setting on a record (an
//      asset's Now, Soon or Later) is a Seg, not a switch.
//   4. Content: records are Rows; places to look (categories) are
//      Tiles; one end of a set of links is a Group. Anything that is
//      a Row can be tapped and goes somewhere.
//   5. Notice: a plain sentence (Blank, Note) at the foot or on the
//      record it is about. An Alert only when the screen cannot work.
//      A notice is never a Row, and the same fact is said once.
//
// Critical values are checked when a record is made or changed, not
// flagged on a list afterwards.
export { default as Alert } from './Alert.svelte';
export { default as Amt } from './Amt.svelte';
export { default as Appr } from './Appr.svelte';
export { default as Banner } from './Banner.svelte';
export { default as Blank } from './Blank.svelte';
export { default as Btn } from './Btn.svelte';
export { default as Chips } from './Chips.svelte';
export { default as EmptyLive } from './EmptyLive.svelte';
export { default as Expander } from './Expander.svelte';
export { default as Facts } from './Facts.svelte';
export { default as FocusNote } from './FocusNote.svelte';
export { default as Delete } from './Delete.svelte';
export { default as Field } from './Field.svelte';
export { default as Filter } from './Filter.svelte';
export { default as Hero } from './Hero.svelte';
export { default as Group } from './Group.svelte';
export { default as Icon } from './Icon.svelte';
export { default as Lead } from './Lead.svelte';
export { default as StateSwitch } from './StateSwitch.svelte';
export { default as Missing } from './Missing.svelte';
export { default as Note } from './Note.svelte';
export { default as PageHead } from './PageHead.svelte';
export { default as Prog } from './Prog.svelte';
export { default as Row } from './Row.svelte';
export { default as SectionHead } from './SectionHead.svelte';
export { default as Seg } from './Seg.svelte';
export { default as Select } from './Select.svelte';
export { default as SourceNote } from './SourceNote.svelte';
export { default as TypeBadge } from './TypeBadge.svelte';
export { default as SpherePick } from './SpherePick.svelte';
export { default as SphereTags } from './SphereTags.svelte';
export { default as Stats } from './Stats.svelte';
export { default as Tabs } from './Tabs.svelte';
export { default as Tiles } from './Tiles.svelte';
export { default as Wave } from './Wave.svelte';
export { TONE, tone } from './tone.js';
