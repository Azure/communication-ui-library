// This is the babel plugin to strip out the statement/expression following a comment key word
// Used by `rushx preprocess` command in projects under /packages folder

Object.defineProperty(exports, '__esModule', { value: true });

const babelHelper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');
exports.default = babelHelper.declare((_api, opts) => {
  return {
    name: 'babel-conditional-preprocess',
    // Check types/visitors supported: https://babeljs.io/docs/en/babel-types#typescript
    visitor: {
      ObjectProperty(path) {
        Handle(path, opts);
      },

      FunctionDeclaration(path) {
        Handle(path, opts);
      },

      Statement(path) {
        Handle(path, opts);
      },

      VariableDeclaration(path) {
        Handle(path, opts);
      },

      ImportDeclaration(path) {
        Handle(path, opts);
      },

      ExportNamedDeclaration(path) {
        Handle(path, opts);
      },

      ExportAllDeclaration(path) {
        Handle(path, opts);
      },

      JSXAttribute(path) {
        Handle(path, opts);
      },

      TSPropertySignature(path) {
        Handle(path, opts);
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
        Handle(path, opts);
      },

      TSDeclareMethod(path) {
        Handle(path, opts);
      },

      Expression(path) {
        Handle(path, opts);
      },

      ClassMethod(path) {
        Handle(path, opts);
      },

      ClassProperty(path) {
        Handle(path, opts);
      },
    }
  };
});

function Handle(path, opts) {
  let { node } = path;
  const { match } = opts;

  const shouldRemove = node.leadingComments && node.leadingComments.some((comment) => containsDirective(comment, match));
  if (!shouldRemove) {
    return;
  }

  node.leadingComments && node.leadingComments.forEach((comment) => {
    if (!containsDirective(comment, match)) {
      return;
    }
    comment.ignore = true;
    // Comment is inherited by next line even it is set to 'ignore'.
    // Clear the conditional compilation directive to avoid removing the
    // next line.
    comment.value = '';
  })

  // We cannot remove Expression in JSXExpressionContainer cause it is not correct for AST
  // Replacing it with jSXEmptyExpression will get us the same result
  // There will always be only one expression under JSXExpressionContainer
  if (path?.container?.type === 'JSXExpressionContainer') {
    path.replaceWith(t.jSXEmptyExpression());
  } else {
    path.remove();
  }
}

function containsDirective(comment, match) {
  return comment.value.includes(match);
}