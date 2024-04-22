// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon, Stack } from '@fluentui/react';
import { insertTable as insertTableAction } from './insertTableAction';
import type { RibbonButton } from 'roosterjs-react';
import type { IContextualMenuItem, Theme } from '@fluentui/react';
import { insertTableMenuTablePane, ribbonTableButtonStyle } from '../../../styles/RichTextEditor.styles';
import { RichTextInsertTablePane } from './RichTextInsertTablePane';
import { ColumnRowReplaceString, parseKey } from '../../../utils/RichTextTableUtils';
import type { IEditor } from 'roosterjs-editor-types-compatible';

// This file uses RoosterJS React package implementation with updates to UI components and styles.

/**
 * "Insert table" button for the RoosterJS ribbon
 */
export const insertTableButton = (
  theme: Theme,
  maxRowsNumber: number,
  maxColumnsNumber: number
): RibbonButton<string> => {
  return {
    key: 'buttonNameInsertTable',
    unlocalizedText: 'Insert table',
    // Icon will be set in onRenderIcon callback
    iconName: '',
    onClick: (editor: IEditor, key: string) => {
      const { row, column } = parseKey(key);
      insertTableAction(editor, column, row);
    },
    dropDownMenu: {
      items: {
        // the key of the item is also used as a key for localization
        insertTablePane: `Insert ${ColumnRowReplaceString} table`
      },
      itemRender: (
        item: IContextualMenuItem,
        onClick: (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>, item: IContextualMenuItem) => void
      ) => {
        return (
          <RichTextInsertTablePane
            item={item}
            onClick={onClick}
            theme={theme}
            maxColumnsNumber={maxColumnsNumber}
            maxRowsNumber={maxRowsNumber}
          />
        );
      },
      commandBarSubMenuProperties: {
        className: insertTableMenuTablePane
      }
    },
    commandBarProperties: {
      // hide the chevron icon
      menuIconProps: {
        hidden: true
      },
      onRenderIcon: () => {
        return <TableIcon />;
      },
      buttonStyles: ribbonTableButtonStyle(theme),
      canCheck: false
    }
  };
};

const TableIcon = (): JSX.Element => {
  return (
    // update the visibility of the Table Icon with css classes that are triggered by command bar's state
    <Stack>
      <Icon iconName="RichTextInsertTableFilledIcon" className={'ribbon-table-button-filled-icon'} />
      <Icon iconName="RichTextInsertTableRegularIcon" className={'ribbon-table-button-regular-icon'} />
    </Stack>
  );
};
