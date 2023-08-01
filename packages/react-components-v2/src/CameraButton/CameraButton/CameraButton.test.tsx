// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isConformant } from '../../test-utils/isConformant';
import { CameraButton } from './CameraButton';
import { CameraButtonProps } from './CameraButton.types';

describe('CameraButton', () => {
  isConformant({
    Component: CameraButton as React.FunctionComponent<CameraButtonProps>
  });
});
