// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButton } from '@internal/react-components';
import React from 'react';
import {
  CallControlDisplayType,
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement
} from '../../types/CallControlOptions';

/**
 * Max number of Custom Buttons in MainBar and SideBar
 *
 * @private
 */
export const CUSTOM_BUTTON_OPTIONS = {
  MAX_MAINBAR_DESKTOP_CUSTOM_BUTTONS: 3,
  MAX_MAINBAR_MOBILE_CUSTOM_BUTTONS: 1,
  MAX_SIDEBAR_DESKTOP_CUSTOM_BUTTONS: 2
};

/** @private */
export type CustomButtons = { [key in CustomCallControlButtonPlacement]: JSX.Element | undefined };

/** @private */
export const generateCustomButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    mainBar: undefined,
    sideBar: undefined,
    overflowMenu: undefined
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
            <ControlBarButton {...buttonProps} key={`${buttonProps.placement}_${i}`} />
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
    mainBar: undefined,
    sideBar: undefined,
    overflowMenu: undefined
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
          .map((buttonProps, i) => ({ ...buttonProps, key: `${buttonProps.placement}_${i}` }))}
      </>
    );
  }
  return response;
};
