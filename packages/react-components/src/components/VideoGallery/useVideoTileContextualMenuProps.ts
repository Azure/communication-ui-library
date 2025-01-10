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
    muteParticipantMenuItemLabel?: string;
    /* @conditional-compile-remove(media-access) */
    forbidAudioTileMenuLabel?: string;
    /* @conditional-compile-remove(media-access) */
    permitAudioTileMenuLabel?: string;
    /* @conditional-compile-remove(media-access) */
    forbidVideoTileMenuLabel?: string;
    /* @conditional-compile-remove(media-access) */
    permitVideoTileMenuLabel?: string;
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
  onMuteParticipant?: (userId: string) => void;
  /* @conditional-compile-remove(media-access) */
  onForbidAudio?: (userIds: string[]) => void;
  /* @conditional-compile-remove(media-access) */
  onPermitAudio?: (userIds: string[]) => void;
  /* @conditional-compile-remove(media-access) */
  onForbidVideo?: (userIds: string[]) => void;
  /* @conditional-compile-remove(media-access) */
  onPermitVideo?: (userIds: string[]) => void;
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
    onMuteParticipant,
    /* @conditional-compile-remove(media-access) */
    onForbidAudio,
    /* @conditional-compile-remove(media-access) */
    onPermitAudio,
    /* @conditional-compile-remove(media-access) */
    onForbidVideo,
    /* @conditional-compile-remove(media-access) */
    onPermitVideo
  } = props;
  const scalingMode = useMemo(() => {
    return props.participant.videoStream?.scalingMode;
  }, [props.participant.videoStream?.scalingMode]);

  const contextualMenuProps: IContextualMenuProps | undefined = useMemo(() => {
    const items: IContextualMenuItem[] = [];
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

    /* @conditional-compile-remove(media-access) */
    if (
      participant.canAudioBeForbidden &&
      participant.mediaAccess &&
      !participant.mediaAccess.isAudioPermitted &&
      onPermitAudio
    ) {
      items.push({
        key: 'permitAudio',
        text: strings?.permitAudioTileMenuLabel,
        iconProps: {
          iconName: 'ControlButtonMicOn',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onPermitAudio([participant.userId]),
        'data-ui-id': 'video-tile-permit-audio',
        ariaLabel: strings?.permitAudioTileMenuLabel
      });
    }
    /* @conditional-compile-remove(media-access) */
    if (participant.canAudioBeForbidden && participant.mediaAccess?.isAudioPermitted && onForbidAudio) {
      items.push({
        key: 'forbidAudio',
        text: strings?.forbidAudioTileMenuLabel,
        iconProps: {
          iconName: 'ControlButtonMicProhibited',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onForbidAudio([participant.userId]),
        'data-ui-id': 'video-tile-forbid-audio',
        ariaLabel: strings?.forbidAudioTileMenuLabel
      });
    }

    /* @conditional-compile-remove(media-access) */
    if (
      participant.canVideoBeForbidden &&
      participant.mediaAccess &&
      !participant.mediaAccess.isVideoPermitted &&
      onPermitVideo
    ) {
      items.push({
        key: 'permitVideo',
        text: strings?.permitVideoTileMenuLabel,
        iconProps: {
          iconName: 'ControlButtonCameraOn',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onPermitVideo([participant.userId]),
        'data-ui-id': 'video-tile-permit-video',
        ariaLabel: strings?.permitVideoTileMenuLabel
      });
    }
    /* @conditional-compile-remove(media-access) */
    if (participant.canVideoBeForbidden && participant.mediaAccess?.isVideoPermitted && onForbidVideo) {
      items.push({
        key: 'forbidVideo',
        text: strings?.forbidVideoTileMenuLabel,
        iconProps: {
          iconName: 'ControlButtonCameraProhibited',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => onForbidVideo([participant.userId]),
        'data-ui-id': 'video-tile-forbid-video',
        ariaLabel: strings?.forbidVideoTileMenuLabel
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

    return { items, styles: {}, calloutProps: { preventDismissOnEvent }, shouldFocusOnContainer: false };
  }, [
    onMuteParticipant,
    strings,
    participant.isMuted,
    participant.userId,
    participant.displayName,
    isPinned,
    isSpotlighted,
    scalingMode,
    onUnpinParticipant,
    onPinParticipant,
    toggleAnnouncerString,
    disablePinMenuItem,
    myUserId,
    onStopSpotlight,
    spotlightedParticipantUserIds,
    maxParticipantsToSpotlight,
    onStartSpotlight,
    onUpdateScalingMode,
    view,
    /* @conditional-compile-remove(media-access) */
    participant.canAudioBeForbidden,
    /* @conditional-compile-remove(media-access) */
    participant.canVideoBeForbidden,
    /* @conditional-compile-remove(media-access) */
    participant.mediaAccess,
    /* @conditional-compile-remove(media-access) */
    onPermitAudio,
    /* @conditional-compile-remove(media-access) */
    onForbidAudio,
    /* @conditional-compile-remove(media-access) */
    onPermitVideo,
    /* @conditional-compile-remove(media-access) */
    onForbidVideo
  ]);

  return contextualMenuProps;
};
