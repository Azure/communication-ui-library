// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DefaultButton,
  IButton,
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
import React, { useCallback, useEffect } from 'react';
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

  /**
   * Should focus on mounting of the picker item
   */
  focusOnMount?: boolean;
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
  const iconContainerStyles = mergeStyles(props.styles?.iconContainer, { height: '1.25rem' });
  const textContainerStyles = mergeStyles(props.styles?.textContainer, { height: '1.25rem' });

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

  const componentRef = React.createRef<IButton>();

  useEffect(() => {
    if (props.focusOnMount && componentRef.current) {
      componentRef.current.focus();
    }
  }, [componentRef, props.focusOnMount]);

  return (
    <TooltipHost {...props.tooltipProps}>
      <Stack
        key={props.itemKey}
        className={mergeStyles(props.styles?.root)}
        verticalAlign="center"
        horizontalAlign="center"
        data-ui-id={`video-effects-item`}
        aria-label={props.ariaLabel ?? props.itemKey}
        aria-disabled={props.disabled}
      >
        <DefaultButton
          styles={containerStyles()}
          onClick={disabled ? undefined : () => props.onSelect?.(props.itemKey)}
          componentRef={componentRef}
          autoFocus={props.focusOnMount}
        >
          <Stack horizontalAlign={'center'}>
            {props.iconProps && (
              <Stack.Item className={iconContainerStyles}>
                <Icon {...props.iconProps} />
              </Stack.Item>
            )}
            {props.title && (
              <Stack.Item className={textContainerStyles}>
                <Text variant="small">{props.title}</Text>
              </Stack.Item>
            )}
          </Stack>
        </DefaultButton>
      </Stack>
    </TooltipHost>
  );
};
