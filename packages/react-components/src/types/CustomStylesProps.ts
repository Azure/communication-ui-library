// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IStyle } from '@fluentui/react';

/**
 * Basic custom styles props for components
 */
export interface BaseCustomStylesProps {
  /** Styles for the root container. */
  root?: IStyle;
}

/**
 * custom styles props for button components, extension on fluentUI IButtonStyles
 */
export interface ButtonCustomStylesProps extends IButtonStyles {}
