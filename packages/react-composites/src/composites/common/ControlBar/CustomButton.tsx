// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line no-restricted-imports
import { Icon, IContextualMenuItem, mergeStyleSets } from '@fluentui/react';
import { ControlBarButton, _DrawerMenuItemProps } from '@internal/react-components';
import React from 'react';
import { _CommonCallControlOptions } from '../types/CommonCallControlOptions';
import { CallControlDisplayType } from '../types/CommonCallControlOptions';
import { CommonCallControlOptions } from '../types/CommonCallControlOptions';

/**
 * Max number of Custom Buttons in primary and secondary ControlBar
 * Does not include existing buttons in the controlBar.
 *
 * @private
 */
export const CUSTOM_BUTTON_OPTIONS = {
  MAX_PRIMARY_DESKTOP_CUSTOM_BUTTONS: 3,
  MAX_PRIMARY_MOBILE_CUSTOM_BUTTONS: 1,
  MAX_SECONDARY_DESKTOP_CUSTOM_BUTTONS: 2
};

/** @private */
export type CustomButtons = {
  [key in CustomCallControlButtonPlacement]: typeof ControlBarButton[] | undefined;
};

/**
 * Arguments for {@link CustomCallControlButtonCallback}.
 *
 * @beta
 */
export interface CustomCallControlButtonCallbackArgs {
  /**
   * Buttons should reduce the size to fit a smaller viewport when `displayType` is `'compact'`.
   *
   * @defaultValue `'default'`
   */
  displayType?: CallControlDisplayType;
}

/**
 * Response from {@link CustomCallControlButtonCallback}.
 * Includes the base props necessary to render a {@link ControlBarButton} or {@link DrawerMenuItem}.
 *
 * @beta
 */
export interface CustomCallControlButtonProps {
  /**
   * Where to place the custom button relative to other buttons.
   */
  placement: CustomCallControlButtonPlacement;
  /**
   * Icon to render. Icon is a non-default icon name that needs to be registered as a
   * custom icon using registerIcons through fluentui. Examples include icons from the fluentui library
   */
  iconName?: string;
  /**
   * Calback for when button is clicked
   */
  onItemClick?: () => void;
  /**
   * Whether the buttons is disabled
   */
  disabled?: boolean;
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;
  /**
   * A unique id set for the standard HTML id attibute
   */
  id?: string;
  /**
   * Optional strings to override in component
   */
  strings?: CustomCallControlButtonStrings;
}

/**
 * @beta
 */
export interface CustomCallControlButtonStrings {
  /**
   * Optional label for the button
   */
  label?: string;
  /**
   * Text that is shown in Tooltip content
   */
  tooltipContent?: string;
  /**
   * The aria label of the button for the benefit of screen readers.
   */
  ariaLabel?: string;
  /**
   * Detailed description of the button for the benefit of screen readers.
   */
  ariaDescription?: string;
}

/** @private */
export const generateCustomCallControlBarButton = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const allButtonProps = onFetchCustomButtonProps?.map((callback) => callback({ displayType }));

  return {
    primary: generateCustomControlBarButtons('primary', allButtonProps),
    secondary: generateCustomControlBarButtons('secondary', allButtonProps),
    overflow: generateCustomControlBarButtons('overflow', allButtonProps)
  };
};

/** @private */
const generateCustomControlBarButtons = (
  placement: CustomCallControlButtonPlacement,
  customButtons?: CustomCallControlButtonProps[]
): typeof ControlBarButton[] =>
  customButtons
    ? customButtons
        .filter((buttonProps) => buttonProps.placement === placement)
        .map((buttonProps, i) => (internalProps) => {
          if (buttonProps['onRenderButton']) {
            return buttonProps['onRenderButton'](internalProps);
          }
          return (
            <ControlBarButton
              ariaDescription={buttonProps.strings?.ariaDescription ?? internalProps.ariaDescription}
              ariaLabel={
                buttonProps.strings?.ariaLabel ?? buttonProps.strings?.tooltipContent ?? internalProps.ariaLabel
              }
              disabled={buttonProps.disabled ?? internalProps.disabled}
              id={buttonProps.id ?? internalProps.id}
              key={`${buttonProps.placement}_${i}`}
              onClick={buttonProps.onItemClick ?? internalProps.onClick}
              onRenderIcon={() => (
                <Icon iconName={buttonProps.iconName ?? internalProps.iconProps?.iconName ?? 'ControlButtonOptions'} />
              )}
              showLabel={buttonProps.showLabel ?? internalProps.showLabel}
              text={buttonProps.strings?.label ?? internalProps.label}
              styles={mergeStyleSets(internalProps.styles)}
            />
          );
        })
    : [];

/** @private */
const generateCustomDrawerButtons = (
  placement: CustomCallControlButtonPlacement,
  customButtons?: CustomCallControlButtonProps[]
): _DrawerMenuItemProps[] =>
  customButtons
    ? customButtons
        .filter((buttonProps) => buttonProps.placement === placement)
        .map(
          (buttonProps, i): _DrawerMenuItemProps => ({
            ...buttonProps,
            disabled: buttonProps.disabled,
            iconProps: { iconName: buttonProps.iconName },
            id: buttonProps.id,
            itemKey: `${buttonProps.placement}_${i}`,
            onItemClick: buttonProps.onItemClick,
            text: buttonProps.strings?.label
          })
        )
    : [];

/** @private */
export type CustomDrawerButtons = {
  [key in CustomCallControlButtonPlacement]: _DrawerMenuItemProps[];
};

/** @private */
export const generateCustomCallDrawerButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomDrawerButtons => {
  const customButtons = onFetchCustomButtonProps?.map((callback) => callback({ displayType }));
  return {
    primary: generateCustomDrawerButtons('primary', customButtons),
    secondary: generateCustomDrawerButtons('secondary', customButtons),
    overflow: generateCustomDrawerButtons('overflow', customButtons)
  };
};

/** @private */
export type CustomDesktopOverflowButtons = {
  [key in CustomCallControlButtonPlacement]: IContextualMenuItem[];
};

/** @private */
export const generateCustomCallDesktopOverflowButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomDesktopOverflowButtons => {
  const customButtons = onFetchCustomButtonProps?.map((callback) => callback({ displayType }));
  return {
    primary: generateCustomDrawerButtons('primary', customButtons).map(drawerMenuItemToContextualMenuItem),
    secondary: generateCustomDrawerButtons('secondary', customButtons).map(drawerMenuItemToContextualMenuItem),
    overflow: generateCustomDrawerButtons('overflow', customButtons).map(drawerMenuItemToContextualMenuItem)
  };
};

/** @private */
export const drawerMenuItemToContextualMenuItem = (item: _DrawerMenuItemProps): IContextualMenuItem => ({
  ...item,
  key: item.itemKey,
  onClick: item.onItemClick
    ? (ev) => {
        item.onItemClick?.(ev);
      }
    : undefined,
  subMenuProps: item.subMenuProps
    ? {
        items: item.subMenuProps.map(drawerMenuItemToContextualMenuItem)
      }
    : undefined
});

/**
 * A callback that returns the props to render a custom {@link ControlBarButton} and {@link DrawerMenuItem}.
 *
 * The response indicates where the custom button should be placed.
 *
 * Performance tip: This callback is only called when either the callback or its arguments change.
 * @beta
 */
export type CustomCallControlButtonCallback = (
  args: CustomCallControlButtonCallbackArgs
) => CustomCallControlButtonProps;

/**
 * Placement for a custom button injected in the {@link CommonCallControlBar}.
 *
 * 'primary': Place the button(s) on the right end of the center control bar but before the EndCallButton (left end in rtl mode).
 * 'overflow': Place the buttons(s) on the end of the overflow Menu.
 * 'secondary': Place the button(s) on the left end of the side control bar (right in rtl mode).
 *
 * Multiple buttons assigned the same placement are appended in order.
 * E.g., if two buttons are placed in 'secondary', they'll both appear on the left end (right end in rtl mode)
 * in the order provided.
 *
 * Only 'primary' placement works when legacy call control is enabled in call composite
 *
 * @beta
 */
export type CustomCallControlButtonPlacement = 'primary' | 'overflow' | 'secondary';

/** @private */
export const onFetchCustomButtonPropsTrampoline = (
  options?: CommonCallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  response = (options as _CommonCallControlOptions)?.onFetchCustomButtonProps;
  return response;
};
