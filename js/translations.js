const translations = {
  de: {
    // --- NAVIGATION ---
    nav_projects: "Projekte",
    nav_stack: "Tech Stack",
    nav_about: "Über mich",
    nav_contact: "Kontakt",
    nav_back: "Zurück",
    nav_portfolio: "Portfolio",

    // --- HERO SECTION (Index) ---
    hero_title_prefix: "Informatik-Student & <br>",
    hero_text:
      "Hi, ich bin Yusef. Ich studiere Angewandte Informatik an der Hochschule Hannover (3. Semester). <br><br> Mein Ansatz ist: <strong>Erst verstehen, dann coden.</strong> Mich fasziniert die ganze Breite der IT – von Web-Entwicklung über Datenbanken bis zur IT-Security. Dabei gebe ich mich nicht mit schnellen Lösungen zufrieden, sondern will wissen, was unter der Haube passiert. Ich arbeite analytisch und strukturiert, um Systeme zu bauen, die wirklich sauber funktionieren.<br><br> Aktuell suche ich eine <strong>Werkstudentenstelle</strong>, um genau diese Denkweise in ein echtes Team einzubringen.",
    hero_btn_primary: "Mein Hauptprojekt ansehen",
    hero_btn_contact: "Kontakt aufnehmen",

    // --- TECH STACK SECTION ---
    stack_title:
      "Mein <span style='color: var(--primary-color)'>Tech Stack</span>",
    stack_subtitle:
      "Hier sind die Technologien und Werkzeuge, die ich im Studium und in meinen privaten Projekten aktuell nutze und vertiefe.",

    // --- PROJECTS SECTION ---
    projects_title:
      "Meine <span style='color: var(--primary-color)'>Projekte</span>",
    projects_subtitle:
      "Theorie ist gut, Praxis ist besser. Hier zeige ich, woran ich arbeite.",

    // Project: Phishing Defender
    pd_desc:
      "Ein interaktives Lernspiel ('Serious Game') zur Cybersicherheit. Ziel ist es, Kindern und Jugendlichen das Erkennen von Phishing-Mails beizubringen.",
    pd_btn_view: "Projekt ansehen",
    pd_btn_code: "Code auf GitHub",
    pd_feat_java:
      "<strong>Pure Java:</strong> Keine Game-Engine. UI, Animationen (30 FPS Buffer) und Logik sind komplett selbst in Swing implementiert.",
    pd_feat_arch:
      "<strong>Architektur:</strong> Saubere Trennung durch Manager-Klassen (Sound, Settings, Achievements).",
    pd_feat_features:
      "<strong>Features:</strong> Highscore-System, Speichern (JSON), Admin-Modus und interaktives 'Cyber-HQ'.",

    // Other Projects
    other_projects_title: "Weitere Projekte & Experimente",
    proj_portfolio_title: "Portfolio Projekt",
    project_portfolio_desc:
      "Aktueller Projekt <br> Planung und Realisierung einer Landingpage, um modernes UI-Design mit sauberer Code-Struktur zu verbinden.",
    project_portfolio_status: "🚧 In Arbeit",
    proj_github_title: "Mehr auf GitHub",
    project_github_desc:
      "Schau dir meine aktuellen Repositories und Code-Snippets an.",
    project_github_link: "Zum Profil &rarr;",

    // --- ABOUT SECTION ---
    about_title: "Über <span style='color: var(--primary-color)'>Mich</span>",
    about_quote:
      "„Ich mag Dinge erst dann, wenn sie wirklich sauber funktionieren.“",
    about_text_1:
      "Ich bin Yusef Bach und studiere Informatik an der Hochschule Hannover im dritten Semester. Mir ist wichtig, dass ich die Dinge, an denen ich arbeite, wirklich verstehe. Nicht nur anwenden, sondern nachvollziehen, wie etwas aufgebaut ist und warum es funktioniert.",
    about_text_2:
      "Ich arbeite gerne klar und strukturiert. Das hilft mir sowohl bei Projekten wie dem Datenbankmodellieren als auch im Alltag. Am meisten Spaß machen mir Themen, bei denen man tiefer in Systeme eintaucht, zum Beispiel Linux oder Softwarearchitektur.",
    about_text_3:
      "In meiner Freizeit brauche ich manchmal Abstand vom Bildschirm. Musik hören, Freunde treffen oder einfach kurz abschalten – das bringt mir wieder Ruhe, damit ich mich danach wieder besser konzentrieren kann.",
    stat_semester: "Semester (WiSe 25/26)",
    stat_passion: "Leidenschaft & Fokus",
    stat_learning: "Lernbereitschaft",
    btn_talk: "Lass uns sprechen",
    btn_cv: "CV Download (PDF)",

    // --- CONTACT SECTION ---
    cta_title: "Kontakt",
    cta_text:
      "Wenn Sie Fragen zu meinen Projekten haben oder mit mir in Austausch treten möchten, können Sie mich jederzeit kontaktieren.",
    cta_btn: "Kontakt aufnehmen",

    contact_title: "Kontaktieren <span>Sie mich</span>",
    contact_subtitle:
      "Ich freue mich darauf, von Ihnen zu hören und Ihre Fragen oder IT-Themen zu besprechen.",
    contact_header: "Lassen Sie uns zusammenarbeiten",
    contact_text:
      "Ich stehe Ihnen für Fragen zu meinem Werdegang oder meinen Projekten jederzeit zur Verfügung. Sie können mich über das Formular oder direkt per E-Mail erreichen.",
    contact_label_phone: "Telefon",
    contact_phone_placeholder: "Bei Anfrage",
    contact_label_email: "E-Mail",
    contact_label_location: "Standort",
    contact_location_val: "Region Hannover (Verfügbar vor Ort & Remote)",

    // Form
    form_name: "Name",
    form_name_placeholder: "Ihr Name",
    form_email: "E-Mail",
    form_email_placeholder: "Ihre E-Mail-Adresse",
    form_subject: "Betreff",
    form_subject_placeholder: "Betreff",
    form_message: "Nachricht",
    form_message_placeholder: "Ihre Nachricht",
    form_btn_send: "Nachricht senden",
    form_sending: "Wird gesendet...",

    // --- FOOTER ---
    footer_about:
      "Informatik-Student & Nachwuchs-DEV.<br> Motiviert, als Werkstudent Theorie in Praxis umzusetzen und echte Projekte zu unterstützen.",
    footer_nav: "Navigation",
    footer_legal: "Rechtliches",
    footer_impressum: "Impressum",
    footer_privacy: "Datenschutz",

    // --- PHISHING DEFENDER PAGE ---
    pd_nav_mission: "Mission",
    pd_nav_process: "Prozess",
    pd_nav_arch: "Architektur",
    pd_nav_gallery: "Galerie",
    pd_nav_download: "Download",
    pd_hero_badge: "Semesterprojekt (1.0)",
    pd_hero_scroll: "Case ansehen",
    pd_page_subtitle:
      "Ein Serious Game zur Cybersicherheit.<br> Keine Engine. <span class='highlight-text'>100% Pure Java.</span>",
    pd_tag_project: "Das Projekt",
    pd_mission_title:
      "Werde zum <br><span class='highlight-text'>Cyber-Detektiv</span>",
    pd_mission_text:
      '"Phishing Defender" ist mehr als nur ein Spiel. Es ist eine Mission. In einer Welt voller digitaler Gefahren lernen Kinder und Jugendliche (6–14 Jahre), die Tricks der Hacker zu durchschauen.',
    pd_mission_subtext:
      "Entwickelt als Semesterprojekt an der Hochschule Hannover. <br> Das Ziel: Trockene Theorie in adrenalingeladenes Gameplay verwandeln.",
    pd_stat_levels: "Level",
    pd_stat_weeks: "Wochen Dev",
    pd_planning_title: "Strategic <span class='highlight-text'>Planning</span>",
    pd_planning_sub:
      "Ein Spiel entsteht nicht durch Zufall. Es entsteht durch Planung.",
    pd_step_1_title: "Analyse",
    pd_step_1_desc: "Zielgruppe (6-14J) & Lernziele definiert.",
    pd_step_2_title: "Design",
    pd_step_2_desc: "UML, Use-Cases & Paper Prototypes.",
    pd_step_3_title: "Core Impl.",
    pd_step_3_desc: "Game Loop, Swing UI & Logic.",
    pd_step_4_title: "Features",
    pd_step_4_desc: "Highscores, Save-System & Audio.",
    pd_step_5_title: "Polish",
    pd_step_5_desc: "Animationen, Testing & Release.",
    pd_feat_main_title: "Use-Case Driven Development",
    pd_feat_main_desc:
      'Jedes Feature basierte auf klar definierten Use-Cases. Vom "Spiel starten" bis zum "Firewall Bonus aktivieren". Dies garantierte einen klaren Fokus und verhinderte Feature-Creep.',
    pd_uc_core_title: "Core Loop",
    pd_uc_core_desc: "Level spielen & E-Mails analysieren",
    pd_uc_game_title: "Gamification",
    pd_uc_game_desc: "Firewall-Bonus System aktivieren",
    pd_uc_pers_title: "Persistence",
    pd_uc_pers_desc: "Highscore & Daten-Speicherung",
    pd_evo_title: "The <span class='highlight-text'>Evolution</span>",
    pd_evo_1_title: "Paper Prototype",
    pd_evo_1_desc:
      "Erste Ideenvalidierung auf Papier. Fokus auf Layout und User-Flow.",
    pd_evo_2_title: "Final Release",
    pd_evo_2_desc:
      "Umsetzung in Java Swing mit Custom-Rendering und Animationen.",
    pd_challenges_title:
      "Challenges & <span class='highlight-text'>Solutions</span>",
    pd_challenges_sub:
      "Echte Projekte laufen nie perfekt. Hier ist, wie ich Risiken gemanagt habe.",
    pd_chal_risk_1: "Risiko: Zeitüberschreitung",
    pd_chal_desc_1:
      '12 Wochen sind kurz. Die Gefahr bestand, sich in Details zu verlieren ("Feature Creep") und die Deadline zu verpassen.',
    pd_chal_label_1: "Gegenmaßnahme",
    pd_chal_sol_1:
      'Anwendung des <strong>MVP-Prinzips</strong> (Minimum Viable Product). Kern-Features (Gameplay) hatten absolute Priorität vor "Nice-to-Have" Features.',
    pd_chal_risk_2: "Risiko: Swing Limitations",
    pd_chal_desc_2:
      "Java Swing ist alt. HTML-Rendering und Layout-Manager verhielten sich oft unvorhersehbar (z.B. falsche Scrollbalken).",
    pd_chal_label_2: "Lösung",
    pd_chal_sol_2:
      'Implementierung eigener <strong>Custom Panels</strong> (Scrollable Interface) und Nutzung von "Buffering" für flüssige Animationen.',
    pd_chal_risk_3: "Risiko: Datenverlust",
    pd_chal_desc_3:
      "Gefahr von Code-Verlust oder kaputten Builds während der heißen Entwicklungsphase.",
    pd_chal_label_3: "Strategie",
    pd_chal_sol_3:
      "Strikte <strong>Git-Strategie</strong> mit regelmäßigen Commits und Backups auf GitHub. OS-unabhängige Speicherpfade.",
    pd_files_title: "Project <span class='highlight-text'>Files</span>",
    pd_files_sub: "Transparenz ist alles. Sieh dir meine Planung an.",
    pd_files_note:
      "(Dokumentation erstellt mit <strong style='color: var(--primary-color)'>LaTeX</strong>)",
    pd_file_1_desc: "PDF • 20 Seiten • Architektur & GUI Skizzen",
    pd_file_2_desc: "PDF • 12 Seiten • Meilensteine & Risiko-Analyse",
    pd_file_3_desc: "Source Code • Assets • Releases",
    pd_arch_title: "Under the <span class='highlight-text'>Hood</span>",
    pd_arch_sub: "Saubere Software-Architektur statt Spaghetti-Code.",
    pd_arch_mvc_title: "MVC & Manager Pattern",
    pd_arch_mvc_desc:
      "Das Spiel basiert auf einer strikten Trennung von Daten (Model), Logik (Controller) und Anzeige (View). Zentrale Manager-Klassen steuern die Sub-Systeme.",
    pd_arch_li_1:
      "<strong>PhishingDefender (Main):</strong> Der zentrale Controller.",
    pd_arch_li_2:
      "<strong>SettingsManager:</strong> Kapselt Einstellungen & JSON-Speicherung.",
    pd_arch_li_3:
      "<strong>AudioEngine:</strong> Pufferung im RAM für latenzfreien Sound.",
    pd_arch_li_4:
      "<strong>IntegrityShield:</strong> Visuelles Feedback-System für Leben.",
    pd_arch_caption: "Klassendiagramm (Auszug der Architektur)",
    pd_gallery_title: "Mission <span class='highlight-text'>Gallery</span>",
    pd_gallery_sub: "Einblicke in das Spielgeschehen.",
    pd_download_title: "Get the <span class='highlight-text'>Defender</span>",
    pd_download_sub: "Wähle deine Version und starte die Mission.",
    pd_dl_rec: "Empfohlen",
    pd_dl_jar_info: "Windows, Mac & Linux",
    pd_dl_jar_req: "Benötigt Java 17+",
    pd_dl_win_info: "Keine Installation nötig",
    pd_dl_win_req: "Startet ohne Java-Setup",
    pd_dl_src_info: "Full Access",
    pd_dl_src_req: "Assets & Documentation",
    pd_term_title: "Terminal - How to run",
    pd_term_opt_a: "# Option A: Doppelklick auf die .jar Datei",
    pd_term_opt_b: "# Option B: Start über Terminal (für Debugging)",

    // --- CV ENGINE PROJECT ---
    proj_cv_title: "HTML/CSS CV Engine",
    proj_cv_desc:
      "Entwicklung einer Print-Optimierten Rendering-Engine für Bewerbungsunterlagen. Pixelgenaues A4-Design direkt im Browser.",
    proj_cv_status: "🚀 Beendet",
    proj_cv_link: "Case Study ansehen",
    cv_hero_title: "Next Gen <span class='text-stroke'>Application</span>",
    cv_hero_subtitle:
      "Kein Word. Kein Canva. <span class='highlight-text'>100% Code.</span>",
    cv_hero_badge: "CSS Print Engine",
    cv_tag_project: "Das Konzept",
    cv_mission_title:
      "Bewerbung als <br><span class='highlight-text'>Code-Experience</span>",
    cv_mission_text:
      "Standard-Tools wie Word sind unflexibel und generieren unsauberen Code. Meine Lösung: Ein eigenes Framework basierend auf HTML5 & CSS3, das Design-Freiheit mit technischer Präzision verbindet.",
    cv_mission_subtext:
      "Das Ziel: Absolute Kontrolle über Layout, Typografie und 'Dark Glass' Ästhetik – bei perfektem PDF-Export.",
    cv_stat_dependencies: "Dependencies",
    cv_stat_performance: "Lighthouse Score",
    cv_stat_format: "Format",
    cv_tech_title: "Technical <span class='highlight-text'>Deep Dive</span>",
    cv_tech_sub: "Warum HTML besser ist als Word.",
    cv_feat_1_title: "Print CSS Optimization",
    cv_feat_1_desc:
      "Nutzung von @page und zoom-Hacks für pixelgenaue A4-Skalierung ohne Ränder.",
    cv_feat_2_title: "Glassmorphism UI",
    cv_feat_2_desc:
      "Modernes UI-Design mit backdrop-filter und CSS-Variablen für Dark-Mode Ästhetik.",
    cv_feat_3_title: "Privacy Workflow",
    cv_feat_3_desc:
      "Trennung von privaten Daten und Code via .gitignore und Placeholder-Strategie.",
    cv_chal_title: "Challenges & <span class='highlight-text'>Solutions</span>",
    cv_chal_sub: "Der Weg vom Browser zum Papier.",
    cv_chal_1_title: "Problem: Browser Rendering",
    cv_chal_1_desc:
      "Browser rendern Abstände unterschiedlich. Ein PDF aus Chrome sah anders aus als in Edge.",
    cv_chal_1_sol:
      "Einsatz von `webkit-print-color-adjust: exact` und striktem CSS Reset für Druck-Medien.",
    cv_chal_2_title: "Problem: Privacy",
    cv_chal_2_desc:
      "Wie zeige ich den Code auf GitHub, ohne meine privaten Sachen hochzuladen?",
    cv_chal_2_sol:
      "Architektur-Split: `index.html` (Dummy Daten) vs. `private_data.js` (Lokal).",
    cv_dl_title: "Check the <span class='highlight-text'>Results</span>",
    cv_dl_sub: "Code ansehen oder Ergebnis prüfen.",
    cv_dl_repo_info: "Full Source Code",
    cv_dl_pdf_info: "Result Preview (PDF)",
    cv_card_feat_1:
      "<strong>Print CSS:</strong> Pixelgenaue A4-Skalierung via @page Rules.",
    cv_card_feat_2:
      "<strong>Privacy-First:</strong> Datentrennung via .gitignore Strategie.",
    cv_card_feat_3:
      "<strong>No-Framework:</strong> 100% Vanilla HTML5 & CSS3 Architecture.",

    archive_cta_text: "Weitere Experimente, Tools & Case Studies",
    archive_cta_btn: "Zum Projekt-Archiv",

    // Sektion 1: Code Highlight
    cv_code_title: "The <span class='highlight-text'>Secret Sauce</span>",
    cv_code_sub: "Wie man den Browser zwingt, perfektes A4 zu drucken.",
    cv_code_box_title: "style.css (Print Logic)",
    cv_code_desc_title: "Warum ist das wichtig?",
    cv_code_desc_text:
      "Standard-Webseiten drucken schlecht. Header werden abgeschnitten, Hintergründe werden weiß. <br><br><strong>Meine Lösung:</strong> Ich nutze <code>@media print</code>, um das CSS-Grid komplett neu zu berechnen. Elemente wie Navigationsleisten werden ausgeblendet, während der Lebenslauf-Container exakt auf die physikalischen Millimeter eines A4-Blattes gezwungen wird.",

    // Sektion 2: Word vs. Code Comparison
    cv_comp_title: "Word vs. <span class='highlight-text'>Code</span>",
    cv_comp_bad_title: "Klassische Vorlagen",
    cv_comp_bad_li_1: "Verrutschende Layouts bei Textänderung",
    cv_comp_bad_li_2: "Keine Versionierung (Lebenslauf_v2.docx)",
    cv_comp_bad_li_3: "Langweiliges Standard-Design",
    cv_comp_bad_li_4: "Schlechte PDF-Komprimierung",

    cv_comp_good_title: "Meine HTML-Engine",
    cv_comp_good_li_1:
      "<strong>Pixel-Perfect:</strong> Layout ist in Stein gemeißelt (CSS Grid)",
    cv_comp_good_li_2:
      "<strong>Git-Versionierung:</strong> Jede Änderung ist nachvollziehbar",
    cv_comp_good_li_3:
      "<strong>High-End UI:</strong> Glassmorphism & Vektorgrafiken",
    cv_comp_good_li_4:
      "<strong>Privacy:</strong> Daten-Trennung durch .gitignore",

    // Sektion 3: Roadmap
    cv_road_title: "What's <span class='highlight-text'>Next?</span>",
    cv_road_done_1_title: "Core Engine",
    cv_road_done_1_desc: "HTML Structure & Print CSS",
    cv_road_done_2_title: "Privacy Layer",
    cv_road_done_2_desc: "Git Hooks & Data Separation",
    cv_road_plan_1_title: "JSON Import",
    cv_road_plan_1_desc:
      "Lebenslauf-Daten aus JSON-Datei laden statt Hardcoding.",
    cv_road_plan_2_title: "PDF-Auto-Gen",
    cv_road_plan_2_desc:
      "Automatischer PDF-Export via Node.js (Puppeteer) bei jedem Git Push.",

    // ============================================
    // META PORTFOLIO - DE
    // ============================================
    meta_title: "Portfolio Architecture v2",
    meta_desc:
      "Dokumentation des Portfolios selbst. Von statischem HTML zur dynamischen Rendering-Engine. Ein Deep-Dive in Software-Architektur, DNS-Routing und Performance.",
    meta_btn: "Ansehen",
    meta_code: "Repo ansehen",
    meta_status: "⚡ Live",

    // Hero
    meta_hero_sub:
      "Kein Baukasten. Keine Templates.<br><span class='highlight-text' style='text-shadow: 0 0 20px rgba(157,0,255,0.4);'>100% Engineered.</span>",

    // Chapter 1: Origin
    meta_c1_title: "Chapter I: <span class='highlight-text'>The Origin</span>",
    meta_c1_sub: "Warum ich das Rad neu erfunden habe.",
    meta_c1_mot_title: 'Das "Black Box" Problem',
    meta_c1_mot_text:
      "Natürlich hätte ich WordPress oder Wix nehmen können. Das geht in 2 Stunden und sieht gut aus.",
    meta_c1_mot_sub:
      "Aber im Studium lerne ich Algorithmen, Datenstrukturen und wie Computer 'denken'. Einen Baukasten zu benutzen, fühlt sich an wie Schummeln. Es ist eine 'Black Box', ich werfe Inhalt rein und vorne kommt eine Webseite raus, aber ich habe keine Ahnung warum, warum und wie das funktioniert!<br><br><strong>Das Ziel:</strong> Ich wollte den Code besitzen. Ich wollte <em>Inspect Element</em> im Browser drücken und jede einzelne Klasse verstehen, weil ich sie selbst geschrieben habe.",
    meta_c1_perf_title: "Bloatware vs. Handwerk",
    meta_c1_perf_text:
      "Fertige Templates laden oft Megabytes an JavaScript-Bibliotheken (jQuery, Bootstrap, zig Plugins), nur um ein bisschen Text anzuzeigen. Das ist Verschwendung.",
    meta_c1_perf_sub:
      "<strong>Mein Ansatz:</strong> Ich habe mir eine Challenge gesetzt: <span style='color:white'>Zero Dependencies.</span> Kein Bootstrap, kein React, kein Tailwind. Nur natives HTML5, CSS3 und Vanilla JS. <br><br>Dadurch habe ich gelernt, wie CSS Grid wirklich funktioniert, anstatt nur <code>col-md-6</code> zu schreiben. Das Ergebnis? Eine Seite, die in Millisekunden lädt (Lighthouse 100).",
    meta_c1_trans_title: "Theorie trifft Praxis",
    meta_c1_trans_text:
      "In der Hochschule lernen wir Java und OOP (Objektorientierung). Viele Studenten fragen: 'Brauche ich das für Webseiten?'",
    meta_c1_trans_sub:
      "Das Portfolio ist mein 'Labor'. Ich wollte sehen, ob ich Konzepte wie das <strong>MVC-Pattern</strong> (Model-View-Controller) auch auf eine einfache Webseite anwenden kann. Hier darf ich Dinge kaputt machen und reparieren, ohne dass ein Kunde sich beschwert. Das ist der einzige Weg, wirklich tiefes Verständnis aufzubauen.",

    // Chapter 2: Architecture
    meta_c2_title:
      "Chapter II: <span class='highlight-text'>The Architecture</span>",
    meta_c2_sub: "Vom statischen HTML zur dynamischen Engine.",
    meta_c2_evo_title: "Statisch vs. Dynamisch",
    meta_c2_evo_text:
      "Zu Beginn (v1.0) bestand dieses Portfolio aus einzelnen HTML-Dateien und eine alte Test Webseite. Das Problem: Wenn ich im Menü einen Link ändern wollte, musste ich das in fünf verschiedenen Dateien tun. Das war fehleranfällig und fühlte sich nicht 'smart' an.",
    meta_c2_evo_sub:
      "<strong>Die Lösung (v2.2):</strong> Ich habe versucht, das Prinzip 'Don't Repeat Yourself' (DRY) anzuwenden. Anstatt Inhalte hart in HTML zu coden, habe ich sie in Datenstrukturen ausgelagert.",
    meta_c2_li_1: "<strong>Früher:</strong> Copy & Paste von Code-Blöcken.",
    meta_c2_li_2:
      "<strong>Heute:</strong> Eine zentrale Daten-Quelle (Single Source of Truth).",
    meta_c2_eng_title: 'Die "Rendering Engine"',
    meta_c2_eng_text:
      "Ich wollte verstehen, wie moderne Frameworks (wie React) im Kern funktionieren. Also habe ich eine stark vereinfachte Version selbst gebaut.",
    meta_c2_eng_sub:
      "Das System basiert auf einer Trennung der Zuständigkeiten (Separation of Concerns):",
    meta_c2_li_3:
      "<strong>Data Layer:</strong> <code>projects-data.js</code> hält alle Infos (Texte, Bildpfade) als JSON-Objekte.",
    meta_c2_li_4:
      "<strong>Logic Layer:</strong> <code>project-renderer.js</code> nimmt diese Daten und baut das HTML live im Browser zusammen.",
    meta_c2_li_5:
      "<strong>View Layer:</strong> Die <code>index.html</code> ist nur noch ein leerer Rahmen (Container).",
    meta_c2_eng_note:
      "<em>Das ermöglicht mir, ein neues Projekt hinzuzufügen, indem ich einfach nur einen Eintrag im Array mache – ohne eine einzige Zeile HTML zu schreiben.</em>",

    // Chapter 3: Features
    meta_c3_title:
      "Chapter III: <span class='highlight-text'>Invisible Tech</span>",
    meta_c3_sub: "Features, die man fühlt, aber nicht sieht.",
    meta_c3_i18n_title: "Custom i18n Engine",
    meta_c3_i18n_text:
      "Statt 500KB für eine Library wie <em>i18next</em> zu laden, habe ich eine eigene Engine geschrieben.",
    meta_c3_li_1:
      "<strong>Attribute Mapping:</strong> Der Content ist vom HTML entkoppelt (<code>data-i18n</code>).",
    meta_c3_li_2:
      "<strong>Persistence:</strong> Die Sprache bleibt dank <code>localStorage</code> beim Reload erhalten.",
    meta_c3_li_3:
      "<strong>Fade-Transition:</strong> Ein Promise-basierter Übergang sorgt für sanfte Animationen statt hartem Flackern.",
    meta_c3_dom_title: "Smart DOM Injection",
    meta_c3_dom_text:
      "Die <code>project-renderer.js</code> agiert wie ein Mini-Framework ('Vanilla React'). Sie entscheidet zur Laufzeit, was gerendert wird.",
    meta_c3_dom_sub:
      "Ein besonderes Highlight ist die <strong>Path Normalization</strong>. Da die Engine sowohl auf der Startseite (Root) als auch im Archiv (Subfolder) läuft, repariert sie relative Bildpfade automatisch, bevor sie ins DOM injiziert werden. Keine 'Broken Images', egal wo der Code läuft.",
    meta_c3_perf_title: "Performance First",
    meta_c3_perf_text:
      "Ein Portfolio muss schnell sein. Durch den Verzicht auf Frameworks und die Nutzung von Hardware-Acceleration (GPU) erreichen wir Top-Werte.",
    meta_c3_obs_title: "Ressourcen-Effizienz",
    meta_c3_obs_text:
      "Scroll-Events feuern hunderte Male pro Sekunde. Das tötet den Akku mobiler Geräte. Meine Lösung: Die <strong>Intersection Observer API</strong>.",
    meta_c3_obs_note:
      "<em>⬆️ Live Demo: Dieser Kasten wurde erst aktiviert, als du ihn gerade gesehen hast. Vorher verbrauchte er 0% Rechenleistung.</em>",
    meta_c3_css_title: "Modern CSS & GPU",
    meta_c3_css_text:
      "CSS ist mehr als nur Farbe. Ich nutze <strong>Custom Properties</strong> für globales Theming. Zusätzlich erzwinge ich bei Animationen via <code>transform: translate3d</code> das Rendering auf der <strong>Grafikkarte (GPU)</strong> statt der CPU.",

    // Chapter 4: DevOps
    meta_c4_title:
      "Chapter IV: <span class='highlight-text'>DevOps & Workflow</span>",
    meta_c4_sub: "Code ist nur so gut wie der Prozess dahinter.",
    meta_c4_git_title: "Clean Commits",
    meta_c4_git_text:
      "Ein Portfolio wächst organisch. Um das Chaos zu beherrschen, nutze ich eine strikte Git-Strategie.",
    meta_c4_li_1:
      "<strong>Semantic Commits:</strong> Jeder Commit beginnt mit <code>feat:</code>, <code>fix:</code> oder <code>chore:</code>. Das macht die History lesbar.",
    meta_c4_li_2:
      "<strong>Branching:</strong> Neue Features (wie diese Meta-Seite) entstehen in isolierten Branches, bevor sie in den <code>main</code>-Branch gemerged werden.",
    meta_c4_li_3:
      "<strong>Safety:</strong> Kein Code landet ohne Test (lokaler Live-Server) im Production-Build.",
    meta_c4_str_title: "Domain Driven Design",
    meta_c4_str_text:
      "Anfangs lagen alle Bilder in einem Ordner. Das Chaos war vorprogrammiert.",
    meta_c4_str_sub:
      "Im Zuge des Refactorings (v2.2) habe ich die Struktur aufgeräumt. Assets sind nun logisch nach ihrer Domäne gruppiert. Das macht das Projekt wartbar und skalierbar für zukünftige Erweiterungen.",

    // Chapter 5: Infrastructure
    meta_c5_title:
      "Chapter V: <span class='highlight-text'>Infrastructure</span>",
    meta_c5_sub: "Der Weg zur eigenen Identität (yusefbach.de).",
    meta_c5_dns_title: "Vom Hobby zum Pro",
    meta_c5_dns_text:
      "Anfangs lief die Seite unter <code>yusef03.github.io</code>. Für ein professionelles Auftreten musste eine Top-Level-Domain (TLD) her.",
    meta_c5_dns_sub:
      "Die Herausforderung: GitHub Pages ist ein statischer Hoster. Man muss die Brücke zwischen Domain-Provider und GitHub manuell bauen. Ich nutze redundante <strong>A-Records</strong> (4 Load-Balancer IPs) für Ausfallsicherheit.",
    meta_c5_cname_title: 'The "Persistence Issue"',
    meta_c5_cname_text:
      "Ein klassischer Fallstrick bei GitHub Pages, der mich Nerven gekostet hat.",
    meta_c5_hack_prob_title: "Das Problem",
    meta_c5_hack_prob_desc:
      "Ich hatte die Domain in den GitHub Settings eingetragen. Alles funktionierte. Aber nach jedem neuen <code>git push</code> war die Einstellung plötzlich weg und die Seite offline.<br><br><strong>Grund:</strong> GitHub überschreibt manuelle Settings beim Deployment.",
    meta_c5_hack_fix_title: "Der Fix: CNAME File",
    meta_c5_hack_fix_desc:
      "Die Lösung ist eine unscheinbare Datei namens <code>CNAME</code> (ohne Endung) im Root-Verzeichnis.<br><br><strong>Inhalt:</strong> <code>yusefbach.de</code><br><br>Damit ist die Domain 'Code-defined'. Egal wie oft ich deploye, GitHub weiß jetzt: 'Das gehört mir.'",

    // Chapter 6: Roadmap
    meta_c6_title:
      "Chapter VI: <span class='highlight-text'>Future Roadmap</span>",
    meta_c6_sub: "Code is never finished. The journey continues.",
    meta_c6_n1_title: "Architecture Shift",
    meta_c6_n1_desc:
      "Migration von statischem HTML zu einer datengetriebenen JS-Engine. Implementierung von i18n, Dark Mode & Intersection Observer.",
    meta_c6_n2_title: "UX & Accessibility",
    meta_c6_n2_desc:
      "Einführung eines <strong>Light/Dark Mode Toggles</strong> basierend auf CSS-Variablen. Fokus auf WCAG 2.1 Konformität (Kontraste & Screenreader-Support).",
    meta_c6_n3_title: "Headless CMS",
    meta_c6_n3_desc:
      "Ablösung der lokalen JSON-Dateien durch eine echte API (Contentful/Strapi). Verwaltung der Projekte über ein Admin-Dashboard statt Code-Commits.",
    meta_c6_n4_title: "Own Framework",
    meta_c6_n4_desc:
      "Migration der Vanilla-Architektur zu <strong>Next.js</strong> (React). Nutzung von Server Side Rendering (SSR) für maximale Performance und SEO.",

    // Footer
    meta_outro_title: "Ready for<br>Production",
    meta_outro_text:
      "Dieses Portfolio ist der Beweis, dass ich bereit bin, Theorie in echten Mehrwert zu verwandeln.",
    meta_outro_btn: "Lass uns arbeiten",
    meta_outro_home: "Zur Startseite",
  },

  en: {
    // --- NAVIGATION ---
    nav_projects: "Projects",
    nav_stack: "Tech Stack",
    nav_about: "About Me",
    nav_contact: "Contact",
    nav_back: "Back",
    nav_portfolio: "Portfolio",

    // --- HERO SECTION (Index) ---
    hero_title_prefix: "CS Student & <br>",
    hero_text:
      "Hi, I'm Yusef. I am studying Applied Computer Science at the University of Applied Sciences Hannover (3rd Semester). <br><br> My approach is: <strong>Understand first, then code.</strong> I am fascinated by the entire breadth of IT – from web development to databases and IT security. I am not satisfied with quick fixes; I want to know what happens under the hood. I work analytically and in a structured way to build systems that work cleanly.<br><br> I am currently looking for a <strong>working student position</strong> to bring exactly this mindset into a real team.",
    hero_btn_primary: "View Main Project",
    hero_btn_contact: "Get in Touch",

    // --- TECH STACK SECTION ---
    stack_title:
      "My <span style='color: var(--primary-color)'>Tech Stack</span>",
    stack_subtitle:
      "Here are the technologies and tools I currently use and deepen in my studies and private projects.",

    // --- PROJECTS SECTION ---
    projects_title:
      "My <span style='color: var(--primary-color)'>Projects</span>",
    projects_subtitle:
      "Theory is good, practice is better. Here is what I am working on.",

    // Project: Phishing Defender
    pd_desc:
      "An interactive learning game ('Serious Game') for cyber security. The goal is to teach children and teenagers how to recognize phishing emails.",
    pd_btn_view: "View Project",
    pd_btn_code: "Code on GitHub",
    pd_feat_java:
      "<strong>Pure Java:</strong> No game engine. UI, animations (30 FPS buffer), and logic are fully implemented in Swing.",
    pd_feat_arch:
      "<strong>Architecture:</strong> Clean separation via Manager classes (Sound, Settings, Achievements).",
    pd_feat_features:
      "<strong>Features:</strong> Highscore system, Save (JSON), Admin Mode, and interactive 'Cyber-HQ'.",

    // Other Projects
    other_projects_title: "Other Projects & Experiments",
    proj_portfolio_title: "Portfolio Project",
    project_portfolio_desc:
      "Current Project <br> Planning and realization of a landing page to combine modern UI design with clean code structure.",
    project_portfolio_status: "🚧 In Progress",
    proj_github_title: "More on GitHub",
    project_github_desc: "Check out my current repositories and code snippets.",
    project_github_link: "To Profile &rarr;",

    // --- ABOUT SECTION ---
    about_title: "About <span style='color: var(--primary-color)'>Me</span>",
    about_quote: "“I only like things when they really work cleanly.”",
    about_text_1:
      "I'm Yusef Bach and I'm studying Computer Science at the University of Applied Sciences Hannover in my third semester. It is important to me that I really understand the things I work on. Not just applying them, but understanding how something is built and why it works.",
    about_text_2:
      "I like working clearly and structured. This helps me both with projects like database modeling and in everyday life. I enjoy topics most where you dive deeper into systems, for example Linux or software architecture.",
    about_text_3:
      "In my free time, I sometimes need distance from the screen. Listening to music, meeting friends, or just switching off briefly – that brings me peace so I can concentrate better afterwards.",
    stat_semester: "Semester (Winter 25/26)",
    stat_passion: "Passion & Focus",
    stat_learning: "Willingness to learn",
    btn_talk: "Let's talk",
    btn_cv: "Download CV (PDF)",

    // --- CONTACT SECTION ---
    cta_title: "Contact",
    cta_text:
      "If you have questions about my projects or would like to exchange ideas, feel free to contact me at any time.",
    cta_btn: "Get in Touch",

    contact_title:
      "Contact <span style='color: var(--primary-color)'>Me</span>",
    contact_subtitle:
      "I look forward to hearing from you and discussing your questions or IT topics.",
    contact_header: "Let's work together",
    contact_text:
      "I am available to answer questions about my career or my projects at any time. You can reach me via the form or directly by email.",
    contact_label_phone: "Phone",
    contact_phone_placeholder: "Upon Request",
    contact_label_email: "Email",
    contact_label_location: "Location",
    contact_location_val: "Hanover Region (Available On-site & Remote)",

    // Form
    form_name: "Name",
    form_name_placeholder: "Your Name",
    form_email: "Email",
    form_email_placeholder: "Your Email Address",
    form_subject: "Subject",
    form_subject_placeholder: "Subject",
    form_message: "Message",
    form_message_placeholder: "Your Message",
    form_btn_send: "Send Message",
    form_sending: "Sending...",

    // --- FOOTER ---
    footer_about:
      "CS Student & Aspiring DEV.<br> Motivated to turn theory into practice as a working student and support real projects.",
    footer_nav: "Navigation",
    footer_legal: "Legal",
    footer_impressum: "Imprint",
    footer_privacy: "Privacy Policy",

    // --- PHISHING DEFENDER PAGE ---
    pd_nav_mission: "Mission",
    pd_nav_process: "Process",
    pd_nav_arch: "Architecture",
    pd_nav_gallery: "Gallery",
    pd_nav_download: "Download",
    pd_hero_badge: "Semester Project (1.0)",
    pd_hero_scroll: "Explore Case",
    pd_page_subtitle:
      "A Serious Game for Cyber Security.<br> No Engine. <span class='highlight-text'>100% Pure Java.</span>",
    pd_tag_project: "The Project",
    pd_mission_title:
      "Become a <br><span class='highlight-text'>Cyber Detective</span>",
    pd_mission_text:
      '"Phishing Defender" is more than just a game. It is a mission. In a world full of digital dangers, children and teenagers (6–14 years) learn to see through hackers\' tricks.',
    pd_mission_subtext:
      "Developed as a semester project at the University of Applied Sciences Hannover. <br> The goal: Turn dry theory into adrenaline-pumping gameplay.",
    pd_stat_levels: "Levels",
    pd_stat_weeks: "Weeks Dev",
    pd_planning_title: "Strategic <span class='highlight-text'>Planning</span>",
    pd_planning_sub:
      "A game is not created by chance. It is created by planning.",
    pd_step_1_title: "Analysis",
    pd_step_1_desc: "Target audience (6-14y) & learning goals defined.",
    pd_step_2_title: "Design",
    pd_step_2_desc: "UML, Use-Cases & Paper Prototypes.",
    pd_step_3_title: "Core Impl.",
    pd_step_3_desc: "Game Loop, Swing UI & Logic.",
    pd_step_4_title: "Features",
    pd_step_4_desc: "Highscores, Save-System & Audio.",
    pd_step_5_title: "Polish",
    pd_step_5_desc: "Animations, Testing & Release.",
    pd_feat_main_title: "Use-Case Driven Development",
    pd_feat_main_desc:
      'Every feature was based on clearly defined use-cases. From "Start Game" to "Activate Firewall Bonus". This guaranteed a clear focus and prevented feature creep.',
    pd_uc_core_title: "Core Loop",
    pd_uc_core_desc: "Play levels & analyze emails",
    pd_uc_game_title: "Gamification",
    pd_uc_game_desc: "Activate Firewall Bonus System",
    pd_uc_pers_title: "Persistence",
    pd_uc_pers_desc: "Highscore & Data Storage",
    pd_evo_title: "The <span class='highlight-text'>Evolution</span>",
    pd_evo_1_title: "Paper Prototype",
    pd_evo_1_desc:
      "First idea validation on paper. Focus on layout and user flow.",
    pd_evo_2_title: "Final Release",
    pd_evo_2_desc:
      "Implementation in Java Swing with custom rendering and animations.",
    pd_challenges_title:
      "Challenges & <span class='highlight-text'>Solutions</span>",
    pd_challenges_sub:
      "Real projects never run perfectly. Here is how I managed risks.",
    pd_chal_risk_1: "Risk: Time Overrun",
    pd_chal_desc_1:
      '12 weeks are short. There was a danger of getting lost in details ("Feature Creep") and missing the deadline.',
    pd_chal_label_1: "Countermeasure",
    pd_chal_sol_1:
      'Applying the <strong>MVP Principle</strong> (Minimum Viable Product). Core features (Gameplay) had absolute priority over "Nice-to-Have" features.',
    pd_chal_risk_2: "Risk: Swing Limitations",
    pd_chal_desc_2:
      "Java Swing is old. HTML rendering and layout managers often behaved unpredictably (e.g., wrong scrollbars).",
    pd_chal_label_2: "Solution",
    pd_chal_sol_2:
      'Implementation of own <strong>Custom Panels</strong> (Scrollable Interface) and use of "Buffering" for smooth animations.',
    pd_chal_risk_3: "Risk: Data Loss",
    pd_chal_desc_3:
      "Danger of code loss or broken builds during the hot development phase.",
    pd_chal_label_3: "Strategy",
    pd_chal_sol_3:
      "Strict <strong>Git Strategy</strong> with regular commits and backups on GitHub. OS-independent storage paths.",
    pd_files_title: "Project <span class='highlight-text'>Files</span>",
    pd_files_sub: "Transparency is everything. See my planning.",
    pd_files_note:
      "(Documentation created with <strong style='color: var(--primary-color)'>LaTeX</strong>)",
    pd_file_1_desc: "PDF • 20 Pages • Architecture & GUI Sketches",
    pd_file_2_desc: "PDF • 12 Pages • Milestones & Risk Analysis",
    pd_file_3_desc: "Source Code • Assets • Releases",
    pd_arch_title: "Under the <span class='highlight-text'>Hood</span>",
    pd_arch_sub: "Clean software architecture instead of spaghetti code.",
    pd_arch_mvc_title: "MVC & Manager Pattern",
    pd_arch_mvc_desc:
      "The game is based on a strict separation of data (Model), logic (Controller), and display (View). Central Manager classes control the sub-systems.",
    pd_arch_li_1:
      "<strong>PhishingDefender (Main):</strong> The central controller.",
    pd_arch_li_2:
      "<strong>SettingsManager:</strong> Encapsulates settings & JSON storage.",
    pd_arch_li_3:
      "<strong>AudioEngine:</strong> RAM buffering for latency-free sound.",
    pd_arch_li_4:
      "<strong>IntegrityShield:</strong> Visual feedback system for lives.",
    pd_arch_caption: "Class Diagram (Excerpt of Architecture)",
    pd_gallery_title: "Mission <span class='highlight-text'>Gallery</span>",
    pd_gallery_sub: "Insights into the gameplay.",
    pd_download_title: "Get the <span class='highlight-text'>Defender</span>",
    pd_download_sub: "Choose your version and start the mission.",
    pd_dl_rec: "Recommended",
    pd_dl_jar_info: "Windows, Mac & Linux",
    pd_dl_jar_req: "Requires Java 17+",
    pd_dl_win_info: "No installation needed",
    pd_dl_win_req: "Starts without Java setup",
    pd_dl_src_info: "Full Access",
    pd_dl_src_req: "Assets & Documentation",
    pd_term_title: "Terminal - How to run",
    pd_term_opt_a: "# Option A: Double click on the .jar file",
    pd_term_opt_b: "# Option B: Start via Terminal (for debugging)",

    // --- CV ENGINE PROJECT ---
    proj_cv_title: "HTML/CSS CV Engine",
    proj_cv_desc:
      "Development of a print-optimized rendering engine for application documents. Pixel-perfect A4 design directly in the browser.",
    proj_cv_status: "🚀 Completed",
    proj_cv_link: "View Case Study",
    cv_hero_title: "Next Gen <span class='text-stroke'>Application</span>",
    cv_hero_subtitle:
      "No Word. No Canva. <span class='highlight-text'>100% Code.</span>",
    cv_hero_badge: "CSS Print Engine",
    cv_tag_project: "The Concept",
    cv_mission_title:
      "Application as a <br><span class='highlight-text'>Code Experience</span>",
    cv_mission_text:
      "Standard tools like Word are inflexible and generate messy code. My solution: A custom framework based on HTML5 & CSS3 linking design freedom with technical precision.",
    cv_mission_subtext:
      "The Goal: Absolute control over layout, typography, and 'Dark Glass' aesthetics – with perfect PDF export.",
    cv_stat_dependencies: "Dependencies",
    cv_stat_performance: "Lighthouse Score",
    cv_stat_format: "Format",
    cv_tech_title: "Technical <span class='highlight-text'>Deep Dive</span>",
    cv_tech_sub: "Why HTML beats Word.",
    cv_feat_1_title: "Print CSS Optimization",
    cv_feat_1_desc:
      "Using @page and zoom hacks for pixel-perfect A4 scaling without margins.",
    cv_feat_2_title: "Glassmorphism UI",
    cv_feat_2_desc:
      "Modern UI design with backdrop-filter and CSS variables for Dark Mode aesthetics.",
    cv_feat_3_title: "Privacy Workflow",
    cv_feat_3_desc:
      "Separation of private data and code via .gitignore and placeholder strategy.",
    cv_chal_title: "Challenges & <span class='highlight-text'>Solutions</span>",
    cv_chal_sub: "The path from browser to paper.",
    cv_chal_1_title: "Problem: Browser Rendering",
    cv_chal_1_desc:
      "Browsers render margins differently. A Chrome PDF looked different from Edge.",
    cv_chal_1_sol:
      "Usage of `webkit-print-color-adjust: exact` and strict CSS reset for print media.",
    cv_chal_2_title: "Problem: Privacy",
    cv_chal_2_desc:
      "How to show code on GitHub without leaking my phone number?",
    cv_chal_2_sol:
      "Architecture Split: `index.html` (Dummy Data) vs. `private_data.js` (Local).",
    cv_dl_title: "Check the <span class='highlight-text'>Results</span>",
    cv_dl_sub: "View code or check the result.",
    cv_dl_repo_info: "Full Source Code",
    cv_dl_pdf_info: "Result Preview (PDF)",
    cv_card_feat_1:
      "<strong>Print CSS:</strong> Pixel-perfect A4 scaling via @page rules.",
    cv_card_feat_2:
      "<strong>Privacy-First:</strong> Data separation via .gitignore strategy.",
    cv_card_feat_3:
      "<strong>No-Framework:</strong> 100% Vanilla HTML5 & CSS3 Architecture.",

    archive_cta_text: "More Experiments, Tools & Case Studies",
    archive_cta_btn: "Go to Project Archive",

    // Section 1: Code Highlight
    cv_code_title: "The <span class='highlight-text'>Secret Sauce</span>",
    cv_code_sub: "How to force the browser to print perfect A4.",
    cv_code_box_title: "style.css (Print Logic)",
    cv_code_desc_title: "Why does this matter?",
    cv_code_desc_text:
      "Standard websites print poorly. Headers get cut off, backgrounds turn white. <br><br><strong>My Solution:</strong> I use <code>@media print</code> to completely recalculate the CSS Grid. Elements like navigation bars are hidden, while the CV container is forced to the exact physical millimeters of an A4 sheet.",

    // Section 2: Word vs. Code Comparison
    cv_comp_title: "Word vs. <span class='highlight-text'>Code</span>",
    cv_comp_bad_title: "Classic Templates",
    cv_comp_bad_li_1: "Layouts break when text changes",
    cv_comp_bad_li_2: "No versioning (CV_Final_v2.docx)",
    cv_comp_bad_li_3: "Boring standard design",
    cv_comp_bad_li_4: "Poor PDF compression",

    cv_comp_good_title: "My HTML Engine",
    cv_comp_good_li_1:
      "<strong>Pixel-Perfect:</strong> Layout is set in stone (CSS Grid)",
    cv_comp_good_li_2:
      "<strong>Git Versioning:</strong> Every change is traceable",
    cv_comp_good_li_3:
      "<strong>High-End UI:</strong> Glassmorphism & Vector Graphics",
    cv_comp_good_li_4:
      "<strong>Privacy:</strong> Data separation via .gitignore",

    // Section 3: Roadmap
    cv_road_title: "What's <span class='highlight-text'>Next?</span>",
    cv_road_done_1_title: "Core Engine",
    cv_road_done_1_desc: "HTML Structure & Print CSS",
    cv_road_done_2_title: "Privacy Layer",
    cv_road_done_2_desc: "Git Hooks & Data Separation",
    cv_road_plan_1_title: "JSON Import",
    cv_road_plan_1_desc: "Load CV data from JSON file instead of hardcoding.",
    cv_road_plan_2_title: "PDF-Auto-Gen",
    cv_road_plan_2_desc:
      "Automatic PDF export via Node.js (Puppeteer) on every Git Push.",

    // ============================================
    // META PORTFOLIO (NEW) - EN
    // ============================================
    meta_title: "Portfolio Architecture v2",
    meta_desc:
      "Documentation of the portfolio itself. From static HTML to a dynamic rendering engine. A deep dive into software architecture, DNS routing, and performance.",
    meta_btn: "Read Deep Dive",
    meta_code: "View Repo",
    meta_status: "⚡ Live",

    // Hero
    meta_hero_sub:
      "No Builders. No Templates.<br><span class='highlight-text' style='text-shadow: 0 0 20px rgba(157,0,255,0.4);'>100% Engineered.</span>",

    // Chapter 1: Origin
    meta_c1_title: "Chapter I: <span class='highlight-text'>The Origin</span>",
    meta_c1_sub: "Why I reinvented the wheel.",
    meta_c1_mot_title: 'The "Black Box" Problem',
    meta_c1_mot_text:
      "Of course, I could have used WordPress or Wix. That takes 2 hours and looks good.",
    meta_c1_mot_sub:
      "But in my studies, I learn algorithms, data structures, and how computers 'think'. Using a builder feels like cheating. It's a 'Black Box' – I throw content in, and a website comes out, but I have no idea why.<br><br><strong>The Goal:</strong> I wanted to own the code. I wanted to press <em>Inspect Element</em> in the browser and understand every single class because I wrote it myself.",
    meta_c1_perf_title: "Bloatware vs. Craftsmanship",
    meta_c1_perf_text:
      "Finished templates often load megabytes of JavaScript libraries (jQuery, Bootstrap, countless plugins) just to display a bit of text. That is wasteful.",
    meta_c1_perf_sub:
      "<strong>The Student Approach:</strong> I set myself a challenge: <span style='color:white'>Zero Dependencies.</span> No Bootstrap, no React, no Tailwind. Only native HTML5, CSS3, and Vanilla JS. <br><br>Through this, I learned how CSS Grid really works instead of just writing <code>col-md-6</code>. The result? A page that loads in milliseconds (Lighthouse 100).",
    meta_c1_trans_title: "Theory meets Practice",
    meta_c1_trans_text:
      "At university, we learn Java and OOP (Object Oriented Programming). Many students ask: 'Do I need this for websites?'",
    meta_c1_trans_sub:
      "The portfolio is my 'Lab'. I wanted to see if I could apply concepts like the <strong>MVC Pattern</strong> (Model-View-Controller) to a simple website. Here, I can break things and fix them without a client complaining. It is the only way to build truly deep understanding.",

    // Chapter 2: Architecture
    meta_c2_title:
      "Chapter II: <span class='highlight-text'>The Architecture</span>",
    meta_c2_sub: "From static HTML to a dynamic engine.",
    meta_c2_evo_title: "Static vs. Dynamic",
    meta_c2_evo_text:
      "In the beginning (v1.0), this portfolio consisted of individual HTML files. The problem: If I wanted to change a link in the menu, I had to do it in five different files. That was error-prone and didn't feel 'smart'.",
    meta_c2_evo_sub:
      "<strong>The Solution (v2.2):</strong> I tried to apply the 'Don't Repeat Yourself' (DRY) principle. Instead of hardcoding content in HTML, I outsourced it to data structures.",
    meta_c2_li_1: "<strong>Before:</strong> Copy & Paste of code blocks.",
    meta_c2_li_2:
      "<strong>Today:</strong> A central data source (Single Source of Truth).",
    meta_c2_eng_title: 'The "Rendering Engine"',
    meta_c2_eng_text:
      "I wanted to understand how modern frameworks (like React) work at their core. So I built a heavily simplified version myself.",
    meta_c2_eng_sub: "The system is based on Separation of Concerns:",
    meta_c2_li_3:
      "<strong>Data Layer:</strong> <code>projects-data.js</code> holds all info (texts, image paths) as JSON objects.",
    meta_c2_li_4:
      "<strong>Logic Layer:</strong> <code>project-renderer.js</code> takes this data and builds the HTML live in the browser.",
    meta_c2_li_5:
      "<strong>View Layer:</strong> The <code>index.html</code> is just an empty frame (container).",
    meta_c2_eng_note:
      "<em>This allows me to add a new project by simply adding an entry to the array – without writing a single line of HTML.</em>",

    // Chapter 3: Features
    meta_c3_title:
      "Chapter III: <span class='highlight-text'>Invisible Tech</span>",
    meta_c3_sub: "Features you feel but don't see.",
    meta_c3_i18n_title: "Custom i18n Engine",
    meta_c3_i18n_text:
      "Instead of loading 500KB for a library like <em>i18next</em>, I wrote my own engine.",
    meta_c3_li_1:
      "<strong>Attribute Mapping:</strong> Content is decoupled from HTML (<code>data-i18n</code>).",
    meta_c3_li_2:
      "<strong>Persistence:</strong> The language remains thanks to <code>localStorage</code> on reload.",
    meta_c3_li_3:
      "<strong>Fade-Transition:</strong> A Promise-based transition ensures smooth animations instead of hard flickering.",
    meta_c3_dom_title: "Smart DOM Injection",
    meta_c3_dom_text:
      "The <code>project-renderer.js</code> acts like a mini-framework ('Vanilla React'). It decides at runtime what is rendered.",
    meta_c3_dom_sub:
      "A special highlight is <strong>Path Normalization</strong>. Since the engine runs on both the start page (Root) and in the archive (Subfolder), it automatically repairs relative image paths before injecting them into the DOM. No 'Broken Images', no matter where the code runs.",
    meta_c3_perf_title: "Performance First",
    meta_c3_perf_text:
      "A portfolio must be fast. By avoiding frameworks and using hardware acceleration (GPU), we achieve top scores.",
    meta_c3_obs_title: "Resource Efficiency",
    meta_c3_obs_text:
      "Scroll events fire hundreds of times per second. That kills mobile device batteries. My solution: The <strong>Intersection Observer API</strong>.",
    meta_c3_obs_note:
      "<em>⬆️ Live Demo: This box was only activated when you just saw it. Before that, it consumed 0% computing power.</em>",
    meta_c3_css_title: "Modern CSS & GPU",
    meta_c3_css_text:
      "CSS is more than just color. I use <strong>Custom Properties</strong> for global theming. Additionally, I force rendering on the <strong>Graphics Card (GPU)</strong> via <code>transform: translate3d</code> instead of the CPU.",

    // Chapter 4: DevOps
    meta_c4_title:
      "Chapter IV: <span class='highlight-text'>DevOps & Workflow</span>",
    meta_c4_sub: "Code is only as good as the process behind it.",
    meta_c4_git_title: "Clean Commits",
    meta_c4_git_text:
      "A portfolio grows organically. To control the chaos, I use a strict Git strategy.",
    meta_c4_li_1:
      "<strong>Semantic Commits:</strong> Every commit starts with <code>feat:</code>, <code>fix:</code>, or <code>chore:</code>. This makes the history readable.",
    meta_c4_li_2:
      "<strong>Branching:</strong> New features (like this meta page) are created in isolated branches before being merged into the <code>main</code> branch.",
    meta_c4_li_3:
      "<strong>Safety:</strong> No code lands in the production build without testing (local live server).",
    meta_c4_str_title: "Domain Driven Design",
    meta_c4_str_text:
      "Initially, all images were in one folder. Chaos was pre-programmed.",
    meta_c4_str_sub:
      "During the refactoring (v2.2), I cleaned up the structure. Assets are now logically grouped by their domain. This makes the project maintainable and scalable for future expansions.",

    // Chapter 5: Infrastructure
    meta_c5_title:
      "Chapter V: <span class='highlight-text'>Infrastructure</span>",
    meta_c5_sub: "The path to my own identity (yusefbach.de).",
    meta_c5_dns_title: "From Hobby to Pro",
    meta_c5_dns_text:
      "Initially, the site ran under <code>yusef03.github.io</code>. For a professional appearance, a Top-Level Domain (TLD) was needed.",
    meta_c5_dns_sub:
      "The challenge: GitHub Pages is a static host. You have to manually build the bridge between domain provider and GitHub. I use redundant <strong>A-Records</strong> (4 Load Balancer IPs) for reliability.",
    meta_c5_cname_title: 'The "Persistence Issue"',
    meta_c5_cname_text:
      "A classic pitfall with GitHub Pages that cost me some nerves.",
    meta_c5_hack_prob_title: "The Problem",
    meta_c5_hack_prob_desc:
      "I had entered the domain in GitHub settings. Everything worked. But after every new <code>git push</code>, the setting was suddenly gone and the site offline.<br><br><strong>Reason:</strong> GitHub overwrites manual settings on deployment.",
    meta_c5_hack_fix_title: "The Fix: CNAME File",
    meta_c5_hack_fix_desc:
      "The solution is an inconspicuous file named <code>CNAME</code> (no extension) in the root directory.<br><br><strong>Content:</strong> <code>yusefbach.de</code><br><br>This makes the domain 'Code-defined'. No matter how often I deploy, GitHub now knows: 'This belongs to me.'",

    // Chapter 6: Roadmap
    meta_c6_title:
      "Chapter VI: <span class='highlight-text'>Future Roadmap</span>",
    meta_c6_sub: "Code is never finished. The journey continues.",
    meta_c6_n1_title: "Architecture Shift",
    meta_c6_n1_desc:
      "Migration from static HTML to a data-driven JS engine. Implementation of i18n, Dark Mode & Intersection Observer.",
    meta_c6_n2_title: "UX & Accessibility",
    meta_c6_n2_desc:
      "Introduction of a <strong>Light/Dark Mode Toggle</strong> based on CSS variables. Focus on WCAG 2.1 compliance (contrasts & screen reader support).",
    meta_c6_n3_title: "Headless CMS",
    meta_c6_n3_desc:
      "Replacement of local JSON files with a real API (Contentful/Strapi). Managing projects via an admin dashboard instead of code commits.",
    meta_c6_n4_title: "Own Framework",
    meta_c6_n4_desc:
      "Migration of the Vanilla architecture to <strong>Next.js</strong> (React). Using Server Side Rendering (SSR) for maximum performance and SEO.",

    // Footer
    meta_outro_title: "Ready for<br>Production",
    meta_outro_text:
      "This portfolio is proof that I am ready to turn theory into real value.",
    meta_outro_btn: "Let's work",
    meta_outro_home: "Back to Home",
  },
};
