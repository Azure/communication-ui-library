// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Stack, Theme } from '@fluentui/react';
import {
  ArrowClockwise16Regular,
  CallEnd20Filled,
  Checkmark20Regular,
  CheckmarkCircle16Regular,
  Circle16Regular,
  Delete20Regular,
  Dismiss20Regular,
  Dismiss16Regular,
  Edit20Regular,
  ErrorCircle16Regular,
  EyeShow16Regular,
  MicOff16Filled,
  MicOff16Regular,
  MicOff20Filled,
  MicOn16Filled,
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
  Video16Filled,
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

/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { Backspace20Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(file-sharing) */
import { ArrowDownload16Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { CallPause20Regular, CallPause20Filled, Play20Regular, People20Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(call-readiness) */
import { Warning20Filled } from '@fluentui/react-icons';
import { _pxToRem } from '@internal/acs-ui-common';

import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useTheme } from './FluentThemeProvider';

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

const MoreHorizontal18Regular = (): JSX.Element => (
  // MoreHorizontal icons are 16px x 16px or 20px x 20px so scaling to get desired size
  <div className={mergeStyles({ transform: 'scale(0.9)' })}>
    <MoreHorizontal20Regular />
  </div>
);

const UnsupportedBrowserWarning = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack
      horizontalAlign={'center'}
      styles={{
        root: {
          width: _pxToRem(92),
          borderRadius: '100%',
          background: theme.palette.themeLighterAlt,
          padding: '2rem',
          margin: 'auto'
        }
      }}
    >
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Warning20Filled />
      </div>
    </Stack>
  );
};

/**
 * The default set of icons that are available to use in the UI components.
 *
 * @remark Icons used only in the composites are available in {@link DEFAULT_COMPOSITE_ICONS}.
 *
 * @public
 */
export const DEFAULT_COMPONENT_ICONS = {
  ChatMessageOptions: <MoreHorizontal18Regular />,
  ControlButtonCameraOff: <VideoOff20Filled />,
  ControlButtonCameraOn: <Video20Filled />,
  ControlButtonEndCall: <CallEnd20Filled />,
  ControlButtonMicOff: <MicOff20Filled />,
  ControlButtonMicOn: <MicOn20Filled />,
  ControlButtonOptions: <Settings20Filled />,
  ControlButtonParticipants: <People20Filled />,
  /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
  ControlButtonParticipantsContextualMenuItem: <People20Regular />,
  ControlButtonScreenShareStart: <ShareScreenStart20Filled />,
  ControlButtonScreenShareStop: <ShareScreenStop20Filled />,
  /* @conditional-compile-remove(file-sharing) */
  CancelFileUpload: <Dismiss16Regular />,
  /* @conditional-compile-remove(file-sharing) */
  DownloadFile: <ArrowDownload16Regular />,
  EditBoxCancel: <Dismiss20Regular />,
  EditBoxSubmit: <Checkmark20Regular />,
  ErrorBarCallCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallCameraAlreadyInUse: <VideoProhibited16Filled />,
  ErrorBarCallLocalVideoFreeze: <WifiWarning16Filled />,
  ErrorBarCallMacOsCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallMacOsMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneMutedBySystem: <MicOff16Filled />,
  ErrorBarCallMicrophoneUnmutedBySystem: <MicOn16Filled />,
  ErrorBarCallNetworkQualityLow: <WifiWarning16Filled />,
  ErrorBarCallNoMicrophoneFound: <MicProhibited16Filled />,
  ErrorBarCallNoSpeakerFound: <SpeakerMute16Filled />,
  ErrorBarClear: <Dismiss16Regular />,
  ErrorBarCallVideoRecoveredBySystem: <Video16Filled />,
  ErrorBarCallVideoStoppedBySystem: <VideoProhibited16Filled />,
  HorizontalGalleryLeftButton: <ChevronLeft20Regular />,
  HorizontalGalleryRightButton: <ChevronRight20Regular />,
  MessageDelivered: <CheckmarkCircle16Regular />,
  MessageEdit: <Edit20Regular />,
  MessageFailed: <ErrorCircle16Regular />,
  MessageRemove: <Delete20Regular />,
  MessageResend: <ArrowClockwise16Regular />,
  MessageSeen: <EyeShow16Regular />,
  MessageSending: <Circle16Regular />,
  OptionsCamera: <Video20Regular />,
  OptionsMic: <MicOn20Regular />,
  OptionsSpeaker: <Speaker220Regular />,
  ParticipantItemMicOff: <MicOff16Regular />,
  ParticipantItemOptions: <MoreHorizontal20Regular />,
  ParticipantItemOptionsHovered: <MoreHorizontal20Filled />,
  ParticipantItemScreenShareStart: <ShareScreenStart20Filled />,
  /* @conditional-compile-remove(PSTN-calls) */
  HoldCallContextualMenuItem: <CallPause20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  HoldCallButton: <CallPause20Filled />,
  /* @conditional-compile-remove(PSTN-calls) */
  ResumeCall: <Play20Regular />,
  SendBoxSend: <Send20Regular />,
  SendBoxSendHovered: <Send20Filled />,
  VideoTileMicOff: <MicOff16Filled />,
  /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
  BackSpace: <Backspace20Regular />,
  /* @conditional-compile-remove(call-readiness) */
  UnsupportedBrowserWarning: <UnsupportedBrowserWarning />
};

const scaledIconStyles = (theme: Theme): IStyle => {
  return {
    transform: 'scale(2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.themePrimary,
    zIndex: 1
  };
};
