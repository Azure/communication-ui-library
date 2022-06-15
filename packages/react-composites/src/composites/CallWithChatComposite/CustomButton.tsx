// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ControlBarButton } from '@internal/react-components';
import React from 'react';
import { generateCustomControlBarButtonStrings } from '../CallComposite/components/buttons/Custom';
import {
  CallControlDisplayType,
  CustomCallControlButtonCallbackArgs,
  CustomControlButtonProps
} from '../CallComposite/types/CallControlOptions';
import { CallWithChatCompositeIcon, CallWithChatCompositeIcons } from '../common/icons';
/* @conditional-compile-remove(control-bar-button-injection) */
import { CallWithChatControlOptions } from './CallWithChatComposite';

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
export type CustomButtons = { [key in CustomCallWithChatControlButtonPlacement]: JSX.Element | undefined };

/** @private */
export const generateCustomCallWithChatControlBarButton = (
  onFetchCustomButtonProps?: CustomCallWithChatControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    primary: undefined,
    secondary: undefined,
    overflow: undefined
  };

  if (!onFetchCustomButtonProps) {
    return response;
  }

  const allButtonProps = onFetchCustomButtonProps.map((f) => f({ displayType }));

  for (const key in response) {
    response[key] = (
      <>
        {allButtonProps
          .filter((buttonProps) => buttonProps.placement === key)
          .map((buttonProps, i) => (
            <ControlBarButton
              onClick={buttonProps.onItemClick}
              showLabel={buttonProps.showLabel}
              strings={generateCustomControlBarButtonStrings(buttonProps.text)}
              styles={buttonProps.styles}
              key={`${buttonProps.placement}_${i}`}
              onRenderIcon={() => (
                <CallWithChatCompositeIcon iconName={buttonProps.iconName ?? 'ControlButtonOptions'} />
              )}
              disabled={buttonProps.disabled}
            />
          ))}
      </>
    );
  }
  return response;
};

/** @private */
export const generateCustomCallWithChatDrawerButtons = (
  onFetchCustomButtonProps?: CustomCallWithChatControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    primary: undefined,
    secondary: undefined,
    overflow: undefined
  };

  if (!onFetchCustomButtonProps) {
    return response;
  }

  const allButtonProps = onFetchCustomButtonProps.map((f) => f({ displayType }));

  for (const key in response) {
    response[key] = (
      <>
        {allButtonProps
          .filter((buttonProps) => buttonProps.placement === key)
          .map((buttonProps, i) => ({
            itemKey: `${buttonProps.placement}_${i}`,
            text: buttonProps.text,
            onItemClick: buttonProps.onItemClick,
            iconProps: { iconName: buttonProps.iconName },
            disabled: buttonProps.disabled
          }))}
      </>
    );
  }
  return response;
};

/**
 * A callback that returns the props to render a custom {@link ControlBarButton} and {@link DrawerMenuItem}.
 *
 * The response indicates where the custom button should be placed.
 *
 * Performance tip: This callback is only called when either the callback or its arguments change.
 * @beta
 */
export type CustomCallWithChatControlButtonCallback = (
  args: CustomCallControlButtonCallbackArgs
) => CustomCallWithChatControlButtonProps;

/**
 * Placement for a custom button injected in the {@link CallWithChatControlBar}.
 *
 * 'primary': Place the button(s) on the right end of the center control bar but before the EndCallButton (left end in rtl mode).
 * 'overflow': Place the buttons(s) on the end of the overflow Menu.
 * 'secondary': Place the button(s) on the left end of the side control bar (right in rtl mode).
 *
 * Multiple buttons assigned the same placement are appended in order.
 * E.g., if two buttons are placed in 'secondary', they'll both appear on the left end (right end in rtl mode)
 * in the order provided.
 *
 * @beta
 */
export type CustomCallWithChatControlButtonPlacement = 'primary' | 'overflow' | 'secondary';

/**
 * Response from {@link CustomCallWithChatControlButtonCallback}.
 *
 * Includes the icon and placement prop necessary to indicate where to place the
 * {@link ControlBarButton} and a {@link DrawerMenuItem}
 *
 * @beta
 */
export interface CustomCallWithChatControlButtonProps extends CustomControlButtonProps {
  /**
   * Where to place the custom button relative to other buttons.
   */
  placement: CustomCallWithChatControlButtonPlacement;
  /**
   * Icon to render. Icon is a non-default icon that is already registered by the composites.
   * Examples include icons from {@link CallWithChatCompositeIcons}
   */
  iconName?: keyof CallWithChatCompositeIcons;
}

/* @conditional-compile-remove(control-bar-button-injection) */
/** @private */
export const onFetchCustomButtonPropsTrampoline = (
  options?: CallWithChatControlOptions
): CustomCallWithChatControlButtonCallback[] | undefined => {
  let response: CustomCallWithChatControlButtonCallback[] | undefined = undefined;
  response = options?.onFetchCustomButtonProps;
  return response;
};
