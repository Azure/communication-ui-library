// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { FocusZone, FocusZoneDirection, mergeStyles } from '@fluentui/react';
import type { IContextualMenuItem } from '@fluentui/react';
import {
  insertTableMenuCellButtonSelectedStyles,
  insertTableMenuCellButtonStyles,
  insertTableMenuFocusZone,
  insertTableMenuTitleStyles
} from '../../../styles/RichTextEditor.styles';
import { ColumnRowReplaceString, createKey } from '../../../utils/RichTextTableUtils';
import { useTheme } from '../../../../theming';

// This file uses RoosterJS React package implementation with updates to UI components and styles.
const RowColumnInitialValue = 0;

interface RichTextInsertTablePaneProps {
  item: IContextualMenuItem;
  onClick: (key: string) => void;
  maxRowsNumber: number;
  maxColumnsNumber: number;
}

/**
 * @private
 * Component for the insert table pane
 */
export const RichTextInsertTablePane = (props: RichTextInsertTablePaneProps): JSX.Element => {
  const { item, onClick, maxColumnsNumber, maxRowsNumber } = props;
  const [column, setColumn] = React.useState(RowColumnInitialValue);
  const [row, setRow] = React.useState(RowColumnInitialValue);
  const theme = useTheme();

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

  const onTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      updateSize(e.target as HTMLElement);
    },
    [updateSize]
  );

  const onClickButton = React.useCallback(() => {
    onClick(createKey(formatRowColumnText(row), formatRowColumnText(column)));
  }, [row, column, onClick]);

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
            onTouchStart={onTouchStart}
            aria-label={formatText(item.text ?? '', formatRowColumnText(i), formatRowColumnText(j))}
            data-testid={key}
          />
        );
      }
    }

    return items;
  }, [maxRowsNumber, maxColumnsNumber, column, row, theme, onClickButton, onMouseEnter, onTouchStart, item.text]);

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
