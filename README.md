# AgriHub360 documentation

The product and developer documentation for AgriHub360, published with [Mintlify](https://mintlify.com) at docs.agrihub360.com.

## Layout

| Path | Holds |
|---|---|
| `docs.json` | Site configuration and the navigation for the four tabs |
| `index.mdx`, `agrihub360-101.mdx` | The Guides tab's Getting Started pages |
| `features/` | One overview page per Guides group and one page per feature under it |
| `how-do-i/`, `for-inspectors/` | One task per page with the real screen; the pack explained to the person who reads it |
| `devices/` | The AgriHub360 Sensor and Hub, Connect Your Sensor, Connect Your Device, Standards |
| `quickstart.mdx`, `api-reference/` | The API Reference tab: guides, the OpenAPI document (`device-api.yaml`) and the AsyncAPI document for live updates (`messagebus.yaml`) |
| `models/` | The Models tab: one page per model, science first, then how it is applied |
| `images/` | Cartoon SVG illustrations; `images/guides/` holds one per feature page |
| `style.css` | Justified body text, centred figures, the small reference lists |
| `AGENTS.md` | Writing rules for anyone, human or agent, editing the pages |

Endpoint pages are generated from `api-reference/device-api.yaml`. Keep it in step with the Device API's own OpenAPI document.

## Run it locally

```
npx mint dev --port 3333
```

Open `http://localhost:3333`. Run the command from the repository root, where `docs.json` is. Restart it after changing `device-api.yaml` or `messagebus.yaml`; page edits reload on their own.

To check links and navigation entries:

```
npx mint broken-links
```

## Branches

`main` publishes to docs.agrihub360.com. Work on a branch and merge when the site is ready to change.

## Writing rules

See `AGENTS.md`. The short version: describe the product by what it does, and write in plain British English with no em-dashes.
