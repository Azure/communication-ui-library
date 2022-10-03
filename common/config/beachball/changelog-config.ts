import { BeachballConfig } from 'beachball';
import { renderHeader, renderEntry } from './changelog-custom-renders';

export const config: BeachballConfig = {
  changelog: {
    customRenderers: {
      renderHeader,
      renderEntry
    },
    groups: [{
      masterPackageName: '@azure/communication-react',
      include: 'packages/*',
      changelogPath: 'packages/communication-react'
    }]
  },
  ignorePatterns: [
    // do not require change files for tests or snapshots
    "**/*.test.ts?(x)",
    "**/tests/**",
    "**/__snapshots__/**",
    "**/*-snapshots/**",
    "**/playwright.config.ts"
  ],
  tag: "next",
  changehint: 'Run "rush changelog" to create required change files',
  // We use package groups to bump all our internal dependent packages together.
  // There seems to be a bug in how beachball handles prerelease vs patch change types.
  // Setting `bumpDeps` to true can cause beachball to attempt to bump a dependent package
  // in the group to `patch` even though the group is being bumped to `prelease`.
  // This causes infinite recursion inside beachball.
  bumpDeps: false,
  groups: [
    {
      name: "@azure/communication-react and its packlets",
      include: "packages/*",
      disallowedChangeTypes: [
        "major"
      ]
    }
  ]
};
