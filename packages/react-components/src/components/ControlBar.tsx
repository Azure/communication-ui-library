//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack, IButtonProps } from '@fluentui/react';
import { useTheme } from '@fluentui/react-theme-provider';
import { CallIcon, CallRecordingIcon } from '@fluentui/react-northstar';
import React from 'react';
import { BaseCustomStylesProps } from '../types';
import { controlBarStyles, controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';
import { isDarkThemed } from '../theming/themeUtils';

/** Fluent UI Button props for recording control */
export const recordButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallRecordingIcon />,
  styles: controlButtonStyles
};

/** Fluent UI Button props for recording control with label */
export const labeledRecordButtonProps: IButtonProps = {
  ...recordButtonProps,
  onRenderText: (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Stop</Stack>;
    } else {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Record</Stack>;
    }
  }
};

/** Fluent UI Button props for call answering control */
export const answerButtonProps: IButtonProps = {
  onRenderIcon: (): JSX.Element => <CallIcon />,
  styles: controlButtonStyles
};

/** Fluent UI Button props for call answering control with label */
export const labeledAnswerButtonProps: IButtonProps = {
  ...answerButtonProps,
  onRenderText: (): JSX.Element => {
    return <Stack className={mergeStyles(controlButtonLabelStyles)}>Answer</Stack>;
  }
};

export type ControlBarLayoutType =
  | 'horizontal'
  | 'vertical'
  | 'dockedTop'
  | 'dockedBottom'
  | 'dockedLeft'
  | 'dockedRight'
  | 'floatingTop'
  | 'floatingBottom'
  | 'floatingLeft'
  | 'floatingRight';

/**
 * Props for ControlBar component.
 */
export interface ControlBarProps {
  /** React Child components. */
  children?: React.ReactNode;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <ControlBar styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
  /**
   * Changes the layout of the control bar.
   * Available layouts are `horizontal`, `vertical`, `dockedTop`, `dockedBottom`,
   * `dockedLeft`, `dockedRight`, `floatingTop`, `floatingBottom`, `floatingLeft`,
   * `floatingRight`
   * Defaults to a `horizontal` layout.
   */
  layout?: ControlBarLayoutType;
}

/**
 * `ControlBar` allows you to easily create a component for call controls using
 * [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from
 * Fluent UI. Users will need to provide methods to Button components used inside `ControlBar`
 * for altering call behavior.
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, layout } = props;
  const theme = useTheme();
  const controlBarStyle = controlBarStyles[layout ?? 'horizontal'];
  return (
    <Stack
      className={mergeStyles(
        controlBarStyle,
        {
          background:
            isDarkThemed(theme) && layout?.startsWith('floating')
              ? theme.palette.neutralQuaternaryAlt
              : theme.palette.white
        },
        styles?.root
      )}
    >
      {props.children}
    </Stack>
  );
};
