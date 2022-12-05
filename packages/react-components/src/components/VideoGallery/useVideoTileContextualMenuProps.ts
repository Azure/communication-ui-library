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
  const scalingMode = useMemo(() => {
    /* @conditional-compile-remove(pinned-participants) */
    return remoteParticipant.videoStream?.scalingMode;
    return;
  }, [remoteParticipant.videoStream?.scalingMode]);

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];
    if (scalingMode) {
      if (scalingMode === 'Crop' && strings?.fitRemoteParticipantToFrame) {
        items.push({
          key: 'fitRemoteParticipantToFrame',
          text: strings.fitRemoteParticipantToFrame,
          iconProps: { iconName: 'VideoTileScaleFit', styles: { root: { lineHeight: '1rem' } } },
          onClick: () => {
            view?.updateScalingMode('Fit');
          }
        });
      } else if (scalingMode === 'Fit' && strings?.fillRemoteParticipantFrame) {
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
  }, [scalingMode, strings, view]);

  return contextualMenuProps;
};
