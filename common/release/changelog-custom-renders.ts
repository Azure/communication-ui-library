import { PackageChangelogRenderInfo, ChangelogEntry } from 'beachball';
import { getPrNumber, repoDetails } from './github-functions';

const repoUrl = `https://github.com/${repoDetails.owner}/${repoDetails.repo}`;

export async function renderHeader(renderInfo: PackageChangelogRenderInfo): Promise<string> {
  const {
    newVersionChangelog: { tag, version, date },
    previousJson
  } = renderInfo;

  // Link to the tag on github
  const header = tag ? `[${version}](${repoUrl}/tree/${tag})` : version;

  // Also include a compare link to the previous tag if available
  const previousTag = previousJson?.entries?.[0]?.tag;
  const compareLink = tag && previousTag ? ` \n[Compare changes](${repoUrl}/compare/${previousTag}..${tag})` : '';

  return `## ${header}\n\n${date.toUTCString()}${compareLink}`;
}

export async function renderEntry(entry: ChangelogEntry): Promise<string> {
  // Link to the PR for this changelog entry (or the commit if PR isn't found)
  const prNumber = await getPrNumber(entry.commit);
  const commitLink = prNumber
    ? `[PR #${prNumber}](${repoUrl}/pull/${prNumber})`
    : `[commit](${repoUrl}/commit/${entry.commit})`;
  return `- ${entry.comment} (${commitLink} by ${entry.author})`;
}
