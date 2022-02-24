// This is the babel plugin to strip out the statement/expression following a comment key word
// Used by `rushx preprocess` command in projects under /packages folder

Object.defineProperty(exports, '__esModule', { value: true });

const babelHelper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');

const CONDITIONAL_FEATURE_RE = /@conditional-compile-remove\(.*\)/g;

function createFeatureSet(features) {
  const featureSet = {}
  features.forEach(f => featureSet[`@conditional-compile-remove(${f})`] = true);
  return featureSet;
}


exports.default = babelHelper.declare((_api, opts) => {
  const { match, features, stabilizedFeatures } = opts;
  const featureSet = createFeatureSet(features);
  const stabilizedFeatureSet = createFeatureSet(stabilizedFeatures);

  return {
    name: 'babel-conditional-preprocess',
    // Check types/visitors supported: https://babeljs.io/docs/en/babel-types#typescript
    visitor: {
      ObjectProperty(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      FunctionDeclaration(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      Statement(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      VariableDeclaration(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      ImportDeclaration(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      ExportNamedDeclaration(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      ExportAllDeclaration(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      JSXAttribute(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      TSPropertySignature(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
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
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      TSDeclareMethod(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      Expression(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      ClassMethod(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },

      ClassProperty(path) {
        Handle(path, match, featureSet, stabilizedFeatureSet);
      },
    }
  };
});

function Handle(path, match, featureSet, stabilizedFeatureSet) {
  let { node } = path;

  const shouldRemove = node.leadingComments && node.leadingComments.some((comment) => containsDirective(comment, match, featureSet, stabilizedFeatureSet));
  if (!shouldRemove) {
    return;
  }

  node.leadingComments && node.leadingComments.forEach((comment) => {
    if (!containsDirective(comment, match, featureSet, stabilizedFeatureSet)) {
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

function containsDirective(comment, match, featureSet, stabilizedFeatureSet) {
  if (comment.value.includes(match)) {
    // legacy annotation
    return true;
  }

  const featuresInComment = comment.value.match(CONDITIONAL_FEATURE_RE);
  if (!featuresInComment) {
    return false;
  }

  // Check for validity first to catch errors even when valid features exist.
  const unknownFeatures = featuresInComment.filter((f) => !(featureSet[f] || stabilizedFeatureSet[f]))
  if (unknownFeatures.length > 1) {
    throw new Error(`Unknown conditional compilation features ${unknownFeatures} in: ${comment.value}`);
  }
  return featuresInComment.some(f => featureSet[f]);
}