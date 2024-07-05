// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantItem as ParticipantItemComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { CustomAvatarExample } from './snippets/CustomAvatar.snippet';
import { CustomIconExample } from './snippets/CustomIcon.snippet';
import { ParticipantItemExample } from './snippets/ParticipantItem.snippet';
export { ParticipantItem } from './ParticipantItem.story';

export const ParticipantItemSnippetDocsOnly = {
  render: ParticipantItemExample
};

export const CustomAvatarSnippetDocsOnly = {
  render: CustomAvatarExample
};

export const CustomIconSnippetDocsOnly = {
  render: CustomIconExample
};

const meta: Meta = {
  title: 'Components/Participant Item',
  component: ParticipantItemComponent,
  argTypes: {
    displayName: controlsToAdd.displayName,
    isScreenSharing: controlsToAdd.isScreenSharing,
    isMuted: controlsToAdd.isMuted,
    me: controlsToAdd.isMe,
    menuItemsStr: controlsToAdd.participantItemMenuItemsStr,
    isRaisedHand: controlsToAdd.isRaisedHand,
    // Hidden controls
    userId: hiddenControl,
    onRenderAvatar: hiddenControl,
    menuItems: hiddenControl,
    onRenderIcon: hiddenControl,
    presence: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl,
    onClick: hiddenControl,
    showParticipantOverflowTooltip: hiddenControl,
    participantState: hiddenControl,
    ariaLabelledBy: hiddenControl
  },
  args: {
    displayName: 'August Manning',
    isScreenSharing: true,
    isMuted: true,
    me: false,
    menuItemsStr: 'Mute, Remove',
    isRaisedHand: false
  }
};

export default meta;
