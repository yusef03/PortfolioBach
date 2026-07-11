/**
 * Wartungsmodus-Monitor
 *
 * Diese Datei wird in ALLEN Portfolio-Seiten geladen (außer maintenance.html).
 * Sie pollt Supabase auf den Wartungsmodus-Status und leitet bei AN zur
 * maintenance.html um. Auf der maintenance.html selbst läuft dieses Skript
 * NICHT — dort übernimmt ein eigenes Inline-Skript (Auto-Return).
 *
 * Verhalten:
 *   - Auf localhost: standardmäßig deaktiviert (Entwickler-Schutz).
 *     Mit ?test=1 in der URL wird die Prüfung trotzdem ausgeführt.
 *   - Initial-Check sofort beim Laden + Polling alle POLL_INTERVAL_MS.
 *   - Polling pausiert wenn Tab im Hintergrund (Visibility API).
 *   - Fail-open: bei Netzwerk- oder Serverfehler bleibt die Seite normal.
 *   - Debug-Logs: ?debug=1 in der URL zeigt jeden Schritt in der Console.
 *
 * Datenquelle (Supabase): settings.maintenance_mode.value
 *   {
 *     enabled: boolean,    // Wartungsmodus AN/AUS
 *     emergency?: boolean, // Notfall-Variante (rot, dramatischer)
 *     message?: string     // Custom Nachricht (optional)
 *   }
 *
 * Konfiguration:
 *   Die KONFIG-Konstanten am Anfang der IIFE müssen auch in maintenance.html
 *   (inline script) übereinstimmen. Bei Änderung BEIDE anpassen.
 */

(function setupMaintenanceMonitor(): void {
  // === KONFIGURATION ===
  const SUPABASE_URL = "https://msfmugoazylvbqvyidlg.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_ehu6DwJKCxcW6FSrmxXs5A_ve9aO-mR";
  const MAINTENANCE_PAGE = "/maintenance.html";
  const POLL_INTERVAL_MS = 30_000;
  const FETCH_TIMEOUT_MS = 2_000;
  // === ENDE KONFIGURATION ===

  interface MaintenanceSettings {
    enabled: boolean;
    emergency?: boolean;
    message?: string;
  }

  const currentPath = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const forceCheck = params.get("test") === "1";
  const debug = params.get("debug") === "1";

  const isLocal =
    document.location.hostname === "127.0.0.1" ||
    document.location.hostname === "localhost";

  function log(...args: unknown[]): void {
    if (debug) console.log("[maintenance-check]", ...args);
  }

  log("Setup", {
    path: currentPath,
    hostname: document.location.hostname,
    isLocal,
    forceCheck,
    pollInterval: POLL_INTERVAL_MS,
  });

  // Auf localhost ohne ?test=1 → komplett deaktiviert (Entwickler-Schutz)
  if (isLocal && !forceCheck) {
    log("Skip: localhost ohne ?test=1");
    return;
  }

  // Auf maintenance.html selbst → eigenes Inline-Skript übernimmt
  if (currentPath.includes("maintenance.html")) {
    log("Skip: auf maintenance.html");
    return;
  }

  async function fetchSettings(): Promise<MaintenanceSettings | null> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/settings?key=eq.maintenance_mode&select=value`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);
      if (!res.ok) {
        log("HTTP not OK:", res.status);
        return null;
      }
      const data: Array<{ value: MaintenanceSettings }> = await res.json();
      log("Response:", data);
      return data?.[0]?.value ?? null;
    } catch (err) {
      log("Fetch failed (fail-open):", err);
      return null;
    }
  }

  async function check(): Promise<void> {
    const settings = await fetchSettings();
    if (!settings) {
      log("Kein Settings (fail-open) → Seite bleibt normal");
      return;
    }
    log("enabled =", settings.enabled, "| emergency =", settings.emergency);
    if (settings.enabled === true) {
      const preserveTest = forceCheck ? "?test=1" : "";
      const preserveDebug = debug ? (preserveTest ? "&debug=1" : "?debug=1") : "";
      const target = `${window.location.origin}${MAINTENANCE_PAGE}${preserveTest}${preserveDebug}`;
      log("Redirecting to", target);
      window.location.replace(target);
    }
  }

  let intervalId: number | null = null;

  function startPolling(): void {
    if (intervalId !== null) return;
    intervalId = window.setInterval(check, POLL_INTERVAL_MS);
    log("Polling gestartet — alle", POLL_INTERVAL_MS / 1000, "Sek");
  }

  function stopPolling(): void {
    if (intervalId === null) return;
    clearInterval(intervalId);
    intervalId = null;
    log("Polling pausiert (Tab im Hintergrund)");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPolling();
    } else {
      log("Tab sichtbar — Check + Polling fortsetzen");
      check();
      startPolling();
    }
  });

  // Initial-Check sofort
  check();

  // Polling starten falls Tab beim Laden sichtbar
  if (!document.hidden) {
    startPolling();
  }
})();
