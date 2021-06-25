// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles, useTheme } from '@fluentui/react';
import { CallEnd20Filled } from '@fluentui/react-icons';
import { controlButtonLabelStyles, endCallControlButtonStyles } from './styles/ControlBar.styles';
import { lightTheme, darkTheme } from '../theming/themes';
import { isDarkThemed } from '../theming/themeUtils';

/**
 * Props for EndCallButton component
 */
export interface EndCallButtonProps extends IButtonProps {
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
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

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

  const defaultRenderIcon = (): JSX.Element => {
    return <CallEnd20Filled primaryFill="currentColor" key={'callEndIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'callEndLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        Leave
      </Label>
    );
  };

  return (
    <DefaultButton
      {...props}
      onClick={props.onHangUp ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
