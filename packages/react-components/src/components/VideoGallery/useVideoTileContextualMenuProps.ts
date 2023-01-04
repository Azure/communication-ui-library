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
    pinParticipantForMe?: string;
    pinParticipantForMeWhenLimitReached?: string;
    unpinParticipantForMe?: string;
  };
  view?: { updateScalingMode: (scalingMode: ViewScalingMode) => Promise<void> };
  isPinned?: boolean;
  onPinParticipant?: (userId: string) => void;
  onUnpinParticipant?: (userId: string) => void;
  disablePinMenuItem?: boolean;
}): IContextualMenuProps | undefined => {
  const { view, strings, isPinned, onPinParticipant, onUnpinParticipant, disablePinMenuItem } = props;
  const scalingMode = useMemo(() => {
    /* @conditional-compile-remove(pinned-participants) */
    return props.remoteParticipant.videoStream?.scalingMode;
    return undefined;
  }, [
    /* @conditional-compile-remove(pinned-participants) */
    props.remoteParticipant.videoStream?.scalingMode
  ]);

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];

    if (isPinned !== undefined) {
      if (isPinned && onUnpinParticipant && strings?.unpinParticipantForMe) {
        items.push({
          key: 'unpin',
          text: strings.unpinParticipantForMe,
          iconProps: {
            iconName: 'UnpinParticipant',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => onUnpinParticipant?.(props.remoteParticipant.userId),
          'data-ui-id': 'video-tile-unpin-participant-button'
        });
      }
      if (!isPinned && onPinParticipant && strings?.pinParticipantForMe) {
        items.push({
          key: 'pin',
          text: disablePinMenuItem ? strings.pinParticipantForMeWhenLimitReached : strings.pinParticipantForMe,
          iconProps: {
            iconName: 'PinParticipant',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => onPinParticipant?.(props.remoteParticipant.userId),
          'data-ui-id': 'video-tile-pin-participant-button',
          disabled: disablePinMenuItem
        });
      }
    }
    if (scalingMode) {
      if (scalingMode === 'Crop' && strings?.fitRemoteParticipantToFrame) {
        items.push({
          key: 'fitRemoteParticipantToFrame',
          text: strings.fitRemoteParticipantToFrame,
          iconProps: {
            iconName: 'VideoTileScaleFit',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            view?.updateScalingMode('Fit');
          }
        });
      } else if (scalingMode === 'Fit' && strings?.fillRemoteParticipantFrame) {
        {
          items.push({
            key: 'fillRemoteParticipantFrame',
            text: strings.fillRemoteParticipantFrame,
            iconProps: {
              iconName: 'VideoTileScaleFill',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              view?.updateScalingMode('Crop');
            },
            styles: {}
          });
        }
      }
    }
    if (items.length === 0) {
      return undefined;
    }

    return { items, styles: {} };
  }, [
    scalingMode,
    strings,
    view,
    isPinned,
    onPinParticipant,
    onUnpinParticipant,
    props.remoteParticipant.userId,
    disablePinMenuItem
  ]);

  return contextualMenuProps;
};
