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

    // Project: Phishing Defender Card
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

    // --- LEGAL PAGES (Note) ---
    legal_note: "", // Leer für DE
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

    // Project: Phishing Defender Card
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

    // --- LEGAL PAGES (Note) ---
    legal_note:
      "<br><br><em>Note: The German version of this document is the legally binding one.</em>",
  },
};
