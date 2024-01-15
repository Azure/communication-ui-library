// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme, mergeStyles } from '@fluentui/react';
import { borderAndBoxShadowStyle } from './SendBox.styles';

/**
 * @private
 */
export const sendBoxStyle = ({
  theme,
  hasErrorMessage,
  disabled
}: {
  theme: Theme;
  hasErrorMessage: boolean;
  disabled: boolean;
}): string => {
  return mergeStyles(borderAndBoxShadowStyle({ theme, hasErrorMessage, disabled }));
};
