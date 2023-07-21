// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CameraButton, ControlBarButtonStyles } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
import { useAdapter } from '../../adapter/CallAdapterProvider';

/**
 * @private
 */
export const Camera = (props: {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  splitButtonsForDeviceSelection?: boolean;
  disabled?: boolean;
  /* @conditional-compile-remove(video-background-effects) */
  onShowVideoEffectsPicker?: (showVideoEffectsOptions: boolean) => void;
}): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  const adapter = useAdapter();
  const isRoomsCall = adapter.getState().isRoomsCall;
  return (
    <CameraButton
      data-ui-id="call-composite-camera-button"
      {...cameraButtonProps}
      showLabel={props.displayType !== 'compact'}
      styles={styles}
      enableDeviceSelectionMenu={props.splitButtonsForDeviceSelection}
      disabled={
        cameraButtonProps.disabled || props.disabled || (isRoomsCall && adapter.getState().call?.role === 'Unknown')
      }
      /* @conditional-compile-remove(video-background-effects) */
      onShowVideoEffectsPicker={props.onShowVideoEffectsPicker}
    />
  );
};
