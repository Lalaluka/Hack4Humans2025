#!/usr/bin/env node

/**
 * CLI: EPREL JSON -> HTML Report
 * Aufruf:
 *   node eprel-report.js data.json
 *
 * data.json enthält ein EPREL-konformes JSON (wie aus deinem Schema).
 */

import fs from "fs";
import path from "path";
import { exec } from "child_process";

// --- Hilfsfunktionen für Ampel ---
function rating(value, thresholds) {
    if (value === null || value === undefined) return "❓";
    if (typeof thresholds === "function") return thresholds(value);

    const [bad, medium] = thresholds;
    if (value < bad) return "🔴";
    if (value < medium) return "🟡";
    return "🟢";
}

// --- Lade Datei ---
const file = process.argv[2];
if (!file) {
    console.error("❌ Bitte JSON-Datei angeben! Beispiel: node eprel-report.js data.json");
    process.exit(1);
}

const raw = fs.readFileSync(file, "utf-8");
const data = JSON.parse(raw);

// --- HTML bauen ---
function buildHTML(product) {
    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>EPREL Report – ${product.product.model}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.5; }
    h1 { color: #e20074; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    th { background: #f2f2f2; text-align: left; }
    .emoji { font-size: 1.2em; }
  </style>
</head>
<body>
  <h1>📱 EPREL Produktbericht</h1>
  <h2>${product.product.brand} – ${product.product.model}</h2>
  <p><b>Gerätetyp:</b> ${product.product.deviceType}, 
     <b>OS:</b> ${product.product.operatingSystem}</p>

  <h3>⚡ Energie & Akku</h3>
  <table>
    <tr><th>Eigenschaft</th><th>Wert</th><th>Bewertung</th></tr>
    <tr><td>Energieklasse</td><td>${product.energy.efficiencyClass}</td><td class="emoji">${rating(product.energy.efficiencyClass, () => product.energy.efficiencyClass <= "C" ? "🟡" : "🟢")}</td></tr>
    <tr><td>Akku-Laufzeit/Zyklus (h)</td><td>${product.energy.battery.lifetimePerCycle_h}</td><td class="emoji">${rating(product.energy.battery.lifetimePerCycle_h, [20, 40])}</td></tr>
    <tr><td>Akku-Zyklen</td><td>${product.energy.battery.lifetimeCycles}</td><td class="emoji">${rating(product.energy.battery.lifetimeCycles, [500, 1000])}</td></tr>
    <tr><td>Batteriekapazität</td><td>${product.energy.battery.capacity_mAh} mAh</td><td>—</td></tr>
    <tr><td>Ladeleistung</td><td>${product.energy.requiredChargerPower_W} W</td><td class="emoji">${rating(product.energy.requiredChargerPower_W, [60, 80])}</td></tr>
    <tr><td>Anschluss</td><td>${product.energy.chargerConnector}</td><td>${product.energy.chargerConnector === "USB-C" ? "🟢" : "🔴"}</td></tr>
  </table>

  <h3>🛡️ Zuverlässigkeit</h3>
  <table>
    <tr><th>Eigenschaft</th><th>Wert</th><th>Bewertung</th></tr>
    <tr><td>Stürze ohne Defekt</td><td>${product.reliability.dropTest.freeFall_noDamage}</td><td class="emoji">${rating(product.reliability.dropTest.freeFall_noDamage, [100, 300])}</td></tr>
    <tr><td>Sturzklasse</td><td>${product.reliability.dropTest.class}</td><td>${product.reliability.dropTest.class === "A" ? "🟢" : "🟡"}</td></tr>
    <tr><td>IP-Schutz</td><td>${product.reliability.ingressProtection}</td><td>${product.reliability.ingressProtection === "IP68" ? "🟢" : "🟡"}</td></tr>
    <tr><td>Kratzfestigkeit (Mohs)</td><td>${product.reliability.screenScratchResistance_Mohs}</td><td class="emoji">${rating(product.reliability.screenScratchResistance_Mohs, [6, 7])}</td></tr>
  </table>

  <h3>🔧 Reparierbarkeit</h3>
  <p>Klasse: ${product.repairability.class}, Index: ${product.repairability.index}</p>
  <ul>
    <li>Updates (Jahre): ${product.repairability.guaranteedUpdates_years}</li>
    <li>Zerlegungstiefe: ${product.repairability.subScores.disassemblyDepth}</li>
    <li>Ersatzteile: ${product.repairability.subScores.spareParts}</li>
  </ul>

  <h3>📜 Garantie</h3>
  <p>${product.warranty.duration_months} Monate</p>

  <h3>🌍 Markt</h3>
  <p>Seit: ${product.market.availableSince}, EPREL: <a href="${product.market.eprelLink}" target="_blank">${product.market.eprelId}</a></p>

  <h3>🏢 Lieferant</h3>
  <p>${product.supplier.name} (${product.supplier.role}) – <a href="https://${product.supplier.website}" target="_blank">${product.supplier.website}</a></p>
  <p>Kontakt: ${product.supplier.customerService.email}, ${product.supplier.customerService.phone}</p>

</body>
</html>`;
}

// --- HTML-Datei schreiben ---
const outFile = path.join(process.cwd(), "eprel-report.html");
fs.writeFileSync(outFile, buildHTML(data), "utf-8");

console.log("✅ Report erstellt:", outFile);

// --- im Browser öffnen ---
switch (process.platform) {
    case "darwin":
        exec(`open "${outFile}"`);
        break;
    case "win32":
        exec(`start "" "${outFile}"`);
        break;
    default:
        exec(`xdg-open "${outFile}"`);
}
