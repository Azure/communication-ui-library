// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const ChatSystemMessageContainerStyle = (hasWarning: boolean): string =>
  mergeStyles({
    height: hasWarning ? '1.25em' : '2.5em',
    display: 'flex',
    alignItems: 'center'
  });

export const ChatSystemMessageTextStyle = mergeStyles({
  fontWeight: 400,
  whiteSpace: 'nowrap',
  color: 'red'
});
