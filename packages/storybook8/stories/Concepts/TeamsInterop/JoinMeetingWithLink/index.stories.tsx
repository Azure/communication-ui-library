import { Meta } from '@storybook/react';
import { JoinMeetingWithLink as JoinMeetingWithLinkComponent, storyControls } from './JoinMeetingWithLink.story';
import { defaultCallWithChatCompositeHiddenControls } from '../utils/controlsUtils';

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
