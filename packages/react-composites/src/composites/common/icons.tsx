// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
  WifiWarning20Filled
} from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { PersonAdd20Regular, Dialpad20Regular, Call20Regular } from '@fluentui/react-icons';
import { DEFAULT_COMPONENT_ICONS } from '@internal/react-components';
import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { FontIcon, IIconProps, mergeStyles, Text } from '@fluentui/react';
/* @conditional-compile-remove(file-sharing) */
import { Attach20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';

const CoffeeIcon = (): JSX.Element => (
  <Text className={mergeStyles(coffeeIconStyle)} aria-hidden={true}>
    ☕
  </Text>
);

const coffeeIconStyle = {
  // Fluent wraps all icons with <i> so we must force the fontStyle back to normal.
  fontStyle: 'normal',
  // By default our icons are 20px x 20px (for 1rem = 16px), make this a bit bigger for lobby.
  fontSize: '2rem'
};

/**
 * The default set of icons used by the composites directly (i.e. not via the components defined in this library).
 *
 * @public
 */
export const COMPOSITE_ONLY_ICONS: CompositeIcons = {
  ChevronLeft: undefined,
  Link: undefined,
  LobbyScreenConnectingToCall: <CoffeeIcon />,
  LobbyScreenWaitingToBeAdmitted: <CoffeeIcon />,
  LocalDeviceSettingsCamera: <Video20Filled />,
  LocalDeviceSettingsMic: <Mic20Filled />,
  LocalDeviceSettingsSpeaker: <Speaker220Filled />,
  LocalPreviewPlaceholder: <VideoOff20Filled />,
  LocalCameraSwitch: <CameraSwitch24Regular />,
  ControlBarChatButtonActive: <Chat20Filled />,
  ControlBarChatButtonInactive: <Chat20Regular />,
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
  /* @conditional-compile-remove(file-sharing) */
  SendBoxAttachFile: <Attach20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneAddPerson: <PersonAdd20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneOpenDialpad: <Dialpad20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  DialpadStartCall: <Call20Regular />,
  /* @conditional-compile-remove(rooms) */
  NoticePageInvalidRoom: <Info20Filled />,
  /* @conditional-compile-remove(video-background-effects) */
  BlurVideoBackground: <VideoBackgroundEffect20Regular />,
  /* @conditional-compile-remove(video-background-effects) */
  RemoveVideoBackgroundEffect: <VideoPerson20Filled />
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
  /* @conditional-compile-remove(file-sharing) */
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
  ControlButtonCameraOff?: JSX.Element;
  ControlButtonCameraOn?: JSX.Element;
  ControlButtonEndCall?: JSX.Element;
  ControlButtonMicOff?: JSX.Element;
  ControlButtonMicOn?: JSX.Element;
  ControlButtonOptions?: JSX.Element;
  ControlButtonParticipants?: JSX.Element;
  ControlButtonScreenShareStart?: JSX.Element;
  ControlButtonScreenShareStop?: JSX.Element;
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
  /* @conditional-compile-remove(rooms) */
  NoticePageInvalidRoom?: JSX.Element;
  /* @conditional-compile-remove(video-background-effects) */
  BlurVideoBackground?: JSX.Element;
  /* @conditional-compile-remove(video-background-effects) */
  RemoveVideoBackgroundEffect?: JSX.Element;
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
