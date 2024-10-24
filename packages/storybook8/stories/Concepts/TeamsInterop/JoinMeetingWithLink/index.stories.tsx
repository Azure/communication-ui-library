// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Meta } from '@storybook/react';
import { defaultCallWithChatCompositeHiddenControls } from '../utils/controlsUtils';
import { JoinMeetingWithLink as JoinMeetingWithLinkComponent, storyControls } from './JoinMeetingWithLink.story';

export const JoinMeetingWithLink = {
  render: JoinMeetingWithLinkComponent
};

export default {
  title: 'Concepts/Teams Interop/Join Meeting With Link',
  component: JoinMeetingWithLinkComponent,
  argTypes: {
    ...storyControls,
    ...defaultCallWithChatCompositeHiddenControls
  },
  args: {}
} as Meta;
