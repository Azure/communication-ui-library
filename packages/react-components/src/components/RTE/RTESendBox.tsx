// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

/**
 * Props for {@link RTESendBox}.
 *
 * @public
 */
export interface RTESendBoxProps {
  // just a value to be displayed for now but it should be deleted when the component development starts
  valueToDisplay?: string;
}

/**
 * A component to render SendBox with Rich Text Editor support.
 *
 * @public
 */
export const RTESendBox = (props: RTESendBoxProps): JSX.Element => {
  const { valueToDisplay = 'Hello World!' } = props;
  return <div>{valueToDisplay}</div>;
};
