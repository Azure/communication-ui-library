// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, mergeStyles } from '@fluentui/react';

export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem'
});

export const buttonStyle = mergeStyles({
  fontWeight: 600,
  fontSize: '0.875rem', // 14px
  height: '2.75rem',
  width: '100%',
  marginTop: '1.25rem',
  maxWidth: '18.75rem',
  minWidth: '12.5rem'
});

export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};

export const rejoinButtonStyle = mergeStyles({
  fontWeight: 600,
  height: '2.5rem',
  width: '22.5rem',
  fontSize: '0.875rem', // 14px
  padding: 0
});
