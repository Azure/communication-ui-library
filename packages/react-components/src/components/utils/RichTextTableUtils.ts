// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { editTable } from 'roosterjs-content-model-api';
import { tableContextMenuIconStyles } from '../styles/RichTextEditor.styles';
import { RichTextStrings } from '../RichTextEditor/RichTextSendBox';
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

  if (row === undefined || column === undefined) {
    throw new Error('Invalid key format');
  }

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
  strings: Partial<RichTextStrings>
): IContextualMenuItem[] => {
  return [
    {
      key: 'RichTextTableEditMenuTableInsert',
      text: strings.richTextInsertRowOrColumnMenu,
      ariaLabel: strings.richTextInsertRowOrColumnMenu,
      iconProps: {
        iconName: 'RichTextTableInsertMenuIcon',
        styles: { root: tableContextMenuIconStyles }
      },
      subMenuProps: {
        items: [
          {
            key: 'RichTextTableEditMenuTableInsertRowAbove',
            text: strings.richTextInsertRowAboveMenu,
            ariaLabel: strings.richTextInsertRowAboveMenu,
            onClick: () => {
              editTable(editor, 'insertAbove');
            }
          },
          {
            key: 'RichTextTableEditMenuTableInsertRowBelow',
            text: strings.richTextInsertRowBelowMenu,
            ariaLabel: strings.richTextInsertRowBelowMenu,
            onClick: () => {
              editTable(editor, 'insertBelow');
            }
          },
          {
            key: 'RichTextTableEditMenuTableInsertColumnLeft',
            text: strings.richTextInsertColumnLeftMenu,
            ariaLabel: strings.richTextInsertColumnLeftMenu,
            onClick: () => {
              editTable(editor, 'insertLeft');
            }
          },
          {
            key: 'RichTextTableEditMenuTableInsertColumnRight',
            text: strings.richTextInsertColumnRightMenu,
            ariaLabel: strings.richTextInsertColumnRightMenu,
            onClick: () => {
              editTable(editor, 'insertRight');
            }
          }
        ]
      }
    },
    {
      key: 'RichTextTableEditMenuTableDelete',
      text: strings.richTextDeleteRowOrColumnMenu,
      ariaLabel: strings.richTextDeleteRowOrColumnMenu,
      iconProps: {
        iconName: 'RichTextTableDeleteMenuIcon',
        styles: { root: tableContextMenuIconStyles }
      },
      subMenuProps: {
        items: [
          {
            key: 'RichTextTableEditMenuTableDeleteRow',
            text: strings.richTextDeleteRowMenu,
            ariaLabel: strings.richTextDeleteRowMenu,
            onClick: () => {
              editTable(editor, 'deleteRow');
            }
          },
          {
            key: 'RichTextTableEditMenuTableDeleteColumn',
            text: strings.richTextDeleteColumnMenu,
            ariaLabel: strings.richTextDeleteColumnMenu,
            onClick: () => {
              editTable(editor, 'deleteColumn');
            }
          },
          {
            key: 'RichTextTableEditMenuTableDeleteTable',
            text: strings.richTextDeleteTableMenu,
            ariaLabel: strings.richTextDeleteTableMenu,
            onClick: () => {
              editTable(editor, 'deleteTable');
            }
          }
        ]
      }
    }
  ];
};
