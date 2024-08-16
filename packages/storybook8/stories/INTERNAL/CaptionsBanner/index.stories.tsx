// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _CaptionsBanner } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { CaptionsBanner } from './CaptionsBanner.story';

const meta: Meta = {
  title: 'Components/Internal/Captions Banner',
  component: _CaptionsBanner,
  argTypes: {
    captions: hiddenControl,
    onRenderAvatar: hiddenControl,
    isCaptionsOn: hiddenControl
  }
};

export default meta;
