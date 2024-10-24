// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ParticipantsButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { ParticipantsButtonDefaultExample } from './snippets/Default.snippet';
import { ParticipantsButtonWithCallLinkExample } from './snippets/WithCallLink.snippet';
import { ParticipantsButtonWithCustomRenderExample } from './snippets/WithCustomRender.snippet';
import { ParticipantsButtonWithCustomStylesExample } from './snippets/WithCustomStyles.snippet';
import { ParticipantsButtonWithLabelExample } from './snippets/WithLabel.snippet';
import { ParticipantsButtonWithMuteAllOptionExample } from './snippets/WithMuteAllOption.snippet';
import { ParticipantsButtonWithUserExcludeFromListExample } from './snippets/WithUserExcludeFromList.snippet';

export { Participants } from './Participants.story';

export const ParticipantsButtonDefaultExampleDocsOnly = {
  render: ParticipantsButtonDefaultExample
};

export const ParticipantsButtonWithLabelExampleDocsOnly = {
  render: ParticipantsButtonWithLabelExample
};

export const ParticipantsButtonWithCallLinkExampleDocsOnly = {
  render: ParticipantsButtonWithCallLinkExample
};

export const ParticipantsButtonWithCustomRenderExampleDocsOnly = {
  render: ParticipantsButtonWithCustomRenderExample
};

export const ParticipantsButtonWithCustomStylesExampleDocsOnly = {
  render: ParticipantsButtonWithCustomStylesExample
};

export const ParticipantsButtonWithMuteAllOptionExampleDocsOnly = {
  render: ParticipantsButtonWithMuteAllOptionExample
};

export const ParticipantsButtonWithUserExcludeFromListExampleDocsOnly = {
  render: ParticipantsButtonWithUserExcludeFromListExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Participants',
  component: ParticipantsButton,
  argTypes: {
    isMuteAllAvailable: controlsToAdd.isMuteAllAvailable,
    showLabel: controlsToAdd.showLabel,
    callInvitationURL: controlsToAdd.callInvitationURL,
    participants: controlsToAdd.participantNames,
    // Hiding auto-generated controls
    onRenderParticipantList: hiddenControl,
    styles: hiddenControl,
    onMuteAll: hiddenControl,
    strings: hiddenControl,
    myUserId: hiddenControl,
    excludeMe: hiddenControl,
    onRenderParticipant: hiddenControl,
    onRenderAvatar: hiddenControl,
    onRemoveParticipant: hiddenControl,
    onFetchParticipantMenuItems: hiddenControl,
    showParticipantOverflowTooltip: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    disableTooltip: hiddenControl,
    tooltipId: hiddenControl,
    labelKey: hiddenControl
  },
  args: {
    isMuteAllAvailable: false,
    showLabel: false,
    callInvitationURL: '',
    participants: 'You, Hal Jordan, Barry Allen, Bruce Wayne'
  }
};
export default meta;
