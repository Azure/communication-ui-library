// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LayerHost, Stack, mergeStyles } from '@fluentui/react';
import { LayoutProps } from './Layout';
import React from 'react';
import { innerLayoutStyle, layerHostStyle, rootLayoutStyle } from './styles/FloatingLocalVideoLayout.styles';
import { videoGalleryLayoutGap } from './styles/Layout.styles';
import { useId } from '@fluentui/react-hooks';

/**
 * Props for {@link FocusedContentLayout}.
 *
 * @private
 */
export interface FocusedContentLayoutProps extends LayoutProps {
  /**
   * Whether to display the local video camera switcher button
   */
  showCameraSwitcherInLocalPreview?: boolean;
  /**
   * Height of parent element
   */
  parentHeight?: number;
}

/**
 * Video gallery layout to focus on the screenshare stream that is present in the call.
 */
export const FocusedContentLayout = (props: FocusedContentLayoutProps): JSX.Element => {
  const { screenShareComponent } = props;

  const layerHostId = useId('layerhost');

  return (
    <Stack styles={rootLayoutStyle}>
      <LayerHost id={layerHostId} className={mergeStyles(layerHostStyle)} />
      <Stack styles={innerLayoutStyle} tokens={videoGalleryLayoutGap}>
        {screenShareComponent ? screenShareComponent : <></>}
      </Stack>
    </Stack>
  );
};
