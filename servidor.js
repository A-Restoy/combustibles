// Proxy local para tiburon-precios.html
// Uso: node servidor.js   (abre el navegador automáticamente)

import http from "http";
import { exec } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const URL_MINETUR =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

const IDEESS_OBJETIVO = new Set(["12671", "12750", "11079"]);

const PORT = 3000;
const HTML = resolve(__dirname, "tiburon-precios.html");

http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.url !== "/precios") {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    return;
  }

  try {
    const apiRes = await fetch(URL_MINETUR, {
      headers: { Accept: "application/json" },
    });
    if (!apiRes.ok) throw new Error(`MINETUR HTTP ${apiRes.status}`);

    const data = await apiRes.json();
    const filtrado = {
      Fecha: data.Fecha,
      ListaEESSPrecio: (data.ListaEESSPrecio ?? []).filter(e =>
        IDEESS_OBJETIVO.has(e["IDEESS"])
      ),
    };

    res.writeHead(200);
    res.end(JSON.stringify(filtrado));
  } catch (err) {
    res.writeHead(502);
    res.end(JSON.stringify({ error: err.message }));
  }
}).listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
  console.log("Abriendo navegador...\n");
  console.log("Ctrl+C para cerrar.\n");

  const cmd = process.platform === "win32"
    ? `start "" "${HTML}"`
    : process.platform === "darwin"
      ? `open "${HTML}"`
      : `xdg-open "${HTML}"`;

  exec(cmd);
});
