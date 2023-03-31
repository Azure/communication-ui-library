// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets } from '@fluentui/react';
import { ControlBarButtonStyles, EndCallButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from '../../styles/Buttons.styles';

/** @private */
export const EndCall = (props: {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
}): JSX.Element => {
  const compactMode = props.displayType === 'compact';
  const hangUpButtonProps = usePropsFor(EndCallButton);
  const styles = useMemo(
    () =>
      concatStyleSets(
        compactMode ? groupCallLeaveButtonCompressedStyle : groupCallLeaveButtonStyle,
        props.styles ?? {}
      ),
    [compactMode, props.styles]
  );
  return (
    <EndCallButton
      data-ui-id="call-composite-hangup-button"
      {...hangUpButtonProps}
      styles={styles}
      showLabel={!compactMode}
    />
  );
};
