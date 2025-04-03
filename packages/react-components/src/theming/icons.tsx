// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */ /* @conditional-compile-remove(unsupported-browser) */
import { Stack } from '@fluentui/react';
import {
  ArrowClockwise16Regular,
  Backspace20Regular,
  Call20Filled,
  CallEnd20Filled,
  CallPause20Filled,
  CallPause20Regular,
  Checkmark20Regular,
  CheckmarkCircle16Regular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Circle16Regular,
  ClosedCaption20Regular,
  ClosedCaptionOff20Regular,
  Delete20Regular,
  Dismiss16Regular,
  Dismiss20Regular,
  Edit20Regular,
  Emoji20Regular,
  ErrorCircle16Regular,
  Eye16Regular,
  HandRight20Regular,
  HandRightOff20Regular,
  Mic16Filled,
  Mic20Filled,
  Mic20Regular,
  MicOff16Filled,
  MicOff16Regular,
  MicOff20Filled,
  MicOff20Regular,
  MicProhibited16Filled,
  MoreHorizontal20Filled,
  MoreHorizontal20Regular,
  Open20Regular,
  People20Filled,
  People20Regular,
  PersonDelete20Regular,
  PersonVoice20Regular,
  Pin16Filled,
  Pin20Filled,
  Pin20Regular,
  PinOff20Regular,
  Play20Regular,
  Record16Regular,
  ScaleFill20Regular,
  ScaleFit20Regular,
  Send20Filled,
  Send20Regular,
  Settings20Filled,
  Settings20Regular,
  ShareScreenStart20Filled,
  ShareScreenStop20Filled,
  SlideTextEdit16Regular,
  Speaker220Regular,
  SpeakerMute16Filled,
  Star28Filled,
  Star28Regular,
  Translate20Regular,
  Video16Filled,
  Video20Filled,
  Video20Regular,
  VideoBackgroundEffect20Filled,
  VideoBackgroundEffect20Regular,
  VideoOff20Filled,
  VideoPersonStar20Filled,
  VideoPersonStarOff20Filled,
  VideoProhibited16Filled,
  Warning16Regular,
  WifiWarning20Filled
} from '@fluentui/react-icons';
/* @conditional-compile-remove(together-mode) */
import { PeopleAudience20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(rtt) */
import { SlideTextCall20Regular, ArrowMaximize20Regular, ArrowMinimize20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(rich-text-editor) */
import {
  TextBold20Regular,
  TextItalic20Regular,
  TextUnderlineCharacterU20Regular,
  TextBulletList20Regular,
  TextNumberListLtr20Regular,
  TextIndentDecrease20Regular,
  TextIndentIncrease20Regular,
  DividerTall24Regular,
  TextEditStyle20Regular,
  TextEditStyle20Filled,
  Table20Regular,
  Table20Filled,
  TableAdd20Regular,
  TableDismiss20Regular
} from '@fluentui/react-icons';
/* @conditional-compile-remove(call-readiness) */
import { Important20Filled, Sparkle20Filled } from '@fluentui/react-icons';
import { VideoProhibited20Filled, MicProhibited20Filled } from '@fluentui/react-icons';
import { ConferenceRoom16Regular, DoorArrowLeft16Regular, DoorArrowRight16Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(file-sharing-acs) */
import { ArrowDownload20Regular } from '@fluentui/react-icons';
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
  // There is no 16px version of this icon in the fluent icon package, so set height and width to 1rem.
  <WifiWarning20Filled style={{ height: '1rem', width: '1rem' }} />
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

const ControlButtonRaiseHandIcon = (): JSX.Element => {
  return <HandRight20Regular />;
};

const ControlButtonLowerHandIcon = (): JSX.Element => {
  return <HandRightOff20Regular />;
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
  ControlButtonParticipantsContextualMenuItem: <People20Regular />,
  ControlButtonScreenShareStart: <ShareScreenStart20Filled />,
  ControlButtonScreenShareStop: <ShareScreenStop20Filled />,
  ControlButtonRaiseHand: <ControlButtonRaiseHandIcon />,
  ControlButtonLowerHand: <ControlButtonLowerHandIcon />,
  ControlButtonMicProhibited: <MicProhibited20Filled />,
  ControlButtonMicProhibitedSmall: <MicProhibited16Filled />,
  ControlButtonCameraProhibited: <VideoProhibited20Filled />,
  ControlButtonCameraProhibitedSmall: <VideoProhibited16Filled />,
  RaiseHandContextualMenuItem: <HandRight20Regular />,
  LowerHandContextualMenuItem: <HandRightOff20Regular />,
  ReactionButtonIcon: <Emoji20Regular />,
  /* @conditional-compile-remove(file-sharing-acs) */
  CancelAttachmentUpload: <Dismiss16Regular />,
  /* @conditional-compile-remove(file-sharing-acs) */
  DownloadAttachment: <ArrowDownload20Regular />,
  OpenAttachment: <Open20Regular />,
  /* @conditional-compile-remove(file-sharing-acs) */
  AttachmentMoreMenu: <MoreHorizontal20Filled />,
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
  ErrorBarCallMicrophoneMutedBySystem: <MicOff16Regular />,
  ErrorBarCallMicrophoneUnmutedBySystem: <Mic16Filled />,
  ErrorBarCallNetworkQualityLow: <WifiWarning16Filled />,
  ErrorBarCallNoMicrophoneFound: <MicProhibited16Filled />,
  ErrorBarCallNoSpeakerFound: <SpeakerMute16Filled />,
  ErrorBarClear: <Dismiss16Regular />,
  ErrorBarCallVideoRecoveredBySystem: <Video16Filled />,
  ErrorBarCallVideoStoppedBySystem: <VideoProhibited16Filled />,
  ErrorBarMutedByRemoteParticipant: <MicOff16Regular />,
  NotificationBarRecording: <Record16Regular />,
  NotificationBarBreakoutRoomOpened: <DoorArrowRight16Regular />,
  NotificationBarBreakoutRoomPromptJoin: <DoorArrowRight16Regular />,
  NotificationBarBreakoutRoomChanged: <DoorArrowRight16Regular />,
  NotificationBarBreakoutRoomJoined: <ConferenceRoom16Regular />,
  NotificationBarBreakoutRoomClosingSoon: <DoorArrowLeft16Regular />,
  NotificationBarBreakoutRoomClosed: <DoorArrowLeft16Regular />,
  NotificationBarTranscriptionError: <Warning16Regular />,
  NotificationBarTranscriptionStartedByYou: <SlideTextEdit16Regular />,
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
  ParticipantItemMicOff: <MicOff20Regular />,
  ParticipantItemOptions: <></>,
  ParticipantItemOptionsHovered: <MoreHorizontal20Filled />,
  ParticipantItemScreenShareStart: <ShareScreenStart20Filled />,
  ParticipantItemSpotlighted: <VideoPersonStar20Filled />,
  HoldCallContextualMenuItem: <CallPause20Regular />,
  HoldCallButton: <CallPause20Filled />,
  ResumeCall: <Play20Regular />,
  SendBoxSend: <Send20Regular />,
  SendBoxSendHovered: <Send20Filled />,
  VideoTileMicOff: <MicOff16Filled />,
  VideoTileCameraOff: <VideoProhibited16Filled />,
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
  VideoTilePinned: <Pin16Filled />,
  ParticipantItemPinned: <Pin20Filled />,
  VideoTileMoreOptions: <MoreHorizontal20Filled />,
  VideoTileScaleFit: <ScaleFit20Regular />,
  VideoTileScaleFill: <ScaleFill20Regular />,
  PinParticipant: <Pin20Regular />,
  UnpinParticipant: <PinOff20Regular />,
  SplitButtonPrimaryActionCameraOn: <Video20Filled />,
  SplitButtonPrimaryActionCameraOff: <VideoOff20Filled />,
  SplitButtonPrimaryActionMicUnmuted: <Mic20Filled />,
  SplitButtonPrimaryActionMicMuted: <MicOff20Filled />,
  VerticalGalleryLeftButton: <GalleryLeftButton />,
  VerticalGalleryRightButton: <GalleryRightButton />,
  ControlButtonVideoEffectsOption: <VideoBackgroundEffect20Regular />,
  ConfigurationScreenVideoEffectsButton: <VideoBackgroundEffect20Filled />,
  CaptionsIcon: <ClosedCaption20Regular />,
  CaptionsOffIcon: <ClosedCaptionOff20Regular />,
  CaptionsSettingsIcon: <Settings20Regular />,
  ChangeSpokenLanguageIcon: <PersonVoice20Regular />,
  ChangeCaptionLanguageIcon: <Translate20Regular />,
  ContextMenuCameraIcon: <Video20Regular />,
  ContextMenuMicIcon: <Mic20Regular />,
  ContextMenuSpeakerIcon: <Speaker220Regular />,
  ContextMenuRemoveParticipant: <PersonDelete20Regular />,
  SurveyStarIcon: <Star28Regular />,
  SurveyStarIconFilled: <Star28Filled />,
  StartSpotlightContextualMenuItem: <VideoPersonStar20Filled />,
  StopSpotlightContextualMenuItem: <VideoPersonStarOff20Filled />,
  VideoTileSpotlighted: <VideoPersonStar20Filled style={{ height: '16px', width: '16px' }} />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextBoldButtonIcon: <TextBold20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextItalicButtonIcon: <TextItalic20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextUnderlineButtonIcon: <TextUnderlineCharacterU20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextBulletListButtonIcon: <TextBulletList20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextNumberListButtonIcon: <TextNumberListLtr20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextIndentDecreaseButtonIcon: <TextIndentDecrease20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextIndentIncreaseButtonIcon: <TextIndentIncrease20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextDividerIcon: <DividerTall24Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextEditorButtonIcon: <TextEditStyle20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextEditorButtonIconFilled: <TextEditStyle20Filled />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextInsertTableRegularIcon: <Table20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextInsertTableFilledIcon: <Table20Filled />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextTableInsertMenuIcon: <TableAdd20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextTableDeleteMenuIcon: <TableDismiss20Regular />,
  ContextualMenuMicMutedIcon: <MicOff20Regular />,
  IncomingCallNotificationRejectIcon: <CallEnd20Filled />,
  IncomingCallNotificationAcceptIcon: <Call20Filled />,
  IncomingCallNotificationAcceptWithVideoIcon: <Video20Filled />,
  /* @conditional-compile-remove(together-mode) */
  NotificationBarTogetherModeIcon: <PeopleAudience20Regular />,
  /* @conditional-compile-remove(rtt) */
  RealTimeTextIcon: <SlideTextCall20Regular />,
  /* @conditional-compile-remove(rtt) */
  ExpandIcon: <ArrowMaximize20Regular />,
  /* @conditional-compile-remove(rtt) */
  MinimizeIcon: <ArrowMinimize20Regular />
};
