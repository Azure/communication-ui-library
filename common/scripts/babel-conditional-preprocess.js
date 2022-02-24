// This is the babel plugin to strip out the statement/expression following a comment key word
// Used by `rushx preprocess` command in projects under /packages folder

Object.defineProperty(exports, '__esModule', { value: true });

const babelHelper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');

const FEATURE_PREFIX = '@conditional-compile-remove';

exports.default = babelHelper.declare((_api, opts) => {
  const { match, features } = opts;
  const featurePrefixes = features.map((feature) => `${FEATURE_PREFIX}(${feature})`);

  return {
    name: 'babel-conditional-preprocess',
    // Check types/visitors supported: https://babeljs.io/docs/en/babel-types#typescript
    visitor: {
      ObjectProperty(path) {
        Handle(path, match, featurePrefixes);
      },

      FunctionDeclaration(path) {
        Handle(path, match, featurePrefixes);
      },

      Statement(path) {
        Handle(path, match, featurePrefixes);
      },

      VariableDeclaration(path) {
        Handle(path, match, featurePrefixes);
      },

      ImportDeclaration(path) {
        Handle(path, match, featurePrefixes);
      },

      ExportNamedDeclaration(path) {
        Handle(path, match, featurePrefixes);
      },

      ExportAllDeclaration(path) {
        Handle(path, match, featurePrefixes);
      },

      JSXAttribute(path) {
        Handle(path, match, featurePrefixes);
      },

      TSPropertySignature(path) {
        Handle(path, match, featurePrefixes);
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
        Handle(path, match, featurePrefixes);
      },

      TSDeclareMethod(path) {
        Handle(path, match, featurePrefixes);
      },

      Expression(path) {
        Handle(path, match, featurePrefixes);
      },

      ClassMethod(path) {
        Handle(path, match, featurePrefixes);
      },

      ClassProperty(path) {
        Handle(path, match, featurePrefixes);
      },
    }
  };
});

function Handle(path, match, featurePrefixes) {
  let { node } = path;

  const shouldRemove = node.leadingComments && node.leadingComments.some((comment) => containsDirective(comment, match, featurePrefixes));
  if (!shouldRemove) {
    return;
  }

  node.leadingComments && node.leadingComments.forEach((comment) => {
    if (!containsDirective(comment, match, featurePrefixes)) {
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

function containsDirective(comment, match, featurePrefixes) {
  if (comment.value.includes(match)) {
    // legacy annotation
    return true;
  }
  // Check for partial prefix first to avoid checking each feature in most cases.
  if (!comment.value.includes(FEATURE_PREFIX)) {
    return false;
  }
  if(featurePrefixes.some((match) => comment.value.includes(match))) {
    return true;
  }
  throw new Error(`Unknown conditional compilation feature in: ${comment.value}`);
}