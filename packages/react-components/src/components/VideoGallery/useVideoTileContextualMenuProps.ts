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
  strings?: {
    fitRemoteParticipantToFrame?: string;
    fillRemoteParticipantFrame?: string;
  };
  view?: { updateScalingMode: (scalingMode: ViewScalingMode) => Promise<void> };
}): IContextualMenuProps | undefined => {
  const { view, remoteParticipant, strings } = props;

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];
    if (remoteParticipant.videoStream?.scalingMode) {
      if (remoteParticipant.videoStream?.scalingMode === 'Crop' && strings?.fitRemoteParticipantToFrame) {
        items.push({
          key: 'fitRemoteParticipantToFrame',
          text: strings.fitRemoteParticipantToFrame,
          iconProps: { iconName: 'VideoTileScaleFit', styles: { root: { lineHeight: '1rem' } } },
          onClick: () => {
            view?.updateScalingMode('Fit');
          }
        });
      } else if (remoteParticipant.videoStream?.scalingMode === 'Fit' && strings?.fillRemoteParticipantFrame) {
        {
          items.push({
            key: 'fillRemoteParticipantFrame',
            text: strings.fillRemoteParticipantFrame,
            iconProps: { iconName: 'VideoTileScaleFill', styles: { root: { lineHeight: '1rem' } } },
            onClick: () => {
              view?.updateScalingMode('Crop');
            }
          });
        }
      }
    }
    if (items.length === 0) {
      return undefined;
    }

    /* @conditional-compile-remove(pinned-participants) */
    return { items };
    return;
  }, [remoteParticipant.videoStream?.scalingMode, strings, view]);

  return contextualMenuProps;
};
