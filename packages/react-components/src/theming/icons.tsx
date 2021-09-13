// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CallEnd20Filled,
  Checkmark20Regular,
  CheckmarkCircle20Regular,
  Circle20Regular,
  Delete20Regular,
  Dismiss20Regular,
  Edit20Regular,
  ErrorCircle20Regular,
  EyeShow20Filled,
  MicOff16Filled,
  MicOff20Filled,
  MicOn20Filled,
  MicOn20Regular,
  MoreHorizontal20Filled,
  MoreHorizontal20Regular,
  People20Filled,
  Send20Filled,
  Send20Regular,
  ShareScreenStart20Filled,
  ShareScreenStop20Filled,
  Speaker220Regular,
  Video20Filled,
  Video20Regular,
  VideoOff20Filled
} from '@fluentui/react-icons';
import React from 'react';

export type ComponentIcons = Record<keyof typeof DEFAULT_COMPONENT_ICONS, JSX.Element>;

/**
 * The default set of icons that are available to use in the UI components.
 */
// NOTE: Don't forget to add icons used in composites to the types in `packages/react-composites/src/composites/common/icons.tsx`
export const DEFAULT_COMPONENT_ICONS = {
  ControlButtonCameraOff: <VideoOff20Filled />,
  ControlButtonCameraOn: <Video20Filled />,
  ControlButtonEndCall: <CallEnd20Filled />,
  ControlButtonMicOff: <MicOff20Filled />,
  ControlButtonMicOn: <MicOn20Filled />,
  ControlButtonOptions: <MoreHorizontal20Filled />,
  ControlButtonParticipants: <People20Filled />,
  ControlButtonScreenShareStart: <ShareScreenStart20Filled />,
  ControlButtonScreenShareStop: <ShareScreenStop20Filled />,
  MessageDelivered: <CheckmarkCircle20Regular />,
  MessageFailed: <ErrorCircle20Regular />,
  MessageSeen: <EyeShow20Filled />,
  MessageSending: <Circle20Regular />,
  OptionsCamera: <Video20Regular />,
  OptionsMic: <MicOn20Regular />,
  OptionsSpeaker: <Speaker220Regular />,
  ParticipantItemScreenShareStart: <ShareScreenStart20Filled />,
  ParticipantItemMicOff: <MicOff16Filled />,
  ParticipantItemOptions: <MoreHorizontal20Regular />,
  ParticipantItemOptionsHovered: <MoreHorizontal20Filled />,
  SendBoxSend: <Send20Regular />,
  SendBoxSendHovered: <Send20Filled />,
  VideoTileMicOff: <MicOff16Filled />,
  EditBoxCancel: <Dismiss20Regular />,
  EditBoxSubmit: <Checkmark20Regular />,
  MessageEdit: <Edit20Regular />,
  MessageRemove: <Delete20Regular />
};
