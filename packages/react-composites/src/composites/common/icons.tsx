// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallEnd20Filled,
  CallMissed20Filled,
  CameraSwitch24Regular,
  Chat20Filled,
  Chat20Regular,
  Info20Filled,
  MicOff20Filled,
  Mic20Filled,
  Mic20Regular,
  People20Regular,
  PersonDelete20Filled,
  Speaker220Filled,
  Speaker220Regular,
  Video20Filled,
  VideoOff20Filled,
  WifiWarning20Filled,
  Circle20Regular
} from '@fluentui/react-icons';
import { PersonCall20Regular, Clock20Filled } from '@fluentui/react-icons';
import { MoreHorizontal20Filled, VideoPersonStarOff20Filled } from '@fluentui/react-icons';
import { MicProhibited20Filled, VideoProhibited20Filled } from '@fluentui/react-icons';
import { Grid20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { PersonAdd20Regular, Call20Regular } from '@fluentui/react-icons';
import { Dialpad20Regular } from '@fluentui/react-icons';
import { DEFAULT_COMPONENT_ICONS } from '@internal/react-components';
import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { FontIcon, IIconProps, Spinner, SpinnerSize } from '@fluentui/react';
/* @conditional-compile-remove(file-sharing-acs) */
import { Attach20Regular } from '@fluentui/react-icons';

import { VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';
import {
  PersonSquare20Regular,
  WindowHeaderHorizontal20Regular,
  TableSimple20Regular,
  BoardSplit20Regular,
  ContentView20Regular,
  Table20Regular
} from '@fluentui/react-icons';

const SpinnerIcon = (): JSX.Element => <Spinner size={SpinnerSize.large} />;

/**
 * The default set of icons used by the composites directly (i.e. not via the components defined in this library).
 *
 * @public
 */
export const COMPOSITE_ONLY_ICONS: CompositeIcons = {
  ChevronLeft: undefined,
  Link: undefined,
  LobbyScreenConnectingToCall: <SpinnerIcon />,
  LobbyScreenWaitingToBeAdmitted: <SpinnerIcon />,
  LocalDeviceSettingsCamera: <Video20Filled />,
  LocalDeviceSettingsMic: <Mic20Filled />,
  LocalDeviceSettingsSpeaker: <Speaker220Filled />,
  LocalPreviewPlaceholder: <VideoOff20Filled />,
  LocalCameraSwitch: <CameraSwitch24Regular />,
  ControlBarChatButtonActive: <Chat20Filled />,
  ControlBarChatButtonInactive: <Chat20Regular />,

  ControlButtonCameraProhibited: <VideoProhibited20Filled />,

  ControlButtonMicProhibited: <MicProhibited20Filled />,
  ControlButtonExitSpotlight: <VideoPersonStarOff20Filled />,
  ControlBarPeopleButton: <People20Regular />,
  MoreDrawerMicrophones: <Mic20Regular />,
  MoreDrawerPeople: <People20Regular />,
  MoreDrawerSpeakers: <Speaker220Regular />,
  MoreDrawerSelectedMicrophone: <Mic20Filled />,
  MoreDrawerSelectedSpeaker: <Speaker220Filled />,
  Muted: <MicOff20Filled />,
  NetworkReconnectIcon: <CallMissed20Filled />,
  NoticePageAccessDeniedTeamsMeeting: <PersonDelete20Filled />,
  NoticePageJoinCallFailedDueToNoNetwork: <WifiWarning20Filled />,
  NoticePageLeftCall: <CallEnd20Filled />,
  NoticePageRemovedFromCall: <Info20Filled />,
  NoticePageNotInvitedToRoom: <Info20Filled />,
  NoticePageRoomNotFound: <Info20Filled />,
  NoticePageRoomNotValid: <Info20Filled />,
  NoticePageCallRejected: <Info20Filled />,
  NoticePageCallTimeout: <Info20Filled />,
  /* @conditional-compile-remove(file-sharing-acs) */
  SendBoxAttachFile: <Attach20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneAddPerson: <PersonAdd20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneOpenDialpad: <Dialpad20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  DialpadStartCall: <Call20Regular />,
  NoticePageInviteToRoomRemoved: <Info20Filled />,

  BlurVideoBackground: <VideoBackgroundEffect20Regular />,

  RemoveVideoBackgroundEffect: <VideoPerson20Filled />,
  GalleryOptions: <Grid20Regular />,
  OverflowGalleryTop: <WindowHeaderHorizontal20Regular />,
  SpeakerGalleryLayout: <PersonSquare20Regular />,
  DefaultGalleryLayout: <TableSimple20Regular />,
  FloatingLocalVideoGalleryLayout: <BoardSplit20Regular />,
  FocusedContentGalleryLayout: <ContentView20Regular />,
  LargeGalleryLayout: <Table20Regular />,
  DefaultCustomButton: <Circle20Regular />,
  DtmfDialpadButton: <Dialpad20Regular />,
  PhoneNumberButton: <PersonCall20Regular />,
  JoinByPhoneDialStepIcon: <PersonCall20Regular />,
  JoinByPhoneConferenceIdIcon: <Dialpad20Regular />,
  JoinByPhoneWaitToBeAdmittedIcon: <Clock20Filled />,
  PeoplePaneMoreButton: <MoreHorizontal20Filled />,
  StopAllSpotlightMenuButton: <VideoPersonStarOff20Filled />
};

/**
 * The default set of icons that are available to used in the Composites.
 *
 * @public
 */
export const DEFAULT_COMPOSITE_ICONS = {
  ...DEFAULT_COMPONENT_ICONS,
  ...COMPOSITE_ONLY_ICONS
};

/** @private */
export type CompositeIconProps<Icons> = IIconProps & { iconName: keyof Icons };

/**
 * Icons that can be overridden for {@link ChatComposite}.
 *
 * @public
 */
export type ChatCompositeIcons = {
  EditBoxCancel?: JSX.Element;
  EditBoxSubmit?: JSX.Element;
  MessageDelivered?: JSX.Element;
  MessageEdit?: JSX.Element;
  MessageFailed?: JSX.Element;
  MessageRemove?: JSX.Element;
  MessageSeen?: JSX.Element;
  MessageSending?: JSX.Element;
  ParticipantItemOptions?: JSX.Element;
  ParticipantItemOptionsHovered?: JSX.Element;
  SendBoxSend?: JSX.Element;
  SendBoxSendHovered?: JSX.Element;
  /* @conditional-compile-remove(file-sharing-acs) */
  SendBoxAttachFile?: JSX.Element;
};

/**
 * Icon wrapper to use when including customizable icons inside the ChatComposite.
 * This wrapper ensures the icon name is being type-checked helping ensure no typos
 * and ensure that icon is customizable through the composite API.
 *
 * @private
 */
export const ChatCompositeIcon = (props: CompositeIconProps<ChatCompositeIcons>): JSX.Element => (
  <FontIcon {...props} />
);

/**
 * Icons that can be overridden for {@link CallComposite}.
 *
 * @public
 */
export type CallCompositeIcons = {
  ControlBarPeopleButton?: JSX.Element;
  ControlButtonCameraOff?: JSX.Element;
  ControlButtonCameraOn?: JSX.Element;
  ControlButtonEndCall?: JSX.Element;
  ControlButtonMicOff?: JSX.Element;
  ControlButtonMicOn?: JSX.Element;
  ControlButtonOptions?: JSX.Element;
  ControlButtonParticipants?: JSX.Element;
  ControlButtonScreenShareStart?: JSX.Element;
  ControlButtonScreenShareStop?: JSX.Element;

  ControlButtonCameraProhibited?: JSX.Element;

  ControlButtonMicProhibited?: JSX.Element;
  ControlButtonRaiseHand?: JSX.Element;
  ControlButtonLowerHand?: JSX.Element;
  ControlButtonExitSpotlight?: JSX.Element;
  RaiseHandContextualMenuItem?: JSX.Element;
  ReactionContextualMenuItem?: JSX.Element;
  LowerHandContextualMenuItem?: JSX.Element;
  ReactionButtonIcon?: JSX.Element;
  ErrorBarCallCameraAccessDenied?: JSX.Element;
  ErrorBarCallCameraAlreadyInUse?: JSX.Element;
  ErrorBarCallLocalVideoFreeze?: JSX.Element;
  ErrorBarCallMacOsCameraAccessDenied?: JSX.Element;
  ErrorBarCallMacOsMicrophoneAccessDenied?: JSX.Element;
  ErrorBarCallMicrophoneAccessDenied?: JSX.Element;
  ErrorBarCallMicrophoneMutedBySystem?: JSX.Element;
  ErrorBarCallMicrophoneUnmutedBySystem?: JSX.Element;
  ErrorBarCallNetworkQualityLow?: JSX.Element;
  ErrorBarCallNoMicrophoneFound?: JSX.Element;
  ErrorBarCallNoSpeakerFound?: JSX.Element;
  ErrorBarClear?: JSX.Element;
  HorizontalGalleryLeftButton?: JSX.Element;
  HorizontalGalleryRightButton?: JSX.Element;
  LobbyScreenConnectingToCall?: JSX.Element;
  LobbyScreenWaitingToBeAdmitted?: JSX.Element;
  LocalDeviceSettingsCamera?: JSX.Element;
  LocalDeviceSettingsMic?: JSX.Element;
  LocalDeviceSettingsSpeaker?: JSX.Element;
  LocalPreviewPlaceholder?: JSX.Element;
  Muted?: JSX.Element;
  NetworkReconnectIcon?: JSX.Element;
  NoticePageAccessDeniedTeamsMeeting?: JSX.Element;
  NoticePageJoinCallFailedDueToNoNetwork?: JSX.Element;
  NoticePageLeftCall?: JSX.Element;
  NoticePageRemovedFromCall?: JSX.Element;
  NoticePageCallRejected?: JSX.Element;
  NoticePageNotInvitedToRoom?: JSX.Element;
  NoticePageRoomNotFound?: JSX.Element;
  NoticePageRoomNotValid?: JSX.Element;
  NoticePageCallTimeout?: JSX.Element;
  OptionsCamera?: JSX.Element;
  OptionsMic?: JSX.Element;
  OptionsSpeaker?: JSX.Element;
  ParticipantItemMicOff?: JSX.Element;
  ParticipantItemOptions?: JSX.Element;
  ParticipantItemOptionsHovered?: JSX.Element;
  ParticipantItemScreenShareStart?: JSX.Element;
  VideoTileMicOff?: JSX.Element;
  LocalCameraSwitch?: JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneAddPerson?: JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneOpenDialpad?: JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  DialpadStartCall?: JSX.Element;
  NoticePageInviteToRoomRemoved?: JSX.Element;

  BlurVideoBackground?: JSX.Element;

  RemoveVideoBackgroundEffect?: JSX.Element;
  GalleryOptions?: JSX.Element;
  SpeakerGalleryLayout?: JSX.Element;
  FloatingLocalVideoGalleryLayout?: JSX.Element;
  DefaultGalleryLayout?: JSX.Element;
  FocusedContentGalleryLayout?: JSX.Element;
  OverflowGalleryTop?: JSX.Element;
  LargeGalleryLayout?: JSX.Element;
  DefaultCustomButton?: JSX.Element;
  DtmfDialpadButton?: JSX.Element;
  PhoneNumberButton?: JSX.Element;
  JoinByPhoneDialStepIcon?: JSX.Element;
  JoinByPhoneConferenceIdIcon?: JSX.Element;
  JoinByPhoneWaitToBeAdmittedIcon?: JSX.Element;
  PeoplePaneMoreButton?: JSX.Element;
  StopAllSpotlightMenuButton?: JSX.Element;
};

/**
 * Icon wrapper to use when including customizable icons inside the CallComposite.
 * This wrapper ensures the icon name is being type-checked helping ensure no typos
 * and ensure that icon is customizable through the composite API.
 *
 * @private
 */
export const CallCompositeIcon = (props: CompositeIconProps<CallCompositeIcons>): JSX.Element => (
  <FontIcon {...props} />
);

/**
 * Icons that can be overridden for {@link CallWithChatComposite}.
 *
 * @public
 */
export type CallWithChatCompositeIcons = {
  // CallWithChat Specific Icons
  ChevronLeft?: JSX.Element;
  ControlBarChatButtonActive?: JSX.Element;
  ControlBarChatButtonInactive?: JSX.Element;
  ControlBarPeopleButton?: JSX.Element;
  Link?: JSX.Element;
  MoreDrawerMicrophones?: JSX.Element;
  MoreDrawerPeople?: JSX.Element;
  MoreDrawerSelectedMicrophone?: JSX.Element;
  MoreDrawerSelectedSpeaker?: JSX.Element;
  MoreDrawerSpeakers?: JSX.Element;

  // Call icons
  ControlButtonCameraOff?: JSX.Element;
  ControlButtonCameraOn?: JSX.Element;
  ControlButtonEndCall?: JSX.Element;
  ControlButtonMicOff?: JSX.Element;
  ControlButtonMicOn?: JSX.Element;
  ControlButtonOptions?: JSX.Element;
  ControlButtonScreenShareStart?: JSX.Element;
  ControlButtonScreenShareStop?: JSX.Element;

  ControlButtonCameraProhibited?: JSX.Element;

  ControlButtonMicProhibited?: JSX.Element;
  ErrorBarCallCameraAccessDenied?: JSX.Element;
  ErrorBarCallCameraAlreadyInUse?: JSX.Element;
  ErrorBarCallLocalVideoFreeze?: JSX.Element;
  ErrorBarCallMacOsCameraAccessDenied?: JSX.Element;
  ErrorBarCallMacOsMicrophoneAccessDenied?: JSX.Element;
  ErrorBarCallMicrophoneAccessDenied?: JSX.Element;
  ErrorBarCallMicrophoneMutedBySystem?: JSX.Element;
  ErrorBarCallMicrophoneUnmutedBySystem?: JSX.Element;
  ErrorBarCallNetworkQualityLow?: JSX.Element;
  ErrorBarCallNoMicrophoneFound?: JSX.Element;
  ErrorBarCallNoSpeakerFound?: JSX.Element;
  ErrorBarClear?: JSX.Element;
  HorizontalGalleryLeftButton?: JSX.Element;
  HorizontalGalleryRightButton?: JSX.Element;
  LobbyScreenConnectingToCall?: JSX.Element;
  LobbyScreenWaitingToBeAdmitted?: JSX.Element;
  LocalDeviceSettingsCamera?: JSX.Element;
  LocalDeviceSettingsMic?: JSX.Element;
  LocalDeviceSettingsSpeaker?: JSX.Element;
  LocalPreviewPlaceholder?: JSX.Element;
  Muted?: JSX.Element;
  NetworkReconnectIcon?: JSX.Element;
  NoticePageAccessDeniedTeamsMeeting?: JSX.Element;
  NoticePageJoinCallFailedDueToNoNetwork?: JSX.Element;
  NoticePageLeftCall?: JSX.Element;
  NoticePageRemovedFromCall?: JSX.Element;
  OptionsCamera?: JSX.Element;
  OptionsMic?: JSX.Element;
  OptionsSpeaker?: JSX.Element;
  ParticipantItemMicOff?: JSX.Element;
  ParticipantItemScreenShareStart?: JSX.Element;
  VideoTileMicOff?: JSX.Element;
  LocalCameraSwitch?: JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneAddPerson?: JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneOpenDialpad?: JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  DialpadStartCall?: JSX.Element;
  DefaultCustomButton?: JSX.Element;
  DtmfDialpadButton?: JSX.Element;

  // Chat icons
  EditBoxCancel?: JSX.Element;
  EditBoxSubmit?: JSX.Element;
  MessageDelivered?: JSX.Element;
  MessageEdit?: JSX.Element;
  MessageFailed?: JSX.Element;
  MessageRemove?: JSX.Element;
  MessageSeen?: JSX.Element;
  MessageSending?: JSX.Element;
  SendBoxSend?: JSX.Element;
  SendBoxSendHovered?: JSX.Element;
  SendBoxAttachFile?: JSX.Element;

  // Icons common to Call and Chat.
  ParticipantItemOptions?: JSX.Element;
  ParticipantItemOptionsHovered?: JSX.Element;
  PeoplePaneMoreButton?: JSX.Element;
  StopAllSpotlightMenuButton?: JSX.Element;
};

/**
 * Icon wrapper to use when including customizable icons inside the CallWithChatComposite.
 * This wrapper ensures the icon name is being type-checked helping ensure no typos
 * and ensure that icon is customizable through the composite API.
 *
 * @private
 */
export const CallWithChatCompositeIcon = (props: CompositeIconProps<CallWithChatCompositeIcons>): JSX.Element => (
  <FontIcon {...props} />
);

/**
 * Icons that can be overridden in one of the composites exported by this library.
 *
 * See {@link ChatCompositeIcons}, {@link CallCompositeIcons} and {@link CallWithChatCompositeIcons} for more targeted types.
 *
 * @public
 */
export type CompositeIcons = ChatCompositeIcons & CallCompositeIcons & CallWithChatCompositeIcons;
