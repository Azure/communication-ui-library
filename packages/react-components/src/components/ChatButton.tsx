// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { Chat20Filled, Chat20Regular } from '@fluentui/react-icons';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Strings of ScreenShareButton that can be overridden
 */
export interface ChatButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
}

/**
 * Props for ScreenShareButton component
 */
export interface ChatButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleChat?: () => Promise<void>;

  /**
   * Optional strings to override in component
   */
  strings?: Partial<ChatButtonStrings>;
}

/**
 * `ScreenShareButton` allows you to easily create a component for rendering a screen-share button.
 * It can be used in your ControlBar component for example.
 *
 * @param props - of type ScreenShareButtonProps
 */
export const ChatButton = (props: ChatButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  // const localeStrings = useLocale().strings.screenShareButton; // todo
  const onLabel = props.strings?.onLabel ?? 'Chat';
  const offLabel = props.strings?.offLabel ?? 'Chat';

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? (
      <Chat20Regular key={'chatOnIconKey'} primaryFill="currentColor" />
    ) : (
      <Chat20Filled key={'chatOffIconKey'} primaryFill="currentColor" />
    );
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'chatLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {props?.checked ? onLabel : offLabel}
        </Label>
      );
    },
    [onLabel, offLabel]
  );

  return (
    <DefaultButton
      {...props}
      onClick={props.onToggleChat ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
