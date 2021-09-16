// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackTokens } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';

export const configurationStackTokens: IStackTokens = {
  childrenGap: '3em'
};

export const configurationContainer = mergeStyles({
  // we need offset for the token's childrenGap here
  height: 'calc(100% - 3em)'
});
