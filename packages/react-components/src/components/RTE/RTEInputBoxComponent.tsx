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
  placeholderText?: string;
  textValue: string;
}

/**
 * @private
 */
export const RTEInputBoxComponent = (props: RTEInputBoxComponentProps): JSX.Element => {
  const { placeholderText, textValue } = props;

  return (
    <div>
      <RichTextEditor content={textValue} placeholderText={placeholderText} onChange={() => {}}>
        <div>Children</div>
      </RichTextEditor>
    </div>
  );
};
