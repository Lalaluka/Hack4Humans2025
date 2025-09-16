# Prompt to generate a JSON file for a product data sheet

Bitte lese die angehängte EPREL-Produktdatenblatt-PDF vollständig ein und baue daraus ein JSON nach folgendem Schema.
Wichtig:
- Keine Werte erfinden oder schätzen, nur übernehmen was in der PDF steht.
- Wenn ein Wert fehlt oder „n.a.“ ist, dann bitte als null eintragen.
- Alle Zahlen in numerischer Form (z. B. 4900 statt "4.900").
- URLs bitte als String übernehmen.
- Boolean-Werte („Ja“/„Nein“) bitte in true/false umwandeln.
- Datumsangaben bitte im Format YYYY-MM-DD ausgeben.

Das Ziel ist ein valides JSON-Objekt in folgender Struktur:

{
"product": {
"brand": "String",
"model": "String",
"deviceType": "String",
"operatingSystem": "String"
},
"energy": {
"efficiencyClass": "String",
"userReplaceableBattery": "Boolean",
"battery": {
"lifetimePerCycle_h": "Number",
"lifetimeCycles": "Number",
"capacity_mAh": "Number"
},
"shippedWithProtectiveCover": "Boolean",
"requiredChargerPower_W": "Number",
"chargerConnector": "String"
},
"reliability": {
"dropTest": {
"freeFall_noDamage": "Number",
"freeFall_extended_noDamage": "Number|null",
"class": "String"
},
"ingressProtection": "String",
"waterResistance_m": "Number|null",
"screenScratchResistance_Mohs": "Number"
},
"repairability": {
"guaranteedUpdates_years": "Number",
"class": "String",
"index": "Number",
"subScores": {
"disassemblyDepth": "Number",
"fasteners": "Number",
"tools": "Number",
"spareParts": "Number",
"softwareUpdates": "Number",
"repairInformation": "Number"
},
"links": {
"spareParts": "URL",
"repairInstructions": "URL",
"priceGuidelines": "URL"
}
},
"warranty": {
"duration_months": "Number"
},
"market": {
"availableSince": "String (YYYY-MM-DD)",
"eprelId": "Number",
"eprelLink": "URL"
},
"supplier": {
"name": "String",
"role": "String",
"website": "URL",
"customerService": {
"name": "String",
"website": "URL",
"email": "String",
"phone": "String",
"address": {
"street": "String",
"postalCode": "String",
"city": "String",
"country": "String"
}
}
}
}
Gib ausschließlich das JSON-Objekt als Antwort zurück, ohne zusätzliche Kommentare oder Erklärungen.
