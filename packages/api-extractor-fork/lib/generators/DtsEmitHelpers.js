'use strict';
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod) if (k !== 'default' && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DtsEmitHelpers = void 0;
const ts = __importStar(require('typescript'));
const node_core_library_1 = require('@rushstack/node-core-library');
const AstImport_1 = require('../analyzer/AstImport');
const AstDeclaration_1 = require('../analyzer/AstDeclaration');
/**
 * Some common code shared between DtsRollupGenerator and ApiReportGenerator.
 */
class DtsEmitHelpers {
  static emitImport(stringWriter, collectorEntity, astImport) {
    const importPrefix = astImport.isTypeOnlyEverywhere ? 'import type' : 'import';
    switch (astImport.importKind) {
      case AstImport_1.AstImportKind.DefaultImport:
        if (collectorEntity.nameForEmit !== astImport.exportName) {
          stringWriter.write(`${importPrefix} { default as ${collectorEntity.nameForEmit} }`);
        } else {
          stringWriter.write(`${importPrefix} ${astImport.exportName}`);
        }
        stringWriter.writeLine(` from '${astImport.modulePath}';`);
        break;
      case AstImport_1.AstImportKind.NamedImport:
        if (collectorEntity.nameForEmit === astImport.exportName) {
          stringWriter.write(`${importPrefix} { ${astImport.exportName} }`);
        } else {
          stringWriter.write(`${importPrefix} { ${astImport.exportName} as ${collectorEntity.nameForEmit} }`);
        }
        stringWriter.writeLine(` from '${astImport.modulePath}';`);
        break;
      case AstImport_1.AstImportKind.StarImport:
        stringWriter.writeLine(`${importPrefix} * as ${collectorEntity.nameForEmit} from '${astImport.modulePath}';`);
        break;
      case AstImport_1.AstImportKind.EqualsImport:
        stringWriter.writeLine(`${importPrefix} ${collectorEntity.nameForEmit} = require('${astImport.modulePath}');`);
        break;
      case AstImport_1.AstImportKind.ImportType:
        if (!astImport.exportName) {
          stringWriter.writeLine(`${importPrefix} * as ${collectorEntity.nameForEmit} from '${astImport.modulePath}';`);
        } else {
          const topExportName = astImport.exportName.split('.')[0];
          if (collectorEntity.nameForEmit === topExportName) {
            stringWriter.write(`${importPrefix} { ${topExportName} }`);
          } else {
            stringWriter.write(`${importPrefix} { ${topExportName} as ${collectorEntity.nameForEmit} }`);
          }
          stringWriter.writeLine(` from '${astImport.modulePath}';`);
        }
        break;
      default:
        throw new node_core_library_1.InternalError('Unimplemented AstImportKind');
    }
  }
  static emitNamedExport(stringWriter, exportName, collectorEntity) {
    if (exportName === ts.InternalSymbolName.Default) {
      stringWriter.writeLine(`export default ${collectorEntity.nameForEmit};`);
    } else if (collectorEntity.nameForEmit !== exportName) {
      stringWriter.writeLine(`export { ${collectorEntity.nameForEmit} as ${exportName} }`);
    } else {
      stringWriter.writeLine(`export { ${exportName} }`);
    }
  }
  static emitStarExports(stringWriter, collector) {
    if (collector.starExportedExternalModulePaths.length > 0) {
      stringWriter.writeLine();
      for (const starExportedExternalModulePath of collector.starExportedExternalModulePaths) {
        stringWriter.writeLine(`export * from "${starExportedExternalModulePath}";`);
      }
    }
  }
  static modifyImportTypeSpan(collector, span, astDeclaration, modifyNestedSpan) {
    var _a, _b, _c, _d;
    const node = span.node;
    const referencedEntity = collector.tryGetEntityForNode(node);
    if (referencedEntity) {
      if (!referencedEntity.nameForEmit) {
        // This should never happen
        throw new node_core_library_1.InternalError('referencedEntry.nameForEmit is undefined');
      }
      let typeArgumentsText = '';
      if (node.typeArguments && node.typeArguments.length > 0) {
        // Type arguments have to be processed and written to the document
        const lessThanTokenPos = span.children.findIndex(
          (childSpan) => childSpan.node.kind === ts.SyntaxKind.LessThanToken
        );
        const greaterThanTokenPos = span.children.findIndex(
          (childSpan) => childSpan.node.kind === ts.SyntaxKind.GreaterThanToken
        );
        if (lessThanTokenPos < 0 || greaterThanTokenPos <= lessThanTokenPos) {
          throw new node_core_library_1.InternalError('Invalid type arguments:\n' + node.getText());
        }
        const typeArgumentsSpans = span.children.slice(lessThanTokenPos + 1, greaterThanTokenPos);
        // Apply modifications to Span elements of typeArguments
        typeArgumentsSpans.forEach((childSpan) => {
          const childAstDeclaration = AstDeclaration_1.AstDeclaration.isSupportedSyntaxKind(childSpan.kind)
            ? collector.astSymbolTable.getChildAstDeclarationByNode(childSpan.node, astDeclaration)
            : astDeclaration;
          modifyNestedSpan(childSpan, childAstDeclaration);
        });
        const typeArgumentsStrings = typeArgumentsSpans.map((childSpan) => childSpan.getModifiedText());
        typeArgumentsText = `<${typeArgumentsStrings.join(', ')}>`;
      }
      const separatorAfter =
        (_b = (_a = /(\s*)$/.exec(span.getText())) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0
          ? _b
          : '';
      if (
        referencedEntity.astEntity instanceof AstImport_1.AstImport &&
        referencedEntity.astEntity.importKind === AstImport_1.AstImportKind.ImportType &&
        referencedEntity.astEntity.exportName
      ) {
        // For an ImportType with a namespace chain, only the top namespace is imported.
        // Must add the original nested qualifiers to the rolled up import.
        const qualifiersText =
          (_d = (_c = node.qualifier) === null || _c === void 0 ? void 0 : _c.getText()) !== null && _d !== void 0
            ? _d
            : '';
        const nestedQualifiersStart = qualifiersText.indexOf('.');
        // Including the leading "."
        const nestedQualifiersText = nestedQualifiersStart >= 0 ? qualifiersText.substring(nestedQualifiersStart) : '';
        const replacement = `${referencedEntity.nameForEmit}${nestedQualifiersText}${typeArgumentsText}${separatorAfter}`;
        span.modification.skipAll();
        span.modification.prefix = replacement;
      } else {
        // Replace with internal symbol or AstImport
        span.modification.skipAll();
        span.modification.prefix = `${referencedEntity.nameForEmit}${typeArgumentsText}${separatorAfter}`;
      }
    }
  }
}
exports.DtsEmitHelpers = DtsEmitHelpers;
//# sourceMappingURL=DtsEmitHelpers.js.map
