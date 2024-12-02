// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FocusZone, IStyle, Label, mergeStyles, Stack } from '@fluentui/react';
import { useId, useWarnings } from '@fluentui/react-hooks';
import React from 'react';
import { chunk } from '../utils';
import { _VideoEffectsItem, _VideoEffectsItemProps } from './VideoEffectsItem';
import { hiddenVideoEffectsItemContainerStyles } from './VideoEffectsItem.styles';

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

  /**
   * Imperative handle for calling focus()
   */
  componentRef?: React.RefObject<{
    focus: () => void;
  }>;
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
    isSelected: option.itemKey === selectedEffect,
    onSelect: () => setSelectedEffect(option.itemKey),
    ...option
  }));

  const itemsPerRow = props.itemsPerRow ?? 3;
  const optionsByRow = itemsPerRow === 'wrap' ? [convertedOptions] : chunk(convertedOptions, itemsPerRow);

  // If the final row is not full, fill it with hidden items to ensure layout.
  const fillCount = itemsPerRow === 'wrap' ? 0 : itemsPerRow - (optionsByRow[optionsByRow.length - 1]?.length ?? 0);

  const effectsLabelId = useId('effects-radio-label');
  return (
    <FocusZone>
      <Stack tokens={{ childrenGap: '0.5rem' }} role="radiogroup" aria-labelledby={effectsLabelId}>
        <Label id={effectsLabelId} className={mergeStyles(props.styles?.label)}>
          {props.label}
        </Label>

        {optionsByRow.map((options, rowIndex) => (
          <Stack
            className={mergeStyles(props.styles?.rowRoot)}
            wrap={props.itemsPerRow === 'wrap'}
            horizontal
            key={rowIndex}
            tokens={{ childrenGap: '0.5rem' }}
            data-ui-id="video-effects-picker-row"
          >
            {options.map((option, i) => {
              if (i === 0 && rowIndex === 0) {
                return (
                  <_VideoEffectsItem
                    {...option}
                    itemKey={option.itemKey}
                    key={option.itemKey}
                    componentRef={props.componentRef}
                  />
                );
              }
              return <_VideoEffectsItem {...option} itemKey={option.itemKey} key={option.itemKey} />;
            })}
            {fillCount > 0 &&
              rowIndex === optionsByRow.length - 1 &&
              Array.from({ length: fillCount }).map((_, index) => (
                <Stack
                  key={index}
                  styles={hiddenVideoEffectsItemContainerStyles}
                  data-ui-id="video-effects-hidden-item"
                />
              ))}
          </Stack>
        ))}
      </Stack>
    </FocusZone>
  );
};
