// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ControlBarButton, ControlBarButtonStrings, ControlBarButtonStyles } from '@internal/react-components';
import { CallControlDisplayType } from './types/CommonCallControlOptions';
import { _HighContrastAwareIcon } from '@internal/react-components';

/**
 * @private
 */
export const ExitSpotlightButton = (props: {
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
  onClick?: () => void;
  strings?: ControlBarButtonStrings;
}): JSX.Element => {
  return (
    <ControlBarButton
      data-ui-id={'call-composite-exit-spotlight-button'}
      labelKey={'exitSpotlightButtonLabelKey'}
      showLabel={props.displayType !== 'compact'}
      onRenderIcon={() => <_HighContrastAwareIcon iconName={'ControlButtonExitSpotlight'} />}
      onClick={props.onClick}
      {...props}
    />
  );
};
