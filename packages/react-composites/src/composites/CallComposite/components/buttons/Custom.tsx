// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon } from '@fluentui/react';
import { ControlBarButton, ControlBarButtonStrings } from '@internal/react-components';
import React from 'react';
import {
  CallControlDisplayType,
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement
} from '../../types/CallControlOptions';

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
export type CustomButtons = { [key in CustomCallControlButtonPlacement]: JSX.Element | undefined };

/** @private */
export const generateCustomControlBarButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
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

  const generateCustomControlBarButtonStrings = (text: string | undefined): ControlBarButtonStrings => {
    return { label: text };
  };

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
              onRenderIcon={() => <Icon iconName={buttonProps.icon} />}
              disabled={buttonProps.disabled}
            />
          ))}
      </>
    );
  }
  return response;
};

/** @private */
export const generateCustomDrawerButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
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
            iconProps: { iconName: buttonProps.icon },
            disabled: buttonProps.disabled
          }))}
      </>
    );
  }
  return response;
};
