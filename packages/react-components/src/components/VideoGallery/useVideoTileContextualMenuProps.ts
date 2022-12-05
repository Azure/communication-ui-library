// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react';
import { useMemo } from 'react';
import { VideoGalleryRemoteParticipant, ViewScalingMode } from '../../types';

/**
 * @private
 */
export const useVideoTileContextualMenuProps = (props: {
  remoteParticipant: VideoGalleryRemoteParticipant;
  view?: { updateScalingMode: (scalingMode: ViewScalingMode) => Promise<void> };
  strings: {
    fitToFrame: string;
    fillFrame: string;
  };
}): IContextualMenuProps | undefined => {
  const { view, remoteParticipant, strings } = props;

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];
    if (remoteParticipant.videoStream?.scalingMode) {
      if (remoteParticipant.videoStream?.scalingMode === 'Crop') {
        items.push({
          key: 'fitToFrame',
          text: strings.fitToFrame,
          iconProps: { iconName: 'VideoTileScaleFit', styles: { root: { lineHeight: '1rem' } } },
          onClick: () => {
            view?.updateScalingMode('Fit');
          }
        });
      } else {
        items.push({
          key: 'fillFrame',
          text: strings.fillFrame,
          iconProps: { iconName: 'VideoTileScaleFill', styles: { root: { lineHeight: '1rem' } } },
          onClick: () => {
            view?.updateScalingMode('Crop');
          }
        });
      }
    }
    if (items.length === 0) {
      return undefined;
    }
    return { items };
  }, [remoteParticipant.videoStream?.scalingMode, strings.fillFrame, strings.fitToFrame, view]);

  return contextualMenuProps;
};
