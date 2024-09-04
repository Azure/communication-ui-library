// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { RichTextInsertTablePane } from '../../../src/components/RichTextEditor/Toolbar/Table/RichTextInsertTablePane';
import { ColumnRowReplaceString } from '../../../src/components/utils/RichTextTableUtils';

interface TestRichTextInsertTablePaneProps {
  maxRowsNumber: number;
  maxColumnsNumber: number;
}

/**
 * @private
 */
export const TestRichTextInsertTablePane = (props: TestRichTextInsertTablePaneProps): JSX.Element => {
  const { maxRowsNumber, maxColumnsNumber } = props;
  return (
    <RichTextInsertTablePane
      item={{ key: 'test', text: `Insert table ${ColumnRowReplaceString}` }}
      onClick={() => {}}
      maxRowsNumber={maxRowsNumber}
      maxColumnsNumber={maxColumnsNumber}
    />
  );
};
