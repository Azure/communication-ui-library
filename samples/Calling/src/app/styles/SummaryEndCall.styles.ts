// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { IStyle, IStackTokens, IStackStyles } from '@fluentui/react';

/**
 * @private
 */
export const containerStyle: IStyle = {
  maxWidth: '22.5rem',
  // Ensure some space around the text on a narrow viewport.
  margin: '1rem'
};

/**
 * @private
 */
export const containerItemGap: IStackTokens = {
  childrenGap: '1rem'
};

/**
 * @private
 */
export const rejoinCallButtonContainerStyles: IStackStyles = {
  root: {
    paddingTop: '1.125rem',
    borderRadius: '0.25rem'
  }
};

/**
 * @private
 */
export const titleStyles: IStyle = {
  fontSize: '1.25rem',
  fontWeight: 600
};

/**
 * @private
 */
export const moreDetailsStyles: IStyle = {
  fontSize: '1rem'
};
