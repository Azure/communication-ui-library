// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IMessageBarStyleProps, IMessageBarStyles, IStyleFunctionOrObject } from '@fluentui/react';

export const permissionsBannerContainerStyle = {
  width: '100%'
};

export const permissionsBannerMessageBarStyle: IStyleFunctionOrObject<IMessageBarStyleProps, IMessageBarStyles> = {
  content: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  text: { flexGrow: '0' },
  actions: { position: 'absolute', right: '0px' }
};
