// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBanner } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';

export { CaptionsBanner } from './CaptionsBanner.story';

const meta: Meta = {
  title: 'Components/Captions Banner',
  component: CaptionsBanner,
  argTypes: {
    captions: hiddenControl,
    realTimeTexts: hiddenControl,
    strings: hiddenControl,
    onRenderAvatar: hiddenControl,
    captionsOptions: hiddenControl,
    onSendRealTimeText: hiddenControl,
    latestLocalRealTimeText: hiddenControl,
    isCaptionsOn: controlsToAdd.isCaptionsOn,
    formFactor: controlsToAdd.captionsFormFactor,
    isRealTimeTextOn: controlsToAdd.isRealTimeTextOn,
    startCaptionsInProgress: controlsToAdd.startCaptionsInProgress
  },
  args: {
    isCaptionsOn: true,
    formFactor: 'default',
    isRealTimeTextOn: true,
    startCaptionsInProgress: false
  }
};

export default meta;
