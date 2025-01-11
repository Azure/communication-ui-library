// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBanner } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { CaptionsBanner } from './CaptionsBanner.story';

const meta: Meta = {
  title: 'Components/Captions Banner',
  component: CaptionsBanner,
  argTypes: {
    captions: hiddenControl,
    realTimeTexts: hiddenControl,
    isCaptionsOn: hiddenControl,
    startCaptionsInProgress: hiddenControl,
    strings: hiddenControl,
    onRenderAvatar: hiddenControl,
    formFactor: hiddenControl,
    captionsOptions: hiddenControl,
    isRealTimeTextOn: hiddenControl,
    onSendRealTimeText: hiddenControl,
    latestLocalRealTimeText: hiddenControl
  }
};

export default meta;
