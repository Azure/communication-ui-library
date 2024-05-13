// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { editTable } from 'roosterjs-content-model-api';
import { tableContextMenuIconStyles } from '../styles/RichTextEditor.styles';
import { RichTextSendBoxStrings } from '../RichTextEditor/RichTextSendBox';
import { IEditor } from 'roosterjs-content-model-types';
import { IContextualMenuItem } from '@fluentui/react';

/**
 * @private
 *
 * String to be replaces by actual values of row and column.
 */
export const ColumnRowReplaceString = '{column} x {row}';

/**
 * @private
 *
 * Function to create key pair for the selected table size.
 */
export function createKey(row: number, column: number): string {
  return `${row},${column}`;
}

/**
 * @private
 *
 * Function to parse key to the selected table size valules.
 */
export function parseKey(key: string): { row: number; column: number } {
  const [row, column] = key.split(',');
  return {
    row: parseInt(row),
    column: parseInt(column)
  };
}

/**
 * Returns an array of context menu items for editing a rich text table.
 *
 * @param editor - The editor instance.
 * @param strings - An object containing localized strings for the context menu items.
 * @returns An array of context menu items.
 */
export const getTableEditContextMenuItems = (
  editor: IEditor,
  strings: Partial<RichTextSendBoxStrings>
): IContextualMenuItem[] => {
  return [
    {
      key: 'RichTextTableEditMenuTableInsert',
      text: strings.insertRowOrColumnMenu,
      ariaLabel: strings.insertRowOrColumnMenu,
      iconProps: {
        iconName: 'RichTextTableInsertMenuIcon',
        styles: { root: tableContextMenuIconStyles }
      },
      subMenuProps: {
        items: [
          {
            key: 'RichTextTableEditMenuTableInsertRowAbove',
            text: strings.insertRowAboveMenu,
            ariaLabel: strings.insertRowAboveMenu,
            onClick: () => {
              editTable(editor, 'insertAbove');
            }
          },
          {
            key: 'RichTextTableEditMenuTableInsertRowBelow',
            text: strings.insertRowBelowMenu,
            ariaLabel: strings.insertRowBelowMenu,
            onClick: () => {
              editTable(editor, 'insertBelow');
            }
          },
          {
            key: 'RichTextTableEditMenuTableInsertColumnLeft',
            text: strings.insertColumnLeftMenu,
            ariaLabel: strings.insertColumnLeftMenu,
            onClick: () => {
              editTable(editor, 'insertLeft');
            }
          },
          {
            key: 'RichTextTableEditMenuTableInsertColumnRight',
            text: strings.insertColumnRightMenu,
            ariaLabel: strings.insertColumnRightMenu,
            onClick: () => {
              editTable(editor, 'insertRight');
            }
          }
        ]
      }
    },
    {
      key: 'RichTextTableEditMenuTableDelete',
      text: strings.deleteRowOrColumnMenu,
      ariaLabel: strings.deleteRowOrColumnMenu,
      iconProps: {
        iconName: 'RichTextTableDeleteMenuIcon',
        styles: { root: tableContextMenuIconStyles }
      },
      subMenuProps: {
        items: [
          {
            key: 'RichTextTableEditMenuTableDeleteRow',
            text: strings.deleteRowMenu,
            ariaLabel: strings.deleteRowMenu,
            onClick: () => {
              editTable(editor, 'deleteRow');
            }
          },
          {
            key: 'RichTextTableEditMenuTableDeleteColumn',
            text: strings.deleteColumnMenu,
            ariaLabel: strings.deleteColumnMenu,
            onClick: () => {
              editTable(editor, 'deleteColumn');
            }
          },
          {
            key: 'RichTextTableEditMenuTableDeleteTable',
            text: strings.deleteTableMenu,
            ariaLabel: strings.deleteTableMenu,
            onClick: () => {
              editTable(editor, 'deleteTable');
            }
          }
        ]
      }
    }
  ];
};
