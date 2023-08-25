// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(raise-hand) */
import { ControlBarButtonStyles, RaiseHandButton, RaiseHandButtonProps } from '@internal/react-components';
/* @conditional-compile-remove(raise-hand) */
import React, { useMemo } from 'react';
/* @conditional-compile-remove(raise-hand) */
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
/* @conditional-compile-remove(raise-hand) */
import { usePropsFor } from '../../hooks/usePropsFor';
/* @conditional-compile-remove(raise-hand) */
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(raise-hand) */
import { useSelector } from '../../hooks/useSelector';
/* @conditional-compile-remove(raise-hand) */
import { getCallStatus } from '../../selectors/baseSelectors';
/* @conditional-compile-remove(raise-hand) */
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';

/* @conditional-compile-remove(raise-hand) */
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
      disabled={raiseHandButtonDisabled || raiseHandButtonProps.disabled || props.disabled}
      styles={styles}
    />
  );
};

/* @conditional-compile-remove(raise-hand) */
const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
