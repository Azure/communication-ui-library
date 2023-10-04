// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { UIUtilities } from 'roosterjs-react';

/**
 *
 * @private
 */
export const renderReactComponent = (uiUtilities: UIUtilities | undefined, reactElement: JSX.Element): (() => void) => {
  if (uiUtilities) {
    return uiUtilities.renderComponent(reactElement);
  } else {
    throw new Error(
      'UIUtilities is required but not provided. Please call ReactEditorPlugin.setUIUtilities() to set a valid uiUtilities object'
    );
  }
};
