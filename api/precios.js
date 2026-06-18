const IDEESS_OBJETIVO = new Set(["12671", "12750", "11079"]);

const URL_MINETUR =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    const apiRes = await fetch(URL_MINETUR, {
      headers: { Accept: "application/json" },
    });
    if (!apiRes.ok) throw new Error(`MINETUR HTTP ${apiRes.status}`);

    const data = await apiRes.json();
    // Caché en el edge de Vercel: sirve la respuesta guardada 10 min,
    // la renueva en segundo plano hasta 5 min más (stale-while-revalidate)
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=300");
    res.status(200).json({
      Fecha: data.Fecha,
      ListaEESSPrecio: (data.ListaEESSPrecio ?? []).filter(e =>
        IDEESS_OBJETIVO.has(e["IDEESS"])
      ),
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}
