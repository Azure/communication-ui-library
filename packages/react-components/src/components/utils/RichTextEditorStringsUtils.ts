// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { LocalizedStrings } from 'roosterjs-react';
import type { RichTextSendBoxStrings } from '../RichTextEditor/RichTextSendBox';

/**
 * @private
 *
 * Strings for the table context menu  where key should match `key` prop if any or the name of the item.
 */
export const tableContextMenuStrings = (strings: Partial<RichTextSendBoxStrings>): LocalizedStrings<string> => {
  return {
    menuNameTableInsert: strings.richTextInsertRowOrColumnMenu,
    menuNameTableInsertAbove: strings.richTextInsertRowAboveMenu,
    menuNameTableInsertBelow: strings.richTextInsertRowBelowMenu,
    menuNameTableInsertLeft: strings.richTextInsertColumnLeftMenu,
    menuNameTableInsertRight: strings.richTextInsertColumnRightMenu,
    menuNameTableDelete: strings.richTextDeleteRowOrColumnMenu,
    menuNameTableDeleteColumn: strings.richTextDeleteColumnMenu,
    menuNameTableDeleteRow: strings.richTextDeleteRowMenu,
    menuNameTableDeleteTable: strings.richTextDeleteTableMenu
  };
};
