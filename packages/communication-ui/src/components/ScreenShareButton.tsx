// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { DefaultButton, IButtonProps, mergeStyles, Stack } from '@fluentui/react';
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
 * @param props - of type ScreenShareButtonProps
 */
export const ScreenShareButton = (props: ScreenShareButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? <CallControlCloseTrayIcon /> : <CallControlPresentNewIcon bordered={false} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return <Stack className={mergeStyles(controlButtonLabelStyles)}>{props?.checked ? 'Stop' : 'Share'}</Stack>;
  };

  return (
    <DefaultButton
      {...props}
      styles={styles ?? controlButtonStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
