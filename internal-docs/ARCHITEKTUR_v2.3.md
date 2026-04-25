# PortfolioBach Architektur Log (v2.3)

Dieses Dokument liegt absichtlich im Ordner `internal-docs/` und ist nur im Source-Code-Repository sichtbar. Es dient als private Entwickler-Dokumentation für zukünftige Entwicklungen.

## Stand der Technik (Letztes Upgrade)
- **TypeScript:** Alle JavaScript Logik wurde in TypeScript (`src/ts/`) umgeschrieben. Die Dateien sind Typen-sicher.
- **Build Step:** TypeScript muss lokal per `npx tsc` ausgeführt werden. Es gibt absichtlich kein ESBuild, Webpack, Vite oder Node-Modules Bloat. Der Compiler leitet den Output direkt nach `.js` ab.
- **HTML Referenz:** Die HTML Struktur lädt die `.js`-Dateien synchron/direkt, die TypeScript Quelldateien sind für den Browser unsichtbar.
- **Performance / Asset Loading:** Bilder außerhalb des Initial-Layers laden per `loading="lazy"`. 

## i18n System (Internationalisierung)
- Früher lag eine riesige `translations.js` vor, die alle Subseiten mit 60KB blockiert hat.
- Aktuell: JSON Chunking. Es gibt nun `lang/de.json` und `lang/en.json`.
- Im `script.ts` gibt es eine `async function applyTranslations(lang)`, die mittels `fetch(basePath + lang + '.json')` die Sprachdateien nur dann lädt, wenn der User den Knopf drückt. Dies hat die Dateigröße exakt um 50% gesenkt.

## Zukunftspläne (Roadmap & Offene Überlegungen)
1. **Das "Eigene Framework"**: Ein Long-Term Ziel ist es, den `Renderer` von `innerHTML` auf ein Proxy-basiertes, reaktives Event-System umzubauen (React nachbauen).
2. **Headless CMS**: Projekte in `projects-data.ts` sind aktuell statisch. Eine Rest-API zur Entkopplung wäre der finale Fullstack-Beweis.

## Notizen für Maintenance
- **node_modules**: Wegen des minimalen `tsc` Aufbaus kann `node_modules` sicher ignoriert werden oder gelöscht werden nach dem Build. 
- **EmailJS Key**: Der PublicKey ist client-seitig, zwingend in EmailJS-Dashboard die Domain (`yusefbach.de`) whitelisten, da ansonsten Missbrauch droht.
