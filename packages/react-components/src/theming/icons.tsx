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
  MicOff16Regular,
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
  VideoOff20Filled,
  ChevronLeft20Regular,
  ChevronRight20Regular
} from '@fluentui/react-icons';
import React from 'react';

/**
 * Icons used by the React components exported from this library.
 *
 * @remark See {@link CompositeIcons} for icons used by composites only.
 *
 * @public
 */
export type ComponentIcons = Record<keyof typeof DEFAULT_COMPONENT_ICONS, JSX.Element>;

/**
 * The default set of icons that are available to use in the UI components.
 *
 * @remark Icons used only in the composites are available in {@link DEFAULT_COMPOSITE_ICONS}.
 *
 * @public
 */
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
  ParticipantItemMicOff: <MicOff16Regular />,
  ParticipantItemOptions: <MoreHorizontal20Regular />,
  ParticipantItemOptionsHovered: <MoreHorizontal20Filled />,
  SendBoxSend: <Send20Regular />,
  SendBoxSendHovered: <Send20Filled />,
  VideoTileMicOff: <MicOff16Filled />,
  EditBoxCancel: <Dismiss20Regular />,
  EditBoxSubmit: <Checkmark20Regular />,
  MessageEdit: <Edit20Regular />,
  MessageRemove: <Delete20Regular />,
  HorizontalGalleryLeftButton: <ChevronLeft20Regular />,
  HorizontalGalleryRightButton: <ChevronRight20Regular />
};
