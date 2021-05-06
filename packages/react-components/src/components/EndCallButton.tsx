// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { DefaultButton, IButtonProps, Stack, concatStyleSets, mergeStyles } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';
import { controlButtonLabelStyles, endCallControlButtonStyles } from './styles/ControlBar.styles';

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
}

/**
 * `EndCallButton` allows you to easily create a component for rendering a end call button. It can be used in your ControlBar component for example.
 *
 * @param props - of type EndCallButtonProps
 */
export const EndCallButton = (props: EndCallButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(endCallControlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <CallEndIcon key={'callEndIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Stack key={'callEndLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {'Hangup'}
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
