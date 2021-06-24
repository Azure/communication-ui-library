// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { concatStyleSets, useTheme } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';
import { endCallControlButtonStyles } from './styles/ControlBar.styles';
import { lightTheme, darkTheme } from '../theming/themes';
import { isDarkThemed } from '../theming/themeUtils';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';

/**
 * Props for EndCallButton component
 */
export interface EndCallButtonProps extends ControlBarButtonProps {
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onHangUp?: () => Promise<void>;
}

/**
 * `EndCallButton` allows you to easily create a component for rendering a end call button. It can be used in your ControlBar component for example.
 *
 * @param props - of type EndCallButtonProps
 */
export const EndCallButton = (props: EndCallButtonProps): JSX.Element => {
  const { styles } = props;

  const isDarkTheme = isDarkThemed(useTheme());

  const componentStyles = concatStyleSets(
    endCallControlButtonStyles,
    {
      root: {
        background: isDarkTheme ? darkTheme.callingPalette.callRed : lightTheme.callingPalette.callRed
      },
      rootHovered: {
        background: isDarkTheme ? darkTheme.callingPalette.callRedDark : lightTheme.callingPalette.callRedDark
      },
      rootPressed: {
        background: isDarkTheme ? darkTheme.callingPalette.callRedDarker : lightTheme.callingPalette.callRedDarker
      }
    },
    styles ?? {}
  );

  return (
    <ControlBarButton
      {...props}
      onClick={props.onHangUp ?? props.onClick}
      styles={componentStyles}
      icon={<CallEndIcon key={'callEndIconKey'} />}
      labelText={'leave'}
    />
  );
};
