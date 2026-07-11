#!/usr/bin/env bash
# structure.sh — V1: Prüft dass alle Web-Assets in website/ liegen und Root frei ist
#
# Aufruf: bash scripts/verify/structure.sh
# Exit 0 = alles OK, Exit 1 = Fehler

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEBSITE="$REPO_ROOT/website"
ERRORS=0

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✅${NC} $1"; }
fail() { echo -e "  ${RED}❌${NC} $1"; ERRORS=$((ERRORS + 1)); }
info() { echo -e "  ${YELLOW}ℹ️${NC}  $1"; }

echo ""
echo "=== V1: Struktur-Check ==="
echo ""

# 1. website/ existiert
if [ -d "$WEBSITE" ]; then
  pass "website/ vorhanden"
else
  fail "website/ FEHLT"
  echo -e "${RED}ABBRUCH: website/ nicht gefunden.${NC}"
  exit 1
fi

# 2. Erwartete HTML-Dateien in website/
HTML_EXPECTED=(
  "index.html" "404.html" "changelog.html" "datenschutz.html"
  "impressum.html" "maintenance.html" "roadmap.html" "thanks.html"
  "googlebd7900ffe59aa1d6.html"
)
echo "--- HTML-Dateien in website/ ---"
for f in "${HTML_EXPECTED[@]}"; do
  if [ -f "$WEBSITE/$f" ]; then
    pass "$f"
  else
    fail "$f FEHLT in website/"
  fi
done

# 3. Erwartete Asset-Ordner in website/
echo ""
echo "--- Asset-Ordner in website/ ---"
DIRS_EXPECTED=("css" "js" "images" "fonts" "lang" "projects" "thoughts" "docs")
for d in "${DIRS_EXPECTED[@]}"; do
  if [ -d "$WEBSITE/$d" ]; then
    pass "$d/"
  else
    fail "$d/ FEHLT in website/"
  fi
done

# 4. Erwartete Web-Root-Dateien in website/
echo ""
echo "--- Web-Root-Dateien in website/ ---"
ROOT_FILES=("sw.js" "manifest.json" "robots.txt" "sitemap.xml" "media-manifest.json" "CNAME" ".nojekyll")
for f in "${ROOT_FILES[@]}"; do
  if [ -f "$WEBSITE/$f" ]; then
    pass "$f"
  else
    fail "$f FEHLT in website/"
  fi
done

# 5. Root frei von Web-Content (kein HTML, keine Asset-Ordner)
echo ""
echo "--- Root frei von Web-Content? ---"
SHOULD_NOT_EXIST_ROOT=(
  "index.html" "404.html" "changelog.html" "datenschutz.html"
  "impressum.html" "maintenance.html" "roadmap.html" "thanks.html"
  "googlebd7900ffe59aa1d6.html"
  "css" "js" "images" "fonts" "lang" "projects" "thoughts"
  "sw.js" "manifest.json" "robots.txt" "sitemap.xml" "media-manifest.json"
)
ALL_ROOT_CLEAN=true
for entry in "${SHOULD_NOT_EXIST_ROOT[@]}"; do
  if [ -e "$REPO_ROOT/$entry" ]; then
    fail "$entry noch im Root (sollte in website/ sein)"
    ALL_ROOT_CLEAN=false
  fi
done
if $ALL_ROOT_CLEAN; then
  pass "Root enthält keinen Web-Content mehr"
fi

# 6. CNAME nicht im Root (Custom Domain darf nur in website/ liegen)
echo ""
echo "--- CNAME-Prüfung ---"
if [ -f "$REPO_ROOT/CNAME" ] && [ -f "$WEBSITE/CNAME" ]; then
  fail "CNAME existiert sowohl in Root als auch in website/ — doppelt!"
elif [ -f "$WEBSITE/CNAME" ]; then
  pass "CNAME nur in website/"
elif [ -f "$REPO_ROOT/CNAME" ]; then
  fail "CNAME noch im Root (nicht in website/)"
else
  info "CNAME nicht vorhanden (optional)"
fi

# 7. Bot-Dateien unberührt
echo ""
echo "--- Bot-Dateien unberührt? ---"
BOT_FILES=("api" "vercel.json" "requirements.txt")
for f in "${BOT_FILES[@]}"; do
  if [ -e "$REPO_ROOT/$f" ]; then
    pass "$f im Root (korrekt)"
  else
    fail "$f FEHLT im Root (wurde versehentlich verschoben?)"
  fi
done

# yusef_brain.md zog seit V5 (Verkabelungs-Matrix, release-go-live.md) nach api/ um —
# eigener Check statt im Root erwartet.
if [ -f "$REPO_ROOT/api/yusef_brain.md" ]; then
  pass "api/yusef_brain.md vorhanden (korrekt, seit V5 nicht mehr im Root)"
else
  fail "api/yusef_brain.md FEHLT"
fi

# 8. Config-Dateien im Root
echo ""
echo "--- Config-Dateien im Root ---"
CONFIG_FILES=("package.json" "tsconfig.json" "package-lock.json")
for f in "${CONFIG_FILES[@]}"; do
  if [ -f "$REPO_ROOT/$f" ]; then
    pass "$f"
  else
    fail "$f FEHLT im Root"
  fi
done

# 9. Unterordner in projects/ und thoughts/
echo ""
echo "--- Unterseiten-Struktur ---"
if [ -f "$WEBSITE/projects/_template.html" ]; then
  pass "projects/_template.html"
else
  fail "projects/_template.html FEHLT"
fi
if [ -f "$WEBSITE/thoughts/_post-template.html" ]; then
  pass "thoughts/_post-template.html"
else
  fail "thoughts/_post-template.html FEHLT"
fi

# --- Ergebnis ---
echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ V1 GRÜN — Struktur korrekt${NC}"
else
  echo -e "${RED}❌ V1 ROT — $ERRORS Fehler gefunden${NC}"
fi
echo ""
exit $ERRORS
