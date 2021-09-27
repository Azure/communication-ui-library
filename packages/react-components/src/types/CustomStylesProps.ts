// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStyle } from '@fluentui/react';

/**
 * Basic fluent styles props for all components exported from this libray.
 *
 * @public
 */
export interface BaseCustomStylesProps {
  /** Styles for the root container. */
  root?: IStyle;
}

/**
 * Custom styles props for button components, extension on fluentUI IButtonStyles.
 *
 * @public
 */
export type ButtonCustomStylesProps = IButtonStyles;
