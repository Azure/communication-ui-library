// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CameraButton, ControlBarButtonStyles } from '@internal/react-components';
/* @conditional-compile-remove(capabilities) */
import { _HighContrastAwareIcon } from '@internal/react-components';
import React, { useCallback, useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(capabilities) */
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
  onClickVideoEffects?: (showVideoEffects: boolean) => void;
  componentRef?: React.RefObject<IButton>;
  /* @conditional-compile-remove(video-background-effects) */
  videoBackgroundPickerRef?: React.RefObject<HTMLDivElement>;
}): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(capabilities) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(rooms) */
  const isRoomsCall = adapter.getState().isRoomsCall;

  /* @conditional-compile-remove(capabilities) */
  const turnVideoOnCapability = adapter.getState().call?.capabilitiesFeature?.capabilities.turnVideoOn;
  const modOnClickVideoEffects = useCallback(
    (showVideoEffects: boolean) => {
      props.onClickVideoEffects && props.onClickVideoEffects(showVideoEffects);
      console.log(props.videoBackgroundPickerRef?.current);
      props.videoBackgroundPickerRef?.current?.focus();
    },
    [props]
  );

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
      onClickVideoEffects={modOnClickVideoEffects}
      componentRef={props.componentRef}
    />
  );
};
