// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

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
// eslint-disable-next-line no-restricted-imports
import { FontIcon, IIconProps, Spinner, SpinnerSize } from '@fluentui/react';
/* @conditional-compile-remove(file-sharing) */
import { Attach20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(video-background-effects) */
import { VideoBackgroundEffect20Regular, VideoPerson20Filled } from '@fluentui/react-icons';

const SpinnerIcon = (): React.JSX.Element => <Spinner size={SpinnerSize.large} />;

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
  EditBoxCancel?: React.JSX.Element;
  EditBoxSubmit?: React.JSX.Element;
  MessageDelivered?: React.JSX.Element;
  MessageEdit?: React.JSX.Element;
  MessageFailed?: React.JSX.Element;
  MessageRemove?: React.JSX.Element;
  MessageSeen?: React.JSX.Element;
  MessageSending?: React.JSX.Element;
  ParticipantItemOptions?: React.JSX.Element;
  ParticipantItemOptionsHovered?: React.JSX.Element;
  SendBoxSend?: React.JSX.Element;
  SendBoxSendHovered?: React.JSX.Element;
  /* @conditional-compile-remove(file-sharing) */
  SendBoxAttachFile?: React.JSX.Element;
};

/**
 * Icon wrapper to use when including customizable icons inside the ChatComposite.
 * This wrapper ensures the icon name is being type-checked helping ensure no typos
 * and ensure that icon is customizable through the composite API.
 *
 * @private
 */
export const ChatCompositeIcon = (props: CompositeIconProps<ChatCompositeIcons>): React.JSX.Element => (
  <FontIcon {...props} />
);

/**
 * Icons that can be overridden for {@link CallComposite}.
 *
 * @public
 */
export type CallCompositeIcons = {
  ControlBarPeopleButton?: React.JSX.Element;
  ControlButtonCameraOff?: React.JSX.Element;
  ControlButtonCameraOn?: React.JSX.Element;
  ControlButtonEndCall?: React.JSX.Element;
  ControlButtonMicOff?: React.JSX.Element;
  ControlButtonMicOn?: React.JSX.Element;
  ControlButtonOptions?: React.JSX.Element;
  ControlButtonParticipants?: React.JSX.Element;
  ControlButtonScreenShareStart?: React.JSX.Element;
  ControlButtonScreenShareStop?: React.JSX.Element;
  ErrorBarCallCameraAccessDenied?: React.JSX.Element;
  ErrorBarCallCameraAlreadyInUse?: React.JSX.Element;
  ErrorBarCallLocalVideoFreeze?: React.JSX.Element;
  ErrorBarCallMacOsCameraAccessDenied?: React.JSX.Element;
  ErrorBarCallMacOsMicrophoneAccessDenied?: React.JSX.Element;
  ErrorBarCallMicrophoneAccessDenied?: React.JSX.Element;
  ErrorBarCallMicrophoneMutedBySystem?: React.JSX.Element;
  ErrorBarCallMicrophoneUnmutedBySystem?: React.JSX.Element;
  ErrorBarCallNetworkQualityLow?: React.JSX.Element;
  ErrorBarCallNoMicrophoneFound?: React.JSX.Element;
  ErrorBarCallNoSpeakerFound?: React.JSX.Element;
  ErrorBarClear?: React.JSX.Element;
  HorizontalGalleryLeftButton?: React.JSX.Element;
  HorizontalGalleryRightButton?: React.JSX.Element;
  LobbyScreenConnectingToCall?: React.JSX.Element;
  LobbyScreenWaitingToBeAdmitted?: React.JSX.Element;
  LocalDeviceSettingsCamera?: React.JSX.Element;
  LocalDeviceSettingsMic?: React.JSX.Element;
  LocalDeviceSettingsSpeaker?: React.JSX.Element;
  LocalPreviewPlaceholder?: React.JSX.Element;
  Muted?: React.JSX.Element;
  NetworkReconnectIcon?: React.JSX.Element;
  NoticePageAccessDeniedTeamsMeeting?: React.JSX.Element;
  NoticePageJoinCallFailedDueToNoNetwork?: React.JSX.Element;
  NoticePageLeftCall?: React.JSX.Element;
  NoticePageRemovedFromCall?: React.JSX.Element;
  OptionsCamera?: React.JSX.Element;
  OptionsMic?: React.JSX.Element;
  OptionsSpeaker?: React.JSX.Element;
  ParticipantItemMicOff?: React.JSX.Element;
  ParticipantItemOptions?: React.JSX.Element;
  ParticipantItemOptionsHovered?: React.JSX.Element;
  ParticipantItemScreenShareStart?: React.JSX.Element;
  VideoTileMicOff?: React.JSX.Element;
  LocalCameraSwitch?: React.JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneAddPerson?: React.JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneOpenDialpad?: React.JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  DialpadStartCall?: React.JSX.Element;
  /* @conditional-compile-remove(rooms) */
  NoticePageInvalidRoom?: React.JSX.Element;
  /* @conditional-compile-remove(video-background-effects) */
  BlurVideoBackground?: React.JSX.Element;
  /* @conditional-compile-remove(video-background-effects) */
  RemoveVideoBackgroundEffect?: React.JSX.Element;
};

/**
 * Icon wrapper to use when including customizable icons inside the CallComposite.
 * This wrapper ensures the icon name is being type-checked helping ensure no typos
 * and ensure that icon is customizable through the composite API.
 *
 * @private
 */
export const CallCompositeIcon = (props: CompositeIconProps<CallCompositeIcons>): React.JSX.Element => (
  <FontIcon {...props} />
);

/**
 * Icons that can be overridden for {@link CallWithChatComposite}.
 *
 * @public
 */
export type CallWithChatCompositeIcons = {
  // CallWithChat Specific Icons
  ChevronLeft?: React.JSX.Element;
  ControlBarChatButtonActive?: React.JSX.Element;
  ControlBarChatButtonInactive?: React.JSX.Element;
  ControlBarPeopleButton?: React.JSX.Element;
  Link?: React.JSX.Element;
  MoreDrawerMicrophones?: React.JSX.Element;
  MoreDrawerPeople?: React.JSX.Element;
  MoreDrawerSelectedMicrophone?: React.JSX.Element;
  MoreDrawerSelectedSpeaker?: React.JSX.Element;
  MoreDrawerSpeakers?: React.JSX.Element;

  // Call icons
  ControlButtonCameraOff?: React.JSX.Element;
  ControlButtonCameraOn?: React.JSX.Element;
  ControlButtonEndCall?: React.JSX.Element;
  ControlButtonMicOff?: React.JSX.Element;
  ControlButtonMicOn?: React.JSX.Element;
  ControlButtonOptions?: React.JSX.Element;
  ControlButtonScreenShareStart?: React.JSX.Element;
  ControlButtonScreenShareStop?: React.JSX.Element;
  ErrorBarCallCameraAccessDenied?: React.JSX.Element;
  ErrorBarCallCameraAlreadyInUse?: React.JSX.Element;
  ErrorBarCallLocalVideoFreeze?: React.JSX.Element;
  ErrorBarCallMacOsCameraAccessDenied?: React.JSX.Element;
  ErrorBarCallMacOsMicrophoneAccessDenied?: React.JSX.Element;
  ErrorBarCallMicrophoneAccessDenied?: React.JSX.Element;
  ErrorBarCallMicrophoneMutedBySystem?: React.JSX.Element;
  ErrorBarCallMicrophoneUnmutedBySystem?: React.JSX.Element;
  ErrorBarCallNetworkQualityLow?: React.JSX.Element;
  ErrorBarCallNoMicrophoneFound?: React.JSX.Element;
  ErrorBarCallNoSpeakerFound?: React.JSX.Element;
  ErrorBarClear?: React.JSX.Element;
  HorizontalGalleryLeftButton?: React.JSX.Element;
  HorizontalGalleryRightButton?: React.JSX.Element;
  LobbyScreenConnectingToCall?: React.JSX.Element;
  LobbyScreenWaitingToBeAdmitted?: React.JSX.Element;
  LocalDeviceSettingsCamera?: React.JSX.Element;
  LocalDeviceSettingsMic?: React.JSX.Element;
  LocalDeviceSettingsSpeaker?: React.JSX.Element;
  LocalPreviewPlaceholder?: React.JSX.Element;
  Muted?: React.JSX.Element;
  NetworkReconnectIcon?: React.JSX.Element;
  NoticePageAccessDeniedTeamsMeeting?: React.JSX.Element;
  NoticePageJoinCallFailedDueToNoNetwork?: React.JSX.Element;
  NoticePageLeftCall?: React.JSX.Element;
  NoticePageRemovedFromCall?: React.JSX.Element;
  OptionsCamera?: React.JSX.Element;
  OptionsMic?: React.JSX.Element;
  OptionsSpeaker?: React.JSX.Element;
  ParticipantItemMicOff?: React.JSX.Element;
  ParticipantItemScreenShareStart?: React.JSX.Element;
  VideoTileMicOff?: React.JSX.Element;
  LocalCameraSwitch?: React.JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneAddPerson?: React.JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  PeoplePaneOpenDialpad?: React.JSX.Element;
  /* @conditional-compile-remove(PSTN-calls) */
  DialpadStartCall?: React.JSX.Element;

  // Chat icons
  EditBoxCancel?: React.JSX.Element;
  EditBoxSubmit?: React.JSX.Element;
  MessageDelivered?: React.JSX.Element;
  MessageEdit?: React.JSX.Element;
  MessageFailed?: React.JSX.Element;
  MessageRemove?: React.JSX.Element;
  MessageSeen?: React.JSX.Element;
  MessageSending?: React.JSX.Element;
  SendBoxSend?: React.JSX.Element;
  SendBoxSendHovered?: React.JSX.Element;
  SendBoxAttachFile?: React.JSX.Element;

  // Icons common to Call and Chat.
  ParticipantItemOptions?: React.JSX.Element;
  ParticipantItemOptionsHovered?: React.JSX.Element;
};

/**
 * Icon wrapper to use when including customizable icons inside the CallWithChatComposite.
 * This wrapper ensures the icon name is being type-checked helping ensure no typos
 * and ensure that icon is customizable through the composite API.
 *
 * @private
 */
export const CallWithChatCompositeIcon = (props: CompositeIconProps<CallWithChatCompositeIcons>): React.JSX.Element => (
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
