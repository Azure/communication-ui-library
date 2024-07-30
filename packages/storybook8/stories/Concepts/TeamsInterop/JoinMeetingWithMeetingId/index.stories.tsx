import { Meta } from '@storybook/react';
import { JoinMeetingWithMeetingId, storyControls } from './JoinMeetingWithMeetingId.story';
import { defaultCallWithChatCompositeHiddenControls } from '../utils/controlsUtils';

export const JoinMeetingWithMeetingIdDocsOnly = {
  render: JoinMeetingWithMeetingId
};

export default {
  title: 'Concepts/Teams Interop/Join Meeting With Meeting Id',
  component: JoinMeetingWithMeetingId,
  argTypes: {
    ...storyControls,
    ...defaultCallWithChatCompositeHiddenControls
  },
  args: {}
} as Meta;
