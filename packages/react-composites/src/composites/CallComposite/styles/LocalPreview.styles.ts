// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStyle, mergeStyles } from '@fluentui/react';
import {
  CONFIGURATION_PAGE_MAX_SECTION_WIDTH_REM,
  CONFIGURATION_PAGE_MIN_SECTION_WIDTH_REM
} from './CallConfiguration.styles';

const localPreviewContainerStyle: IStyle = {
  borderRadius: '.25rem'
};

/**
 * @private
 */
export const localPreviewContainerStyleDesktop = mergeStyles({
  ...localPreviewContainerStyle,
  width: '100%',
  height: '13.625rem',
  minWidth: `${CONFIGURATION_PAGE_MIN_SECTION_WIDTH_REM}rem`,
  maxWidth: `${CONFIGURATION_PAGE_MAX_SECTION_WIDTH_REM}rem`
});

/**
 * @private
 */
export const localPreviewContainerStyleMobile = mergeStyles({
  ...localPreviewContainerStyle,
  width: '100%',
  height: '100%'
});

/**
 * @private
 */
export const cameraOffLabelStyle = mergeStyles({
  fontSize: '0.75rem' // 12px
});

/**
 * @private
 */
export const localPreviewTileStyle = {
  root: {
    borderRadius: '.25rem',
    '@media (forced-colors: active)': {
      borderColor: '#FFFFFF',
      border: '1px solid'
    }
  }
};

/**
 * @private
 */
export const localPreviewButtonStyle = {
  root: {
    '@media (forced-colors: active)': {
      ':focus': {
        border: '1px solid !important' // we need bang important to override fluents colours
      },
      ':focus::after': {
        border: 'unset !important', // we need bang important to override fluents colours
        outline: 'unset !important'
      }
    }
  }
};
