// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Text } from '@fluentui/react';
import { Info16Regular } from '@fluentui/react-icons';
import React from 'react';

/**
 * Small component that shows the `(i) important` used in banners.
 * @private
 */
export const ImportantHeading = (props: { color: string }): JSX.Element => (
  <>
    <Info16Regular style={importantIconStyles} primaryFill={props.color} />{' '}
    <Text styles={{ root: { ...importantTextStyles, color: props.color } }}>Important</Text>
  </>
);

const importantIconStyles = {
  // Ensure icon aligns with text by setting to the height to the same as the font size (1rem)
  // And aligning the icon with the bottom of the text
  height: '1rem',
  verticalAlign: 'text-bottom',

  // display must be block or inline-block for verticalAlign to work
  display: 'inline-block'
};

const importantTextStyles = {
  lineHeight: '1.5rem',
  fontWeight: '600'
};
