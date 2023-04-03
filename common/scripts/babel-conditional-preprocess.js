// This is the babel plugin to strip out the statement/expression following a comment key word
// Used by `rushx preprocess` command in projects under /packages folder

Object.defineProperty(exports, '__esModule', { value: true });

const babelHelper = require('@babel/helper-plugin-utils');
const t = require('@babel/types');

// Note: This uses the non-greedy `*?` so that the first closing `)` finishes the tag.
const CONDITIONAL_FEATURE_RE = /@conditional-compile-remove\(.*?\)/g;

function createFeatureSet(features) {
  const featureSet = {}
  features.forEach(f => featureSet[`@conditional-compile-remove(${f})`] = true);
  return featureSet;
}


exports.default = babelHelper.declare((_api, opts) => {
  const { features, stabilizedFeatures } = opts;
  const featureSet = createFeatureSet(features);
  const stabilizedFeatureSet = createFeatureSet(stabilizedFeatures);

  return {
    name: 'babel-conditional-preprocess',
    // Check types/visitors supported: https://babeljs.io/docs/en/babel-types#typescript
    visitor: {
      ObjectProperty(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      FunctionDeclaration(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      Statement(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      VariableDeclaration(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      ImportDeclaration(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      ExportNamedDeclaration(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      ExportAllDeclaration(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      JSXAttribute(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      TSPropertySignature(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
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
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      TSDeclareMethod(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      TSMethodSignature(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      Expression(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      ClassMethod(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      ClassProperty(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      Identifier(path) {
        Handle(path, featureSet, stabilizedFeatureSet);
      },

      TSFunctionType(path) {
        path.traverse({
          Identifier(identifier_path) {
            if(path.node.parameters.includes(identifier_path.node)) {
            	Handle(identifier_path, featureSet, stabilizedFeatureSet);
            }
        }});
      },

      TSConditionalType(path) {
        HandleConditionalType(path, featureSet, stabilizedFeatureSet);
      }
    }
  };
});


function Handle(path, featureSet, stabilizedFeatureSet, relaceWith=undefined) {
  let { node } = path;

  if (!node.leadingComments) {
    return;
  }

  const removalInstructions = node.leadingComments.map((comment) => nodeRemovalInstruction(node, comment, featureSet, stabilizedFeatureSet));
  if (!shouldRemoveNode(removalInstructions)) {
    return;
  }

  const firstRemovalInstructionIdx = node.leadingComments.findIndex((comment) => nodeRemovalInstruction(node, comment, featureSet, stabilizedFeatureSet) === 'remove');
  if (firstRemovalInstructionIdx === -1) {
    return;
  }

  // Remove the first removal instruction as well as all following comments so that
  // those comments aren't added to the AST node that follows the removed node.
  node.leadingComments.slice(firstRemovalInstructionIdx).forEach((comment) => {
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

function HandleConditionalType(path, featureSet, stabilizedFeatureSet) {
  let { node } = path;
  let { trueType, falseType } = node;

  if (trueType.leadingComments) {
    const removalInstructions = trueType.leadingComments.map((comment) => nodeRemovalInstruction(trueType, comment, featureSet, stabilizedFeatureSet));
    if (shouldRemoveNode(removalInstructions)) {
      path.replaceWith(falseType);
    }
  }
  if (falseType.leadingComments) {
    const removalInstructions = falseType.leadingComments.map((comment) => nodeRemovalInstruction(falseType, comment, featureSet, stabilizedFeatureSet));
    if (shouldRemoveNode(removalInstructions)) {
      path.replaceWith(trueType);
    }
  }
}

function nodeRemovalInstruction(node, comment, featureSet, stabilizedFeatureSet) {
  const featuresInComment = comment.value.match(CONDITIONAL_FEATURE_RE);
  if (!featuresInComment) {
    return 'none';
  }

  // Check for validity first to catch errors even when valid features exist.
  const unknownFeatures = featuresInComment.filter((f) => !(featureSet[f] || stabilizedFeatureSet[f]))
  if (unknownFeatures.length > 0) {
    throw new Error(`Unknown conditional compilation features ${unknownFeatures} in file ${node.loc?.filename} at line ${node.loc?.start?.line}`);
  }
  // If any of the directives reference a stabilized feature, do not remove the associated node.
  // Justification: If a node is needed for more than one features, the first feature that is stabilized needs
  // that node in the stable build.
  if (featuresInComment.some(f => stabilizedFeatureSet[f])) {
    return 'keep';
  }
  return 'remove';
}

function shouldRemoveNode(instructions) {
  // If any of the directives reference a stabilized feature, do not remove the associated node.
  // Justification: If a node is needed for more than one features, the first feature that is stabilized needs
  // that node in the stable build.
  if (instructions.includes('keep')) {
    return false;
  }
  return instructions.includes('remove');
}
