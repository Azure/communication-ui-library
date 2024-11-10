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
/* @conditional-compile-remove(media-access) */
import { MediaAccess } from '@internal/react-components';

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
  onForbidRemoteParticipantsAudio?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitRemoteParticipantsAudio?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onForbidParticipantVideo?: (userIds: string[]) => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitParticipantVideo?: (userIds: string[]) => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onForbidRemoteParticipantsVideo?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  onPermitRemoteParticipantsVideo?: () => Promise<void>;
  /* @conditional-compile-remove(media-access) */
  mediaAccess?: MediaAccess;
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
    onForbidRemoteParticipantsAudio,
    /* @conditional-compile-remove(media-access) */
    onPermitRemoteParticipantsAudio,
    /* @conditional-compile-remove(media-access) */
    onForbidParticipantVideo,
    /* @conditional-compile-remove(media-access) */
    onPermitParticipantVideo,
    /* @conditional-compile-remove(media-access) */
    onForbidRemoteParticipantsVideo,
    /* @conditional-compile-remove(media-access) */
    onPermitRemoteParticipantsVideo,
    /* @conditional-compile-remove(media-access) */
    mediaAccess
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

  const onMuteAllPromptConfirm = useCallback(() => {
    onMuteAllRemoteParticipants && onMuteAllRemoteParticipants();
    setShowMuteAllPrompt(false);
  }, [onMuteAllRemoteParticipants, setShowMuteAllPrompt]);

  const [showForbidRemoteParticipantsAudioPrompt, setShowForbidRemoteParticipantsAudioPrompt] = React.useState(false);
  const [showPermitRemoteParticipantsAudioPrompt, setShowPermitRemoteParticipantsAudioPrompt] = React.useState(false);
  const [showForbidRemoteParticipantsVideoPrompt, setShowForbidRemoteParticipantsVideoPrompt] = React.useState(false);
  const [showPermitRemoteParticipantsVideoPrompt, setShowPermitRemoteParticipantsVideoPrompt] = React.useState(false);

  const onForbidAllAttendeesPromptConfirm = useCallback(() => {
    onForbidRemoteParticipantsAudio && onForbidRemoteParticipantsAudio();
    setShowForbidRemoteParticipantsAudioPrompt(false);
  }, [onForbidRemoteParticipantsAudio, setShowForbidRemoteParticipantsAudioPrompt]);

  const onPermitAllAttendeesPromptConfirm = useCallback(() => {
    onPermitRemoteParticipantsAudio && onPermitRemoteParticipantsAudio();
    setShowPermitRemoteParticipantsAudioPrompt(false);
  }, [onPermitRemoteParticipantsAudio, setShowPermitRemoteParticipantsAudioPrompt]);

  const onForbidRemoteParticipantsVideoPromptConfirm = useCallback(() => {
    onForbidRemoteParticipantsVideo && onForbidRemoteParticipantsVideo();
    setShowForbidRemoteParticipantsVideoPrompt(false);
  }, [onForbidRemoteParticipantsVideo, setShowForbidRemoteParticipantsVideoPrompt]);

  const onPermitRemoteParticipantsVideoPromptConfirm = useCallback(() => {
    onPermitRemoteParticipantsVideo && onPermitRemoteParticipantsVideo();
    setShowPermitRemoteParticipantsVideoPrompt(false);
  }, [onPermitRemoteParticipantsVideo, setShowPermitRemoteParticipantsVideoPrompt]);

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
    let hasAttendee = false;
    /* @conditional-compile-remove(media-access) */
    if (remoteParticipants) {
      for (const participant of Object.values(remoteParticipants)) {
        if (participant.role && participant.role === 'Attendee') {
          hasAttendee = true;
          break;
        }
      }
    }
    /* @conditional-compile-remove(media-access) */
    const isMeetingAudioPermitted = mediaAccess?.isAudioPermitted;
    /* @conditional-compile-remove(media-access) */
    const isMeetingVideoPermitted = mediaAccess?.isVideoPermitted;
    /* @conditional-compile-remove(media-access) */
    if (onForbidRemoteParticipantsAudio && remoteParticipants) {
      hasAttendee &&
        isMeetingAudioPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-forbid-all-attendees-audio',
          key: 'forbidRemoteParticipantsAudio',
          text: localeStrings.forbidRemoteParticipantsAudioMenuLabel,
          iconProps: {
            iconName: 'ControlButtonMicProhibited',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowForbidRemoteParticipantsAudioPrompt(true);
          },
          ariaLabel: localeStrings.forbidRemoteParticipantsAudioMenuLabel,
          disabled: !hasAttendee
        });
    }
    /* @conditional-compile-remove(media-access) */
    if (onPermitRemoteParticipantsAudio && remoteParticipants) {
      hasAttendee &&
        !isMeetingAudioPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-permit-all-attendees-audio',
          key: 'permitRemoteParticipantsAudio',
          text: localeStrings.permitRemoteParticipantsAudioMenuLabel,
          iconProps: {
            iconName: 'ContextualMenuMicMutedIcon',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowPermitRemoteParticipantsAudioPrompt(true);
          },
          ariaLabel: localeStrings.permitRemoteParticipantsAudioMenuLabel,
          disabled: !hasAttendee
        });
    }

    /* @conditional-compile-remove(media-access) */
    if (onForbidRemoteParticipantsVideo && remoteParticipants) {
      hasAttendee &&
        isMeetingVideoPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-forbid-all-attendees-video',
          key: 'forbidRemoteParticipantsVideo',
          text: localeStrings.forbidRemoteParticipantsVideoMenuLabel,
          iconProps: {
            iconName: 'ControlButtonCameraProhibitedSmall',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowForbidRemoteParticipantsVideoPrompt(true);
          },
          ariaLabel: localeStrings.forbidRemoteParticipantsVideoMenuLabel,
          disabled: !hasAttendee
        });
    }
    /* @conditional-compile-remove(media-access) */
    if (onPermitRemoteParticipantsVideo && remoteParticipants) {
      hasAttendee &&
        !isMeetingVideoPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-permit-all-attendees-video',
          key: 'permitRemoteParticipantsVideo',
          text: localeStrings.permitRemoteParticipantsVideoMenuLabel,
          iconProps: {
            iconName: 'ControlButtonCameraOff',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowPermitRemoteParticipantsVideoPrompt(true);
          },
          ariaLabel: localeStrings.permitRemoteParticipantsVideoMenuLabel,
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
    mediaAccess?.isAudioPermitted,
    mediaAccess?.isVideoPermitted,
    onForbidRemoteParticipantsAudio,
    onPermitRemoteParticipantsAudio,
    onForbidRemoteParticipantsVideo,
    onPermitRemoteParticipantsVideo,
    onStopAllSpotlight,
    spotlightedParticipantUserIds,
    localeStrings.muteAllMenuLabel,
    localeStrings.forbidRemoteParticipantsAudioMenuLabel,
    localeStrings.permitRemoteParticipantsAudioMenuLabel,
    localeStrings.forbidRemoteParticipantsVideoMenuLabel,
    localeStrings.permitRemoteParticipantsVideoMenuLabel,
    localeStrings.stopAllSpotlightMenuLabel
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
      onPermitParticipantAudio,
      onForbidParticipantAudio,
      onPermitParticipantVideo,
      onForbidParticipantVideo,
      onFetchParticipantMenuItems,
      localeStrings.permitParticipantAudioMenuLabel,
      localeStrings.forbidParticipantAudioMenuLabel,
      localeStrings.permitParticipantVideoMenuLabel,
      localeStrings.forbidParticipantVideoMenuLabel,
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
      onStopLocalSpotlight,
      onStopRemoteSpotlight,
      maxParticipantsToSpotlight,
      onStartLocalSpotlight,
      onStartRemoteSpotlight,
      onUnpinParticipant,
      onPinParticipant,
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
            heading={localeStrings.forbidRemoteParticipantsAudioDialogTitle}
            text={localeStrings.forbidRemoteParticipantsAudioDialogContent}
            confirmButtonLabel={localeStrings.forbidRemoteParticipantsAudioConfirmButtonLabel}
            cancelButtonLabel={localeStrings.forbidRemoteParticipantsAudioCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onForbidAllAttendeesPromptConfirm()}
            isOpen={showForbidRemoteParticipantsAudioPrompt}
            onCancel={() => setShowForbidRemoteParticipantsAudioPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.permitRemoteParticipantsAudioDialogTitle}
            text={localeStrings.permitRemoteParticipantsAudioDialogContent}
            confirmButtonLabel={localeStrings.permitRemoteParticipantsAudioConfirmButtonLabel}
            cancelButtonLabel={localeStrings.permitRemoteParticipantsAudioCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onPermitAllAttendeesPromptConfirm()}
            isOpen={showPermitRemoteParticipantsAudioPrompt}
            onCancel={() => setShowForbidRemoteParticipantsAudioPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.forbidRemoteParticipantsVideoDialogTitle}
            text={localeStrings.forbidRemoteParticipantsVideoDialogContent}
            confirmButtonLabel={localeStrings.forbidRemoteParticipantsVideoConfirmButtonLabel}
            cancelButtonLabel={localeStrings.forbidRemoteParticipantsVideoCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onForbidRemoteParticipantsVideoPromptConfirm()}
            isOpen={showForbidRemoteParticipantsVideoPrompt}
            onCancel={() => setShowForbidRemoteParticipantsVideoPrompt(false)}
          />
        }
        {
          /* @conditional-compile-remove(media-access) */
          <Prompt
            heading={localeStrings.permitRemoteParticipantsVideoDialogTitle}
            text={localeStrings.permitRemoteParticipantsVideoDialogContent}
            confirmButtonLabel={localeStrings.permitRemoteParticipantsVideoConfirmButtonLabel}
            cancelButtonLabel={localeStrings.permitRemoteParticipantsVideoCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onPermitRemoteParticipantsVideoPromptConfirm()}
            isOpen={showPermitRemoteParticipantsVideoPrompt}
            onCancel={() => setShowForbidRemoteParticipantsVideoPrompt(false)}
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
    localeStrings.forbidRemoteParticipantsAudioDialogTitle,
    localeStrings.forbidRemoteParticipantsAudioDialogContent,
    localeStrings.forbidRemoteParticipantsAudioConfirmButtonLabel,
    localeStrings.forbidRemoteParticipantsAudioCancelButtonLabel,
    localeStrings.permitRemoteParticipantsAudioDialogTitle,
    localeStrings.permitRemoteParticipantsAudioDialogContent,
    localeStrings.permitRemoteParticipantsAudioConfirmButtonLabel,
    localeStrings.permitRemoteParticipantsAudioCancelButtonLabel,
    localeStrings.forbidRemoteParticipantsVideoDialogTitle,
    localeStrings.forbidRemoteParticipantsVideoDialogContent,
    localeStrings.forbidRemoteParticipantsVideoConfirmButtonLabel,
    localeStrings.forbidRemoteParticipantsVideoCancelButtonLabel,
    localeStrings.permitRemoteParticipantsVideoDialogTitle,
    localeStrings.permitRemoteParticipantsVideoDialogContent,
    localeStrings.permitRemoteParticipantsVideoConfirmButtonLabel,
    localeStrings.permitRemoteParticipantsVideoCancelButtonLabel,
    showForbidRemoteParticipantsAudioPrompt,
    showPermitRemoteParticipantsAudioPrompt,
    showForbidRemoteParticipantsVideoPrompt,
    showPermitRemoteParticipantsVideoPrompt,
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
    onForbidRemoteParticipantsVideoPromptConfirm,
    onPermitRemoteParticipantsVideoPromptConfirm
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
