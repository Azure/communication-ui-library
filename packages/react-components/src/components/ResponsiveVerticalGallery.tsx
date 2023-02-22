// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, Stack } from '@fluentui/react';
import React from 'react';
import { VerticalGallery, VerticalGalleryStyles } from './VerticalGallery';

export interface ResponsiveVerticalGalleryProps {
  children: React.ReactNode;
  containerStyles: IStyle;
  horizontalGalleryStyles: VerticalGalleryStyles;
  childWidthRem: number;
  gapWidthRem: number;
  buttonWidthRem?: number;
}

/**
 * Responsive container for the VerticalGallery Component. Performs calculations for number of children
 * for the VerticalGallery
 * @param props
 *
 * @beta
 */
export const ResponsiveVerticalGallery = (props: ResponsiveVerticalGalleryProps): JSX.Element => {
  return (
    <Stack>
      <VerticalGallery></VerticalGallery>
    </Stack>
  );
};
