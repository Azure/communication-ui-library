// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CameraButton, ControlBarButtonStyles } from '@internal/react-components';

import { _HighContrastAwareIcon } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
import { IButton } from '@fluentui/react';
import { useSelector } from '../../hooks/useSelector';
import { getCapabilites, getIsRoomsCall, getRole } from '../../selectors/baseSelectors';

/**
 * @private
 */
export const Camera = (props: {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  splitButtonsForDeviceSelection?: boolean;
  disabled?: boolean;

  onClickVideoEffects?: (showVideoEffects: boolean) => void;
  componentRef?: React.RefObject<IButton>;
  disableTooltip?: boolean;
}): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  const isRoomsCall = useSelector(getIsRoomsCall);
  const role = useSelector(getRole);

  const turnVideoOnCapability = useSelector(getCapabilites)?.turnVideoOn;

  return (
    <CameraButton
      data-ui-id="call-composite-camera-button"
      {...cameraButtonProps}
      showLabel={props.displayType !== 'compact'}
      styles={styles}
      enableDeviceSelectionMenu={props.splitButtonsForDeviceSelection}
      disableTooltip={props.disableTooltip}
      disabled={cameraButtonProps.disabled || props.disabled || !!(isRoomsCall && role === 'Unknown')}
      onRenderOffIcon={
        turnVideoOnCapability?.isPresent === false
          ? () => <_HighContrastAwareIcon disabled={true} iconName={'ControlButtonCameraProhibited'} />
          : undefined
      }
      onClickVideoEffects={props.onClickVideoEffects}
      componentRef={props.componentRef}
    />
  );
};
