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
}

// Display skill type (for UI)
export interface Skill {
  id: string;
  slug?: string;
  name: string;
  author: string;
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
export const toDisplaySkill = (skill: BackendSkill): Skill => ({
  id: skill.id,
  slug: skill.slug,
  name: skill.name,
  author: skill.author || 'Anonymous',
  description: skill.shortDescription || skill.description || '',
  shortDescription: skill.shortDescription,
  stars: skill.stars,
  agents: skill.agents || [],
  category: skill.category || undefined,
  version: skill.version || undefined,
  featured: false,
  // Generate install command from slug
  installCommand: `npx skillsnat add @pgh/${skill.slug}`,
  // Default color based on category or hash
  accentColor: getCategoryColor(skill.category || undefined),
  // Default icon based on category
  icon: getCategoryIcon(skill.category || undefined),
});
