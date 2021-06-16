import { CollectorEntity } from '../collector/CollectorEntity';
import { AstImport } from '../analyzer/AstImport';
import { AstDeclaration } from '../analyzer/AstDeclaration';
import { StringWriter } from './StringWriter';
import { Collector } from '../collector/Collector';
import { Span } from '../analyzer/Span';
/**
 * Some common code shared between DtsRollupGenerator and ApiReportGenerator.
 */
export declare class DtsEmitHelpers {
  static emitImport(stringWriter: StringWriter, collectorEntity: CollectorEntity, astImport: AstImport): void;
  static emitNamedExport(stringWriter: StringWriter, exportName: string, collectorEntity: CollectorEntity): void;
  static emitStarExports(stringWriter: StringWriter, collector: Collector): void;
  static modifyImportTypeSpan(
    collector: Collector,
    span: Span,
    astDeclaration: AstDeclaration,
    modifyNestedSpan: (childSpan: Span, childAstDeclaration: AstDeclaration) => void
  ): void;
}
//# sourceMappingURL=DtsEmitHelpers.d.ts.map
