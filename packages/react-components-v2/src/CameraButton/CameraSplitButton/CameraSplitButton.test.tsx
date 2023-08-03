// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { isConformant } from '../../test-utils/isConformant';
import { CameraSplitButton } from './CameraSplitButton';
import { CameraSplitButtonProps } from './CameraSplitButton.types';

describe('CameraSplitButton', () => {
  isConformant({
    Component: CameraSplitButton as React.FunctionComponent<CameraSplitButtonProps>
  });
});
