// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { defaultFluentDisabledTests, isConformant } from '../test-utils/isConformant';
import { DeviceMenuItemRadio } from './DeviceMenuItemRadio';

describe('DeviceMenuItemRadio', () => {
  isConformant({
    Component: DeviceMenuItemRadio,
    disabledTests: [
      ...defaultFluentDisabledTests,
      'component-has-root-ref',
      'component-handles-classname',
      'component-handles-ref'
    ]
  });
});
