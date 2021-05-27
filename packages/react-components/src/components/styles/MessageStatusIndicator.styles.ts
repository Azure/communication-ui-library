// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getTheme, mergeStyles } from '@fluentui/react';

const palette = getTheme().palette;

// ErrorIcon seems designed slightly smaller than other icons we try to match the size and then fix positioning here
export const MessageStatusIndicatorErrorIconStyle = mergeStyles({
  marginRight: '-0.06rem',
  fontSize: '1.06rem',
  color: palette.redDark
});

export const MessageStatusIndicatorIconStyle = mergeStyles({
  fontSize: '1rem',
  color: palette.blue
});
