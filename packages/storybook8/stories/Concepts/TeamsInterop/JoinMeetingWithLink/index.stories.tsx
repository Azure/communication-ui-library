import { Meta } from '@storybook/react';
import { JoinMeetingWithLink, storyControls } from './JoinMeetingWithLink.story';
import { defaultCallWithChatCompositeHiddenControls } from '../utils/controlsUtils';

export const JoinMeetingWithLinkDocsOnly = {
  render: JoinMeetingWithLink
};

export default {
  title: 'Concepts/Teams Interop/Join Meeting With Link',
  component: JoinMeetingWithLink,
  argTypes: {
    ...storyControls,
    ...defaultCallWithChatCompositeHiddenControls
  },
  args: {}
} as Meta;
