// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isConformant } from '../../test-utils/isConformant';
import { CameraSelectionMenuGroup } from './CameraSelectionMenuGroup';

const testCameras = [
  { id: '0', name: 'camera0' },
  { id: '1', name: 'camera1' },
  { id: '2', name: 'camera2' }
];

describe('CameraSelectionMenuGroup', () => {
  isConformant({
    Component: CameraSelectionMenuGroup,
    requiredProps: {
      availableCameras: testCameras,
      selectedCamera: testCameras[1],
      onSelectCamera: () => {}
    }
  });
});
