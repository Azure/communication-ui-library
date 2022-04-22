// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle } from '@fluentui/react';

/** @private */
export type ContainerRectProps = {
  containerHeight?: number;
  containerWidth?: number;
};

/** @private */
export const containerDivStyles: IStyle = { position: 'relative', width: '100%', height: '100%' };
