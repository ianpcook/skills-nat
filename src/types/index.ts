export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  author: string;
  authorUrl: string;
  repoUrl: string;
  category: string;
  agents: string[];
  version: string;
  downloads: number;
  stars: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Agent {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface SkillsData {
  skills: Skill[];
  categories: Category[];
  agents: Agent[];
}
