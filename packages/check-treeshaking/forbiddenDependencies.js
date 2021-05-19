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
  '../acs-chat-selector/dist/dist-esm/index.js': [],
  '../acs-calling-selector/dist/dist-esm/index.js': [],
  '../acs-ui-common/dist/dist-esm/index.js': [
    'acs-calling-selectors',
    'acs-chat-selectors',
    'calling-stateful-client',
    'chat-stateful-client',
    'react-components',
    'react-composites'
  ]
};
