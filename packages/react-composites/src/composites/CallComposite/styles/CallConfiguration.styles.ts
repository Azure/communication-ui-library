// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';

export const configurationStackTokens: IStackTokens = {
  childrenGap: '3rem'
};

export const configurationContainer = mergeStyles({
  // offset for the children gap
  height: 'calc(100% - 3rem)'
});
