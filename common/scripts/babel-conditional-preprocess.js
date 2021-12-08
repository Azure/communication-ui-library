Object.defineProperty(exports, '__esModule', { value: true });

const helper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');
exports.default = helper.declare((_api, opts) => {
  const {
    annotations
  } = opts;

  function Handle(path) {
    let { node } = path;
    let removed = false;

    for (const annotation of annotations) {
      const {
        match
      } = annotation;

      if (node.leadingComments && node.leadingComments.length > 0) {
        for (const comment of node.leadingComments) {
          if (comment.value.includes(match)) {
            removed = true;
          }
          if(removed) {
            comment.ignore = true;
          }
        }
      }

      if (removed) {
        if (path?.container?.type === 'JSXExpressionContainer') {
          path.parentPath.remove();
        } else {
          path.remove();
        }
      }
    }
  }

  return {
    name: 'babel-conditional-preprocess',
    visitor: {
      ObjectProperty(path) {
        Handle(path);
      },

      FunctionDeclaration(path) {
        Handle(path);
      },

      Statement(path) {
        Handle(path);
      },

      VariableDeclaration(path) {
        Handle(path);
      },

      ImportDeclaration(path) {
        Handle(path);
      },

      ExportNamedDeclaration(path) {
        Handle(path);
      },

      ExportAllDeclaration(path) {
        Handle(path);
      },

      TSPropertySignature(path) {
        Handle(path);
      },

      Expression(path) {
        Handle(path);
      }
    }
  };
});
