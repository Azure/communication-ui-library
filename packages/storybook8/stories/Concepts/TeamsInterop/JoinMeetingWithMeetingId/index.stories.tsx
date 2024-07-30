import { Meta } from '@storybook/react';
import {
  JoinMeetingWithMeetingId as JoinMeetingWithMeetingIdComponent,
  storyControls
} from './JoinMeetingWithMeetingId.story';
import { defaultCallWithChatCompositeHiddenControls } from '../utils/controlsUtils';

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
