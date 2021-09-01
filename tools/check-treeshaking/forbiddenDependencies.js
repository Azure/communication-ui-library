// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

module.exports = {
  '../../packages/react-components/dist/dist-esm/components/SendBox.js': [
    '@azure/communication-chat',
    '@azure/communication-calling',
    '@azure/communication-common'
  ],
  '../../packages/chat-stateful-client/dist/dist-esm/index.js': ['react-components', '@fluentui', 'react'],
  '../../packages/calling-stateful-client/dist/dist-esm/index.js': ['react-components', '@fluentui', 'react'],
  '../../packages/chat-component-bindings/dist/dist-esm/index.js': [],
  '../../packages/calling-component-bindings/dist/dist-esm/index.js': [],
  '../../packages/acs-ui-common/dist/dist-esm/index.js': [
    'calling-component-bindings',
    'chat-component-bindings',
    'calling-stateful-client',
    'chat-stateful-client',
    'react-components',
    'react-composites'
  ]
};
