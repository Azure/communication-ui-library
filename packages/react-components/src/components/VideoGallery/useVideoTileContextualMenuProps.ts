// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import { useMemo } from 'react';
import { VideoGalleryParticipant, ViewScalingMode } from '../../types';
import { _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';
import { CallingContextualMenuItem } from '../VideoGallery';

/**
 * @private
 */
export const useVideoTileContextualMenuProps = (props: {
  participant: VideoGalleryParticipant;
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
    /* @conditional-compile-remove(spotlight) */
    stopSpotlightOnSelfVideoTileMenuLabel?: string;
    /* @conditional-compile-remove(spotlight) */
    spotlightLimitReachedMenuTitle?: string;
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
  onFetchParticipantCallbackItems?: (participant: VideoGalleryParticipant) => CallingContextualMenuItem[];
  /* @conditional-compile-remove(spotlight) */
  maxParticipantsToSpotlight?: number;
  /* @conditional-compile-remove(spotlight) */
  myUserId?: string;
}): IContextualMenuProps | undefined => {
  const {
    participant,
    view,
    strings,
    isPinned,
    onPinParticipant,
    onUnpinParticipant,
    onUpdateScalingMode,
    disablePinMenuItem,
    toggleAnnouncerString,
    /* @conditional-compile-remove(spotlight) */ spotlightedParticipantUserIds = [],
    /* @conditional-compile-remove(spotlight) */ isSpotlighted,
    /* @conditional-compile-remove(spotlight) */ onFetchParticipantCallbackItems,
    /* @conditional-compile-remove(spotlight) */ maxParticipantsToSpotlight,
    /* @conditional-compile-remove(spotlight) */ myUserId
  } = props;
  const scalingMode = useMemo(() => {
    return props.participant.videoStream?.scalingMode;
  }, [props.participant.videoStream?.scalingMode]);

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];

    if (isPinned !== undefined) {
      if (isPinned && onUnpinParticipant && strings?.unpinParticipantForMe) {
        let unpinActionString: string | undefined = undefined;
        if (toggleAnnouncerString && strings.unpinParticipantMenuItemAriaLabel && participant.displayName) {
          unpinActionString = _formatString(strings?.unpinParticipantMenuItemAriaLabel, {
            participantName: participant.displayName
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
            onUnpinParticipant(participant.userId);
            unpinActionString && toggleAnnouncerString?.(unpinActionString);
          },
          'data-ui-id': 'video-tile-unpin-participant-button',
          ariaLabel: unpinActionString
        });
      }
      if (!isPinned && onPinParticipant && strings?.pinParticipantForMe) {
        let pinActionString: string | undefined = undefined;
        if (toggleAnnouncerString && strings.pinnedParticipantAnnouncementAriaLabel && participant.displayName) {
          pinActionString = _formatString(strings?.pinnedParticipantAnnouncementAriaLabel, {
            participantName: participant.displayName
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
            onPinParticipant(participant.userId);
            pinActionString && toggleAnnouncerString?.(pinActionString);
          },
          'data-ui-id': 'video-tile-pin-participant-button',
          disabled: disablePinMenuItem || /* @conditional-compile-remove(spotlight) */ isSpotlighted,
          ariaLabel: pinActionString
        });
      }
    }
    const g = onFetchParticipantCallbackItems ? onFetchParticipantCallbackItems(participant) : [];
    console.log('g: ', g);
    g.forEach((h) => {
      if (h.action === 'startSpotlight') {
        const startSpotlightMenuLabel =
          spotlightedParticipantUserIds && spotlightedParticipantUserIds.length > 0
            ? strings?.addSpotlightVideoTileMenuLabel
            : strings?.startSpotlightVideoTileMenuLabel;
        const maxSpotlightedParticipantsReached = maxParticipantsToSpotlight
          ? spotlightedParticipantUserIds.length >= maxParticipantsToSpotlight
          : false;
        items.push({
          ...h,
          text: startSpotlightMenuLabel,
          iconProps: {
            iconName: 'StartSpotlightContextualMenuItem',
            styles: { root: { lineHeight: 0 } }
          },
          ariaLabel: startSpotlightMenuLabel,
          disabled: maxSpotlightedParticipantsReached,
          title: maxSpotlightedParticipantsReached ? strings?.spotlightLimitReachedMenuTitle : undefined
        });
      } else if (h.action === 'stopSpotlight') {
        const stopSpotlightMenuLabel =
          myUserId === participant.userId
            ? strings?.stopSpotlightOnSelfVideoTileMenuLabel
            : strings?.stopSpotlightVideoTileMenuLabel;
        items.push({
          ...h,
          text: stopSpotlightMenuLabel,
          iconProps: {
            iconName: 'StopSpotlightContextualMenuItem',
            styles: { root: { lineHeight: 0 } }
          },
          ariaLabel: stopSpotlightMenuLabel
        });
      }
    });
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
            onUpdateScalingMode?.(participant.userId, 'Fit');
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
            onUpdateScalingMode?.(participant.userId, 'Crop');
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
    disablePinMenuItem,
    toggleAnnouncerString,
    /* @conditional-compile-remove(spotlight) */ spotlightedParticipantUserIds,
    /* @conditional-compile-remove(spotlight) */ isSpotlighted,
    /* @conditional-compile-remove(spotlight) */ onFetchParticipantCallbackItems,
    participant,
    /* @conditional-compile-remove(spotlight) */ maxParticipantsToSpotlight,
    /* @conditional-compile-remove(spotlight) */ myUserId
  ]);

  return contextualMenuProps;
};
