// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of adapter.getState()',
      category: 'Best Practices',
      recommended: true
    },
    messages: {
      'no-getstate':
        'The use of `adapter.getState()` is disallowed in react functional components and react hooks. Use `useSelector` instead.'
    },
    schema: []
  },
  create: function (context) {
    const isReactComponent = (node) => {
      // Check if the function is a React functional component
      return (
        node.type === 'FunctionDeclaration' ||
        node.type === 'ArrowFunctionExpression' ||
        (node.type === 'FunctionExpression' &&
          context
            .getScope()
            .variables.some((variable) => variable.defs.some((def) => def.node === node && def.name === 'default')))
      );
    };

    const isHook = (node) => {
      // Check if the call is a React Hook (e.g., useEffect, useState)
      return node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name.startsWith('use');
    };

    return {
      CallExpression: function (node) {
        // Check if the node is in a React component or hook context
        const parent = context
          .getAncestors()
          .reverse()
          .find((ancestor) => {
            return isReactComponent(ancestor) || isHook(ancestor);
          });

        if (
          parent &&
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'adapter' &&
          node.callee.property.name === 'getState'
        ) {
          context.report({
            node: node,
            messageId: 'no-getstate'
          });
        }
      }
    };
  }
};
