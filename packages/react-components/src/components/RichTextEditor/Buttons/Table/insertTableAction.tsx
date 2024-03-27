// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Position, VTable } from 'roosterjs-editor-dom';
import type { IEditor } from 'roosterjs-editor-types-compatible';
import { CompatibleChangeSource, CompatiblePositionType } from 'roosterjs-editor-types-compatible';

// This file  uses RoosterJS React package implementation with updates to change table's size and remove styles

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table
 * @param rows Number of rows in table
 */
export const insertTable = (editor: IEditor, columns: number, rows: number): void => {
  const document = editor.getDocument();
  const table = document.createElement('table') as HTMLTableElement;
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr') as HTMLTableRowElement;
    table.appendChild(tr);
    for (let j = 0; j < columns; j++) {
      const td = document.createElement('td') as HTMLTableCellElement;
      tr.appendChild(td);
      td.appendChild(document.createElement('br'));
      // without setting any styles, input is not handled properly for the cell
      // because of https://github.com/microsoft/roosterjs/blob/14dbb947e3ae94580109cbd05e48ceb05327c4dc/packages/roosterjs-editor-core/lib/corePlugins/TypeInContainerPlugin.ts#L75
      // this issue is fixed for content model package and this line can be removed after the migration
      // top is used because it is one of the shortest available style prop
      td.style.top = '0';
    }
  }

  editor.focus();
  editor.addUndoSnapshot(
    () => {
      const vTable = new VTable(table);
      vTable.writeBack();
      editor.insertNode(table);
      editor.runAsync((editor) => editor.select(new Position(table, CompatiblePositionType.Begin).normalize()));
    },
    CompatibleChangeSource.Format,
    undefined /* canUndoByBackspace */,
    {
      formatApiName: 'insertTable'
    }
  );
};
