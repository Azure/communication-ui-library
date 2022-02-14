// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
/* @conditional-compile-remove-from(stable) */
import { Icon } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, ParticipantMenuItemsCallback } from '@internal/react-components';
/* @conditional-compile-remove-from(stable) */
import { ControlBarButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlOptions, CustomCallControlButtonCallback } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
import { generateCustomButtons } from './buttons/Custom';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';

/**
 * @private
 */
export type CallControlsProps = {
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: boolean | CallControlOptions;
  /**
   * Option to increase the height of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  increaseFlyoutItemSize?: boolean;
  /* @conditional-compile-remove-from(stable) */
  /**
   * Click handler for participants button. If defined, participant button will not show menu
   */
  onParticipantButtonClick?: () => void;
};

/**
 * @private
 */
export const CallControls = (props: CallControlsProps): JSX.Element => {
  const options = typeof props.options === 'boolean' ? {} : props.options;
  const customButtons = useMemo(
    () => generateCustomButtons(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

  const renderParticipantsButton = (): JSX.Element => {
    /* @conditional-compile-remove-from(stable) */
    return props.onParticipantButtonClick ? (
      <ControlBarButton
        data-ui-id="call-composite-participants-button"
        onClick={props.onParticipantButtonClick}
        onRenderIcon={(): JSX.Element => <Icon iconName="ControlButtonParticipants" />}
        disabled={isDisabled(options?.participantsButton)}
      />
    ) : (
      <Participants
        option={options?.participantsButton}
        callInvitationURL={props.callInvitationURL}
        onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
        displayType={options?.displayType}
        increaseFlyoutItemSize={props.increaseFlyoutItemSize}
      />
    );
    return (
      <Participants
        option={options?.participantsButton}
        callInvitationURL={props.callInvitationURL}
        onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
        displayType={options?.displayType}
        increaseFlyoutItemSize={props.increaseFlyoutItemSize}
      />
    );
  };

  return (
    <Stack horizontalAlign="center">
      <Stack.Item>
        {/*
            Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
            control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
            set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
            dockedBottom it has position absolute and would therefore float on top of the media gallery,
            occluding some of its content.
         */}
        <ControlBar layout="horizontal">
          {customButtons['first']}
          {isEnabled(options?.microphoneButton) && <Microphone displayType={options?.displayType} />}
          {customButtons['afterMicrophoneButton']}
          {isEnabled(options?.cameraButton) && <Camera displayType={options?.displayType} />}
          {customButtons['afterCameraButton']}
          {isEnabled(options?.screenShareButton) && (
            <ScreenShare option={options?.screenShareButton} displayType={options?.displayType} />
          )}
          {customButtons['afterScreenShareButton']}
          {isEnabled(options?.participantsButton) && renderParticipantsButton()}
          {customButtons['afterParticipantsButton']}
          {isEnabled(options?.devicesButton) && (
            <Devices displayType={options?.displayType} increaseFlyoutItemSize={props.increaseFlyoutItemSize} />
          )}
          {customButtons['afterOptionsButton']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
          {customButtons['afterEndCallButton']}
          {customButtons['last']}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const isEnabled = (option: unknown): boolean => option !== false;

/* @conditional-compile-remove-from(stable) */
const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};

const onFetchCustomButtonPropsTrampoline = (
  options?: CallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  /* @conditional-compile-remove-from(stable): custom button injection */
  response = options?.onFetchCustomButtonProps;
  return response;
};
