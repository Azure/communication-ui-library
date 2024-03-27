// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { LocalizedStrings } from 'roosterjs-react';
import type { RichTextSendBoxStrings } from '../RichTextEditor/RichTextSendBox';
/**
 * @private
 *
 * Strings for the ribbon buttons where key should match `key` prop if any or the name of the item.
 */
export const ribbonButtonsStrings = (strings: Partial<RichTextSendBoxStrings>): LocalizedStrings<string> => {
  return {
    buttonNameBold: strings.boldTooltip,
    buttonNameItalic: strings.italicTooltip,
    buttonNameUnderline: strings.underlineTooltip,
    buttonNameBulletedList: strings.bulletListTooltip,
    buttonNameNumberedList: strings.numberListTooltip,
    buttonNameIncreaseIndent: strings.increaseIndentTooltip,
    buttonNameDecreaseIndent: strings.decreaseIndentTooltip,
    buttonNameInsertTable: strings.insertTableTooltip,
    insertTablePane: strings.insertTableMenuTitle
  };
};

/**
 * @private
 *
 * Strings for the table context menu  where key should match `key` prop if any or the name of the item.
 */
export const tableContextMenuStrings = (strings: Partial<RichTextSendBoxStrings>): LocalizedStrings<string> => {
  return {
    menuNameTableInsert: strings.insertRowOrColumnMenu,
    menuNameTableInsertAbove: strings.insertRowAboveMenu,
    menuNameTableInsertBelow: strings.insertRowBelowMenu,
    menuNameTableInsertLeft: strings.insertColumnLeftMenu,
    menuNameTableInsertRight: strings.insertColumnRightMenu,
    menuNameTableDelete: strings.deleteRowOrColumnMenu,
    menuNameTableDeleteColumn: strings.deleteColumnMenu,
    menuNameTableDeleteRow: strings.deleteRowMenu,
    menuNameTableDeleteTable: strings.deleteTableMenu
  };
};
