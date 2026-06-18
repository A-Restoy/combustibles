# Combustible · Albolote

Consulta en tiempo real los precios de gasolina y diésel de las tres gasolineras low cost de Albolote (Granada): **Tiburonoil**, **Juncadiesel** y **Minioil**.

Los datos provienen de la API oficial del [MINETUR](https://geoportalgasolineras.es/) (Ministerio de Transporte de España).

**App web:** [combustible-tau.vercel.app](https://combustible-tau.vercel.app)

---

## Uso

### App web (Vercel)

Abre [combustible-tau.vercel.app](https://combustible-tau.vercel.app) en el navegador. Los precios se cargan automáticamente y se cachean durante 60 minutos en el edge de Vercel para que la carga sea instantánea.

**Añadir al escritorio del móvil:**
- **Android (Chrome):** menú `⋮` → *Añadir a pantalla de inicio*
- **iPhone (Safari):** botón compartir → *Añadir a pantalla de inicio*

### CLI

```bash
node tiburon-precios.js
```

Requiere Node.js 18+ (usa `fetch` nativo).

### En local con navegador

```bash
node servidor.js
```

Arranca un proxy en `localhost:3000` y abre el navegador automáticamente. Usar `Ctrl+C` para cerrar.

---

## Estructura

```
├── api/
│   └── precios.js          # Función serverless de Vercel (proxy MINETUR)
├── tiburon-precios.html    # Frontend (app web)
├── tiburon-precios.js      # CLI
├── servidor.js             # Proxy local para desarrollo sin Vercel
├── icon.svg                # Icono PWA (surtidor de gasolina)
├── manifest.json           # Manifiesto PWA
└── vercel.json             # Configuración de rutas en Vercel
```

## Por qué hace falta un proxy

La API del MINETUR devuelve todas las gasolineras de España (~12 MB) y no incluye cabeceras CORS, por lo que no se puede llamar directamente desde el navegador. El proxy (`api/precios.js` en Vercel, o `servidor.js` en local) descarga ese JSON, filtra las 3 gasolineras objetivo por su ID (`IDEESS`) y devuelve solo esos datos.

| Entorno | Proxy usado |
|---|---|
| Vercel | `api/precios.js` (serverless, caché 60 min en edge) |
| Local (`node servidor.js`) | `servidor.js` en `localhost:3000` |
| Abrir HTML como archivo | Requiere tener `servidor.js` corriendo |

## Gasolineras monitorizadas

| Nombre | IDEESS | Dirección |
|---|---|---|
| Low Cost Tiburonoil | 12671 | Calle Loja, S/N |
| Juncadiesel | 12750 | Calle Baza, 328 |
| Minioil Albolote | 11079 | Calle Motril, Parcela 243 |

Para añadir una gasolinera nueva: busca su `IDEESS` en la [app de gasolineras del MINETUR](https://geoportalgasolineras.es/) y añádelo en `ESTACIONES` (en `tiburon-precios.js` y `tiburon-precios.html`) y en `IDEESS_OBJETIVO` (en `api/precios.js` y `servidor.js`).

---

© Antonio Restoy 2026
