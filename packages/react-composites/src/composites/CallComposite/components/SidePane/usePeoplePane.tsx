// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { RefObject, useCallback, useEffect, useMemo } from 'react';
import { SidePaneRenderer, useIsParticularSidePaneOpen } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
import { PeoplePaneContent } from '../../../common/PeoplePaneContent';
import { useLocale } from '../../../localization';
import { ParticipantMenuItemsCallback, _DrawerMenuItemProps } from '@internal/react-components';
import { AvatarPersonaDataCallback } from '../../../common/AvatarPersona';
import { IButton, IContextualMenuProps, IContextualMenuItem } from '@fluentui/react';
import { useSelector } from '../../hooks/useSelector';
import { getAlternateCallerId, getRemoteParticipants, getRole } from '../../selectors/baseSelectors';
import { Prompt } from '../Prompt';

const PEOPLE_SIDE_PANE_ID = 'people';

/** @private */
export const usePeoplePane = (props: {
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  setDrawerMenuItems: (items: _DrawerMenuItemProps[]) => void;
  inviteLink?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  mobileView?: boolean;
  peopleButtonRef?: RefObject<IButton>;
  setParticipantActioned?: (userId: string) => void;
  spotlightedParticipantUserIds?: string[];
  onStartLocalSpotlight?: () => Promise<void>;
  onStopLocalSpotlight?: () => Promise<void>;
  onStartRemoteSpotlight?: (userIds: string[]) => Promise<void>;
  onStopRemoteSpotlight?: (userIds: string[]) => Promise<void>;
  onStopAllSpotlight?: () => Promise<void>;
  maxParticipantsToSpotlight?: number;
  onMuteParticipant?: (userId: string) => Promise<void>;
  onMuteAllRemoteParticipants?: () => Promise<void>;
  pinnedParticipants?: string[];
  onPinParticipant?: (userId: string) => void;
  onUnpinParticipant?: (userId: string) => void;
  disablePinMenuItem?: boolean;
  /* @conditional-compile-remove(media-access) */
  onForbidParticipantAudio?: (userIds: string[]) => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitParticipantAudio?: (userIds: string[]) => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onForbidAllAttendeesAudio?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitAllAttendeesAudio?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onForbidParticipantVideo?: (userIds: string[]) => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitParticipantVideo?: (userIds: string[]) => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onForbidAllAttendeesVideo?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitAllAttendeesVideo?: () => Promise<void>;
}): {
  openPeoplePane: () => void;
  closePeoplePane: () => void;
  isPeoplePaneOpen: boolean;
} => {
  const {
    updateSidePaneRenderer,
    inviteLink,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    setDrawerMenuItems,
    mobileView,
    peopleButtonRef,
    setParticipantActioned,
    spotlightedParticipantUserIds,
    onStartLocalSpotlight,
    onStopLocalSpotlight,
    onStartRemoteSpotlight,
    onStopRemoteSpotlight,
    onStopAllSpotlight,
    maxParticipantsToSpotlight,
    onMuteParticipant,
    pinnedParticipants,
    onPinParticipant,
    onUnpinParticipant,
    disablePinMenuItem,
    onMuteAllRemoteParticipants,
    /* @conditional-compile-remove(media-access) */
    onForbidParticipantAudio,
    /* @conditional-compile-remove(media-access) */
    onPermitParticipantAudio,
    /* @conditional-compile-remove(media-access) */
    onForbidAllAttendeesAudio,
    /* @conditional-compile-remove(media-access) */
    onPermitAllAttendeesAudio,
    /* @conditional-compile-remove(media-access) */
    onForbidParticipantVideo,
    /* @conditional-compile-remove(media-access) */
    onPermitParticipantVideo,
    /* @conditional-compile-remove(media-access) */
    onForbidAllAttendeesVideo,
    /* @conditional-compile-remove(media-access) */
    onPermitAllAttendeesVideo
  } = props;

  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
    peopleButtonRef?.current?.focus();
  }, [peopleButtonRef, updateSidePaneRenderer]);

  const localeStrings = useLocale().strings.call;
  const remoteParticipants = useSelector(getRemoteParticipants);
  const [showMuteAllPrompt, setShowMuteAllPrompt] = React.useState(false);
  const muteAllPromptLabels = useMemo(
    () => ({
      confirmButtonLabel: localeStrings.muteAllConfirmButtonLabel,
      heading: localeStrings.muteAllDialogTitle,
      text: localeStrings.muteAllDialogContent,
      cancelButtonLabel: localeStrings.muteAllCancelButtonLabel
    }),
    [
      localeStrings.muteAllConfirmButtonLabel,
      localeStrings.muteAllDialogTitle,
      localeStrings.muteAllDialogContent,
      localeStrings.muteAllCancelButtonLabel
    ]
  );

  const [showForbidAllAttendeesAudioPrompt, setShowForbidAllAttendeesAudioPrompt] = React.useState(false);
  const [showPermitAllAttendeesAudioPrompt, setShowPermitAllAttendeesAudioPrompt] = React.useState(false);
  const [showForbidAllAttendeesVideoPrompt, setShowForbidAllAttendeesVideoPrompt] = React.useState(false);
  const [showPermitAllAttendeesVideoPrompt, setShowPermitAllAttendeesVideoPrompt] = React.useState(false);

  /* @conditional-compile-remove(soft-mute) */
  const onMuteAllPromptConfirm = useCallback(() => {
    onMuteAllRemoteParticipants && onMuteAllRemoteParticipants();
    setShowMuteAllPrompt(false);
  }, [onMuteAllRemoteParticipants, setShowMuteAllPrompt]);

  const onForbidAllAttendeesPromptConfirm = useCallback(() => {
    onForbidAllAttendeesAudio && onForbidAllAttendeesAudio();
    setShowForbidAllAttendeesAudioPrompt(false);
  }, [onForbidAllAttendeesAudio, setShowForbidAllAttendeesAudioPrompt]);

  const onPermitAllAttendeesPromptConfirm = useCallback(() => {
    onPermitAllAttendeesAudio && onPermitAllAttendeesAudio();
    setShowPermitAllAttendeesAudioPrompt(false);
  }, [onPermitAllAttendeesAudio, setShowPermitAllAttendeesAudioPrompt]);

  const onForbidAllAttendeesVideoPromptConfirm = useCallback(() => {
    onForbidAllAttendeesVideo && onForbidAllAttendeesVideo();
    setShowForbidAllAttendeesVideoPrompt(false);
  }, [onForbidAllAttendeesVideo, setShowForbidAllAttendeesVideoPrompt]);

  const onPermitAllAttendeesVideoPromptConfirm = useCallback(() => {
    onPermitAllAttendeesVideo && onPermitAllAttendeesVideo();
    setShowPermitAllAttendeesVideoPrompt(false);
  }, [onPermitAllAttendeesVideo, setShowPermitAllAttendeesVideoPrompt]);

  const sidePaneHeaderMenuProps: IContextualMenuProps = useMemo(() => {
    const menuItems: IContextualMenuItem[] = [];
    if (onMuteAllRemoteParticipants && remoteParticipants) {
      let isAllMuted = true;
      if (remoteParticipants) {
        for (const participant of Object.values(remoteParticipants)) {
          if (!participant.isMuted) {
            isAllMuted = false;
            break;
          }
        }
      }
      menuItems.push({
        ['data-ui-id']: 'people-pane-mute-all-remote-participants',
        key: 'muteAllRemoteParticipants',
        text: localeStrings.muteAllMenuLabel,
        iconProps: {
          iconName: 'ContextualMenuMicMutedIcon',
          styles: { root: { lineHeight: 0 } }
        },
        onClick: () => {
          setShowMuteAllPrompt(true);
        },
        ariaLabel: localeStrings.muteAllMenuLabel,
        disabled: isAllMuted
      });
    }
    /* @conditional-compile-remove(media-access) */
    if (onForbidAllAttendeesAudio && remoteParticipants) {
      let hasAttendee = false;
      if (remoteParticipants) {
        for (const participant of Object.values(remoteParticipants)) {
          if (participant.role && participant.role === 'Attendee' && participant.mediaAccess?.isAudioPermitted) {
            hasAttendee = true;
            break;
          }
        }
      }
      hasAttendee &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-forbid-all-attendees-audio',
          key: 'forbidAllAttendeesAudio',
          text: localeStrings.forbidAllAttendeesAudioMenuLabel,
          iconProps: {
            iconName: 'ControlButtonMicProhibited', // ControlButtonMicProhibited
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowForbidAllAttendeesAudioPrompt(true);
          },
          ariaLabel: localeStrings.forbidAllAttendeesAudioMenuLabel,
          disabled: !hasAttendee
        });
    }
    /* @conditional-compile-remove(media-access) */
    if (onPermitAllAttendeesAudio && remoteParticipants) {
      let hasAttendee = false;
      if (remoteParticipants) {
        for (const participant of Object.values(remoteParticipants)) {
          if (participant.role && participant.role === 'Attendee' && !participant.mediaAccess?.isAudioPermitted) {
            hasAttendee = true;
            break;
          }
        }
      }
      hasAttendee &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-permit-all-attendees-audio',
          key: 'permitAllAttendeesAudio',
          text: localeStrings.permitAllAttendeesAudioMenuLabel,
          iconProps: {
            iconName: 'ContextualMenuMicMutedIcon',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowPermitAllAttendeesAudioPrompt(true);
          },
          ariaLabel: localeStrings.permitAllAttendeesAudioMenuLabel,
          disabled: !hasAttendee
        });
    }

    /* @conditional-compile-remove(media-access) */
    if (onForbidAllAttendeesVideo && remoteParticipants) {
      let hasAttendee = false;
      if (remoteParticipants) {
        for (const participant of Object.values(remoteParticipants)) {
          if (participant.role && participant.role === 'Attendee' && participant.mediaAccess?.isVideoPermitted) {
            hasAttendee = true;
            break;
          }
        }
      }
      hasAttendee &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-forbid-all-attendees-video',
          key: 'forbidAllAttendeesVideo',
          text: localeStrings.forbidAllAttendeesVideoMenuLabel,
          iconProps: {
            iconName: 'ControlButtonCameraProhibitedSmall',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowForbidAllAttendeesVideoPrompt(true);
          },
          ariaLabel: localeStrings.forbidAllAttendeesVideoMenuLabel,
          disabled: !hasAttendee
        });
    }
    /* @conditional-compile-remove(media-access) */
    if (onPermitAllAttendeesVideo && remoteParticipants) {
      let hasAttendee = false;
      if (remoteParticipants) {
        for (const participant of Object.values(remoteParticipants)) {
          if (participant.role && participant.role === 'Attendee' && !participant.mediaAccess?.isVideoPermitted) {
            hasAttendee = true;
            break;
          }
        }
      }
      hasAttendee &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-permit-all-attendees-video',
          key: 'permitAllAttendeesVideo',
          text: localeStrings.permitAllAttendeesVideoMenuLabel,
          iconProps: {
            iconName: 'ContextualMenuCameraOff',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowPermitAllAttendeesVideoPrompt(true);
          },
          ariaLabel: localeStrings.permitAllAttendeesVideoMenuLabel,
          disabled: !hasAttendee
        });
    }

    if (onStopAllSpotlight && spotlightedParticipantUserIds && spotlightedParticipantUserIds.length > 0) {
      menuItems.push({
        key: 'stopAllSpotlightKey',
        text: localeStrings.stopAllSpotlightMenuLabel,
        iconProps: { iconName: 'StopAllSpotlightMenuButton', styles: { root: { lineHeight: 0 } } },
        onClick: () => {
          onStopAllSpotlight();
        },
        ariaLabel: localeStrings.stopAllSpotlightMenuLabel
      });
    }
    return {
      items: menuItems
    };
  }, [
    onMuteAllRemoteParticipants,
    remoteParticipants,
    onForbidAllAttendeesAudio,
    onPermitAllAttendeesAudio,
    onForbidAllAttendeesVideo,
    onPermitAllAttendeesVideo,
    onStopAllSpotlight,
    spotlightedParticipantUserIds,
    localeStrings.muteAllMenuLabel,
    localeStrings.forbidAllAttendeesAudioMenuLabel,
    localeStrings.permitAllAttendeesAudioMenuLabel,
    localeStrings.forbidAllAttendeesVideoMenuLabel,
    localeStrings.permitAllAttendeesVideoMenuLabel,
    localeStrings.stopAllSpotlightMenuLabel,
    setShowMuteAllPrompt
  ]);

  const onRenderHeader = useCallback(
    () => (
      <SidePaneHeader
        onClose={closePane}
        headingText={localeStrings.peoplePaneTitle}
        dismissSidePaneButtonAriaLabel={localeStrings.dismissSidePaneButtonLabel}
        mobileView={mobileView ?? false}
      />
    ),
    [mobileView, closePane, localeStrings]
  );

  const onFetchParticipantMenuItemsForCallComposite = useCallback(
    (participantId: string, myUserId?: string, defaultMenuItems?: IContextualMenuItem[]): IContextualMenuItem[] => {
      let isPinned = pinnedParticipants?.includes(participantId);
      const _defaultMenuItems: IContextualMenuItem[] = [];
      const isSpotlighted = spotlightedParticipantUserIds?.includes(participantId);
      const isMe = myUserId === participantId;
      isPinned = isSpotlighted ? false : isPinned;
      if (onMuteParticipant && !isMe && remoteParticipants && remoteParticipants[participantId]) {
        const participant = remoteParticipants[participantId];
        const isMuted = !!participant?.isMuted;
        _defaultMenuItems.push({
          key: 'mute',
          text: 'Mute',
          iconProps: {
            iconName: 'ContextualMenuMicMutedIcon',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            onMuteParticipant(participantId);
          },
          'data-ui-id': 'participant-item-mute-participant',
          ariaLabel: 'Mute',
          disabled: isMuted
        });
      }
      if (isSpotlighted) {
        const stopSpotlightMenuText = isMe
          ? localeStrings.stopSpotlightOnSelfMenuLabel
          : localeStrings.stopSpotlightMenuLabel;
        const onStopSpotlight = isMe
          ? onStopLocalSpotlight
          : onStopRemoteSpotlight
            ? () => {
                onStopRemoteSpotlight([participantId]);
              }
            : undefined;
        if (onStopSpotlight && stopSpotlightMenuText) {
          _defaultMenuItems.push({
            key: 'stop-spotlight',
            text: stopSpotlightMenuText,
            onClick: onStopSpotlight,
            iconProps: {
              iconName: 'StopSpotlightContextualMenuItem',
              styles: { root: { lineHeight: 0 } }
            },
            ariaLabel: stopSpotlightMenuText
          });
        }
      } else {
        const startSpotlightMenuText =
          spotlightedParticipantUserIds && spotlightedParticipantUserIds.length > 0
            ? localeStrings.addSpotlightMenuLabel
            : localeStrings.startSpotlightMenuLabel;
        const maxSpotlightedParticipantsReached = maxParticipantsToSpotlight
          ? spotlightedParticipantUserIds
            ? spotlightedParticipantUserIds.length >= maxParticipantsToSpotlight
            : false
          : false;
        const onStartSpotlight = isMe
          ? onStartLocalSpotlight
          : onStartRemoteSpotlight
            ? () => {
                onStartRemoteSpotlight([participantId]);
              }
            : undefined;
        if (onStartSpotlight && startSpotlightMenuText) {
          _defaultMenuItems.push({
            key: 'start-spotlight',
            text: startSpotlightMenuText,
            onClick: onStartSpotlight,
            iconProps: {
              iconName: 'StartSpotlightContextualMenuItem',
              styles: { root: { lineHeight: 0 } }
            },
            ariaLabel: startSpotlightMenuText,
            disabled: maxSpotlightedParticipantsReached,
            title: maxSpotlightedParticipantsReached ? localeStrings.spotlightLimitReachedMenuTitle : undefined
          });
        }
      }
      if (!isMe && isPinned !== undefined) {
        if (isPinned && onUnpinParticipant && localeStrings?.unpinParticipantMenuLabel) {
          _defaultMenuItems.push({
            key: 'unpin',
            text: localeStrings?.unpinParticipantMenuLabel,
            iconProps: {
              iconName: 'UnpinParticipant',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              onUnpinParticipant?.(participantId);
            },
            'data-ui-id': 'participant-item-unpin-participant-button',
            ariaLabel: localeStrings.unpinParticipantMenuItemAriaLabel
          });
        }
        if (!isPinned && onPinParticipant && localeStrings?.pinParticipantMenuLabel) {
          _defaultMenuItems.push({
            key: 'pin',
            text: disablePinMenuItem
              ? localeStrings.pinParticipantLimitReachedMenuLabel
              : localeStrings.pinParticipantMenuLabel,
            iconProps: {
              iconName: 'PinParticipant',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              onPinParticipant(participantId);
            },
            'data-ui-id': 'participant-item-pin-participant-button',
            disabled: disablePinMenuItem || isSpotlighted,
            ariaLabel: localeStrings.pinParticipantMenuItemAriaLabel
          });
        }
        /* @conditional-compile-remove(media-access) */
        const remoteParticipant = remoteParticipants?.[participantId];
        /* @conditional-compile-remove(media-access) */
        if (
          !remoteParticipant?.mediaAccess?.isAudioPermitted &&
          remoteParticipant?.role === 'Attendee' &&
          onPermitParticipantAudio
        ) {
          _defaultMenuItems.push({
            key: 'permit-audio',
            text: localeStrings.permitParticipantAudioMenuLabel,
            iconProps: {
              iconName: 'ContextualMenuMicMutedIcon',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              onPermitParticipantAudio([participantId]);
            },
            'data-ui-id': 'participant-item-permit-microphone-button',
            ariaLabel: localeStrings.permitParticipantAudioMenuLabel
          });
        }
        /* @conditional-compile-remove(media-access) */
        if (
          remoteParticipant?.mediaAccess?.isAudioPermitted &&
          remoteParticipant?.role === 'Attendee' &&
          onForbidParticipantAudio
        ) {
          _defaultMenuItems.push({
            key: 'forbid-audio',
            text: localeStrings.forbidParticipantAudioMenuLabel,
            iconProps: {
              iconName: 'ControlButtonMicProhibited',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              onForbidParticipantAudio([participantId]);
            },
            'data-ui-id': 'participant-item-forbid-microphone-button',
            ariaLabel: localeStrings.forbidParticipantAudioMenuLabel
          });
        }
        /* @conditional-compile-remove(media-access) */
        if (
          !remoteParticipant?.mediaAccess?.isVideoPermitted &&
          remoteParticipant?.role === 'Attendee' &&
          onPermitParticipantVideo
        ) {
          _defaultMenuItems.push({
            key: 'permit-video',
            text: localeStrings.permitParticipantVideoMenuLabel,
            iconProps: {
              iconName: 'ControlButtonCameraOff',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              onPermitParticipantVideo([participantId]);
            },
            'data-ui-id': 'participant-item-permit-camera-button',
            ariaLabel: localeStrings.permitParticipantVideoMenuLabel
          });
        }
        /* @conditional-compile-remove(media-access) */
        if (
          remoteParticipant?.mediaAccess?.isVideoPermitted &&
          remoteParticipant?.role === 'Attendee' &&
          onForbidParticipantVideo
        ) {
          _defaultMenuItems.push({
            key: 'forbid-video',
            text: localeStrings.forbidParticipantVideoMenuLabel,
            iconProps: {
              iconName: 'ControlButtonCameraProhibitedSmall',
              styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
            },
            onClick: () => {
              onForbidParticipantVideo([participantId]);
            },
            'data-ui-id': 'participant-item-forbid-camera-button',
            ariaLabel: localeStrings.forbidParticipantVideoMenuLabel
          });
        }
      }

      if (defaultMenuItems) {
        _defaultMenuItems.push(...defaultMenuItems);
      }
      return onFetchParticipantMenuItems
        ? onFetchParticipantMenuItems(participantId, myUserId, _defaultMenuItems)
        : _defaultMenuItems;
    },
    [
      pinnedParticipants,
      spotlightedParticipantUserIds,
      onMuteParticipant,
      remoteParticipants,
      onFetchParticipantMenuItems,
      localeStrings.stopSpotlightOnSelfMenuLabel,
      localeStrings.stopSpotlightMenuLabel,
      localeStrings.addSpotlightMenuLabel,
      localeStrings.startSpotlightMenuLabel,
      localeStrings.spotlightLimitReachedMenuTitle,
      localeStrings?.unpinParticipantMenuLabel,
      localeStrings.pinParticipantMenuLabel,
      localeStrings.unpinParticipantMenuItemAriaLabel,
      localeStrings.pinParticipantLimitReachedMenuLabel,
      localeStrings.pinParticipantMenuItemAriaLabel,
      localeStrings.permitParticipantAudioMenuLabel,
      localeStrings.forbidParticipantAudioMenuLabel,
      localeStrings.permitParticipantVideoMenuLabel,
      localeStrings.forbidParticipantVideoMenuLabel,
      onStopLocalSpotlight,
      onStopRemoteSpotlight,
      maxParticipantsToSpotlight,
      onStartLocalSpotlight,
      onStartRemoteSpotlight,
      onUnpinParticipant,
      onPinParticipant,
      onPermitParticipantAudio,
      onForbidParticipantAudio,
      onPermitParticipantVideo,
      onForbidParticipantVideo,
      disablePinMenuItem
    ]
  );

  const role = useSelector(getRole);
  const alternateCallerId = useSelector(getAlternateCallerId);

  const onRenderContent = useCallback((): JSX.Element => {
    return (
      <>
        {
          <Prompt
            {...muteAllPromptLabels}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onMuteAllPromptConfirm()}
            isOpen={showMuteAllPrompt}
            onCancel={() => setShowMuteAllPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.forbidAllAttendeesAudioDialogTitle}
            text={localeStrings.forbidAllAttendeesAudioDialogContent}
            confirmButtonLabel={localeStrings.forbidAllAttendeesAudioConfirmButtonLabel}
            cancelButtonLabel={localeStrings.forbidAllAttendeesAudioCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onForbidAllAttendeesPromptConfirm()}
            isOpen={showForbidAllAttendeesAudioPrompt}
            onCancel={() => setShowForbidAllAttendeesAudioPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.permitAllAttendeesAudioDialogTitle}
            text={localeStrings.permitAllAttendeesAudioDialogContent}
            confirmButtonLabel={localeStrings.permitAllAttendeesAudioConfirmButtonLabel}
            cancelButtonLabel={localeStrings.permitAllAttendeesAudioCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onPermitAllAttendeesPromptConfirm()}
            isOpen={showPermitAllAttendeesAudioPrompt}
            onCancel={() => setShowForbidAllAttendeesAudioPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.forbidAllAttendeesVideoDialogTitle}
            text={localeStrings.forbidAllAttendeesVideoDialogContent}
            confirmButtonLabel={localeStrings.forbidAllAttendeesVideoConfirmButtonLabel}
            cancelButtonLabel={localeStrings.forbidAllAttendeesVideoCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onForbidAllAttendeesVideoPromptConfirm()}
            isOpen={showForbidAllAttendeesVideoPrompt}
            onCancel={() => setShowForbidAllAttendeesVideoPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.permitAllAttendeesVideoDialogTitle}
            text={localeStrings.permitAllAttendeesVideoDialogContent}
            confirmButtonLabel={localeStrings.permitAllAttendeesVideoConfirmButtonLabel}
            cancelButtonLabel={localeStrings.permitAllAttendeesVideoCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onPermitAllAttendeesVideoPromptConfirm()}
            isOpen={showPermitAllAttendeesVideoPrompt}
            onCancel={() => setShowForbidAllAttendeesVideoPrompt(false)}
          />
        }
        <PeoplePaneContent
          inviteLink={inviteLink}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItemsForCallComposite}
          setDrawerMenuItems={setDrawerMenuItems}
          mobileView={mobileView}
          setParticipantActioned={setParticipantActioned}
          participantListHeadingMoreButtonProps={sidePaneHeaderMenuProps}
          pinnedParticipants={pinnedParticipants}
          role={role}
          alternateCallerId={alternateCallerId}
        />
      </>
    );
  }, [
    muteAllPromptLabels,
    showMuteAllPrompt,
    localeStrings.forbidAllAttendeesAudioDialogTitle,
    localeStrings.forbidAllAttendeesAudioDialogContent,
    localeStrings.forbidAllAttendeesAudioConfirmButtonLabel,
    localeStrings.forbidAllAttendeesAudioCancelButtonLabel,
    localeStrings.permitAllAttendeesAudioDialogTitle,
    localeStrings.permitAllAttendeesAudioDialogContent,
    localeStrings.permitAllAttendeesAudioConfirmButtonLabel,
    localeStrings.permitAllAttendeesAudioCancelButtonLabel,
    localeStrings.forbidAllAttendeesVideoDialogTitle,
    localeStrings.forbidAllAttendeesVideoDialogContent,
    localeStrings.forbidAllAttendeesVideoConfirmButtonLabel,
    localeStrings.forbidAllAttendeesVideoCancelButtonLabel,
    localeStrings.permitAllAttendeesVideoDialogTitle,
    localeStrings.permitAllAttendeesVideoDialogContent,
    localeStrings.permitAllAttendeesVideoConfirmButtonLabel,
    localeStrings.permitAllAttendeesVideoCancelButtonLabel,
    showForbidAllAttendeesAudioPrompt,
    showPermitAllAttendeesAudioPrompt,
    showForbidAllAttendeesVideoPrompt,
    showPermitAllAttendeesVideoPrompt,
    inviteLink,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItemsForCallComposite,
    setDrawerMenuItems,
    mobileView,
    setParticipantActioned,
    sidePaneHeaderMenuProps,
    pinnedParticipants,
    role,
    alternateCallerId,
    onMuteAllPromptConfirm,
    onForbidAllAttendeesPromptConfirm,
    onPermitAllAttendeesPromptConfirm,
    onForbidAllAttendeesVideoPromptConfirm,
    onPermitAllAttendeesVideoPromptConfirm,
    setShowMuteAllPrompt
  ]);

  const sidePaneRenderer: SidePaneRenderer = useMemo(
    () => ({
      headerRenderer: onRenderHeader,
      contentRenderer: onRenderContent,
      id: PEOPLE_SIDE_PANE_ID
    }),
    [onRenderContent, onRenderHeader]
  );

  const openPane = useCallback(() => {
    updateSidePaneRenderer(sidePaneRenderer);
  }, [sidePaneRenderer, updateSidePaneRenderer]);

  const isOpen = useIsParticularSidePaneOpen(PEOPLE_SIDE_PANE_ID);

  // Update pane renderer if it is open and the openPane dep changes
  useEffect(() => {
    if (isOpen) {
      openPane();
    }
  }, [isOpen, openPane]);

  return { openPeoplePane: openPane, closePeoplePane: closePane, isPeoplePaneOpen: isOpen };
};
