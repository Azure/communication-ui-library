// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
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
  Settings20Filled,
  Send20Filled,
  Send20Regular,
  ShareScreenStart20Filled,
  ShareScreenStop20Filled,
  Speaker220Regular,
  Video20Filled,
  Video20Regular,
  VideoOff20Filled,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  WifiWarning20Filled,
  SpeakerMute16Filled,
  MicProhibited16Filled,
  VideoProhibited16Filled
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

const WifiWarning16Filled = (): JSX.Element => (
  // All ErrorBar icons are 16px x 16px (when 1rem = 16 px).
  // There is no 16px version of this icon in the fluent icon package, so scale the larger
  // one down to required size.
  <div className={mergeStyles({ transform: 'scale(0.8)' })}>
    <WifiWarning20Filled />
  </div>
);

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
  ControlButtonOptions: <Settings20Filled />,
  ControlButtonParticipants: <People20Filled />,
  ControlButtonScreenShareStart: <ShareScreenStart20Filled />,
  ControlButtonScreenShareStop: <ShareScreenStop20Filled />,
  EditBoxCancel: <Dismiss20Regular />,
  EditBoxSubmit: <Checkmark20Regular />,
  ErrorBarCallCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallCameraAlreadyInUse: <VideoProhibited16Filled />,
  ErrorBarCallLocalVideoFreeze: <WifiWarning16Filled />,
  ErrorBarCallMacOsCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallMacOsMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneMutedBySystem: <MicOff16Filled />,
  ErrorBarCallNetworkQualityLow: <WifiWarning16Filled />,
  ErrorBarCallNoMicrophoneFound: <MicProhibited16Filled />,
  ErrorBarCallNoSpeakerFound: <SpeakerMute16Filled />,
  HorizontalGalleryLeftButton: <ChevronLeft20Regular />,
  HorizontalGalleryRightButton: <ChevronRight20Regular />,
  MessageDelivered: <CheckmarkCircle20Regular />,
  MessageEdit: <Edit20Regular />,
  MessageFailed: <ErrorCircle20Regular />,
  MessageRemove: <Delete20Regular />,
  MessageSeen: <EyeShow20Filled />,
  MessageSending: <Circle20Regular />,
  OptionsCamera: <Video20Regular />,
  OptionsMic: <MicOn20Regular />,
  OptionsSpeaker: <Speaker220Regular />,
  ParticipantItemMicOff: <MicOff16Regular />,
  ParticipantItemOptions: <MoreHorizontal20Regular />,
  ParticipantItemOptionsHovered: <MoreHorizontal20Filled />,
  ParticipantItemScreenShareStart: <ShareScreenStart20Filled />,
  SendBoxSend: <Send20Regular />,
  SendBoxSendHovered: <Send20Filled />,
  VideoTileMicOff: <MicOff16Filled />
};
