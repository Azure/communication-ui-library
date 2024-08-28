// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

/**
 * @private
 */
export const questionTextStyle = (theme: Theme): string =>
  mergeStyles({
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(20),
    color: theme.palette.neutralPrimary
  });

/**
 * @private
 */
export const surveyContainerStyle = (isMobile: boolean): string =>
  mergeStyles(
    isMobile
      ? {
          width: '20rem',
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)'
        }
      : {
          width: '24rem',
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)'
        }
  );
