// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFunction, Stack, useTheme } from '@fluentui/react';
import { useState } from 'react';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBar, ParticipantMenuItemsCallback, _Permissions } from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlOptions, CustomCallControlButtonCallback } from '../types/CallControlOptions';
import { Camera } from './buttons/Camera';
import { generateCustomControlBarButtons } from './buttons/Custom';
import { Devices } from './buttons/Devices';
import { EndCall } from './buttons/EndCall';
import { Microphone } from './buttons/Microphone';
import { Participants } from './buttons/Participants';
import { ScreenShare } from './buttons/ScreenShare';
import { ContainerRectProps } from '../../common/ContainerRectProps';
import { People } from './buttons/People';
import { isDisabled, isEnabled } from '../utils';
import { More } from './buttons/More';
import { DtmfDialpad } from './buttons/DtmfDialpad';

/**
 * @private
 */
export type CallControlsProps = {
  peopleButtonChecked?: boolean;
  onPeopleButtonClicked?: () => void;
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: boolean | CallControlOptions;
  /**
   * Option to increase the height of the button flyout menu items from 36px to 48px.
   * Recommended for mobile devices.
   */
  increaseFlyoutItemSize?: boolean;
  isMobile?: boolean;
};

/**
 * @private
 */
export const CallControls = (props: CallControlsProps & ContainerRectProps): JSX.Element => {
  const options = useMemo(() => (typeof props.options === 'boolean' ? {} : props.options), [props.options]);

  const theme = useTheme();
  const [showDialpad, setShowDialpad] = useState(false);
  const customButtons = useMemo(
    () => generateCustomControlBarButtons(onFetchCustomButtonPropsTrampoline(options), options?.displayType),
    [options]
  );
  const rolePermissions = usePermissionsTrampoline();

  const screenShareButtonIsEnabled = rolePermissions.screenShare && isEnabled(options?.screenShareButton);
  const microphoneButtonIsEnabled = rolePermissions.microphoneButton && isEnabled(options?.microphoneButton);
  const cameraButtonIsEnabled = rolePermissions.cameraButton && isEnabled(options?.cameraButton);
  const moreButtonIsEnabled = isEnabled(moreButtonOptionsTrampoline(options));
  const devicesButtonIsEnabled = isEnabled(options?.devicesButton);
  const participantButtonIsEnabled = isParticipantButtonEnabledTrampoline(options);
  const peopleButtonIsEnabled = isPeopleButtonEnabledTrampoline(options, props.isMobile);
  const sendDtmfDialpadIsEnabled = isSendDtmpfDiapladEnabledTrampoline();

  // when props.options is false then we want to hide the whole control bar.
  if (props.options === false) {
    return <></>;
  }

  return (
    <Stack horizontalAlign="center">
      {sendDtmfDialpadIsEnabled && (
        <DtmfDialpad isMobile={!!props.isMobile} showDialpad={showDialpad} setShowDialpad={setShowDialpad} />
      )}
      <Stack.Item>
        {/*
            Note: We use the layout="horizontal" instead of dockedBottom because of how we position the
            control bar. The control bar exists in a Stack below the MediaGallery. The MediaGallery is
            set to grow and fill the remaining space not taken up by the ControlBar. If we were to use
            dockedBottom it has position absolute and would therefore float on top of the media gallery,
            occluding some of its content.
         */}
        <ControlBar layout="horizontal" styles={controlBarStyles(theme.semanticColors.bodyBackground)}>
          {microphoneButtonIsEnabled && (
            <Microphone displayType={options?.displayType} disabled={isDisabled(options?.microphoneButton)} />
          )}
          {cameraButtonIsEnabled && (
            <Camera displayType={options?.displayType} disabled={isDisabled(options?.cameraButton)} />
          )}
          {screenShareButtonIsEnabled && (
            <ScreenShare
              option={options?.screenShareButton}
              displayType={options?.displayType}
              disabled={isDisabled(options?.screenShareButton)}
            />
          )}
          {participantButtonIsEnabled && (
            <Participants
              option={options?.participantsButton}
              callInvitationURL={props.callInvitationURL}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              isMobile={props.isMobile}
              disabled={isDisabled(options?.participantsButton)}
            />
          )}
          {peopleButtonIsEnabled && (
            <People
              peopleButtonChecked={props.peopleButtonChecked}
              onPeopleButtonClicked={props.onPeopleButtonClicked}
              options={options}
            />
          )}
          {devicesButtonIsEnabled && (
            <Devices
              displayType={options?.displayType}
              increaseFlyoutItemSize={props.increaseFlyoutItemSize}
              disabled={isDisabled(options?.devicesButton)}
            />
          )}
          {moreButtonIsEnabled && (
            <More
              options={options}
              onPeopleButtonClicked={props.onPeopleButtonClicked}
              isMobile={props.isMobile}
              setShowDialpad={setShowDialpad}
            />
          )}
          {customButtons['primary']}
          {isEnabled(options?.endCallButton) && <EndCall displayType={options?.displayType} />}
        </ControlBar>
      </Stack.Item>
    </Stack>
  );
};

const onFetchCustomButtonPropsTrampoline = (
  options?: CallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  /* @conditional-compile-remove(control-bar-button-injection) */
  return options?.onFetchCustomButtonProps;
  return undefined;
};

const isParticipantButtonEnabledTrampoline = (options?: CallControlOptions): boolean => {
  /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
  return false;
  return isEnabled(options?.participantsButton);
};

const isPeopleButtonEnabledTrampoline = (options?: CallControlOptions, isMobile?: boolean): boolean => {
  /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
  return isEnabled(options?.participantsButton) && !isMobile;
  return false;
};

const isSendDtmpfDiapladEnabledTrampoline = (): boolean => {
  /* @conditional-compile-remove(PSTN-calls) */
  return true;
  return false;
};

const moreButtonOptionsTrampoline = (options?: CallControlOptions): boolean | undefined => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  return options?.moreButton;
  // More button is never enabled in stable build.
  return false;
};

const usePermissionsTrampoline = (): _Permissions => {
  /* @conditional-compile-remove(rooms) */
  return _usePermissions();
  // On stable build, all users have all permissions
  return {
    cameraButton: true,
    microphoneButton: true,
    screenShare: true,
    removeParticipantButton: true
  };
};

// Enforce a background color on control bar to ensure it matches the composite background color.
const controlBarStyles = memoizeFunction((background: string) => ({ root: { background: background } }));
