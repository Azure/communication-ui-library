// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isConformant } from '../test-utils/isConformant';
import { ExampleComponent } from './ExampleComponent';

describe('ExampleComponent', () => {
  isConformant({
    Component: ExampleComponent
  });
});
