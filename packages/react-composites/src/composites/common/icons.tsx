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
/* @conditional-compile-remove-from(stable) */
import { CameraSwitch24Filled } from '@fluentui/react-icons';
import { ComponentIcons, DEFAULT_COMPONENT_ICONS } from '@internal/react-components';
import React from 'react';
import { mergeStyles, Text } from '@fluentui/react';
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
  LobbyScreenConnectingToCall: <CoffeeIcon />,
  LobbyScreenWaitingToBeAdmitted: <CoffeeIcon />,
  LocalDeviceSettingsCamera: <Video20Filled />,
  LocalDeviceSettingsMic: <MicOn20Filled />,
  LocalDeviceSettingsSpeaker: <Speaker220Filled />,
  LocalPreviewPlaceholder: <VideoOff20Filled />,
  /* @conditional-compile-remove-from(stable) */
  LocalCameraSwitch: <CameraSwitch24Filled />,
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
 * See {@link ChatCompositeIcons} and {@link CallCompositeIcons} for more targeted types.
 *
 * @public
 */
export type CompositeIcons = ComponentIcons & Record<keyof typeof COMPOSITE_ONLY_ICONS, JSX.Element>;

/**
 * Icons that can be overridden for {@link ChatComposite}.
 *
 * @public
 */
export type ChatCompositeIcons = Partial<
  Pick<
    CompositeIcons,
    | 'MessageDelivered'
    | 'MessageFailed'
    | 'MessageSeen'
    | 'MessageSending'
    | 'MessageEdit'
    | 'MessageRemove'
    | 'ParticipantItemOptions'
    | 'ParticipantItemOptionsHovered'
    | 'SendBoxSend'
    | 'SendBoxSendHovered'
    | 'EditBoxCancel'
    | 'EditBoxSubmit'
  >
> & {
  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  SendBoxAttachFile?: JSX.Element;
};

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
  >
> & {
  /* @conditional-compile-remove-from(stable) */
  LocalCameraSwitch?: JSX.Element;
};
