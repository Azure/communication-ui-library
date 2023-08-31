// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CameraButton, ControlBarButtonStyles } from '@internal/react-components';
/* @conditional-compile-remove(capabilities) */
import { _HighContrastAwareIcon } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../../adapter/CallAdapterProvider';
import { IButton } from '@fluentui/react';

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
  componentRef?: React.RefObject<IButton>;
}): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  /* @conditional-compile-remove(rooms) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(rooms) */
  const isRoomsCall = adapter.getState().isRoomsCall;

  /* @conditional-compile-remove(capabilities) */
  const turnVideoOnCapability = adapter.getState().call?.capabilitiesFeature?.capabilities.turnVideoOn;

  return (
    <CameraButton
      data-ui-id="call-composite-camera-button"
      {...cameraButtonProps}
      showLabel={props.displayType !== 'compact'}
      styles={styles}
      enableDeviceSelectionMenu={props.splitButtonsForDeviceSelection}
      disabled={
        cameraButtonProps.disabled ||
        props.disabled ||
        /* @conditional-compile-remove(rooms) */ (isRoomsCall && adapter.getState().call?.role === 'Unknown')
      }
      /* @conditional-compile-remove(capabilities) */
      onRenderOffIcon={
        turnVideoOnCapability && !turnVideoOnCapability.isPresent
          ? () => <_HighContrastAwareIcon disabled={true} iconName={'ControlButtonCameraProhibited'} />
          : undefined
      }
      /* @conditional-compile-remove(video-background-effects) */
      onShowVideoEffectsPicker={props.onShowVideoEffectsPicker}
      componentRef={props.componentRef}
    />
  );
};
