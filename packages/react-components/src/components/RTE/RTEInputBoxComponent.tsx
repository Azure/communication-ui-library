// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { BaseCustomStyles } from '../../types';
import { RichTextEditor } from './RichTextEditor';

/**
 * @private
 */
export interface RTEInputBoxComponentStylesProps extends BaseCustomStyles {}

/**
 * @private
 */
export interface RTEInputBoxComponentProps {
  textValue: string;
}

/**
 * @private
 */
export const RTEInputBoxComponent = (props: RTEInputBoxComponentProps): JSX.Element => {
  const { textValue } = props;

  return (
    <div>
      <RichTextEditor content={textValue} onChange={() => {}}>
        <div>Children</div>
      </RichTextEditor>
    </div>
  );
};
