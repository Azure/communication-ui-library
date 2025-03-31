import { ChangelogEntry, PackageChangelogRenderInfo } from 'beachball';
import { getPrNumber, repoDetails } from './github-functions';

const repoUrl = `https://github.com/${repoDetails.owner}/${repoDetails.repo}`;

function renderHeader(renderInfo: PackageChangelogRenderInfo): string {
  const {
    newVersionChangelog: { version, date },
    previousJson
  } = renderInfo;

  // Link to the tag on github
  const header = `[${version}](${repoUrl}/tree/${version})`;

  // Also include a compare link to the previous version if available
  const previousVersion = previousJson?.entries?.[0]?.version;
  const compareLink = version && previousVersion ? ` \n[Compare changes](${repoUrl}/compare/${previousVersion}...${version})` : '';

  return `## ${header}\n\n${date.toUTCString()}${compareLink}`;
}

async function renderEntry(entry: ChangelogEntry): Promise<string> {
  // Link to the PR for this changelog entry (or the commit if PR isn't found)
  const prNumber = await getPrNumber(entry['commit']);
  const commitLink = prNumber ? `[PR #${prNumber}](${repoUrl}/pull/${prNumber})` : `[commit](${repoUrl}/commit/${entry['commit']})`;
  const commitComment = `- ${entry['comment']} (${commitLink} by ${entry['author']})\n`
  return commitComment;
}

async function renderSubsection(title: string, entries: ChangelogEntry[]): Promise<string> {
  let subsection = `### ${title}\n`;
  for (const entry of entries) {
    subsection += await renderEntry(entry);
  }
  return subsection;
}

function filterByArea(list: ChangelogEntry[], area: string) {
  let filteredByArea = list.filter((entry) => { 
    return entry['area'] === area 
  });

  return filteredByArea;
}

function filterUnknown(list: ChangelogEntry[]) {
  let unknown = list.filter((entry) => { 
    return entry['area'] === undefined 
  });

  return unknown;
}

export async function renderPackageChangelog(renderInfo: PackageChangelogRenderInfo): Promise<string> {
  let changelog = '';
  let features: ChangelogEntry[] = [];
  let improvements: ChangelogEntry[] = [];
  let bugs: ChangelogEntry[] = [];
  let storybookChanges: ChangelogEntry[] = [];
  let unknowns: ChangelogEntry[] = [];

  changelog = renderHeader(renderInfo) + '\n\n';
  for (const [changetype, entries] of Object.entries(renderInfo.newVersionChangelog.comments)) {
    if (entries.length > 0) {
      features = features.concat(filterByArea(entries, 'feature'));
      improvements = improvements.concat(filterByArea(entries, 'improvement'));
      bugs = bugs.concat(filterByArea(entries, 'fix'));
      storybookChanges = storybookChanges.concat(filterByArea(entries, 'storybook'));
      unknowns = unknowns.concat(filterUnknown(entries));
    }
  }

  if (features.length > 0) {
    changelog += await renderSubsection('Features', features);
  }
  if (improvements.length > 0) {
    changelog += await renderSubsection('Improvements', improvements);
  }
  if (bugs.length > 0) {
    changelog += await renderSubsection('Bug Fixes', bugs);
  }
  if (storybookChanges.length > 0) {
    changelog += await renderSubsection('Storybook Changes', storybookChanges);
  }
  if (unknowns.length > 0) {
    changelog += await renderSubsection('Other Changes', unknowns);
  }
  
  return changelog;
};