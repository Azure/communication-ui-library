// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBarButtonStyles, RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
import { useSelector } from '../../hooks/useSelector';
import { getCallStatus } from '../../selectors/baseSelectors';
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';

/** @private */
export const RaiseHand = (props: {
  // The value of `CallControlOptions.raiseHandButton`.
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const raiseHandButtonProps = usePropsFor(RaiseHandButton) as RaiseHandButtonProps;
  const callStatus = useSelector(getCallStatus);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);

  let raiseHandButtonDisabled = isDisabled(props.option);

  if (_isInLobbyOrConnecting(callStatus)) {
    raiseHandButtonDisabled = true;
  }

  return (
    <RaiseHandButton
      data-ui-id="call-composite-raisehand-button"
      {...raiseHandButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={raiseHandButtonDisabled || props.disabled}
      styles={styles}
    />
  );
};

const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
