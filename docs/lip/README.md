# LIP — design and spec reference

Source material for `apps/lip`. The implementation should track these, and
these should be updated in place rather than forked into new versions.

| File | What it is |
| --- | --- |
| `LIP_App_Concept.pdf` | Original concept: the two-axis spectrum, what LIP measures, the apply-up attribution model, boycott triggers, object model. |
| `LIP_Wireframes_v1.pdf` | 28-screen wireframe spec with per-screen states, components, and edge cases. |

## Still in the Claude project, not yet committed here

Three documents live in the AZBOLT Claude project and should be copied into
this folder when LIP development starts:

- `LIP Wireframes.html` — the **v4 unified design pass**, and the current
  authority on tokens, type, and mode treatments. Supersedes the design
  system sections of the other two.
- `LIP_Path_Forward.md` — component library, screen specs, global style
  guide, phased roadmap, ERD and data-flow map.
- `LIP_Platform_Analysis.md` — executive review of strengths and friction
  points.

## Where the v4 tokens already live in code

`packages/config/tokens.css` carries the shared subset of the v4 system:
ink, paper, line, muted, the type scale, and the 44px tap minimum. LIP's
own additions — the instrument surface `#1c2b2e`, the reserved burnt-orange
`#c1541c` for the JOIN button, the verify tint `#f5f4ee` — belong in
`apps/lip/src/app.css`, not in the shared package. They are LIP-specific by
design: the reserved action color means nothing in Tithe or Peace.

## Carry-forward rules the code must not quietly break

- Three outputs per object (Expressed Position, Support Footprint, Boycott
  Pressure) are never collapsed into one score. Only Expressed Position is
  plotted on the quadrant.
- Opposing support weights are never averaged into Center.
- The 5x5 matrix is the Explore "density" view only, never Home.
- Measure / Verify / Act are differentiated structurally (plain card /
  left-rule + tint / full inversion), not by hue.
- Coverage below 40% renders Provisional; contested measurements render as
  a range, never a point.
