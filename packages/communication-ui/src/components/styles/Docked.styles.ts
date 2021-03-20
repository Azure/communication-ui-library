// © Microsoft Corporation. All rights reserved.

import { mergeStyles } from '@fluentui/react';

export const dockedBottom = mergeStyles({
  flexFlow: 'row nowrap',
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%'
});
