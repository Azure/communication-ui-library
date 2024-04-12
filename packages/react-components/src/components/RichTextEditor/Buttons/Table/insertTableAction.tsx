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

      // set the width as otherwise insets doesn't work well in table
      // review if it's needed when content model packages are used
      td.style.width = getTableCellWidth(columns);
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

function getTableCellWidth(columns: number): string {
  if (columns <= 4) {
    return '120px';
  } else if (columns <= 6) {
    return '100px';
  } else {
    return '70px';
  }
}
