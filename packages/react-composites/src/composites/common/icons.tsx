// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  MicOff20Filled,
  CallMissed20Filled,
  MicOn20Filled,
  Speaker220Filled,
  Video20Filled,
  VideoOff20Filled,
  WifiWarning20Filled,
  Info20Filled,
  PersonDelete20Filled,
  CallEnd20Filled
} from '@fluentui/react-icons';
/* @conditional-compile-remove-from(stable): meeting/calling-composite */
import {
  CameraSwitch24Regular,
  MicOn20Regular,
  People20Regular,
  Speaker220Regular,
  Chat20Regular,
  Chat20Filled
} from '@fluentui/react-icons';
import { ComponentIcons, DEFAULT_COMPONENT_ICONS } from '@internal/react-components';
import React from 'react';
// eslint-disable-next-line no-restricted-imports
import { FontIcon, IIconProps, mergeStyles, Text } from '@fluentui/react';
/* @conditional-compile-remove-from(stable) Chat_Notification_Icon */
import { Circle20Filled } from '@fluentui/react-icons';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { Attach20Regular } from '@fluentui/react-icons';

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
export const COMPOSITE_ONLY_ICONS = {
  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  Cancel: <FontIcon iconName="Cancel" />,
  /* @conditional-compile-remove-from(stable): meeting-composite */
  ChevronLeft: <FontIcon iconName="ChevronLeft" />,
  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  Download: <FontIcon iconName="Download" />,
  LobbyScreenConnectingToCall: <CoffeeIcon />,
  LobbyScreenWaitingToBeAdmitted: <CoffeeIcon />,
  LocalDeviceSettingsCamera: <Video20Filled />,
  LocalDeviceSettingsMic: <MicOn20Filled />,
  LocalDeviceSettingsSpeaker: <Speaker220Filled />,
  LocalPreviewPlaceholder: <VideoOff20Filled />,
  /* @conditional-compile-remove-from(stable) */
  LocalCameraSwitch: <CameraSwitch24Regular />,
  /* @conditional-compile-remove-from(stable) Chat_Notification_Icon*/
  ControlBarButtonBadgeIcon: <Circle20Filled />,
  /* @conditional-compile-remove-from(stable): meeting-composite */
  ControlBarChatButtonActive: <Chat20Filled />,
  /* @conditional-compile-remove-from(stable): meeting-composite */
  ControlBarChatButtonInactive: <Chat20Regular />,
  /* @conditional-compile-remove-from(stable): meeting/calling-composite */
  ControlBarPeopleButton: <People20Regular />,
  /* @conditional-compile-remove-from(stable): meeting/calling-composite */
  MoreDrawerMicrophones: <MicOn20Regular />,
  /* @conditional-compile-remove-from(stable): meeting/calling-composite */
  MoreDrawerPeople: <People20Regular />,
  /* @conditional-compile-remove-from(stable): meeting/calling-composite */
  MoreDrawerSpeakers: <Speaker220Regular />,
  /* @conditional-compile-remove-from(stable): meeting/calling-composite */
  MoreDrawerSelectedMicrophone: <MicOn20Filled />,
  /* @conditional-compile-remove-from(stable): meeting/calling-composite */
  MoreDrawerSelectedSpeaker: <Speaker220Filled />,
  Muted: <MicOff20Filled />,
  NetworkReconnectIcon: <CallMissed20Filled />,
  NoticePageAccessDeniedTeamsMeeting: <PersonDelete20Filled />,
  NoticePageJoinCallFailedDueToNoNetwork: <WifiWarning20Filled />,
  NoticePageLeftCall: <CallEnd20Filled />,
  NoticePageRemovedFromCall: <Info20Filled />,
  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  SendBoxAttachFile: <Attach20Regular />
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

/**
 * Icons that can be overridden in one of the composites exported by this library.
 *
 * See {@link ChatCompositeIcons}, {@link CallCompositeIcons} and {@link CallWithChatCompositeIcons} for more targeted types.
 *
 * @public
 */
export type CompositeIcons = ComponentIcons & Record<keyof typeof COMPOSITE_ONLY_ICONS, JSX.Element>;

/** @private */
export type CompositeIconProps<Icons> = IIconProps & { iconName: keyof Icons };

/**
 * Icons that can be overridden for {@link ChatComposite}.
 *
 * @public
 */
export type ChatCompositeIcons = Partial<
  Pick<
    CompositeIcons,
    | 'EditBoxCancel'
    | 'EditBoxSubmit'
    | 'MessageDelivered'
    | 'MessageEdit'
    | 'MessageFailed'
    | 'MessageRemove'
    | 'MessageSeen'
    | 'MessageSending'
    | 'ParticipantItemOptions'
    | 'ParticipantItemOptionsHovered'
    | 'SendBoxSend'
    | 'SendBoxSendHovered'
    | /* @conditional-compile-remove-from(stable): FILE_SHARING */ 'SendBoxAttachFile'
    | /* @conditional-compile-remove-from(stable): FILE_SHARING */ 'Download'
    | /* @conditional-compile-remove-from(stable): FILE_SHARING */ 'Cancel'
  >
>;

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
export type CallCompositeIcons = Partial<
  Pick<
    CompositeIcons,
    | 'ControlButtonCameraOff'
    | 'ControlButtonCameraOn'
    | 'ControlButtonEndCall'
    | 'ControlButtonMicOff'
    | 'ControlButtonMicOn'
    | 'ControlButtonOptions'
    | 'ControlButtonParticipants'
    | 'ControlButtonScreenShareStart'
    | 'ControlButtonScreenShareStop'
    | 'ErrorBarCallCameraAccessDenied'
    | 'ErrorBarCallCameraAlreadyInUse'
    | 'ErrorBarCallLocalVideoFreeze'
    | 'ErrorBarCallMacOsCameraAccessDenied'
    | 'ErrorBarCallMacOsMicrophoneAccessDenied'
    | 'ErrorBarCallMicrophoneAccessDenied'
    | 'ErrorBarCallMicrophoneMutedBySystem'
    | 'ErrorBarCallNetworkQualityLow'
    | 'ErrorBarCallNoMicrophoneFound'
    | 'ErrorBarCallNoSpeakerFound'
    | 'HorizontalGalleryLeftButton'
    | 'HorizontalGalleryRightButton'
    | 'LobbyScreenConnectingToCall'
    | 'LobbyScreenWaitingToBeAdmitted'
    | 'LocalDeviceSettingsCamera'
    | 'LocalDeviceSettingsMic'
    | 'LocalDeviceSettingsSpeaker'
    | 'LocalPreviewPlaceholder'
    | 'Muted'
    | 'NetworkReconnectIcon'
    | 'NoticePageAccessDeniedTeamsMeeting'
    | 'NoticePageJoinCallFailedDueToNoNetwork'
    | 'NoticePageLeftCall'
    | 'NoticePageRemovedFromCall'
    | 'OptionsCamera'
    | 'OptionsMic'
    | 'OptionsSpeaker'
    | 'ParticipantItemMicOff'
    | 'ParticipantItemOptions'
    | 'ParticipantItemOptionsHovered'
    | 'ParticipantItemScreenShareStart'
    | 'VideoTileMicOff'
    | /* @conditional-compile-remove-from(stable) */ 'LocalCameraSwitch'
  >
>;

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
 * @beta
 */
export type CallWithChatCompositeIcons = Partial<
  Pick<
    CompositeIcons,
    // CallWithChat Specific Icons
    | /* @conditional-compile-remove-from(stable) meeting-composite */ 'ChevronLeft'
    | /* @conditional-compile-remove-from(stable) meeting-composite */ 'ControlBarButtonBadgeIcon'
    | /* @conditional-compile-remove-from(stable) meeting-composite */ 'ControlBarChatButtonActive'
    | /* @conditional-compile-remove-from(stable) meeting-composite */ 'ControlBarChatButtonInactive'
    | /* @conditional-compile-remove-from(stable) meeting-composite */ 'ControlBarPeopleButton'

    // Call icons
    | 'ControlButtonCameraOff'
    | 'ControlButtonCameraOn'
    | 'ControlButtonEndCall'
    | 'ControlButtonMicOff'
    | 'ControlButtonMicOn'
    | 'ControlButtonOptions'
    | 'ControlButtonScreenShareStart'
    | 'ControlButtonScreenShareStop'
    | 'ErrorBarCallCameraAccessDenied'
    | 'ErrorBarCallCameraAlreadyInUse'
    | 'ErrorBarCallLocalVideoFreeze'
    | 'ErrorBarCallMacOsCameraAccessDenied'
    | 'ErrorBarCallMacOsMicrophoneAccessDenied'
    | 'ErrorBarCallMicrophoneAccessDenied'
    | 'ErrorBarCallMicrophoneMutedBySystem'
    | 'ErrorBarCallNetworkQualityLow'
    | 'ErrorBarCallNoMicrophoneFound'
    | 'ErrorBarCallNoSpeakerFound'
    | 'HorizontalGalleryLeftButton'
    | 'HorizontalGalleryRightButton'
    | 'LobbyScreenConnectingToCall'
    | 'LobbyScreenWaitingToBeAdmitted'
    | 'LocalDeviceSettingsCamera'
    | 'LocalDeviceSettingsMic'
    | 'LocalDeviceSettingsSpeaker'
    | 'LocalPreviewPlaceholder'
    | 'Muted'
    | 'NetworkReconnectIcon'
    | 'NoticePageAccessDeniedTeamsMeeting'
    | 'NoticePageJoinCallFailedDueToNoNetwork'
    | 'NoticePageLeftCall'
    | 'NoticePageRemovedFromCall'
    | 'OptionsCamera'
    | 'OptionsMic'
    | 'OptionsSpeaker'
    | 'ParticipantItemMicOff'
    | 'ParticipantItemOptions'
    | 'ParticipantItemOptionsHovered'
    | 'ParticipantItemScreenShareStart'
    | 'VideoTileMicOff'
    | /* @conditional-compile-remove-from(stable) meeting-composite */ 'LocalCameraSwitch'

    // Chat icons
    | 'EditBoxCancel'
    | 'EditBoxSubmit'
    | 'MessageDelivered'
    | 'MessageEdit'
    | 'MessageFailed'
    | 'MessageRemove'
    | 'MessageSeen'
    | 'MessageSending'
    | 'ParticipantItemOptions'
    | 'ParticipantItemOptionsHovered'
    | 'SendBoxSend'
    | 'SendBoxSendHovered'
    | /* @conditional-compile-remove-from(stable): FILE_SHARING */ 'SendBoxAttachFile'
  >
>;

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
