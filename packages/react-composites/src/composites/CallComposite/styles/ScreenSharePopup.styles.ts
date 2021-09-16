// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IModalStyleProps, IModalStyles, IStyleFunctionOrObject, Theme } from '@fluentui/react';
import { CSSProperties } from 'react';

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

export const screenSharePopupModalStackStyles: CSSProperties = {
  width: '18em',
  height: '11.4375em',
  paddingBottom: '0.5em'
};

export const screenSharePopupModalLabelStyles: CSSProperties = {
  lineHeight: '1em',
  fontSize: '0.75em',
  fontWeight: 'normal'
};

export const getScreenSharePopupModalButtonStyles = (theme: Theme): IButtonStyles => {
  return {
    root: {
      padding: '0.375em 0.75em',
      border: '0em',
      boxShadow: theme.effects.elevation4,
      borderRadius: theme.effects.roundedCorner4,
      svg: {
        verticalAlign: 'text-top'
      }
    }
  };
};
