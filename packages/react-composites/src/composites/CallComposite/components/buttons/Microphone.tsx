// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { ControlBarButtonStyles, MicrophoneButton } from '@internal/react-components';

import { _HighContrastAwareIcon } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { useSelector } from '../../hooks/useSelector';
import { getCallStatus, getLocalMicrophoneEnabled } from '../../selectors/baseSelectors';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
import { useAdapter } from '../../adapter/CallAdapterProvider';

/**
 * @private
 */
export const Microphone = (props: {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  splitButtonsForDeviceSelection?: boolean;
  disabled?: boolean;
  disableTooltip?: boolean;
  /* @conditional-compile-remove(DNS) */
  isDeepNoiseSuppressionOn?: boolean;
  /* @conditional-compile-remove(DNS) */
  onClickNoiseSuppression?: () => void;
}): JSX.Element => {
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const callStatus = useSelector(getCallStatus);
  const isLocalMicrophoneEnabled = useSelector(getLocalMicrophoneEnabled);
  const adapter = useAdapter();
  const isRoomsCall = adapter.getState().isRoomsCall;

  const unmuteMicCapability = adapter.getState().call?.capabilitiesFeature?.capabilities.unmuteMic;

  /**
   * When call is in connecting state, microphone button should be disabled.
   * This is due to to headless limitation where a call can not be muted/unmuted in lobby.
   */
  if (callStatus === 'Connecting') {
    // Lobby page should show the microphone status that was set on the local preview/configuration
    // page until the user successfully joins the call.
    microphoneButtonProps.checked = isLocalMicrophoneEnabled;
  }
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  // tab focus on MicrophoneButton on page load
  return (
    <MicrophoneButton
      data-ui-id="call-composite-microphone-button"
      {...microphoneButtonProps}
      /* @conditional-compile-remove(DNS) */
      isDeepNoiseSuppressionOn={props.isDeepNoiseSuppressionOn}
      /* @conditional-compile-remove(DNS) */
      onClickNoiseSuppression={props.onClickNoiseSuppression}
      showLabel={props.displayType !== 'compact'}
      disableTooltip={props.disableTooltip}
      styles={styles}
      enableDeviceSelectionMenu={props.splitButtonsForDeviceSelection}
      disabled={
        microphoneButtonProps.disabled || props.disabled || (isRoomsCall && adapter.getState().call?.role === 'Unknown')
      }
      onRenderOffIcon={
        unmuteMicCapability && !unmuteMicCapability.isPresent
          ? () => <_HighContrastAwareIcon disabled={true} iconName={'ControlButtonMicProhibited'} />
          : undefined
      }
    />
  );
};
