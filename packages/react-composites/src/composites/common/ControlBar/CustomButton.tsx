// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// eslint-disable-next-line no-restricted-imports
import { Icon, IContextualMenuItem, mergeStyleSets } from '@fluentui/react';
import { ControlBarButton, ControlBarButtonProps, _DrawerMenuItemProps } from '@internal/react-components';
import React from 'react';
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

/**
 * Custom Buttons array as ControlBarButtons.
 * Return type for {@link generateCustomCallControlBarButton}
 *
 * @public
 */
export type CustomButtons = {
  [key in CustomCallControlButtonPlacement]: (typeof ControlBarButton)[] | undefined;
};

/**
 * Arguments for {@link CustomCallControlButtonCallback}.
 *
 * @public
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
 * @public
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
   *
   * @defaultValue true
   */
  disabled?: boolean;
  /**
   * Whether the label is displayed or not.
   * If no value is set, showLabel will follow composite rules
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
 * Strings for CustomCallControlButtons
 *
 * @public
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

/**
 * onRenderButton is a custom prop that can be passed to override the default rendering of the button
 * This is useful for custom buttons that need to render more than just an icon and label and is used
 * for CallWithChat button notification badge.
 *
 * @private
 */
export type _InternalCustomButtonType = (props: ControlBarButtonProps) => JSX.Element;

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
): (typeof ControlBarButton)[] =>
  customButtons
    ? customButtons
        .filter((buttonProps) => buttonProps.placement === placement)
        .map((buttonProps, i) => (internalProps) => {
          // onRenderButton is a custom prop that can be passed to override the default rendering of the button
          // This is useful for custom buttons that need to render more than just an icon and label and is used
          // for CallWithChat button notification badge. However, onRenderButton is not a public prop and is
          // not documented in the API. This is a temporary solution and will need to be revisited.
          if ('onRenderButton' in buttonProps) {
            return (buttonProps['onRenderButton'] as _InternalCustomButtonType)(internalProps);
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
                <Icon iconName={buttonProps.iconName ?? internalProps.iconProps?.iconName ?? 'DefaultCustomButton'} />
              )}
              showLabel={buttonProps.showLabel ?? internalProps.showLabel}
              styles={mergeStyleSets(internalProps.styles)}
              strings={buttonProps.strings}
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
            iconProps: { iconName: buttonProps.iconName ?? 'DefaultCustomButton', styles: { root: { lineHeight: 0 } } },
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
 * @public
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
 * @public
 */
export type CustomCallControlButtonPlacement = 'primary' | 'overflow' | 'secondary';

/** @private */
export const onFetchCustomButtonPropsTrampoline = (
  options?: CommonCallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  response = options?.onFetchCustomButtonProps;
  return response;
};
