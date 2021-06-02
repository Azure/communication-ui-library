// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IButtonStyles, IModalStyleProps, IModalStyles, IStyleFunctionOrObject } from '@fluentui/react';
import { CSSProperties } from 'react';

const theme = getTheme();
const palette = theme.palette;

export const screenSharePopupModalStyles: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  root: { width: '100%', height: '100%' },
  main: {
    boxShadow: theme.effects.elevation8,
    borderRadius: theme.effects.roundedCorner4,
    background: palette.neutralLighterAlt
  }
};

export const screenSharePopupModalStackStyles: CSSProperties = {
  width: '18rem',
  height: '11.4375rem',
  paddingBottom: '0.5rem'
};

export const screenSharePopupModalLabelStyles: CSSProperties = {
  lineHeight: '1rem',
  fontSize: '0.75rem',
  fontWeight: 'normal'
};

export const screenSharePopupModalButtonStyles: IButtonStyles = {
  root: {
    padding: '0.375rem 0.75rem',
    boxShadow: theme.effects.elevation4,
    borderRadius: '0.25rem',
    border: '0rem'
  }
};
