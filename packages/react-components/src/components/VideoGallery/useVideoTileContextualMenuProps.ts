// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IContextualMenuItem, IContextualMenuProps } from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import { useMemo } from 'react';
import { VideoGalleryParticipant, ViewScalingMode } from '../../types';
import { _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';

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
    startSpotlightVideoTileMenuLabel?: string;
    addSpotlightVideoTileMenuLabel?: string;
    stopSpotlightVideoTileMenuLabel?: string;
    stopSpotlightOnSelfVideoTileMenuLabel?: string;
    spotlightLimitReachedMenuTitle?: string;
    /* @conditional-compile-remove(soft-mute) */
    muteParticipantMenuItemLabel?: string;
    forbidParticipantAudio?: string;
    permitParticipantAudio?: string;
    forbidParticipantAudioTileMenuLabel?: string;
    permitParticipantAudioTileMenuLabel?: string;
  };
  view?: { updateScalingMode: (scalingMode: ViewScalingMode) => Promise<void> };
  isPinned?: boolean;
  onPinParticipant?: (userId: string) => void;
  onUnpinParticipant?: (userId: string) => void;
  onUpdateScalingMode?: (userId: string, scalingMode: ViewScalingMode) => void;
  disablePinMenuItem?: boolean;
  toggleAnnouncerString?: (announcerString: string) => void;
  isSpotlighted?: boolean;
  spotlightedParticipantUserIds?: string[];
  onStartSpotlight?: (userIds: string[]) => void;
  onStopSpotlight?: (userIds: string[]) => void;
  maxParticipantsToSpotlight?: number;
  myUserId?: string;
  /* @conditional-compile-remove(soft-mute) */
  onMuteParticipant?: (userId: string) => void;
  onForbidParticipantAudio?: (userIds: string[]) => void;
  onPermitParticipantAudio?: (userIds: string[]) => void;
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
    spotlightedParticipantUserIds = [],
    isSpotlighted,
    onStartSpotlight,
    onStopSpotlight,
    maxParticipantsToSpotlight,
    myUserId,
    /* @conditional-compile-remove(soft-mute) */ onMuteParticipant,
    onForbidParticipantAudio,
    onPermitParticipantAudio
  } = props;
  const scalingMode = useMemo(() => {
    return props.participant.videoStream?.scalingMode;
  }, [props.participant.videoStream?.scalingMode]);

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];
    /* @conditional-compile-remove(soft-mute) */
    if (onMuteParticipant && strings?.muteParticipantMenuItemLabel) {
      items.push({
        key: 'mute',
        text: strings?.muteParticipantMenuItemLabel,
        iconProps: {
          iconName: 'ContextualMenuMicMutedIcon',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onMuteParticipant(participant.userId),
        'data-ui-id': 'video-tile-mute-participant',
        ariaLabel: strings?.muteParticipantMenuItemLabel,
        disabled: participant.isMuted
      });
    }
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
          disabled: disablePinMenuItem || isSpotlighted,
          ariaLabel: strings.pinParticipantForMe
        });
      }
    }

    if (isSpotlighted) {
      const stopSpotlightMenuLabel =
        myUserId === participant.userId
          ? strings?.stopSpotlightOnSelfVideoTileMenuLabel
          : strings?.stopSpotlightVideoTileMenuLabel;
      if (onStopSpotlight && participant.userId && strings?.stopSpotlightVideoTileMenuLabel) {
        items.push({
          key: 'stopSpotlight',
          text: stopSpotlightMenuLabel,
          iconProps: {
            iconName: 'StopSpotlightContextualMenuItem',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => onStopSpotlight([participant.userId]),
          ariaLabel: strings.stopSpotlightVideoTileMenuLabel
        });
      }
    } else {
      const startSpotlightMenuLabel =
        spotlightedParticipantUserIds && spotlightedParticipantUserIds.length > 0
          ? strings?.addSpotlightVideoTileMenuLabel
          : strings?.startSpotlightVideoTileMenuLabel;
      const maxSpotlightedParticipantsReached = maxParticipantsToSpotlight
        ? spotlightedParticipantUserIds.length >= maxParticipantsToSpotlight
        : false;
      if (onStartSpotlight && participant.userId && startSpotlightMenuLabel) {
        items.push({
          key: 'startSpotlight',
          text: startSpotlightMenuLabel,
          iconProps: {
            iconName: 'StartSpotlightContextualMenuItem',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => onStartSpotlight([participant.userId]),
          ariaLabel: startSpotlightMenuLabel,
          disabled: maxSpotlightedParticipantsReached,
          title: maxSpotlightedParticipantsReached ? strings?.spotlightLimitReachedMenuTitle : undefined
        });
      }
    }
    /* @conditional-compile-remove(media-access) */
    if (!participant.mediaAccess?.isAudioPermitted && onPermitParticipantAudio) {
      items.push({
        key: 'permitParticipantAudio',
        text: strings?.permitParticipantAudioTileMenuLabel,
        iconProps: {
          iconName: 'Microphone',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onPermitParticipantAudio([participant.userId]),
        'data-ui-id': 'video-tile-unblock-microphone',
        ariaLabel: 'Unblock microphone'
      });
    }
    /* @conditional-compile-remove(media-access) */
    if (participant.mediaAccess?.isAudioPermitted && onForbidParticipantAudio) {
      items.push({
        key: 'forbidParticipantAudio',
        text: strings?.forbidParticipantAudioTileMenuLabel,
        iconProps: {
          iconName: 'ControlButtonMicProhibited',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onForbidParticipantAudio([participant.userId]),
        'data-ui-id': 'video-tile-block-microphone',
        ariaLabel: 'Block microphone'
      });
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
    participant.userId,
    participant.displayName,
    disablePinMenuItem,
    toggleAnnouncerString,
    spotlightedParticipantUserIds,
    isSpotlighted,
    onStartSpotlight,
    onStopSpotlight,
    maxParticipantsToSpotlight,
    myUserId,
    /* @conditional-compile-remove(soft-mute) */ onMuteParticipant,
    /* @conditional-compile-remove(soft-mute) */ participant.isMuted
  ]);

  return contextualMenuProps;
};
