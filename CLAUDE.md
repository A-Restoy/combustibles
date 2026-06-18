# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A gas station fuel price tracker for "Low Cost Tiburonoil" in Albolote, Granada (Spain). Pulls real-time prices from the official Spanish government MINETUR REST API and displays them in a card-based UI.

## Running the App

```bash
# CLI version (requires Node.js 18+ for native fetch)
node tiburon-precios.js

# Browser version: start the local proxy first, then open the HTML
node servidor.js          # starts proxy on http://localhost:3000
# open tiburon-precios.html in browser
```

No build step, no npm dependencies needed.

**Why a local proxy?** The MINETUR `EstacionesTerrestresPorMunicipio` endpoint returns 404 (broken server-side). The only working endpoint is `EstacionesTerrestres/` (all stations, ~12 MB), which exceeds the timeout of every free CORS proxy. `servidor.js` fetches that endpoint from Node.js, filters down to the 3 tracked stations, and re-serves the result on `localhost:3000` with CORS headers.

## Architecture

Three files:

- **`tiburon-precios.js`** — CLI: fetches all stations from MINETUR, filters to the tracked stations by IDEESS, prints prices.
- **`servidor.js`** — Local HTTP proxy (port 3000): fetches all stations from MINETUR and returns only the 3 tracked stations as filtered JSON with CORS headers. Required by the HTML page.
- **`tiburon-precios.html`** — Browser UI: calls `localhost:3000/precios`, renders a card per station with color-coded fuel price grid.

## Data Source

MINETUR REST API, filtered to municipality code 1036 (Albolote):
```
https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestresPorMunicipio/1036
```

Returns all stations in the municipality as JSON. The app filters by station name (`Rótulo` field containing "Tiburón" or "Tiburonoil") and maps raw MINETUR field names (e.g. `PrecioGasolina95E5`) to human-readable labels.

**Number format:** MINETUR returns prices with a comma decimal separator (`1,459`). Both files use `.replace(",", ".")` before `parseFloat`.

## Stations Tracked

| Name | IDEESS |
|---|---|
| Low Cost Tiburonoil | 12671 |
| Juncadiesel | 12750 |
| Minioil Albolote | 11079 |

To add a new station, find its IDEESS (shown by the fallback listing in `tiburon-precios.js` when a station isn't found), then add it to `ESTACIONES` in all three files and to `IDEESS_OBJETIVO` in `servidor.js`.

## Fuel Types Tracked

| MINETUR field | Label | Color |
|---|---|---|
| `Precio Gasolina 95 E5` | Gasolina 95 | Orange |
| `Precio Gasolina 98 E5` | Gasolina 98 | Orange |
| `Precio Gasoleo A` | Gasóleo A | Blue |
| `Precio Gasoleo Premium` | Gasóleo A+ | Blue |
| `Precio Gases licuados del petróleo` | GLP | Green |

## Error Handling

If the Tiburonoil station is not found by name, both files fall back to listing all available stations in the municipality to aid debugging.
