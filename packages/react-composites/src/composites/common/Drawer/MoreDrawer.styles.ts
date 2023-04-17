// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Theme, IToggleStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const themedToggleButtonStyle = (theme: Theme, checked: boolean): Partial<IToggleStyles> => {
  if (checked) {
    return {
      root: {
        margin: 0
      },
      pill: {
        backgroundColor: `${theme.palette.themePrimary} !important`
      },
      thumb: {
        backgroundColor: `${theme.palette.white} !important`
      }
    };
  }
  return {
    root: {
      margin: 0
    }
  };
};
