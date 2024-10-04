// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../controlsUtils';
import { IncomingCallToast as IncomingCallToastStory } from './IncomingCallToast.story';

export const IncomingCallToast = {
  render: IncomingCallToastStory
};

export default {
  id: 'examples-incomingcallalerts-incomingcalltoast',
  title: 'examples/Incoming Call Alerts/Incoming Call Toast',
  component: IncomingCallToastStory,
  argTypes: {
    callerName: controlsToAdd.callerName,
    alertText: controlsToAdd.callToastAlertText,
    images: controlsToAdd.callerImages,
    // Hiding auto-generated controls
    avatar: hiddenControl,
    onClickAccept: hiddenControl,
    onClickReject: hiddenControl
  },
  args: {
    callerName: controlsToAdd.callerName.defaultValue,
    alertText: controlsToAdd.callToastAlertText.defaultValue,
    images: controlsToAdd.callerImages.defaultValue
  }
} as Meta;
