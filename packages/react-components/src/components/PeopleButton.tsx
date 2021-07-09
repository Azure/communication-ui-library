// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { People20Filled, People20Regular } from '@fluentui/react-icons';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Strings of PeopleButton that can be overridden
 */
export interface PeopleButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
}

/**
 * Props for PeopleButton component
 */
export interface PeopleButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Optional strings to override in component
   */
  strings?: Partial<PeopleButtonStrings>;
}

/**
 * `PeopleButton` allows you to easily create a component for rendering a screen-share button.
 * It can be used in your ControlBar component for example.
 *
 * @param props - of type PeopleButtonProps
 */
export const PeopleButton = (props: PeopleButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  // const localeStrings = useLocale().strings.PeopleButton; // todo
  const onLabel = props.strings?.onLabel ?? 'People';
  const offLabel = props.strings?.offLabel ?? 'People';

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? (
      <People20Filled key={'peopleOnIconKey'} primaryFill="currentColor" />
    ) : (
      <People20Regular key={'peopleOffIconKey'} primaryFill="currentColor" />
    );
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'peopleLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {props?.checked ? onLabel : offLabel}
        </Label>
      );
    },
    [onLabel, offLabel]
  );

  return (
    <DefaultButton
      {...props}
      onClick={props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
