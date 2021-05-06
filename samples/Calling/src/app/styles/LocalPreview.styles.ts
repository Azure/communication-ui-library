//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens, IToggleStyles, getTheme, mergeStyles, IImageStyles } from '@fluentui/react';

const palette = getTheme().palette;

export const toggleStyle: Partial<IToggleStyles> = {
  root: { marginBottom: 0 }
};

export const imgStyles = mergeStyles({
  width: '100%',
  height: '100%'
});

export const staticAvatarStyle: Partial<IImageStyles> = {
  image: { width: '10rem', height: '10rem' }
};

export const toggleButtonsBarToken: IStackTokens = {
  childrenGap: '0.625rem',
  padding: '0.625rem'
};

export const localPreviewContainerStyle = mergeStyles({
  maxWidth: '25rem',
  minWidth: '12.5rem',
  width: '100%',
  height: '100%',
  maxHeight: '18.75rem',
  minHeight: '16.875rem',
  background: palette.neutralLighter,
  color: palette.neutralPrimaryAlt
});

export const toggleButtonsBarStyle = mergeStyles({
  height: '2.8125rem',
  width: '100%'
});
