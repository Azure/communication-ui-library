// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { editTable } from 'roosterjs-editor-api';
import { CompatibleTableOperation, EditorPlugin, IEditor } from 'roosterjs-editor-types-compatible';
import { ContextMenuItem, createContextMenuProvider, LocalizedStrings } from 'roosterjs-react';
import { tableContextMenuStrings } from '../../../utils/RichTextEditorStringsUtils';
import { tableContextMenuIconStyles } from '../../../styles/RichTextEditor.styles';

const onClick = (key: string, editor: IEditor): void => {
  editor.focus();
  const operation = TableEditOperationMap[key];
  if (typeof operation === 'number') {
    editTable(editor, operation);
  }
};

const TableEditOperationMap: Partial<Record<string, CompatibleTableOperation>> = {
  menuNameTableInsertAbove: CompatibleTableOperation.InsertAbove,
  menuNameTableInsertBelow: CompatibleTableOperation.InsertBelow,
  menuNameTableInsertLeft: CompatibleTableOperation.InsertLeft,
  menuNameTableInsertRight: CompatibleTableOperation.InsertRight,
  menuNameTableDeleteTable: CompatibleTableOperation.DeleteTable,
  menuNameTableDeleteColumn: CompatibleTableOperation.DeleteColumn,
  menuNameTableDeleteRow: CompatibleTableOperation.DeleteRow
};

const tableEditInsertMenuItem: ContextMenuItem<string> = {
  key: 'menuNameTableInsert',
  unlocalizedText: 'Insert',
  subItems: {
    menuNameTableInsertAbove: 'Insert above',
    menuNameTableInsertBelow: 'Insert below',
    menuNameTableInsertLeft: 'Insert left',
    menuNameTableInsertRight: 'Insert right'
  },
  onClick,
  iconProps: {
    iconName: 'RichTextTableInsertMenuIcon',
    styles: { root: tableContextMenuIconStyles }
  }
};

const tableEditDeleteMenuItem: ContextMenuItem<string> = {
  key: 'menuNameTableDelete',
  unlocalizedText: 'Delete',
  subItems: {
    menuNameTableDeleteColumn: 'Delete column',
    menuNameTableDeleteRow: 'Delete row',
    menuNameTableDeleteTable: 'Delete table'
  },
  onClick,
  iconProps: {
    iconName: 'RichTextTableDeleteMenuIcon',
    styles: { root: tableContextMenuIconStyles }
  }
};

const tableActions: ContextMenuItem<string>[] = [tableEditInsertMenuItem, tableEditDeleteMenuItem];

/**
 * Create a new instance of ContextMenuProvider to support table editing functionalities in context menu
 * @returns A new ContextMenuProvider
 */
export const createTableEditMenuProvider = (strings?: LocalizedStrings<string>): EditorPlugin => {
  return createContextMenuProvider(
    'tableEdit',
    tableActions,
    tableContextMenuStrings(strings ?? {}),
    (editor: IEditor, node: Node) => !!getEditingTable(editor, node)
  );
};

const getEditingTable = (editor: IEditor, node: Node): { table: HTMLTableElement; td: HTMLTableCellElement } | null => {
  const td = editor.getElementAtCursor('TD,TH', node) as HTMLTableCellElement;
  const table = td && (editor.getElementAtCursor('table', td) as HTMLTableElement);

  return table?.isContentEditable ? { table, td } : null;
};
