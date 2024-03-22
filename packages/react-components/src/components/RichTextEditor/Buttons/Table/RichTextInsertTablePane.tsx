// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { FocusZone, FocusZoneDirection, mergeStyles } from '@fluentui/react';
import type { IContextualMenuItem, Theme } from '@fluentui/react';
import {
  insertTableMenuCellButtonSelectedStyles,
  insertTableMenuCellButtonStyles,
  insertTableMenuFocusZone,
  insertTableMenuTitleStyles
} from '../../../styles/RichTextEditor.styles';
import { ColumnRowReplaceString, createKey } from '../../../utils/RichTextTableUtils';

// This file uses RoosterJS React package implementation with updates to UI components and styles.
const MaxRows = 5;
const MaxColumns = 5;

/**
 * @private
 * Component for the insert table pane
 */
export const RichTextInsertTablePane = (props: {
  theme: Theme;
  item: IContextualMenuItem;
  onClick: (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>, item: IContextualMenuItem) => void;
}): JSX.Element => {
  const { item, onClick, theme } = props;
  const [column, setColumn] = React.useState(1);
  const [row, setRow] = React.useState(1);

  const updateSize = React.useCallback((target?: HTMLElement) => {
    if (target !== undefined) {
      const column = parseInt(target.dataset.column ?? '-1');
      const row = parseInt(target.dataset.row ?? '-1');

      if (column > 0 && column <= MaxColumns && row > 0 && row <= MaxRows) {
        setColumn(column);
        setRow(row);
      }
    }
  }, []);

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      updateSize(e.target as HTMLElement);
    },
    [updateSize]
  );

  const onClickButton = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick(e, {
        ...item,
        key: createKey(row, column)
      });
    },
    [row, column, onClick, item]
  );

  const items = React.useMemo(() => {
    const items: JSX.Element[] = [];

    for (let i = 1; i <= MaxRows; i++) {
      for (let j = 1; j <= MaxColumns; j++) {
        const key = `cell_${i}_${j}`;
        const isSelected = j <= column && i <= row;
        items.push(
          <button
            className={mergeStyles(
              insertTableMenuCellButtonStyles(theme),
              isSelected ? insertTableMenuCellButtonSelectedStyles(theme) : undefined
            )}
            onClick={onClickButton}
            key={key}
            id={key}
            data-column={j}
            data-row={i}
            data-is-focusable={true}
            onMouseEnter={onMouseEnter}
            aria-label={formatText(item.text ?? '', i, j)}
          />
        );
      }
    }

    return items;
  }, [column, row, theme, onClickButton, onMouseEnter, item.text]);

  const text = useMemo(() => {
    return formatText(item.text ?? '', row, column);
  }, [column, item.text, row]);

  return (
    <div>
      <div className={insertTableMenuTitleStyles}>{text}</div>
      <FocusZone
        defaultTabbableElement="cell_1_1"
        direction={FocusZoneDirection.bidirectional}
        onActiveElementChanged={updateSize}
        className={insertTableMenuFocusZone(theme)}
      >
        {items}
      </FocusZone>
    </div>
  );
};

/** @private */
export function formatText(text: string, row: number, column: number): string {
  return text.replace(`${ColumnRowReplaceString}`, `${column.toString()} x ${row.toString()}`);
}
