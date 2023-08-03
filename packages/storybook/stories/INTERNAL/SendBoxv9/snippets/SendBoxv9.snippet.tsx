// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { SendBox } from '@internal/react-components-v2';
import React from 'react';

export const SendBoxExamplev9: () => JSX.Element = () => (
  <FluentProvider theme={webLightTheme}>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSubmit={() => {
          return;
        }}
        onTyping={() => {
          return;
        }}
      />
    </div>
  </FluentProvider>
);
