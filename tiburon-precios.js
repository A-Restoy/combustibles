// Precios gasolineras Albolote - Tiburonoil y Juncadiesel
// Uso: node tiburon-precios.js
// No requiere dependencias externas (usa fetch nativo de Node 18+)

const URL_MINETUR =
  "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

const ESTACIONES = [
  { ideess: "12671", nombre: "LOW COST TIBURONOIL" },
  { ideess: "12750", nombre: "JUNCADIESEL" },
  { ideess: "11079", nombre: "MINIOIL" },
];

const COMBUSTIBLES = {
  "Precio Gasolina 95 E5": "Gasolina 95",
  "Precio Gasoleo A":      "Gasóleo A",
};

function mostrarEstacion(est, fecha) {
  console.log("=".repeat(45));
  console.log(`  ${est["Rótulo"]}`);
  console.log(`  ${est["Dirección"]}, ${est["Municipio"]}`);
  console.log(`  ID MINETUR: ${est["IDEESS"]}  |  Horario: ${est["Horario"]}`);
  console.log("=".repeat(45));

  let hayPrecios = false;
  for (const [campo, nombre] of Object.entries(COMBUSTIBLES)) {
    const raw = est[campo];
    if (!raw || raw.trim() === "") continue;
    const precio = parseFloat(raw.replace(",", "."));
    if (isNaN(precio)) continue;
    hayPrecios = true;
    console.log(`  ${nombre.padEnd(15)} ${precio.toFixed(3)} €/l`);
  }

  if (!hayPrecios) console.log("  (sin precios reportados)");

  console.log("-".repeat(45));
  console.log(`  Actualizado: ${fecha}`);
  console.log("=".repeat(45));
  console.log();
}

async function getPreciosAlbolote() {
  console.log("Consultando API del MINETUR...\n");

  const res = await fetch(URL_MINETUR, {
    headers: { "Accept": "application/json" }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const data = await res.json();
  const lista = data.ListaEESSPrecio ?? [];
  const fechaActualizacion = data.Fecha ?? "";

  for (const { ideess, nombre } of ESTACIONES) {
    const est = lista.find(e => e["IDEESS"] === ideess)
      ?? lista.find(e => e["Rótulo"]?.toUpperCase().includes(nombre));

    if (est) {
      mostrarEstacion(est, fechaActualizacion);
    } else {
      console.error(`No se encontró la estación ${nombre} (IDEESS ${ideess}).\n`);
    }
  }
}

getPreciosAlbolote().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
