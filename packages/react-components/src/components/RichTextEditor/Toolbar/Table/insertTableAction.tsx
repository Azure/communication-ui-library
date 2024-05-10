// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  addBlock,
  createContentModelDocument,
  createSelectionMarker,
  createTable,
  createTableCell,
  deleteSelection,
  mergeModel,
  normalizeTable,
  setSelection
} from 'roosterjs-content-model-dom';
import type { ContentModelBlockGroup, ContentModelTable, IEditor } from 'roosterjs-content-model-types';

// This file  uses RoosterJS React package implementation but without applyTableFormat call. This is done because we want to use CSS classes to apply styles instead of inline styles.

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns &lt;= 4, width = 120px; if columns &lt;= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 */
export function insertTable(editor: IEditor, columns: number, rows: number): void {
  editor.focus();

  editor.formatContentModel(
    (model, context) => {
      const insertPosition = deleteSelection(model, [], context).insertPoint;

      if (insertPosition) {
        const doc = createContentModelDocument();
        const table = createTableStructure(doc, columns, rows);

        normalizeTable(table, editor.getPendingFormat() || insertPosition.marker.format);

        mergeModel(model, doc, context, {
          insertPosition,
          mergeFormat: 'mergeAll'
        });

        const firstBlock = table.rows[0]?.cells[0]?.blocks[0];

        if (firstBlock?.blockType === 'Paragraph') {
          const marker = createSelectionMarker(firstBlock.segments[0]?.format);
          firstBlock.segments.unshift(marker);
          setSelection(model, marker);
        }

        return true;
      } else {
        return false;
      }
    },
    {
      apiName: 'insertTable'
    }
  );
}

const createTableStructure = (parent: ContentModelBlockGroup, columns: number, rows: number): ContentModelTable => {
  const table = createTable(rows);

  addBlock(parent, table);

  table.rows.forEach((row) => {
    for (let i = 0; i < columns; i++) {
      const cell = createTableCell();

      row.cells.push(cell);
    }
  });

  return table;
};
