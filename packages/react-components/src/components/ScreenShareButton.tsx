// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, IButtonProps, Stack, concatStyleSets, mergeStyles } from '@fluentui/react';
import { CallControlCloseTrayIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Props for ScreenShareButton component
 */
export interface ScreenShareButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;
}

/**
 * `ScreenShareButton` allows you to easily create a component for rendering a screen-share button.
 * It can be used in your ControlBar component for example.
 *
 * @param props - of type ScreenShareButtonProps
 */
export const ScreenShareButton = (props: ScreenShareButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? (
      <CallControlCloseTrayIcon key={'screenShareIconKey'} />
    ) : (
      <CallControlPresentNewIcon key={'screenShareBorderedIconKey'} bordered={false} />
    );
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Stack key={'screenShareLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {props?.checked ? 'Stop' : 'Share'}
      </Stack>
    );
  };

  return (
    <DefaultButton
      {...props}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
