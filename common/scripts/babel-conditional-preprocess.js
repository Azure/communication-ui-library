Object.defineProperty(exports, '__esModule', { value: true });

const helper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');
exports.default = helper.declare((_api, opts) => {
  const {
    identifiers
  } = opts;

  function Handle(path, state) {
    let { node } = path;

    for (const identifier of identifiers) {
      const {
        start,
        end
      } = identifier;

      if (node.leadingComments && node.leadingComments.length > 0) {
        for (const comment of node.leadingComments) {
          if (new RegExp(start).test(comment.value)) {
            state.removed = true;
          }
          if(state.removed) {
            comment.ignore = true;
          }
        }
      }

      if (state.removed) {
        if (path?.container?.type === 'JSXExpressionContainer') {
          path.parentPath.remove();
        } else {
          path.remove();
        }
      }

      if (node.trailingComments && node.trailingComments.length > 0) {
        for (const comment of node.trailingComments) {
          if(state.removed) {
            comment.ignore = true;
          }
          if (new RegExp(end).test(comment.value)) {
            state.removed = false;
          }
        }
      }
    }
  }

  return {
    name: 'babel-conditional-preprocess',
    visitor: {
      ObjectProperty(path, state) {
        Handle(path, state);
      },

      FunctionDeclaration(path, state) {
        Handle(path, state);
      },

      Statement(path, state) {
        Handle(path, state);
      },

      VariableDeclaration(path, state) {
        Handle(path, state);
      },

      ImportDeclaration(path, state) {
        Handle(path, state);
      },

      ExportNamedDeclaration(path, state) {
        Handle(path, state);
      },

      ExportAllDeclaration(path, state) {
        Handle(path, state);
      },

      TSPropertySignature(path, state) {
        Handle(path, state);
      },

      // JSXExpression(path, state) {
      //   Handle(path, state);
      // },

      Expression(path, state) {
        Handle(path, state);
      }
    }
  };
});
