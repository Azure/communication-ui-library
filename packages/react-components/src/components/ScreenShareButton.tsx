// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { ShareScreenStart20Filled, ShareScreenStop20Filled } from '@fluentui/react-icons';
import { useLocale } from '../localization';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Strings of ScreenShareButton that can be overridden
 */
export interface ScreenShareButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
}

/**
 * Props for ScreenShareButton component
 */
export interface ScreenShareButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleScreenShare?: () => Promise<void>;

  /**
   * Optional strings to override in component
   */
  strings?: Partial<ScreenShareButtonStrings>;
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

  const { strings } = useLocale();
  const onLabel = props.strings?.onLabel ?? strings.cameraButton.onLabel;
  const offLabel = props.strings?.offLabel ?? strings.cameraButton.offLabel;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? (
      <ShareScreenStop20Filled key={'screenShareIconKey'} primaryFill="currentColor" />
    ) : (
      <ShareScreenStart20Filled key={'screenShareBorderedIconKey'} primaryFill="currentColor" />
    );
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'screenShareLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {props?.checked ? onLabel : offLabel}
        </Label>
      );
    },
    [onLabel, offLabel]
  );

  return (
    <DefaultButton
      {...props}
      onClick={props.onToggleScreenShare ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
