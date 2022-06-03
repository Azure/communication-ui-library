// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const loadingSpinnerContainerStyle = (): string =>
  mergeStyles({
    width: '5rem',
    height: '5rem',
    position: 'absolute',
    top: '50%',
    bottom: '0',
    left: '50%',
    right: '0',
    transform: 'translate(-50%, -50%)'
  });
