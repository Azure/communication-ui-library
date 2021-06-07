// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

module.exports = {
  '../react-components/dist/dist-esm/components/SendBox.js': [
    '@azure/communication-chat',
    '@azure/communication-calling',
    '@azure/communication-common'
  ],
  '../chat-stateful-client/dist/dist-esm/index.js': ['react-components', '@fluentui', 'react'],
  '../calling-stateful-client/dist/dist-esm/index.js': ['react-components', '@fluentui', 'react'],
  '../chat-component-bindings/dist/dist-esm/index.js': [],
  '../calling-component-bindings/dist/dist-esm/index.js': [],
  '../acs-ui-common/dist/dist-esm/index.js': [
    'calling-component-bindingss',
    'chat-component-bindingss',
    'calling-stateful-client',
    'chat-stateful-client',
    'react-components',
    'react-composites'
  ]
};
