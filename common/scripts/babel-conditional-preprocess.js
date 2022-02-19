// This is the babel plugin to strip out the statement/expression following a comment key word
// Used by `rushx preprocess` command in projects under /packages folder

Object.defineProperty(exports, '__esModule', { value: true });

const babelHelper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');
exports.default = babelHelper.declare((_api, opts) => {
  const {
    annotations
  } = opts;

  return {
    name: 'babel-conditional-preprocess',
    // Check types/visitors supported: https://babeljs.io/docs/en/babel-types#typescript
    visitor: {
      ObjectProperty(path) {
        Handle(path, annotations);
      },

      FunctionDeclaration(path) {
        Handle(path, annotations);
      },

      Statement(path) {
        Handle(path, annotations);
      },

      VariableDeclaration(path) {
        Handle(path, annotations);
      },

      ImportDeclaration(path) {
        Handle(path, annotations);
      },

      ExportNamedDeclaration(path) {
        Handle(path, annotations);
      },

      ExportAllDeclaration(path) {
        Handle(path, annotations);
      },

      JSXAttribute(path) {
        Handle(path, annotations);
      },

      TSPropertySignature(path) {
        Handle(path, annotations);
      },

      // TSType is fairly broad, but it is necessary for sanely extending existing types by adding disjuncts or conjucts.
      // In other words, support this fairly common situation:
      //
      // stable build:
      //   type SomeType = StableTypeA & StableTypeB;
      //   type AwesomeType = StableTypeA | StableTypeB;
      // beta build:
      //   type SomeType = StableTypeA & StableTypeB & BetaTypeC;
      //   type AwesomeType = StableTypeA | StableTypeB | BetaTypeC;
      //
      // As this only applies to TypeScript types, it is safe from a code-flow perspective: This does not enable any new
      // conditional business logic flows.
      TSType(path) {
        Handle(path, annotations);
      },

      TSDeclareMethod(path) {
        Handle(path, annotations);
      },

      Expression(path) {
        Handle(path, annotations);
      },

      ClassMethod(path) {
        Handle(path, annotations);
      },

      ClassProperty(path) {
        Handle(path, annotations);
      },
    }
  };
});

function Handle(path, annotations) {
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
        if (removed) {
          comment.ignore = true;
          // Comment will be inherit to next line even it is set to 'ignore'
          // this will cause some unexpected removals of code
          // clear the comment to ensure nothing gets wrong
          comment.value = '';
        }
      }
    }

    if (removed) {
      // We cannot remove Expression in JSXExpressionContainer cause it is not correct for AST
      // Replacing it with jSXEmptyExpression will get us the same result
      // There will always be only one expression under JSXExpressionContainer
      if (path?.container?.type === 'JSXExpressionContainer') {
        path.replaceWith(t.jSXEmptyExpression());
      } else {
        path.remove();
      }
    }
  }
}

