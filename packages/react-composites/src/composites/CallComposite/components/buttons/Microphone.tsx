// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { MicrophoneButton } from '@internal/react-components';
import React from 'react';
import { useLocale } from '../../../localization';
import { usePropsFor } from '../../hooks/usePropsFor';
import { useSelector } from '../../hooks/useSelector';
import { getCallStatus, getLocalMicrophoneEnabled } from '../../selectors/baseSelectors';
import { MicrophoneButtonComponent } from '@internal/web-components';

/**
 * @private
 */
export const Microphone = (): JSX.Element => {
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const callStatus = useSelector(getCallStatus);
  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const strings = useLocale().strings.call;

  /**
   * When call is in Lobby, microphone button should be disabled.
   * This is due to to headless limitation where a call can not be muted/unmuted in lobby.
   */
  if (_isInLobbyOrConnecting(callStatus)) {
    microphoneButtonProps.disabled = true;
    // Lobby page should show the microphone status that was set on the local preview/configuration
    // page until the user successfully joins the call.
    microphoneButtonProps.checked = isLocalMicrophoneEnabled;
  }
  const microphoneButtonStrings = _isInLobbyOrConnecting(callStatus)
    ? {
        strings: {
          tooltipOffContent: strings.microphoneToggleInLobbyNotAllowed,
          tooltipOnContent: strings.microphoneToggleInLobbyNotAllowed
        }
      }
    : {};

  // tab focus on MicrophoneButton on page load
  return (
    <MicrophoneButtonComponent
      data-ui-id="call-composite-microphone-button"
      {...microphoneButtonProps}
      {...microphoneButtonStrings}
    />
  );
};
