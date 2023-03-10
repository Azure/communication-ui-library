// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, Label, mergeStyles, Stack } from '@fluentui/react';
import { useWarnings } from '@fluentui/react-hooks';
import React from 'react';
import { chunk } from '../utils';
import { _VideoEffectsItem, _VideoEffectsItemProps } from './VideoEffectsItem';

/**
 * Props for {@link _VideoBackgroundEffectsPicker}
 * @internal
 */
export interface _VideoBackgroundEffectsPickerProps {
  /**
   * The options to display in the picker.
   */
  options: _VideoBackgroundEffectChoiceOption[];

  /**
   * The key of the current selected Video Background Effect.
   * If you provide this, you must maintain selection state by observing onChange events and passing a new value in when changed.
   */
  selectedEffectKey?: string;

  /**
   * Callback to invoke when a Video Background Effect is selected.
   * @param effectKey - The key of the Video Background Effect that was selected.
   */
  onChange?: (effectKey: string) => void;

  /**
   * The key of the Video Background Effect that is initially selected.
   * Only provide this if the picker is an uncontrolled component;
   * otherwise, use the `selectedEffectKey` property.
   */
  defaultSelectedEffectKey?: string;

  /**
   * The label to display for the picker.
   */
  label?: string;

  /**
   * The number of items to display per row.
   * @default 3
   */
  itemsPerRow?: 'wrap' | number;

  /**
   * Styles for the picker.
   */
  styles?: _VideoBackgroundEffectsPickerStyles;
}

/**
 * Option for the {@link _VideoBackgroundEffectsPicker}.
 * @internal
 */
export type _VideoBackgroundEffectChoiceOption = _VideoEffectsItemProps;

/**
 * Styles for the {@link _VideoBackgroundEffectsPicker}.
 * @internal
 */
export interface _VideoBackgroundEffectsPickerStyles {
  /**
   * Styles for the root element.
   */
  root?: IStyle;

  /**
   * Styles for the label.
   */
  label?: IStyle;

  /**
   * Styles for the root of each row element.
   */
  rowRoot?: IStyle;
}

/**
 * Picker for choosing a Video Background Effect.
 *
 * @remarks
 * This functions similar to a radio group of buttons, where the user can select one of the options.
 *
 * @internal
 */
export const _VideoBackgroundEffectsPicker = (props: _VideoBackgroundEffectsPickerProps): JSX.Element => {
  const [componentControlledSelectedEffectKey, setComponentControlledSelectedEffectKey] = React.useState<
    string | undefined
  >(props.defaultSelectedEffectKey);

  // Warn the developer if they use the component in an incorrect controlled way.
  useWarnings({
    name: 'VideoBackgroundEffectsPicker',
    props,
    controlledUsage: {
      onChangeProp: 'onChange',
      valueProp: 'selectedEffectKey',
      defaultValueProp: 'defaultSelectedEffectKey'
    }
  });

  const selectedEffect = props.selectedEffectKey ?? componentControlledSelectedEffectKey;
  const setSelectedEffect = (selectedEffectKey: string): void => {
    setComponentControlledSelectedEffectKey(selectedEffectKey);
    props.onChange?.(selectedEffectKey);
  };

  const convertedOptions: _VideoEffectsItemProps[] = props.options.map((option) => ({
    isSelected: option.key === selectedEffect,
    onSelect: () => setSelectedEffect(option.key),
    ...option
  }));

  const optionsByRow =
    props.itemsPerRow === 'wrap' ? [convertedOptions] : chunk(convertedOptions, props.itemsPerRow ?? 3);

  return (
    <Stack tokens={{ childrenGap: '0.5rem' }}>
      <Label className={mergeStyles(props.styles?.label)}>{props.label}</Label>
      {optionsByRow.map((options, rowIndex) => (
        <Stack
          className={mergeStyles(props.styles?.rowRoot)}
          wrap={props.itemsPerRow === 'wrap'}
          horizontal
          key={rowIndex}
          tokens={{ childrenGap: '0.5rem' }}
        >
          {options.map((option) => (
            <_VideoEffectsItem {...option} key={option.key} />
          ))}
        </Stack>
      ))}
    </Stack>
  );
};
