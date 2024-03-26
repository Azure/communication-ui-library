// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Icon, Stack } from '@fluentui/react';
import { insertTable as insertTableAction } from './insertTableAction';
import type { RibbonButton } from 'roosterjs-react';
import type { Theme } from '@fluentui/react';
import { insertTableMenuTablePane, ribbonTableButtonStyle } from '../../../styles/RichTextEditor.styles';
import { RichTextInsertTablePane } from './RichTextInsertTablePane';
import { ColumnRowReplaceString, parseKey } from '../../../utils/RichTextTableUtils';

// This file uses RoosterJS React package implementation with updates to UI components and styles.

/**
 * "Insert table" button for the RoosterJS ribbon
 */
export const insertTableButton = (theme: Theme): RibbonButton<string> => {
  return {
    key: 'buttonNameInsertTable',
    unlocalizedText: 'Insert table',
    // Icon will be set in onRenderIcon callback
    iconName: '',
    onClick: (editor, key) => {
      const { row, column } = parseKey(key);
      insertTableAction(editor, column, row);
    },
    dropDownMenu: {
      items: {
        // the key of the item is also used as a key for localization
        insertTablePane: `Insert ${ColumnRowReplaceString} table`
      },
      itemRender: (item, onClick) => {
        return <RichTextInsertTablePane item={item} onClick={onClick} theme={theme} />;
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
      onRenderIcon: (item) => {
        console.log('onRenderIcon', item);
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
