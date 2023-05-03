// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */ /* @conditional-compile-remove(unsupported-browser) */
import { Stack } from '@fluentui/react';
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
  Eye16Regular,
  MicOff16Filled,
  MicOff16Regular,
  MicOff20Filled,
  Mic16Filled,
  Mic20Filled,
  Mic20Regular,
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
/* @conditional-compile-remove(close-captions) */
import {
  ClosedCaption20Regular,
  ClosedCaptionOff20Regular,
  Settings20Regular,
  PersonVoice20Regular
} from '@fluentui/react-icons';
/* @conditional-compile-remove(call-readiness) */
import { Important20Filled } from '@fluentui/react-icons';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundEffect20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(pinned-participants) */
import {
  Pin16Filled,
  Pin16Regular,
  PinOff16Regular,
  ScaleFit20Regular,
  ScaleFill20Regular
} from '@fluentui/react-icons';

/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { Backspace20Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(call-readiness) */
import { Sparkle20Filled, VideoProhibited20Filled, MicProhibited20Filled } from '@fluentui/react-icons';

/* @conditional-compile-remove(file-sharing) */
import { ArrowDownload16Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { CallPause20Regular, CallPause20Filled, Play20Regular, People20Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(data-loss-prevention) */
import { Prohibited16Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(unsupported-browser) */
import { Warning20Filled } from '@fluentui/react-icons';
import { _pxToRem } from '@internal/acs-ui-common';

import React from 'react';
import { useTheme } from './FluentThemeProvider';
/* @conditional-compile-remove(call-readiness) */
import { sitePermissionIconBackgroundStyle, scaledIconStyles } from './icons.styles';

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

/* @conditional-compile-remove(call-readiness) */
const SitePermissionMic20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Mic20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionCamera20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Video20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionsMicDenied20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <MicProhibited20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionsCameraDenied20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <VideoProhibited20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionSparkle20Filled = (): JSX.Element => (
  <div className={mergeStyles({ transform: 'scale(2)' })}>
    <Sparkle20Filled />
  </div>
);

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedEnvironmentWarning = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack
      horizontalAlign={'center'}
      styles={{
        root: {
          width: _pxToRem(84),
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

/* @conditional-compile-remove(call-readiness) */
const BrowserPermissionDenied20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Important20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(data-loss-prevention) */
const DataLossPreventionProhibited16Regular = (): JSX.Element => {
  return <Prohibited16Regular />;
};

const GalleryLeftButton = (): JSX.Element => {
  const rtl = useTheme().rtl;
  return rtl ? <ChevronRight20Regular /> : <ChevronLeft20Regular />;
};

const GalleryRightButton = (): JSX.Element => {
  const rtl = useTheme().rtl;
  return rtl ? <ChevronLeft20Regular /> : <ChevronRight20Regular />;
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
  ControlButtonMicOn: <Mic20Filled />,
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
  /* @conditional-compile-remove(data-loss-prevention) */
  DataLossPreventionProhibited: <DataLossPreventionProhibited16Regular />,
  EditBoxCancel: <Dismiss20Regular />,
  EditBoxSubmit: <Checkmark20Regular />,
  ErrorBarCallCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallCameraAlreadyInUse: <VideoProhibited16Filled />,
  ErrorBarCallLocalVideoFreeze: <WifiWarning16Filled />,
  ErrorBarCallMacOsCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallMacOsMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneMutedBySystem: <MicOff16Filled />,
  ErrorBarCallMicrophoneUnmutedBySystem: <Mic16Filled />,
  ErrorBarCallNetworkQualityLow: <WifiWarning16Filled />,
  ErrorBarCallNoMicrophoneFound: <MicProhibited16Filled />,
  ErrorBarCallNoSpeakerFound: <SpeakerMute16Filled />,
  ErrorBarClear: <Dismiss16Regular />,
  ErrorBarCallVideoRecoveredBySystem: <Video16Filled />,
  ErrorBarCallVideoStoppedBySystem: <VideoProhibited16Filled />,
  HorizontalGalleryLeftButton: <GalleryLeftButton />,
  HorizontalGalleryRightButton: <GalleryRightButton />,
  MessageDelivered: <CheckmarkCircle16Regular />,
  MessageEdit: <Edit20Regular />,
  MessageFailed: <ErrorCircle16Regular />,
  MessageRemove: <Delete20Regular />,
  MessageResend: <ArrowClockwise16Regular />,
  MessageSeen: <Eye16Regular />,
  MessageSending: <Circle16Regular />,
  OptionsCamera: <Video20Regular />,
  OptionsMic: <Mic20Regular />,
  OptionsSpeaker: <Speaker220Regular />,
  ParticipantItemMicOff: <MicOff16Regular />,
  ParticipantItemOptions: <></>,
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
  DialpadBackspace: <Backspace20Regular />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionsSparkle: <SitePermissionSparkle20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionCamera: <SitePermissionCamera20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionMic: <SitePermissionMic20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionCameraDenied: <SitePermissionsCameraDenied20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionMicDenied: <SitePermissionsMicDenied20Filled />,
  /* @conditional-compile-remove(unsupported-browser) */
  UnsupportedEnvironmentWarning: <UnsupportedEnvironmentWarning />,
  /* @conditional-compile-remove(call-readiness) */
  BrowserPermissionDeniedError: <BrowserPermissionDenied20Filled />,
  /* @conditional-compile-remove(pinned-participants) */
  VideoTilePinned: <Pin16Filled />,
  /* @conditional-compile-remove(pinned-participants) */
  VideoTileMoreOptions: <MoreHorizontal20Filled />,
  /* @conditional-compile-remove(pinned-participants) */
  VideoTileScaleFit: <ScaleFit20Regular />,
  /* @conditional-compile-remove(pinned-participants) */
  VideoTileScaleFill: <ScaleFill20Regular />,
  /* @conditional-compile-remove(pinned-participants) */
  PinParticipant: <Pin16Regular />,
  /* @conditional-compile-remove(pinned-participants) */
  UnpinParticipant: <PinOff16Regular />,
  SplitButtonPrimaryActionCameraOn: <Video20Filled />,
  SplitButtonPrimaryActionCameraOff: <VideoOff20Filled />,
  SplitButtonPrimaryActionMicUnmuted: <Mic20Filled />,
  SplitButtonPrimaryActionMicMuted: <MicOff20Filled />,
  /* @conditional-compile-remove(vertical-gallery) */
  VerticalGalleryLeftButton: <GalleryLeftButton />,
  /* @conditional-compile-remove(vertical-gallery) */
  VerticalGalleryRightButton: <GalleryRightButton />,
  /* @conditional-compile-remove(video-background-effects) */
  OptionsVideoBackgroundEffect: <VideoBackgroundEffect20Regular />,
  /* @conditional-compile-remove(close-captions) */
  CaptionsIcon: <ClosedCaption20Regular />,
  /* @conditional-compile-remove(close-captions) */
  CaptionsOffIcon: <ClosedCaptionOff20Regular />,
  /* @conditional-compile-remove(close-captions) */
  CaptionsSettingsIcon: <Settings20Regular />,
  /* @conditional-compile-remove(close-captions) */
  ChangeSpokenLanguageIcon: <PersonVoice20Regular />
};
