// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, IButtonStyles, IModalStyleProps, IModalStyles, IStyleFunctionOrObject } from '@fluentui/react';
import { CSSProperties } from 'react';

const palette = getTheme().palette;

export const screenSharePopupModalStyles: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> = {
  root: { width: '100%', height: '100%' },
  main: {
    boxShadow: '0px 1.2px 3.6px rgba(0, 0, 0, 0.1), 0px 6.4px 14.4px rgba(0, 0, 0, 0.13);',
    borderRadius: '0.25rem',
    background: palette.neutralLighter
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
    boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)',
    borderRadius: '0.25rem',
    border: '0rem'
  }
};
