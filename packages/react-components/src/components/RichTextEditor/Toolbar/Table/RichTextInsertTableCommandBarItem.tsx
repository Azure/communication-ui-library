// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { FocusZoneDirection } from '@fluentui/react';
import type { ICommandBarItemProps, IContextualMenuItem, Theme } from '@fluentui/react';
import { insertTableMenuTablePane, toolbarTableButtonStyle } from '../../../styles/RichTextEditor.styles';
import { RichTextInsertTablePane } from './RichTextInsertTablePane';
import { parseKey } from '../../../utils/RichTextTableUtils';
import { RichTextStrings } from '../../RichTextSendBox';
import { RichTextToolbarTableIcon } from './RichTextToolbarTableIcon';

/**
 * "Insert table" command bar item for the rich text toolbar
 */
export const richTextInsertTableCommandBarItem = (
  theme: Theme,
  maxRowsNumber: number,
  maxColumnsNumber: number,
  strings: Partial<RichTextStrings>,
  onClick: (column: number, row: number) => void
): ICommandBarItemProps => {
  return {
    'data-testid': 'rich-text-toolbar-insert-table-button',
    key: 'RichTextToolbarInsertTableButton',
    text: strings.richTextInsertTableTooltip,
    ariaLabel: strings.richTextInsertTableTooltip,
    // hide the chevron icon
    menuIconProps: {
      hidden: true
    },
    onRenderIcon: () => {
      return <RichTextToolbarTableIcon />;
    },
    buttonStyles: toolbarTableButtonStyle(theme),
    canCheck: false,
    iconOnly: true,
    subMenuProps: {
      calloutProps: { isBeakVisible: false },
      shouldFocusOnMount: true,
      className: insertTableMenuTablePane,
      focusZoneProps: { direction: FocusZoneDirection.bidirectional },
      items: [
        {
          key: 'RichTextToolbarInsertTableMenu',
          text: strings.richTextInsertTableMenuTitle,
          canCheck: false,
          onRender: (item: IContextualMenuItem) => {
            return (
              <RichTextInsertTablePane
                item={item}
                onClick={(key) => {
                  const { row, column } = parseKey(key);
                  onClick(column, row);
                }}
                maxColumnsNumber={maxColumnsNumber}
                maxRowsNumber={maxRowsNumber}
              />
            );
          }
        }
      ]
    }
  };
};
