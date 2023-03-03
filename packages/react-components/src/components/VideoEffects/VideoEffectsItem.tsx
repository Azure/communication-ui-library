// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Icon,
  IIconProps,
  IStackStyles,
  IStyle,
  ITheme,
  ITooltipHostProps,
  mergeStyles,
  Stack,
  Text,
  TooltipHost,
  useTheme
} from '@fluentui/react';
import React, { useCallback } from 'react';

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
  key: string;

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

    /**
     * The position of the background image.
     * @default 'center'
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position
     */
    position?: string;

    /**
     * The size of the background image.
     * @default 'cover'
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/background-size
     */
    size?: string;
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
  const backgroundPosition = props.backgroundProps?.position ?? 'center';
  const backgroundSize = props.backgroundProps?.size ?? 'cover';

  const containerStyles = useCallback(
    () =>
      videoEffectsItemContainerStyles({
        theme,
        isSelected,
        disabled,
        backgroundImage,
        backgroundPosition,
        backgroundSize
      }),
    [backgroundImage, backgroundPosition, backgroundSize, disabled, isSelected, theme]
  );

  return (
    <TooltipHost {...props.tooltipProps}>
      <Stack
        key={props.key}
        className={mergeStyles(props.styles?.root)}
        verticalAlign="center"
        horizontalAlign="center"
        styles={containerStyles}
        onClick={disabled ? undefined : () => props.onSelect?.(props.key)}
        onKeyDown={
          disabled
            ? undefined
            : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  props.onSelect?.(props.key);
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

const videoEffectsItemContainerStyles = (args: {
  theme: ITheme;
  isSelected: boolean;
  disabled: boolean;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
}): IStackStyles => {
  const borderDefaultThickness = '1px';
  const borderActiveThickness = '2px';
  return {
    root: {
      background: args.disabled ? args.theme.palette.neutralQuaternaryAlt : undefined,
      backgroundImage: args.backgroundImage ? `url(${args.backgroundImage})` : undefined,
      backgroundPosition: args.backgroundPosition,
      backgroundSize: args.backgroundSize,
      borderRadius: '0.25rem',
      color: args.theme.palette.neutralPrimary,
      cursor: args.disabled ? 'default' : 'pointer',
      height: '3.375rem',
      position: 'relative', // Used for absolute positioning of :after
      width: '4.83rem',
      // Use :after to display a border element. This is used to prevent the background image
      // resizing when the border thichkness is changed. We also want the border to be inside
      // the frame of the container, i.e. we want it to expand inwards and not outwards when
      // border thickness changes from hover/selection.
      ':after': {
        content: '""',
        position: 'absolute',
        boxSizing: 'border-box',
        border: args.isSelected
          ? `${borderActiveThickness} solid ${args.theme.palette.themePrimary}`
          : `${borderDefaultThickness} solid ${args.theme.palette.neutralQuaternaryAlt}`,
        height: '100%',
        width: '100%',
        borderRadius: '0.25rem'
      },
      ':hover': {
        ':after': {
          border:
            args.disabled && !args.isSelected
              ? `${borderDefaultThickness} solid ${args.theme.palette.neutralQuaternaryAlt}`
              : `${borderActiveThickness} solid ${args.theme.palette.themePrimary}`
        }
      }
    }
  };
};
