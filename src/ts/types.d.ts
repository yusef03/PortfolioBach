// ============================================================================
// GLOBAL TYPE DECLARATIONS
// ============================================================================

// --- Projekt-Typen -----------------------------------------------------------

type ProjectStatus = 'active' | 'in-progress' | 'completed';

interface ProjectFeature {
  de: string;
  en: string;
  ar: string;
}

interface Project {
  id: string;           // UUID (stabil, ändert sich nie)
  slug: string;         // "studynexus" (änderbar, für URLs/Anzeige)
  title: string;        // Eigenname, kein i18n: "StudyNexus"
  description_de: string;
  description_en: string;
  description_ar: string;
  badges: string[];
  features: ProjectFeature[];
  status: ProjectStatus;
  image_url: string;    // Supabase Storage URL oder relativer Pfad
  github_url?: string;
  demo_url?: string;
  subpage_url?: string; // "projects/studynexus.html"
  timeframe?: string;
  role?: string;
  is_hero: boolean;
  sort_order: number;
}

interface GithubCard {
  title_de: string; title_en: string; title_ar: string;
  text_de: string;  text_en: string;  text_ar: string;
  btn_de: string;   btn_en: string;   btn_ar: string;
  url: string;
}

// Werden zur Laufzeit von js/projects-data.js (generiert via Supabase) bereitgestellt:
declare const projectsData: Project[];
declare const githubCard: GithubCard | undefined;

// --- Roadmap-Typen -----------------------------------------------------------

type RoadmapScope = 'portfolio' | 'project';
type RoadmapStatus = 'planned' | 'in-progress' | 'completed';

interface RoadmapEntry {
  id: string;
  scope: RoadmapScope;
  project_slug: string | null;
  title_de: string; title_en: string; title_ar: string;
  description_de: string; description_en: string; description_ar: string;
  phase_label_de: string; phase_label_en: string; phase_label_ar: string;
  status: RoadmapStatus;
  sort_order: number;
}

interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  category: 'feature' | 'fix' | 'refactor' | 'security';
  title_de: string; title_en: string; title_ar: string;
  description_de: string; description_en: string; description_ar: string;
}

// Werden zur Laufzeit von js/roadmap-data.js (generiert via Supabase) bereitgestellt:
declare const roadmapData: RoadmapEntry[] | undefined;
declare const changelogData: ChangelogEntry[] | undefined;

// --- Thoughts-Typen ----------------------------------------------------------

interface ThoughtMeta {
  slug: string;

  // Englisch (Pflicht — immer vorhanden)
  title_en: string;
  excerpt_en: string | null;

  // Deutsch (optional)
  title_de: string | null;
  excerpt_de: string | null;

  // Arabisch (optional)
  title_ar: string | null;
  excerpt_ar: string | null;

  // Sprachneutrale Felder
  cover_image_url: string | null;
  tags: string[];
  reading_minutes: number | null;
  published_at: string | null;

  // Convenience-Flags (gesetzt von build-thoughts.mjs)
  has_de: boolean;
  has_ar: boolean;
}

// Wird zur Laufzeit von js/thoughts-data.js bereitgestellt:
declare const thoughtsData: ThoughtMeta[] | undefined;

// --- GitHub-Activity-Typen ---------------------------------------------------

interface GithubContribDay {
  date: string | null;  // ISO "YYYY-MM-DD" — null = Pad-Slot (leere Zelle zur Grid-Ausrichtung)
  count: number;        // Beiträge an diesem Tag
  level: 0 | 1 | 2 | 3 | 4;  // Intensitätsstufe (build-berechnet)
}

interface GithubMonthLabel {
  label: string;     // locale-neutral Index — Anzeige via toLocaleDateString
  date: string;      // ISO Monatsanfang (für locale-Formatierung im Renderer)
  weekIndex: number; // Spaltenposition im Grid
}

interface GithubLanguage {
  name: string;
  percent: number;   // 0–100, eine Nachkommastelle
}

interface GithubActivity {
  generatedAt: string;
  user: string;
  totalContributions: number;
  calendar: {
    weeks: GithubContribDay[][];   // ~53 Wochen × 7 Tage
    monthLabels: GithubMonthLabel[];
  };
  stats: {
    publicRepos: number;
    totalStars: number;
    followers: number;
    codingSince: number;           // Account-Erstellungsjahr
  };
  languages: GithubLanguage[];     // Top 5 + "Other"
}

// Wird zur Laufzeit von js/github-activity-data.js bereitgestellt:
declare const githubActivity: GithubActivity | undefined;

// --- i18n-Typen ---------------------------------------------------------------

interface Translations {
  [lang: string]: {
    [key: string]: string;
  };
}

// --- EmailJS (CDN-geladen) ---------------------------------------------------

declare namespace emailjs {
  function init(publicKey: string): void;
  function sendForm(serviceID: string, templateID: string, form: HTMLFormElement): Promise<any>;
}

// --- Seiten-Sprache ----------------------------------------------------------
// Wird vom Inline-Snippet im <head> aus der URL abgeleitet (/en/ → 'en', /ar/ → 'ar',
// sonst 'de'). Einzige Wahrheit für die Laufzeit-Sprache (statt localStorage).
interface Window {
  __PAGE_LANG__?: 'de' | 'en' | 'ar';
}
