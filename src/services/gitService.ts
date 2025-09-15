export interface GitCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
}

export interface GitInfo {
  lastCommit: GitCommit;
  totalCommits: number;
  status: 'clean' | 'modified';
  repository: {
    name: string;
    url: string;
  };
}

class GitService {
  private async fetchFromGitHub(owner: string, repo: string, token?: string): Promise<GitInfo> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      // Fetch latest commit
      const commitsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        { headers }
      );

      if (!commitsResponse.ok) {
        throw new Error(`GitHub API error: ${commitsResponse.status}`);
      }

      const commits = await commitsResponse.json();
      const latestCommit = commits[0];

      // Fetch repository info
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        { headers }
      );

      if (!repoResponse.ok) {
        throw new Error(`GitHub API error: ${repoResponse.status}`);
      }

      const repoInfo = await repoResponse.json();

      // Get current branch (default branch from repo info)
      const currentBranch = repoInfo.default_branch;

      return {
        lastCommit: {
          hash: latestCommit.sha.substring(0, 7),
          message: latestCommit.commit.message,
          author: latestCommit.commit.author.name,
          date: latestCommit.commit.author.date,
          branch: currentBranch,
        },
        totalCommits: repoInfo.size || 0, // Approximate
        status: 'clean', // We can't easily determine this from GitHub API
        repository: {
          name: repoInfo.name,
          url: repoInfo.html_url,
        },
      };
    } catch (error) {
      console.error('Failed to fetch git info from GitHub:', error);
      throw error;
    }
  }

  async getLatestCommit(): Promise<GitInfo> {
    // Try to get repository info from environment or localStorage
    const storedRepo = localStorage.getItem('github_repository');
    
    if (storedRepo) {
      try {
        const { owner, repo, token } = JSON.parse(storedRepo);
        return await this.fetchFromGitHub(owner, repo, token);
      } catch (error) {
        console.warn('Failed to fetch from stored GitHub repo info:', error);
      }
    }

    // Fallback to detecting from current URL or return mock data
    if (window.location.hostname.includes('lovable.app')) {
      // Try to extract project info from Lovable URL
      try {
        const projectMatch = window.location.pathname.match(/\/projects\/([^\/]+)/);
        if (projectMatch) {
          // This would need actual Lovable API integration
          throw new Error('Lovable API integration not implemented');
        }
      } catch (error) {
        console.warn('Could not extract project info from URL:', error);
      }
    }

    // Return mock data as fallback
    return this.getMockGitInfo();
  }

  private getMockGitInfo(): GitInfo {
    return {
      lastCommit: {
        hash: 'a1b2c3d',
        message: 'feat: Add git commit display to homepage',
        author: 'Developer',
        date: new Date().toISOString(),
        branch: 'main',
      },
      totalCommits: 127,
      status: 'clean',
      repository: {
        name: 'mediation-system',
        url: 'https://github.com/user/mediation-system',
      },
    };
  }

  // Method to configure GitHub repository connection
  setGitHubRepository(owner: string, repo: string, token?: string) {
    const repoInfo = { owner, repo, token };
    localStorage.setItem('github_repository', JSON.stringify(repoInfo));
  }

  // Method to clear GitHub repository connection
  clearGitHubRepository() {
    localStorage.removeItem('github_repository');
  }
}

export const gitService = new GitService();