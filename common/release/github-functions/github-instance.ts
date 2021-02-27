import { Octokit } from '@octokit/rest';
import { repoDetails } from './constants';

const githubPAT = process.env.GH_TOKEN;
if (!githubPAT && (process.argv.includes('bump') || process.argv.includes('publish'))) {
  console.warn('\nGITHUB_PAT environment variable not found. GitHub requests may be rate-limited.\n');
}

// Octokit is used to access the GitHub REST API
export const github = new Octokit({
  ...repoDetails,
  ...(githubPAT && { auth: 'token ' + githubPAT })
});
