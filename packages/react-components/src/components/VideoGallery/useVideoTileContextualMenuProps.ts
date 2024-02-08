// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import { useMemo } from 'react';
import { VideoGalleryRemoteParticipant, ViewScalingMode } from '../../types';
import { _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';

/**
 * @private
 */
export const useVideoTileContextualMenuProps = (props: {
  remoteParticipant: VideoGalleryRemoteParticipant;
  strings?: {
    fitRemoteParticipantToFrame?: string;
    fillRemoteParticipantFrame?: string;
    pinParticipantForMe?: string;
    pinParticipantForMeLimitReached?: string;
    unpinParticipantForMe?: string;
    pinParticipantMenuItemAriaLabel?: string;
    unpinParticipantMenuItemAriaLabel?: string;
    pinnedParticipantAnnouncementAriaLabel?: string;
    unpinnedParticipantAnnouncementAriaLabel?: string;
    /* @conditional-compile-remove(spotlight) */
    startSpotlightVideoTileMenuLabel?: string;
    /* @conditional-compile-remove(spotlight) */
    addSpotlightVideoTileMenuLabel?: string;
    /* @conditional-compile-remove(spotlight) */
    stopSpotlightVideoTileMenuLabel?: string;
  };
  view?: { updateScalingMode: (scalingMode: ViewScalingMode) => Promise<void> };
  isPinned?: boolean;
  onPinParticipant?: (userId: string) => void;
  onUnpinParticipant?: (userId: string) => void;
  onUpdateScalingMode?: (userId: string, scalingMode: ViewScalingMode) => void;
  disablePinMenuItem?: boolean;
  toggleAnnouncerString?: (announcerString: string) => void;
  /* @conditional-compile-remove(spotlight) */
  isSpotlighted?: boolean;
  /* @conditional-compile-remove(spotlight) */
  spotlightedParticipantUserIds?: string[];
  /* @conditional-compile-remove(spotlight) */
  onStartSpotlight?: (userIds: string[]) => void;
  /* @conditional-compile-remove(spotlight) */
  onStopSpotlight?: (userIds: string[]) => void;
}): IContextualMenuProps | undefined => {
  const {
    remoteParticipant,
    view,
    strings,
    isPinned,
    onPinParticipant,
    onUnpinParticipant,
    onUpdateScalingMode,
    disablePinMenuItem,
    toggleAnnouncerString,
    /* @conditional-compile-remove(spotlight) */ spotlightedParticipantUserIds,
    /* @conditional-compile-remove(spotlight) */ isSpotlighted,
    /* @conditional-compile-remove(spotlight) */ onStartSpotlight,
    /* @conditional-compile-remove(spotlight) */ onStopSpotlight
  } = props;
  const scalingMode = useMemo(() => {
    return props.remoteParticipant.videoStream?.scalingMode;
  }, [props.remoteParticipant.videoStream?.scalingMode]);

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];

    if (isPinned !== undefined) {
      if (isPinned && onUnpinParticipant && strings?.unpinParticipantForMe) {
        let unpinActionString: string | undefined = undefined;
        if (toggleAnnouncerString && strings.unpinParticipantMenuItemAriaLabel && remoteParticipant.displayName) {
          unpinActionString = _formatString(strings?.unpinParticipantMenuItemAriaLabel, {
            participantName: remoteParticipant.displayName
          });
        }
        items.push({
          key: 'unpin',
          text: strings.unpinParticipantForMe,
          iconProps: {
            iconName: 'UnpinParticipant',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onUnpinParticipant(remoteParticipant.userId);
            unpinActionString && toggleAnnouncerString?.(unpinActionString);
          },
          'data-ui-id': 'video-tile-unpin-participant-button',
          ariaLabel: unpinActionString
        });
      }
      if (!isPinned && onPinParticipant && strings?.pinParticipantForMe) {
        let pinActionString: string | undefined = undefined;
        if (toggleAnnouncerString && strings.pinnedParticipantAnnouncementAriaLabel && remoteParticipant.displayName) {
          pinActionString = _formatString(strings?.pinnedParticipantAnnouncementAriaLabel, {
            participantName: remoteParticipant.displayName
          });
        }
        items.push({
          key: 'pin',
          text: disablePinMenuItem ? strings.pinParticipantForMeLimitReached : strings.pinParticipantForMe,
          iconProps: {
            iconName: 'PinParticipant',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onPinParticipant(remoteParticipant.userId);
            pinActionString && toggleAnnouncerString?.(pinActionString);
          },
          'data-ui-id': 'video-tile-pin-participant-button',
          disabled: disablePinMenuItem || /* @conditional-compile-remove(spotlight) */ isSpotlighted,
          ariaLabel: pinActionString
        });
      }
    }
    /* @conditional-compile-remove(spotlight) */
    if (isSpotlighted) {
      if (onStopSpotlight && remoteParticipant.userId && strings?.stopSpotlightVideoTileMenuLabel) {
        items.push({
          key: 'stopSpotlight',
          text: strings.stopSpotlightVideoTileMenuLabel,
          iconProps: {
            iconName: 'StopSpotlightContextualMenuItem',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => onStopSpotlight([remoteParticipant.userId]),
          ariaLabel: strings.stopSpotlightVideoTileMenuLabel
        });
      }
    } else {
      const startSpotlightMenuLabel =
        spotlightedParticipantUserIds && spotlightedParticipantUserIds.length > 0
          ? strings?.addSpotlightVideoTileMenuLabel
          : strings?.startSpotlightVideoTileMenuLabel;
      if (onStartSpotlight && remoteParticipant.userId && startSpotlightMenuLabel) {
        items.push({
          key: 'startSpotlight',
          text: startSpotlightMenuLabel,
          iconProps: {
            iconName: 'StartSpotlightContextualMenuItem',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => onStartSpotlight([remoteParticipant.userId]),
          ariaLabel: startSpotlightMenuLabel
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
            onUpdateScalingMode?.(remoteParticipant.userId, 'Fit');
            view?.updateScalingMode('Fit');
          },
          'data-ui-id': 'video-tile-fit-to-frame',
          ariaLabel: strings.fitRemoteParticipantToFrame
        });
      } else if (scalingMode === 'Fit' && strings?.fillRemoteParticipantFrame) {
        items.push({
          key: 'fillRemoteParticipantFrame',
          text: strings.fillRemoteParticipantFrame,
          iconProps: {
            iconName: 'VideoTileScaleFill',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onUpdateScalingMode?.(remoteParticipant.userId, 'Crop');
            view?.updateScalingMode('Crop');
          },
          'data-ui-id': 'video-tile-fill-frame',
          ariaLabel: strings.fillRemoteParticipantFrame
        });
      }
    }
    if (items.length === 0) {
      return undefined;
    }

    return { items, styles: {}, calloutProps: { preventDismissOnEvent } };
  }, [
    scalingMode,
    strings,
    view,
    isPinned,
    onPinParticipant,
    onUnpinParticipant,
    onUpdateScalingMode,
    remoteParticipant.userId,
    remoteParticipant.displayName,
    disablePinMenuItem,
    toggleAnnouncerString,
    /* @conditional-compile-remove(spotlight) */ spotlightedParticipantUserIds,
    /* @conditional-compile-remove(spotlight) */ isSpotlighted,
    /* @conditional-compile-remove(spotlight) */ onStartSpotlight,
    /* @conditional-compile-remove(spotlight) */ onStopSpotlight
  ]);

  return contextualMenuProps;
};
