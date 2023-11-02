// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IModalStyles, IOverlayStyles } from '@fluentui/react';

/** @private */
export const callReadinessModalStyles: Partial<IModalStyles> = {
  root: { position: 'unset' },
  main: { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
};

/** @private */
export const callReadinessModalOverlayStyles: Partial<IOverlayStyles> = {
  root: { background: 'rgba(0,0,0,0.4)' }
};
