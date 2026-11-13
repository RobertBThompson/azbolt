# Chief — the rules the code must honour

Source of truth is the **Layer 2 mobile experience map, v3** ("A tree, not
a list") in the claude.ai project — 109 screens across eleven branches.
This file is the short version: the decisions a change to `apps/chief` can
get wrong without anyone noticing.

Chief was first built in Flutter in 2021 and never launched. That app is
**not** the target — v3 is a deliberate redesign of it. Do not port the
2021 drawer, its 3×3 neumorphic tile grid, or its "Goodies/Quests"
front-of-house naming into this app.

## The tree

Eleven branches on two tiers. Three are foundation: every branch below
reads from them and none of them read back.

|     | Branch                | Owns                                                          |
| --- | --------------------- | ------------------------------------------------------------- |
| F0  | Shell & Context       | context switching, app bar, bottom nav, search, notifications |
| F1  | Directory             | the only place a person or an organization exists             |
| F2  | Capture (Quick Jot)   | jot input, the proposal model, placement rules and history    |
| B1  | Onboarding            | auth, sphere creation, first-run permissions                  |
| B2  | Today                 | the daily feed, attention ranking, the Records landing page   |
| B3  | Work & Calendar       | endeavors, tasks, calendar, external sync                     |
| B4  | Structure & Ownership | reporting links, ownership records                            |
| B5  | Assets & Evidence     | asset records, valuations, claims, movement history           |
| B6  | Money                 | cash entries, liabilities, the runway calculation             |
| B7  | Business Plan         | plan sections, coverage, gap questions, export                |
| B8  | System & Trust        | connections, AI permissions, help, legal                      |

## Five rules that are load-bearing

1. **Colour answers "what is this screen asking of you", never "which
   section is this".** Graphite is default and should be about two thirds
   of the app; that restraint is what makes the rest legible. Cool blue =
   arranging, reversible. Warm clay = committing something of value.
   Teal = an AI moment, with no decorative exceptions. Rust = attention
   required, never a section colour. Tokens live in
   `packages/config/tokens.css` as `--tone-*`.

2. **Context is never carried by colour alone.** Three redundant channels:
   a muted hue, a swatch shape, and the name in permanent mono caps. It
   claims the top band of every screen plus the leading slot in the app
   bar. A branch may read the active context and may never read another
   branch's context.

3. **Capture must not import a feature branch.** It emits a typed
   placement intent — kind, payload, confidence, context — and each
   branch registers a handler for the kinds it accepts. If Capture ever
   imports Work or Money directly, the tree is gone. Write that contract
   before any branch is coded.

4. **AI never writes without approval.** Nothing is created until the user
   approves it, undo is stated with a duration, and a wrong guess costs
   one tap rather than a repeat performance. Zero confidence produces an
   unfiled note in the user's own words — never an invented record.

5. **Structure & Ownership cannot be built before Directory.** It has no
   records of its own; it is a graph over Directory records. The full
   dependency ledger is in the v3 map.

## Scale

Wireframes are drawn 310px wide for a 390pt phone — 0.795 px per point —
so a wireframe value scaled by ~1.258 gives the real one. At that scale
rows are 45pt, buttons 45pt and the nav 58pt, all above the 44pt minimum;
chips are 30pt, which is under it, so **chips are labels, not controls**
everywhere they appear.

## Accessibility, where the interaction model creates the problem

- **Placement review (Q4)** — each proposal is one accessibility element
  with a composed label ("Proposal 1 of 4. … Confidence 97 percent.
  Included. Double-tap to exclude."), not four bare checkboxes. The bulk
  button's label counts what is actually selected. Confidence is a number
  or a word, never colour.
- **Ownership (R4/R5)** — stats announce label first, swapped from the
  visual order: "Role: controlling interest". The List tab is the
  canonical representation of the ownership graph, not a fallback, and
  the toggle persists per user.
- **Amount entry (M2)** — the custom keypad must keep the system keyboard
  reachable, or voice and switch control users lose dictation. Smart-line
  tokens are individually focusable buttons.
- **Contrast** — tinted panels always use full ink. Mid grey on a 10%
  accent tint lands near or under 4.5:1.

## Three rules that are easy to break by accident

- **Movement is not ownership.** Custody changes in B5 never change title,
  and the movement screen says so at the decision point.
- **Deletion gets two screens.** G15 explains scope and offers an export;
  G16 requires the account name typed before the destructive button arms.
  No default focus lands on Delete.
- **Business Plan borrows Capture's recorder.** It must not own one —
  that would be the first crack in the branch boundary.

## What is built

Every destination on the map, as its own route. Shell in
`src/lib/shell/`, components in `src/lib/kit/`.

**State variants are states, not routes.** The map shows four screens in
three states each (Quick Jot, Endeavors, Assets, Cash flow). Those are
selected with `?state=` — `/records/assets?state=empty`,
`/records/money?state=duplicate`, `/jot?state=offline` — because in a
running app they come from data. Do not turn them into routes. Where the
data now exists the state is simply read from it: assets needing
attention are a filter on the asset list (`?show=attention`), worked out
from the records rather than staged.

The kit is app-local because the tone language is proven on Chief only —
if a second app adopts it, move the folder to `packages/ui` rather than
copying it.

All content is placeholder taken from the map, including its dashed `$—`
figures: the map deliberately does not invent numbers, and neither does
this build. There is no backend yet — PocketBase is the near-term target
on the existing VPS, with Supabase once the box has the RAM for it.

## Home: two states

Home switches between **Jot** and **Dash**. Jot is the default, because
the cost of a thought being lost is higher than the cost of a number
going unseen. Dash is the read-only view of where things stand.

Inside Jot, only Throw It is open. Sphere It and Task It are work already
captured and can wait — opening all three puts a queue in front of
someone whose only intent was to get a sentence out of their head.

Three sections, three light separations, each carrying the tone its work
belongs to: capture is neutral, placing is arranging, tasking is
committing.

## The jot lifecycle

A jot has three stages, and the Jot state is those three stages rather
than a dashboard about them:

1. **Throw it** — the text field, voice or typed. A jot does not start in a
   sphere and is never blocked on choosing one. Throwing must cost nothing.
2. **Sphere it** — select a sphere, then any people or organizations, then
   any assets. Everything is optional. A jot is in **All life** until told
   otherwise: that is every sphere at once _and_ the absence of one, which
   is why there is no separate "unsphered" state in the app. The default
   is a real answer, not a blank waiting to be filled.
3. **Task it** — offered as a choice at the end of Sphere It, never as a
   step. Most jots record something rather than commit to it, and promoting
   every jot to a task is how a capture tool becomes a backlog.

An **endeavor** is a group of tasks. It is never required.

## Sphere and organization

**Sphere** replaced **Workspace** throughout. A sphere is an _area of a
life_ — Family, Business, Church, Career, Hobby, Children, Spouse. It is
the lens a Chief is looking through, and it is the app's subject rather
than one of its fields: spheres overlap, compete for the same hours, and
run up against each other, and choosing between them is the Chief's
central dilemma.

Spheres are personal. The seven in `spheres.js` are a prototype
stand-in, not a set the app decides; real spheres will be records a
Chief writes.

An **organization** is a person or a grouping of people, and need not
include the Chief at all. Inside the Spouse sphere there might be an
organization called "Wife" and another called "Chief and Wife". It is a
separate axis from the sphere, and it is parked for now — when it is
picked up it brings control, ownership and interests with it, tied back
to actions, people and assets.

The collection once called `workspaces` holds organizations, so it is
named `organizations`. There is no spheres collection yet, deliberately:
the concept is still being worked out, and a schema would freeze it.

## Organizations

From the Build Lexicon, November 2026 Organization-Centric revision.

**Organization is the single actor class.** Every person is an
Organization of type **C**; the Directory's People lens is that class
filtered to the individuals, not a different kind of record. The
Organizations lens shows the bodies those individuals are tied together
by. One switch, two lenses, one underlying class.

**Organization Type** is the canonical C–CN vocabulary in
`orgtypes.js` — C, B, CO, CC, DO, DB, P, DN, CN. It is not a Sphere: a
type says what kind of body is acting, a Sphere says which area of
living it acts in, and one Organization of any type may work across
several Spheres. The badge marks **C** differently because C is the only
type capable of control, being the only type that is itself an
intelligence; every other type governs how Cs are tied together.

**The two capacities are never one list.** Asset Rights say what an
Organization may hold and claim. Action Stewardship says what it is
answerable for having done. An Organization can steward actions over
Assets it holds no right in — a manager, a trustee, a committee — and
hold rights in Assets it never touches. Collapsing them would lose the
distinction that makes a manager not an owner, which is exactly the
error the Lexicon flags in the historical `ownerType` field.

**Perspective is derived, never stored.** Me, You, Us and Them are
contextual roles. An Organization whose membership includes Me reads as
Us; one that does not reads as Them. Nothing on the record says so.

**Resolution is a state, not a species.** A proposed Organization —
AME — is a real record that can accumulate evidence and resolve later
without its history being rewritten.

## The Asset tab

What sits behind **Asset** in the menu bar: branches B4 (ownership), B5
and B6 as one place, laid out from the asset lexicon, the Layer 2 screen
maps and the Layer 4 ERD.

**Three numbers, four doors.** The hub leads with Asset value,
Liabilities and Net worth, because net worth is a number Chief always
knows — assets minus liabilities, worked out from the records. There is
no All · Personal · Work filter: spheres replaced that split.

| Door      | Route                | What is behind it                                                          |
| --------- | -------------------- | -------------------------------------------------------------------------- |
| Assets    | `/records/assets`    | categories → list (`in/[category]`) → asset → attributes, claims, timeline |
| Money     | `/records/money`     | two lenses: cash flow here, liabilities at `money/liabilities`             |
| Ownership | `/records/ownership` | Owns · Owned by, one link (`[id]`), add a link (`add`), the tree (`tree`)  |
| Activity  | `/records/activity`  | one feed of asset events; an asset's timeline is the same list narrowed    |

**One book.** Every figure comes from `src/lib/assets.js`: the fixtures
and the arithmetic over them, shaped like the ERD (`asset_categories`,
`assets`, `ownerships`, `liabilities`; cash and events follow the
lexicon's field lists, having no confirmed table yet). No screen keeps a
number of its own, so the hub, the lists and the detail pages cannot
disagree. Swapping fixtures for live rows is a change of source in that
one file.

**Rules that live in the book, not in the screens.**

- Everything is an asset if it is not a person. A person is never an
  asset; the contract that binds one is.
- Every asset carries a value. One without is saved and flagged, not
  refused.
- An asset can be owned by an asset, but every chain has to end at an
  organization. One that does not is named at the top of Ownership and
  under the tree.
- For an asset link, current value is the asset's value times the share.
  It is derived, never stored on the link, so the two cannot disagree.
- Organization-to-organization links are read from `ORGS.controlledBy`,
  the same fact the Directory shows, so the two views cannot drift.
- Owner and Manager stay two words. A manager answers for a thing
  without holding any of it.
- A liability is debt against a specific asset, owed to a specific
  organization. One tied to neither is flagged.
- Net cash is Cash In minus Actual Expense. It is not profit. The other
  five cash types are expected, not moved: listed, never counted.
- Verified, Insured and Stored are read off the claims on file, never
  set by hand.

**Wording.** Owner, Owned by, Liability and Claims are kept exactly. The
friendlier front-of-house words in the language map are not used.

**Not behind Asset.** Reporting structure is about people, so it lives
under Organizations (`/organizations/structure`), reached from an
organization's profile. Organizations themselves stay in the Directory;
ownership links out to them rather than keeping a second list.

**Still a prototype.** The records are design placeholders and say so on
screen. Forms lay out the right fields and step through; they do not
save yet. Dates in the fixtures are stored as ages, so the book reads as
current whenever it is opened.
