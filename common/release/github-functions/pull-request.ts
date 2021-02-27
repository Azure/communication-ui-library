import { spawnSync } from 'child_process';
import { Octokit } from '@octokit/rest';
import { github } from './github-instance';
import { IPullRequest, IRepoDetails } from './types';
import { repoDetails } from './constants';

export interface IGetPullRequestFromCommitParams {
  github: Octokit;
  repoDetails: IRepoDetails;
  // Commit hash
  commit: string;
  // Provide this to have it included in the resulting IPullRequest
  authorEmail?: string;
  verbose?: boolean;
}

/**
 * Get the pull request info corresponding to the given commit.
 * (The `author.email` property is only present if `authorEmail` is provided.)
 */
async function getPullRequestForCommit(params: IGetPullRequestFromCommitParams): Promise<IPullRequest | undefined> {
  const { github, repoDetails, commit, authorEmail, verbose } = params;

  verbose && console.log(`Looking for the PR containing ${commit}...`);

  try {
    // Attempt to directly find the PR corresponding to the commit from the change file
    const result = await github.repos.listPullRequestsAssociatedWithCommit({
      commit_sha: commit,
      ...repoDetails
    });

    // Filter out unmerged PRs, in case the commit has been in multiple PRs but only one got merged
    // (check merged_at because that's only set if the PR has been merged, whereas merge_commit_sha
    // is set even for un-merged PRs, to the most recent intermediate merge)
    const prs = result.data.filter((result) => !!result.merged_at);
    if (prs.length > 1) {
      // In case the commit was in PRs to multiple branches or something?
      console.warn(`Multiple PRs found for ${commit}:`);
      console.warn(prs.map((pr) => `  ${pr.url}`).join('\n'));
    }

    if (prs[0]) {
      verbose && console.log(`Found matching PR #${prs[0].number}.\n`);
      return processPullRequestApiResponse(prs[0], authorEmail);
    }
  } catch (ex) {
    console.warn(`Error finding PR for ${commit}`, ex);
    return;
  }

  console.warn(`Could not find a PR matching ${commit}.`);
}

/**
 * Convert a GitHub API response to an IPullRequest.
 * The `author.email` property is only present if `authorEmail` is provided.
 */
export function processPullRequestApiResponse(pr: any, authorEmail?: string): IPullRequest {
  return {
    number: pr.number,
    url: pr.html_url,
    author: {
      email: authorEmail,
      username: pr.user.login,
      url: pr.user.html_url
    }
  };
}

export async function getPrNumber(commit: string): Promise<number | undefined> {
  // Look for (presumably) the PR number at the end of the first line of the commit
  try {
    // Get the actual commit message which should contain the PR number
    const logResult = spawnSync('git', ['log', '--pretty=format:%s', '-n', '1', commit]);
    if (logResult.status === 0) {
      const message = logResult.stdout.toString().trim();
      const prMatch = message.split(/\r?\n/)[0].match(/\(#(\d+)\)$/m);
      if (prMatch) {
        return Number(prMatch[1]);
      }
    }
  } catch (ex) {
    console.log(`Could not get commit message for ${commit} to find PR number (trying another method):`, ex);
  }

  // Or fetch from GitHub API
  console.log(`Attempting to fetch pull request corresponding to ${commit}...`);
  const pr = await getPullRequestForCommit({
    commit: commit,
    github,
    repoDetails: repoDetails
  });
  if (pr) {
    console.log('...success!'); // failure message is logged by getPullRequestForCommit
    return pr.number;
  }
}
