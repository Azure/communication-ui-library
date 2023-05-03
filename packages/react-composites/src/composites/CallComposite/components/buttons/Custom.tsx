// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line no-restricted-imports
import { Icon } from '@fluentui/react';
import { ControlBarButton, _DrawerMenuItemProps } from '@internal/react-components';
import React from 'react';
import {
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement
} from '../../../common/ControlBar/CustomButton';
import { CallControlDisplayType, _CommonCallControlOptions } from '../../../common/types/CommonCallControlOptions';
import { CallControlOptions } from '../../types/CallControlOptions';

/** @private */
export type CustomButtons = { [key in CustomCallControlButtonPlacement]: JSX.Element | undefined };

/** @private */
export const generateCustomControlBarButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    primary: undefined,
    overflow: undefined,
    secondary: undefined
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
              ariaDescription={buttonProps.ariaDescription}
              ariaLabel={buttonProps.ariaLabel}
              disabled={buttonProps.disabled}
              id={buttonProps.id}
              key={buttonProps.key ?? `${buttonProps.placement}_${i}`}
              onClick={buttonProps.onItemClick}
              onRenderIcon={() => <Icon iconName={buttonProps.iconName ?? 'ControlButtonOptions'} />}
              showLabel={buttonProps.showLabel}
              text={buttonProps.text}
              styles={buttonProps.styles}
            />
          ))}
      </>
    );
  }
  return response;
};

/** @private */
export const onFetchCustomButtonPropsTrampoline = (
  options?: CallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  response = (options as _CommonCallControlOptions)?.onFetchCustomButtonProps;
  return response;
};
