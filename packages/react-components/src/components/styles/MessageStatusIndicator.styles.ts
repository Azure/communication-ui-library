// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

// ErrorIcon seems designed slightly smaller than other icons we try to match the size and then fix positioning here
export const MessageStatusIndicatorErrorIconStyle = mergeStyles({
  marginRight: '-0.06rem',
  fontSize: '1.06rem'
});

export const MessageStatusIndicatorIconStyle = mergeStyles({
  fontSize: '1rem'
});
