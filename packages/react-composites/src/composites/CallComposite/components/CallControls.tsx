// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlOptions, CustomCallControlButtonCallback } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
/* @conditional-compile-remove(control-bar-button-injection) */
import { generateCustomButtons } from './buttons/Custom';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';
import { ContainerRectProps } from '../../common/ContainerRectProps';

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
};

/**
 * @private
 */
export const CallControls = (props: CallControlsProps & ContainerRectProps): JSX.Element => {
  const options = useMemo(() => (typeof props.options === 'boolean' ? {} : props.options), [props.options]);

  /* @conditional-compile-remove(control-bar-button-injection) */
  const customButtons = useMemo(
    () => generateCustomButtons(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

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
          {isEnabled(options?.microphoneButton) && <Microphone displayType={options?.displayType} />}
          {isEnabled(options?.cameraButton) && <Camera displayType={options?.displayType} />}
          {isEnabled(options?.screenShareButton) && (
            <ScreenShare option={options?.screenShareButton} displayType={options?.displayType} />
          )}
          {isEnabled(options?.participantsButton) && (
            <Participants
              option={options?.participantsButton}
              callInvitationURL={props.callInvitationURL}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
            />
          )}
          {isEnabled(options?.devicesButton) && (
            <Devices displayType={options?.displayType} increaseFlyoutItemSize={props.increaseFlyoutItemSize} />
          )}
          {/* @conditional-compile-remove(control-bar-button-injection) */ customButtons['mainBar']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const isEnabled = (option: unknown): boolean => option !== false;

/* @conditional-compile-remove(control-bar-button-injection) */
const onFetchCustomButtonPropsTrampoline = (
  options?: CallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  /* @conditional-compile-remove(control-bar-button-injection) */
  response = options?.onFetchCustomButtonProps;
  return response;
};
