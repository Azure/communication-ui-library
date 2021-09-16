// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IMessageBarStyleProps, IMessageBarStyles, IStyleFunctionOrObject } from '@fluentui/react';

export const permissionsBannerContainerStyle = {
  width: '100%'
};

export const permissionsBannerMessageBarStyle: IStyleFunctionOrObject<IMessageBarStyleProps, IMessageBarStyles> = {
  root: {
    // Constrain permission banner height if there is a long error message in a narrow space.
    maxHeight: '5em'
  },
  text: {
    // Ensure the dismiss action button is aligned to the right hand side by allowing text to grow to available space
    flexGrow: '1',

    // Allow errors to be multi-line. We use this property instead of `isMultiline={true}` to ensure the action button
    // does not take a new line and is instead placed to the right hand side of the error message.
    span: { whiteSpace: 'normal' }
  }
};
