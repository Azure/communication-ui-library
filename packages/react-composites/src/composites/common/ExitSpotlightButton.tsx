// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import React from 'react';
/* @conditional-compile-remove(spotlight) */
import { ControlBarButton, ControlBarButtonStrings, ControlBarButtonStyles } from '@internal/react-components';
/* @conditional-compile-remove(spotlight) */
import { CallControlDisplayType } from './types/CommonCallControlOptions';
/* @conditional-compile-remove(spotlight) */
import { _HighContrastAwareIcon } from '@internal/react-components';

/* @conditional-compile-remove(spotlight) */
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
      onRenderIcon={() => <_HighContrastAwareIcon iconName={'StopSpotlightContextualMenuItem'} />}
      onClick={props.onClick}
      {...props}
    />
  );
};
