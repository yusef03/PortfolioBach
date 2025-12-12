/* Dynamic Project Renderer v2.1 (Mobile Fix) */

document.addEventListener("DOMContentLoaded", () => {
  initProjectRender();
});

function initProjectRender() {
  const heroContainer = document.getElementById("hero-project-container");
  const archiveContainer = document.getElementById("archive-grid-container");

  if (typeof projectsData === "undefined") return;

  // 1. Filter Data
  const heroItem = projectsData.find((p) => p.id === HERO_PROJECT_ID);
  const archiveItems = projectsData.filter((p) => p.id !== HERO_PROJECT_ID);

  // 2. Render Index Page (Hero)
  if (heroContainer && heroItem) {
    heroContainer.innerHTML = renderHeroTemplate(heroItem);
  }

  // 3. Render Archive Page (Grid)
  if (archiveContainer) {
    let gridHTML = "";

    // ERKENNUNG: Sind wir in einem Unterordner?
    // Wir prüfen, ob wir NICHT auf index.html sind (bzw. ob wir im projects Ordner sind)
    const isSubFolder = window.location.pathname.includes("/projects/");

    archiveItems.forEach((item) => {
      let adjustedItem = { ...item };

      // FIX: Nur "../" hinzufügen, wenn wir WIRKLICH im Unterordner sind
      if (
        isSubFolder &&
        !adjustedItem.image.startsWith("http") &&
        !adjustedItem.image.startsWith("../")
      ) {
        adjustedItem.image = "../" + adjustedItem.image;
      }

      gridHTML += renderArchiveTemplate(adjustedItem);
    });

    gridHTML += renderGithubCard();
    archiveContainer.innerHTML = gridHTML;
  }
}

/* --- Templates --- */

function renderHeroTemplate(p) {
  const badges = p.badges
    .map((b) => `<span class="tech-badge">${b}</span>`)
    .join("");
  // Feature Liste rendering fix
  const features = p.features
    ? p.features.map((k) => `<li data-i18n="${k}"></li>`).join("")
    : "";

  return `
    <div class="project-info reveal">
        <div class="hero-project-layout">
            <div class="hero-image-wrapper">
                 <img src="${p.image}" alt="Project Hero" class="hero-project-img" loading="lazy">
            </div>
            <div class="hero-text-wrapper">
                <h3>${p.titleKey}</h3>
                <div class="tech-stack-row">${badges}</div>
                <p class="project-description" data-i18n="${p.descKey}"></p>
                <ul class="project-features">${features}</ul>
                <div class="project-buttons">
                    <a href="${p.linkDetails}" class="cta-button" data-i18n="${p.btnKey}">View</a>
                    <a href="${p.linkCode}" target="_blank" class="cta-button cta-button-outline" data-i18n="${p.codeKey}">Code</a>
                </div>
            </div>
        </div>
    </div>`;
}

function renderArchiveTemplate(p) {
  const relativeLink = p.linkDetails.split("/").pop(); // Holt "dateiname.html"

  return `
    <div class="archive-card reveal">
        <div class="archive-img-container">
            <img src="${p.image}" alt="Project Preview" loading="lazy">
            <div class="overlay">
                <a href="${relativeLink}" class="view-btn">View Case</a>
            </div>
        </div>
        <div class="card-content">
            <div class="card-header">
                <h4>${p.titleKey}</h4>
                <span class="status-badge" data-i18n="${p.statusKey}"></span>
            </div>
            <p data-i18n="${p.descKey}" class="card-desc"></p>
            <div class="card-tags">
                ${p.badges
                  .slice(0, 3)
                  .map((b) => `<span>${b}</span>`)
                  .join("")}
            </div>
        </div>
    </div>`;
}

function renderGithubCard() {
  return `
    <div class="archive-card github-card reveal">
        <div class="card-content" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items: center; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 10px;">To be continued...</div>
            <h4 data-i18n="proj_github_title">Mehr auf GitHub</h4>
            <p data-i18n="project_github_desc" class="card-desc" style="margin:15px 0;"></p>
            <a href="https://github.com/yusef03" target="_blank" class="cta-button cta-button-outline" style="font-size: 0.9rem;" data-i18n="project_github_link">Zum Profil &rarr;</a>
        </div>
    </div>`;
}
