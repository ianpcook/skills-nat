/**
 * GitHub Publisher - Pushes approved skills to the skills-nat repository
 */

import type { SubmissionFile } from '@/db/schema';

const GITHUB_OWNER = 'ianpcook';
const GITHUB_REPO = 'skills-nat';
const GITHUB_BRANCH = 'main';
const SKILLS_PATH = 'skills';

interface GitHubFileContent {
  sha?: string;
  content?: string;
}

interface PublishResult {
  success: boolean;
  filesPublished: number;
  error?: string;
}

/**
 * Get the GitHub token from environment
 */
const getGitHubToken = (): string | null => {
  return process.env.GITHUB_TOKEN || null;
};

/**
 * Get file content and SHA from GitHub (needed for updates)
 */
const getFileFromGitHub = async (
  path: string,
  token: string
): Promise<GitHubFileContent | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(`[GITHUB] Failed to get file ${path}:`, response.status);
      return null;
    }

    const data = await response.json();
    return {
      sha: data.sha,
      content: data.content,
    };
  } catch (error) {
    console.error(`[GITHUB] Error getting file ${path}:`, error);
    return null;
  }
};

/**
 * Create or update a file on GitHub
 */
const pushFileToGitHub = async (
  path: string,
  content: string,
  message: string,
  token: string,
  existingSha?: string
): Promise<boolean> => {
  try {
    const body: Record<string, string> = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
    };

    if (existingSha) {
      body.sha = existingSha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[GITHUB] Failed to push file ${path}:`, errorData);
      return false;
    }

    console.log(`[GITHUB] Successfully pushed ${path}`);
    return true;
  } catch (error) {
    console.error(`[GITHUB] Error pushing file ${path}:`, error);
    return false;
  }
};

/**
 * Publish a skill's files to the GitHub repository
 */
export const publishSkillToGitHub = async (
  slug: string,
  files: SubmissionFile[]
): Promise<PublishResult> => {
  const token = getGitHubToken();

  if (!token) {
    console.warn('[GITHUB] No GITHUB_TOKEN configured, skipping publish');
    return {
      success: false,
      filesPublished: 0,
      error: 'GITHUB_TOKEN not configured',
    };
  }

  console.log(`[GITHUB] Publishing skill "${slug}" with ${files.length} files`);

  let filesPublished = 0;

  for (const file of files) {
    const filePath = `${SKILLS_PATH}/${slug}/${file.name}`;

    // Check if file already exists (to get SHA for update)
    const existing = await getFileFromGitHub(filePath, token);

    const success = await pushFileToGitHub(
      filePath,
      file.content,
      existing
        ? `Update ${file.name} in skill ${slug}`
        : `Add ${file.name} to skill ${slug}`,
      token,
      existing?.sha
    );

    if (success) {
      filesPublished++;
    }
  }

  const allSucceeded = filesPublished === files.length;

  console.log(
    `[GITHUB] Published ${filesPublished}/${files.length} files for skill "${slug}"`
  );

  return {
    success: allSucceeded,
    filesPublished,
    error: allSucceeded ? undefined : `Only ${filesPublished}/${files.length} files published`,
  };
};

/**
 * Delete a skill's folder from GitHub
 */
export const deleteSkillFromGitHub = async (slug: string): Promise<boolean> => {
  const token = getGitHubToken();

  if (!token) {
    console.warn('[GITHUB] No GITHUB_TOKEN configured, skipping delete');
    return false;
  }

  console.log(`[GITHUB] Deleting skill "${slug}" from repository`);

  // First, list all files in the skill folder
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${SKILLS_PATH}/${slug}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 404) {
      console.log(`[GITHUB] Skill folder "${slug}" not found, nothing to delete`);
      return true;
    }

    if (!response.ok) {
      console.error(`[GITHUB] Failed to list skill folder:`, response.status);
      return false;
    }

    const files = await response.json();

    // Delete each file
    for (const file of files) {
      const deleteResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file.path}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Delete ${file.name} from skill ${slug}`,
            sha: file.sha,
            branch: GITHUB_BRANCH,
          }),
        }
      );

      if (!deleteResponse.ok) {
        console.error(`[GITHUB] Failed to delete ${file.path}`);
      }
    }

    console.log(`[GITHUB] Deleted skill "${slug}" from repository`);
    return true;
  } catch (error) {
    console.error(`[GITHUB] Error deleting skill "${slug}":`, error);
    return false;
  }
};
