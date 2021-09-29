// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IModalStyleProps, IModalStyles, IStyleFunctionOrObject, Theme } from '@fluentui/react';
import { CSSProperties } from 'react';

/**
 * @private
 */
export const getScreenSharePopupModalStyles = (
  theme: Theme
): IStyleFunctionOrObject<IModalStyleProps, IModalStyles> => {
  return {
    root: { width: '100%', height: '100%' },
    main: {
      boxShadow: theme.effects.elevation8,
      borderRadius: theme.effects.roundedCorner4,
      background: theme.palette.neutralLighterAlt
    }
  };
};

/**
 * @private
 */
export const screenSharePopupModalStackStyles: CSSProperties = {
  width: '18rem',
  height: '11.4375rem',
  paddingBottom: '0.5rem'
};

/**
 * @private
 */
export const screenSharePopupModalLabelStyles: CSSProperties = {
  lineHeight: '1rem',
  fontSize: '0.75rem',
  fontWeight: 'normal'
};

/**
 * @private
 */
export const getScreenSharePopupModalButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      padding: '0.375rem 0.75rem',
      border: '0rem',
      boxShadow: theme.effects.elevation4,
      borderRadius: theme.effects.roundedCorner4,
      svg: {
        verticalAlign: 'text-top'
      }
    }
  };
};
