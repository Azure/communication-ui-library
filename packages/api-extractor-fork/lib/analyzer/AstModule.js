'use strict';
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, '__esModule', { value: true });
exports.AstModule = exports.AstModuleExportInfo = void 0;
/**
 * Represents information collected by {@link AstSymbolTable.fetchAstModuleExportInfo}
 */
class AstModuleExportInfo {
  constructor() {
    this.exportedLocalEntities = new Map();
    this.starExportedExternalModules = new Set();
  }
}
exports.AstModuleExportInfo = AstModuleExportInfo;
/**
 * An internal data structure that represents a source file that is analyzed by AstSymbolTable.
 *
 * @privateRemarks
 * Our naming convention is to use I____Parameters for constructor options and
 * I____Options for general function options.  However the word "parameters" is
 * confusingly similar to the terminology for function parameters modeled by API Extractor,
 * so we use I____Options for both cases in this code base.
 */
class AstModule {
  constructor(options) {
    this.sourceFile = options.sourceFile;
    this.moduleSymbol = options.moduleSymbol;
    this.externalModulePath = options.externalModulePath;
    this.starExportedModules = new Set();
    this.cachedExportedEntities = new Map();
    this.astModuleExportInfo = undefined;
  }
  /**
   * If false, then this source file is part of the working package being processed by the `Collector`.
   */
  get isExternal() {
    return this.externalModulePath !== undefined;
  }
}
exports.AstModule = AstModule;
//# sourceMappingURL=AstModule.js.map
