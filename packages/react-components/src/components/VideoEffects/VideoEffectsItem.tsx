// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Icon,
  IIconProps,
  IStyle,
  ITooltipHostProps,
  mergeStyles,
  Stack,
  Text,
  TooltipHost,
  useTheme
} from '@fluentui/react';
import React, { useCallback } from 'react';
import { videoEffectsItemContainerStyles } from './VideoEffectsItem.styles';

/**
 * Props for {@link _VideoEffectsItem}
 *
 * @internal
 */
export interface _VideoEffectsItemProps {
  /**
   * The key of the Video Background Effect.
   * This is used to identify the Video Background Effect and is returned in the onChange event.
   * It must be unique within the set of options.
   * @example 'blur'
   */
  itemKey: string;

  /**
   * The text to display for the Video effects item.
   */
  title?: string;

  /**
   * Whether the Video effects item is currently in the selected state.
   * @default false
   */
  isSelected?: boolean;

  /**
   * Callback to invoke when the Video effects item is selected.
   */
  onSelect?: (key: string) => void;

  /**
   * Whether the Video effects item is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * The icon to display for the Video effects item.
   * @default undefined (no icon)
   */
  iconProps?: IIconProps;

  /**
   * Properties to have a Tooltip display when hovering over the Video effects item.
   * @default undefined (no tooltip)
   */
  tooltipProps?: ITooltipHostProps;

  /**
   * Aria label for the Video effects item.
   */
  ariaLabel?: string;

  /**
   * Background to display for the Video effects item.
   * @default undefined (no background image)
   */
  backgroundProps?: {
    /**
     * The URL of the background image.
     */
    url: string;
  };

  /**
   * Styles for the Video effects item.
   */
  styles?: _VideoEffectsItemStyles;
}

/**
 * Styles for {@link _VideoEffectsItem}
 *
 * @internal
 */
export interface _VideoEffectsItemStyles {
  /**
   * Styles for the container of the Video effects item.
   */
  root: IStyle;

  /**
   * Styles for the container of the icon of the Video effects item.
   */
  iconContainer: IStyle;

  /**
   * Styles for the text container of the Video effects item.
   */
  textContainer: IStyle;
}

/**
 * A component for displaying a Video Background Effect Option.
 *
 * @internal
 */
export const _VideoEffectsItem = (props: _VideoEffectsItemProps): JSX.Element => {
  const theme = useTheme();
  const isSelected = props.isSelected ?? false;
  const disabled = props.disabled ?? false;
  const backgroundImage = props.backgroundProps?.url;

  const containerStyles = useCallback(
    () =>
      videoEffectsItemContainerStyles({
        theme,
        isSelected,
        disabled,
        backgroundImage
      }),
    [backgroundImage, disabled, isSelected, theme]
  );

  return (
    <TooltipHost {...props.tooltipProps}>
      <Stack
        key={props.itemKey}
        className={mergeStyles(props.styles?.root)}
        verticalAlign="center"
        horizontalAlign="center"
        styles={containerStyles}
        data-ui-id={`video-effects-item`}
        onClick={disabled ? undefined : () => props.onSelect?.(props.itemKey)}
        onKeyDown={
          disabled
            ? undefined
            : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  props.onSelect?.(props.itemKey);
                }
              }
        }
        tabIndex={props.disabled ? -1 : 0}
        aria-label={props.ariaLabel}
        aria-disabled={props.disabled}
        role="button"
      >
        {props.iconProps && (
          <Stack.Item styles={{ root: props.styles?.iconContainer }}>
            <Icon {...props.iconProps} />
          </Stack.Item>
        )}
        {props.title && (
          <Stack.Item styles={{ root: props.styles?.textContainer }}>
            <Text variant="small">{props.title}</Text>
          </Stack.Item>
        )}
      </Stack>
    </TooltipHost>
  );
};
