'use client';

import { useState } from 'react';
import Link from 'next/link';
import skillsData from '@/data/skills.json';

export default function SubmitPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const agents = skillsData.agents;
  const categories = skillsData.categories;

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isValidGitHubUrl = (url: string) => {
    return /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/.test(url);
  };

  const extractRepoInfo = (url: string) => {
    const match = url.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
  };

  if (isSubmitted) {
    const repoInfo = extractRepoInfo(repoUrl);
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Skill Submitted!</h1>
            <p className="text-[#bfbfbf] text-lg mb-8 max-w-md mx-auto">
              Your skill has been submitted for review. We&apos;ll notify you once it&apos;s approved
              and listed in the directory.
            </p>

            <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-xl p-6 mb-8 text-left">
              <h3 className="font-medium mb-4">Submission Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#bfbfbf]">Repository</span>
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ffbc20] hover:text-[#ffd980]"
                  >
                    {repoInfo?.owner}/{repoInfo?.repo}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#bfbfbf]">Category</span>
                  <span>{categories.find((c) => c.id === selectedCategory)?.name || 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-[#bfbfbf]">Agents</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {selectedAgents.map((agentId) => {
                      const agent = agents.find((a) => a.id === agentId);
                      return (
                        <span
                          key={agentId}
                          className="px-2 py-0.5 bg-[#2a2520] rounded text-xs"
                        >
                          {agent?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/skills"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] rounded-lg font-medium text-[#1a160d] transition-all"
              >
                Browse Skills
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setRepoUrl('');
                  setSelectedAgents([]);
                  setSelectedCategory('');
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1d1e1f] border border-[#2a2520] hover:border-[#ffbc20]/50 rounded-lg font-medium transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Submit a Skill</h1>
          <p className="text-[#bfbfbf] text-lg">
            Share your skill with the community. We&apos;ll review your submission and add it to the
            directory.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* GitHub Repository URL */}
          <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
            <label htmlFor="repo-url" className="block text-lg font-medium mb-2">
              GitHub Repository URL
            </label>
            <p className="text-sm text-[#807c73] mb-4">
              Enter the URL of your skill&apos;s GitHub repository
            </p>
            <input
              type="url"
              id="repo-url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/skill-name"
              className="w-full px-4 py-3 bg-[#1a160d] border border-[#2a2520] rounded-xl text-[#f5f0e6] placeholder-[#807c73] focus:outline-none focus:border-[#ffbc20] transition-colors"
              required
            />
            {repoUrl && !isValidGitHubUrl(repoUrl) && (
              <p className="text-sm text-red-400 mt-2">
                Please enter a valid GitHub repository URL
              </p>
            )}
            {repoUrl && isValidGitHubUrl(repoUrl) && (
              <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Valid GitHub URL detected
                </div>
                <p className="text-sm text-[#bfbfbf] mt-1">
                  Repository: <span className="text-[#f5f0e6]">{extractRepoInfo(repoUrl)?.owner}/{extractRepoInfo(repoUrl)?.repo}</span>
                </p>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
            <label htmlFor="category" className="block text-lg font-medium mb-2">
              Category
            </label>
            <p className="text-sm text-[#807c73] mb-4">
              Select the category that best describes your skill
            </p>
            <div className="relative">
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 bg-[#1a160d] border border-[#2a2520] rounded-xl text-[#f5f0e6] focus:outline-none focus:border-[#ffbc20] transition-colors cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#807c73] pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Supported Agents */}
          <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
            <label className="block text-lg font-medium mb-2">
              Supported Agents
            </label>
            <p className="text-sm text-[#807c73] mb-4">
              Select all the AI agents your skill is compatible with
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => toggleAgent(agent.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    selectedAgents.includes(agent.id)
                      ? 'bg-[#ffbc20]/20 border-[#ffbc20]/50 text-[#f5f0e6]'
                      : 'bg-[#1a160d] border-[#2a2520] text-[#bfbfbf] hover:border-[#ffbc20]/30'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: agent.color }}
                  />
                  <span className="text-sm font-medium">{agent.name}</span>
                  {selectedAgents.includes(agent.id) && (
                    <svg className="w-4 h-4 ml-auto text-[#ffbc20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            {selectedAgents.length === 0 && (
              <p className="text-sm text-amber-400 mt-3">
                Please select at least one agent
              </p>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-[#1d1e1f] border border-[#2a2520] rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">Submission Guidelines</h3>
            <ul className="space-y-3 text-sm text-[#bfbfbf]">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your repository must have a valid <code className="px-1.5 py-0.5 bg-[#2a2520] rounded text-xs">skill.json</code> or <code className="px-1.5 py-0.5 bg-[#2a2520] rounded text-xs">package.json</code> with skill metadata</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Include a README with installation instructions and usage examples</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your skill must be open source (MIT, Apache 2.0, or similar license)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffbc20] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No malicious code or security vulnerabilities</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !repoUrl ||
              !isValidGitHubUrl(repoUrl) ||
              !selectedCategory ||
              selectedAgents.length === 0
            }
            className="w-full px-6 py-4 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] disabled:from-[#ffbc20]/50 disabled:to-[#ffd980]/50 disabled:cursor-not-allowed rounded-xl font-medium text-[#1a160d] transition-all glow-hover flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Skill
              </>
            )}
          </button>
        </form>

        {/* Alternative method */}
        <div className="mt-12 text-center">
          <p className="text-[#807c73] text-sm mb-4">Or submit via the command line:</p>
          <div className="inline-block bg-[#1d1e1f] border border-[#2a2520] rounded-xl px-6 py-3">
            <code className="text-sm text-[#ffd980] font-mono">
              npx skills add owner/repo
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
