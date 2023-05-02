// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CheckBreakingChanges, ExcludeList } from './CompareChanges';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type BreakingChangeTest = CheckBreakingChanges<
  Omit<typeof import('./snapshots/communication-react'), ExcludeList>,
  typeof import('../dist/communication-react')
>;
