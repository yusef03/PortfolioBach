#!/usr/bin/env bash
#
# check-maintenance-coverage.sh
#
# Prüft dass jede HTML-Seite im Portfolio entweder
#   (a) status.js eingebunden hat (Wartungsmodus-Schutz aktiv), oder
#   (b) explizit in EXEMPT aufgeführt ist (z.B. maintenance.html selbst).
#
# Aufruf:
#   ./scripts/check-maintenance-coverage.sh
#
# Exit-Codes:
#   0  → alles gut
#   1  → mindestens eine Seite ungeschützt
#
# Tipp:
#   In package.json einbinden als "check-maintenance" Script
#   ODER als pre-commit hook (.git/hooks/pre-commit)

set -euo pipefail

cd "$(dirname "$0")/.."

# Seiten die KEIN status.js brauchen (mit Begründung):
EXEMPT=(
  "maintenance.html"                  # ist selbst die Wartungsseite
  "googlebd7900ffe59aa1d6.html"       # Google Search Console verification (muss erreichbar bleiben)
)

# Pattern: alle .html Dateien in website/ + website/projects/ + website/thoughts/ (ohne node_modules etc.)
HTML_FILES=()
while IFS= read -r f; do HTML_FILES+=("$f"); done < <(
  find website -maxdepth 3 -type f -name "*.html" \
    -not -path "*/node_modules/*" \
    -not -path "*/.claude/*" \
    -not -path "*/internal-docs/*" \
    -not -path "*/.git/*" \
    | sort
)

MISSING=()
EXEMPT_OK=()
PROTECTED=()

is_exempt() {
  local base="$1"
  for e in "${EXEMPT[@]}"; do
    if [[ "$base" == "$e" ]]; then
      return 0
    fi
  done
  return 1
}

for f in "${HTML_FILES[@]}"; do
  base="$(basename "$f")"
  rel="${f#./}"

  # Templates ignorieren (z.B. _template.html ist nur Vorlage)
  if [[ "$base" == _* ]]; then
    continue
  fi

  if is_exempt "$base"; then
    EXEMPT_OK+=("$rel")
    continue
  fi

  if grep -q 'status\.js' "$f"; then
    PROTECTED+=("$rel")
  else
    MISSING+=("$rel")
  fi
done

echo ""
echo "=== Maintenance Coverage Check ==="
echo ""
echo "Geschützt (status.js eingebunden):"
for f in "${PROTECTED[@]}"; do echo "  ✅ $f"; done

if [[ ${#EXEMPT_OK[@]} -gt 0 ]]; then
  echo ""
  echo "Bewusst ausgenommen:"
  for f in "${EXEMPT_OK[@]}"; do echo "  ⚪ $f"; done
fi

if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo ""
  echo "❌ UNGESCHÜTZT — diese Seiten haben kein status.js:"
  for f in "${MISSING[@]}"; do echo "  ❌ $f"; done
  echo ""
  echo "Fix: <script src=\"js/status.js\"></script> (Root)"
  echo "     oder <script src=\"../js/status.js\"></script> (in projects/)"
  echo "     direkt nach <meta charset=\"UTF-8\"> einfügen."
  echo ""
  echo "ODER explizit ausnehmen indem du sie in scripts/check-maintenance-coverage.sh"
  echo "in der EXEMPT-Liste einträgst (mit Begründung)."
  exit 1
fi

echo ""
echo "✅ Alle Seiten korrekt konfiguriert."
exit 0
