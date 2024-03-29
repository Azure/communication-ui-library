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
const RowColumnInitialValue = 0;

interface RichTextInsertTablePaneProps {
  theme: Theme;
  item: IContextualMenuItem;
  onClick: (e: React.MouseEvent<Element> | React.KeyboardEvent<Element>, item: IContextualMenuItem) => void;
  maxRowsNumber: number;
  maxColumnsNumber: number;
}

/**
 * @private
 * Component for the insert table pane
 */
export const RichTextInsertTablePane = (props: RichTextInsertTablePaneProps): JSX.Element => {
  const { item, onClick, theme, maxColumnsNumber, maxRowsNumber } = props;
  const [column, setColumn] = React.useState(RowColumnInitialValue);
  const [row, setRow] = React.useState(RowColumnInitialValue);

  const updateSize = React.useCallback(
    (target?: HTMLElement) => {
      if (target !== undefined && target.dataset.column !== undefined && target.dataset.row !== undefined) {
        const column = parseInt(target.dataset.column);
        const row = parseInt(target.dataset.row);

        if (
          column >= RowColumnInitialValue &&
          column < maxColumnsNumber &&
          row >= RowColumnInitialValue &&
          row < maxRowsNumber
        ) {
          setColumn(column);
          setRow(row);
        }
      }
    },
    [maxColumnsNumber, maxRowsNumber]
  );

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
        key: createKey(formatRowColumnText(row), formatRowColumnText(column))
      });
    },
    [row, column, onClick, item]
  );

  const items = React.useMemo(() => {
    const items: JSX.Element[] = [];

    for (let i = 0; i < maxRowsNumber; i++) {
      for (let j = 0; j < maxColumnsNumber; j++) {
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
  }, [maxRowsNumber, maxColumnsNumber, column, row, theme, onClickButton, onMouseEnter, item.text]);

  const text = useMemo(() => {
    return formatText(item.text ?? '', formatRowColumnText(row), formatRowColumnText(column));
  }, [column, item.text, row]);

  return (
    <div>
      <div className={insertTableMenuTitleStyles}>{text}</div>
      <FocusZone
        defaultTabbableElement={`cell_${RowColumnInitialValue}_${RowColumnInitialValue}`}
        direction={FocusZoneDirection.bidirectional}
        onActiveElementChanged={updateSize}
        className={insertTableMenuFocusZone(theme)}
      >
        {items}
      </FocusZone>
    </div>
  );
};

const formatText = (text: string, row: number, column: number): string => {
  return text.replace(`${ColumnRowReplaceString}`, `${column.toString()} x ${row.toString()}`);
};

const formatRowColumnText = (value: number): number => {
  return value + 1;
};
