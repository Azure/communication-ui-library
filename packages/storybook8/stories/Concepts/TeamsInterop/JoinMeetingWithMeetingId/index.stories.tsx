// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Meta } from '@storybook/react';
import { defaultCallWithChatCompositeHiddenControls } from '../utils/controlsUtils';
import {
  JoinMeetingWithMeetingId as JoinMeetingWithMeetingIdComponent,
  storyControls
} from './JoinMeetingWithMeetingId.story';

export const JoinMeetingWithMeetingId = {
  render: JoinMeetingWithMeetingIdComponent
};

export default {
  title: 'Concepts/Teams Interop/Join Meeting With Meeting Id',
  component: JoinMeetingWithMeetingIdComponent,
  argTypes: {
    ...storyControls,
    ...defaultCallWithChatCompositeHiddenControls
  },
  args: {}
} as Meta;
