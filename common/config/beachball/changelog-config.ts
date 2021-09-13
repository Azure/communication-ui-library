import { BeachballConfig } from 'beachball';
import { renderHeader, renderEntry } from './changelog-custom-renders';

export const config: BeachballConfig = {
  branch: 'origin/main',
  changelog: {
    customRenderers: {
      renderHeader,
      renderEntry
    }
  },
  tag: "next",
  changehint: 'Run "rush changelog" to create required change files',
  groups: [
    {
      name: "@azure/communication-react and its packlets",
      include: "packages/*",
      disallowedChangeTypes: [
        "major",
        "minor",
        "patch"
      ]
    }
  ]
};
