'use strict';
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, '__esModule', { value: true });
exports.StringWriter = void 0;
const tsdoc_1 = require('@microsoft/tsdoc');
// A small helper used by the generators
class StringWriter {
  constructor() {
    this.stringBuilder = new tsdoc_1.StringBuilder();
  }
  write(s) {
    this.stringBuilder.append(s);
  }
  writeLine(s = '') {
    if (s.length > 0) {
      this.stringBuilder.append(s);
    }
    this.stringBuilder.append('\n');
  }
  toString() {
    return this.stringBuilder.toString();
  }
}
exports.StringWriter = StringWriter;
//# sourceMappingURL=StringWriter.js.map
