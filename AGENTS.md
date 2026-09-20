# Documentation project instructions

This is the AgriHub360 documentation site, built on Mintlify. Pages are MDX files with YAML frontmatter and the configuration lives in `docs.json`.

## Structure

- Four tabs: Guides, Devices, API Reference, Models. Guides opens on Start Here (the overview, 101, Your First Week, Words on the Screen), then How Do I, then a group per feature domain, then the pages for inspectors.
- How Do I is grouped by the app's tabs (Today, Map, Records, Compliance, More, Sensors, For advisors), one task per page under `how-do-i/<tab>/`. A task page is: a title with a verb first, a one-line description, an optional **Before you start** line, `<Steps>` of three to five, a `<Frame>` per screen, "What You See Next", an "If It Does Not" table (You see, It means, Do), and a Related line. Every feature that ships gets a task page before, or with, its feature page.
- A feature page opens with a "How to:" line linking its task pages, when it has any.
- Feature pages carry "What It Tells You" and "How It Works". Compliance pages carry "The Law, In Plain Words", "Where It Applies" and "What AgriHub360 Keeps".
- Model pages follow "here's the science, here's how it's applied": The Science, How It's Applied, External Models, Validation, Limits, References. At most one diagram per page, and none where a code block already states the logic.
- Devices are the **AgriHub360 Sensor** and the **AgriHub360 Hub**. Your own hardware is a **sensor** that posts readings (Connect Your Sensor) or a **device** that acts on webhook events (Connect Your Device).
- The API Reference documents the Device API. Endpoint pages are generated from `api-reference/device-api.yaml`; live updates from `api-reference/messagebus.yaml`.

## References

- Every reference carries a URL or DOI that was actually retrieved.
- References sit in a `<div className="refs">` as a numbered list on every tab: `Author or publisher, year. [Title](url). Venue.` The title is the link.

## Images

- Illustrations are cartoon SVGs in `images/guides/`, drawn in the style of `images/sensor.svg`: 800x450, the same palette and outline. A page gets one only where a picture adds something.
- The How Do I pages are the exception: they show the real screen, a 540 wide JPEG of the app on the demo farm at phone size, in `images/screens/`. Cartoons explain, screenshots instruct. Never a real farm's records.

## The language floor

- `node scripts/lint-guides.mjs` runs before a commit. It fails on an em-dash anywhere, on a How Do I page missing one of its parts, and on a sentence over thirty words on a How Do I or Start Here page. It warns over twenty; aim under.
- On a task page, a word the screen does not show is either on Words on the Screen or not on the page. Name a button as it reads on the screen, in bold, once per step. One idea a step; "and then" is two steps.
- Screens for task pages come from `scratchpad/shoot-guides.mjs` against the demo farms (Whitaker Farm, Cwm Elan Farm), 540 wide. Re-run it after a release so the pictures match the build. Never a real farm's records.

## Voice

Model the writing on Polymarket's developer docs.

- Plain declarative sentences. Contractions are fine. Second person for instructions.
- Describe each feature, device and model by what it does, in the present tense.
- Bold a term the first time it is defined. Tables for parameters and definitions. One Note or Warning per page at most, for the thing that breaks if ignored.
- Titles are Title Case noun phrases. Groups name a domain (Crop Development, Compliance & Records), not a job.
- No aphorisms, no justification, no meta commentary. State the fact, then the next fact.
- British English. No em-dashes: use commas or full stops.
- Keep example hostnames such as `devices.agrihub360.example` in code samples.

## Terminology

- farm, field, zone, planting, record, plan, check, pack, device, reading
- modelled value and measured value: every number carries its source
