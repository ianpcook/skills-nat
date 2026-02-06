// Backend skill type (from API/database)
export interface BackendSkill {
  id: string;
  slug: string;
  name: string;
  author: string | null;
  description: string | null;
  shortDescription?: string | null;
  stars: number;
  agents: string[];
  category: string | null;
  version: string | null;
  repoUrl?: string | null;
}

// Generate install command based on whether skill has its own repo
export const buildInstallCommand = (slug: string, repoUrl?: string | null): string =>
  repoUrl
    ? `npx skills add ${repoUrl}`
    : `npx skills add https://github.com/ianpcook/skills-nat --skill ${slug}`;

// Extract owner from GitHub repo URL, default to 'ianpcook' for file uploads
const getSkillOwner = (repoUrl?: string | null): string => {
  if (repoUrl) {
    const match = repoUrl.match(/github\.com\/([^\/]+)/);
    if (match) return match[1];
  }
  return 'ianpcook';
};

// Display skill type (for UI)
export interface Skill {
  id: string;
  slug?: string;
  name: string;
  author: string;
  owner?: string; // GitHub owner or 'ianpcook' for file uploads
  authorLocation?: string;
  description: string;
  shortDescription?: string | null;
  installCommand?: string;
  tags?: string[];
  agents: string[];
  category?: string;
  version?: string;
  stars: number;
  accentColor?: string;
  icon?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
}

// Deterministic hash-based color index for visual variety
const PALETTE_COLORS = ['yellow', 'pink', 'cyan', 'orange', 'lime'] as const;

const hashStringToColorIndex = (str: string): number =>
  [...str].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 0);

// Helper to get accent color from category, with hash-based fallback for variety
const getCategoryColor = (category?: string, slug?: string): string => {
  const colorMap: Record<string, string> = {
    'Data': 'cyan',
    'API': 'yellow',
    'Productivity': 'pink',
    'Entertainment': 'orange',
    'Local': 'lime',
  };
  const mapped = colorMap[category || ''];
  if (mapped) return mapped;
  // Use slug hash for visual variety instead of always defaulting to yellow
  const index = Math.abs(hashStringToColorIndex(slug || '')) % PALETTE_COLORS.length;
  return PALETTE_COLORS[index];
};

// Helper to get icon from category
const getCategoryIcon = (category?: string): string => {
  const iconMap: Record<string, string> = {
    'Data': '📊',
    'API': '🔌',
    'Productivity': '⚡',
    'Entertainment': '🎮',
    'Local': '📍',
    'Transit': '🚌',
    'Food': '🥟',
    'Research': '📚',
    'Weather': '⛈️',
    'Sports': '🏈',
  };
  return iconMap[category || ''] || '🔧';
};

// Tailwind class mappings for accent colors
export const ACCENT_COLOR_CLASSES: Record<string, { bg: string; bgSolid: string }> = {
  yellow: { bg: "bg-pop-yellow", bgSolid: "bg-pop-yellow" },
  pink: { bg: "bg-pop-pink", bgSolid: "bg-pop-pink" },
  cyan: { bg: "bg-pop-cyan", bgSolid: "bg-pop-cyan" },
  orange: { bg: "bg-pop-orange", bgSolid: "bg-pop-orange" },
  lime: { bg: "bg-pop-lime", bgSolid: "bg-pop-lime" },
};

// Transform backend skill to display skill
export const toDisplaySkill = (skill: BackendSkill): Skill => {
  const owner = getSkillOwner(skill.repoUrl);
  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    author: skill.author || 'Community',
    owner,
    description: skill.shortDescription || skill.description || '',
    shortDescription: skill.shortDescription,
    stars: skill.stars,
    agents: skill.agents || [],
    category: skill.category || undefined,
    version: skill.version || undefined,
    featured: false,
    // Standalone repo → use repo URL directly; bundled → use skills-nat mono-repo
    installCommand: buildInstallCommand(skill.slug, skill.repoUrl),
    // Default color based on category, with slug-based hash fallback for variety
    accentColor: getCategoryColor(skill.category || undefined, skill.slug),
    // Default icon based on category
    icon: getCategoryIcon(skill.category || undefined),
  };
};
