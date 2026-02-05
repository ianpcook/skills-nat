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

// Helper to get accent color from category
const getCategoryColor = (category?: string): string => {
  const colorMap: Record<string, string> = {
    'Data': 'cyan',
    'API': 'yellow',
    'Productivity': 'pink',
    'Entertainment': 'orange',
    'Local': 'lime',
  };
  return colorMap[category || ''] || 'yellow';
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

// Transform backend skill to display skill
export const toDisplaySkill = (skill: BackendSkill): Skill => {
  const owner = getSkillOwner(skill.repoUrl);
  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    author: skill.author || 'Anonymous',
    owner,
    description: skill.shortDescription || skill.description || '',
    shortDescription: skill.shortDescription,
    stars: skill.stars,
    agents: skill.agents || [],
    category: skill.category || undefined,
    version: skill.version || undefined,
    featured: false,
    // Generate install command from slug and owner
    installCommand: `npx skillsnat add ${owner}/${skill.slug}`,
    // Default color based on category or hash
    accentColor: getCategoryColor(skill.category || undefined),
    // Default icon based on category
    icon: getCategoryIcon(skill.category || undefined),
  };
};
