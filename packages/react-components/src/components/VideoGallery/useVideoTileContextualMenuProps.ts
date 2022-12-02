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
}): IContextualMenuProps | undefined => {
  const { view, remoteParticipant } = props;

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];
    if (remoteParticipant.videoStream?.scalingMode) {
      if (remoteParticipant.videoStream?.scalingMode === 'Crop') {
        items.push({
          key: 'fitToFrame',
          text: `Fit to frame`,
          iconProps: { iconName: 'FitWidth' },
          onClick: () => {
            view?.updateScalingMode('Fit');
          }
        });
      } else {
        items.push({
          key: 'fillFrame',
          text: `Fill frame`,
          iconProps: { iconName: 'FitPage' },
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
  }, [remoteParticipant.videoStream?.scalingMode, view]);

  return contextualMenuProps;
};
