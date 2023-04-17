// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// import from @azure/communication-react to ensure tsc tries to parse the `@azure/communication-react/dist/typings.d.ts` file
import * as communicationreact from '@azure/communication-react';

if (!communicationreact) {
  throw new Error('communicationreact is undefined');
}
