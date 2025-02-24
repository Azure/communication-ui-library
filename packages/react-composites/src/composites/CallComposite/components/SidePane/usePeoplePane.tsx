// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { SidePaneRenderer, useIsParticularSidePaneOpen } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
import { PeoplePaneContent } from '../../../common/PeoplePaneContent';
import { useLocale } from '../../../localization';
import { ParticipantMenuItemsCallback, _DrawerMenuItemProps, MediaAccess } from '@internal/react-components';
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
  onForbidAudio?: (userIds: string[]) => Promise<void>;
  onPermitAudio?: (userIds: string[]) => Promise<void>;
  onForbidOthersAudio?: () => Promise<void>;
  onPermitOthersAudio?: () => Promise<void>;
  onForbidVideo?: (userIds: string[]) => Promise<void>;
  onPermitVideo?: (userIds: string[]) => Promise<void>;
  onForbidOthersVideo?: () => Promise<void>;
  onPermitOthersVideo?: () => Promise<void>;
  meetingMediaAccess?: MediaAccess;
  sidePaneDismissButtonRef?: RefObject<IButton>;
  chatButtonPresent?: boolean;
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
    onForbidAudio,
    onPermitAudio,
    onForbidOthersAudio,
    onPermitOthersAudio,
    onForbidVideo,
    onPermitVideo,
    onForbidOthersVideo,
    onPermitOthersVideo,
    meetingMediaAccess,
    sidePaneDismissButtonRef,
    chatButtonPresent
  } = props;

  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
    peopleButtonRef?.current?.focus();
  }, [peopleButtonRef, updateSidePaneRenderer]);

  const localeStrings = useLocale().strings.call;
  const remoteParticipants = useSelector(getRemoteParticipants);
  const [showMuteAllPrompt, setShowMuteAllPrompt] = useState(false);
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

  const [showForbidOthersAudioPrompt, setShowForbidOthersAudioPrompt] = useState(false);
  const [showPermitOthersAudioPrompt, setShowPermitOthersAudioPrompt] = useState(false);
  const [showForbidOthersVideoPrompt, setShowForbidOthersVideoPrompt] = useState(false);
  const [showPermitOthersVideoPrompt, setShowPermitOthersVideoPrompt] = useState(false);

  const onForbidAllAttendeesPromptConfirm = useCallback(() => {
    onForbidOthersAudio && onForbidOthersAudio();
    setShowForbidOthersAudioPrompt(false);
  }, [onForbidOthersAudio, setShowForbidOthersAudioPrompt]);

  const onPermitAllAttendeesPromptConfirm = useCallback(() => {
    onPermitOthersAudio && onPermitOthersAudio();
    setShowPermitOthersAudioPrompt(false);
  }, [onPermitOthersAudio, setShowPermitOthersAudioPrompt]);

  const onForbidOthersVideoPromptConfirm = useCallback(() => {
    onForbidOthersVideo && onForbidOthersVideo();
    setShowForbidOthersVideoPrompt(false);
  }, [onForbidOthersVideo, setShowForbidOthersVideoPrompt]);

  const onPermitOthersVideoPromptConfirm = useCallback(() => {
    onPermitOthersVideo && onPermitOthersVideo();
    setShowPermitOthersVideoPrompt(false);
  }, [onPermitOthersVideo, setShowPermitOthersVideoPrompt]);

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

    let hasAttendee = false;
    if (remoteParticipants) {
      for (const participant of Object.values(remoteParticipants)) {
        if (participant.role && participant.role === 'Attendee') {
          hasAttendee = true;
          break;
        }
      }
    }

    const isMeetingAudioPermitted = meetingMediaAccess ? meetingMediaAccess.isAudioPermitted : true;
    const isMeetingVideoPermitted = meetingMediaAccess ? meetingMediaAccess.isVideoPermitted : true;
    if (onForbidOthersAudio && remoteParticipants) {
      hasAttendee &&
        isMeetingAudioPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-forbid-all-attendees-audio',
          key: 'forbidOthersAudio',
          text: localeStrings.forbidOthersAudioMenuLabel,
          iconProps: {
            iconName: 'ControlButtonMicProhibited',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowForbidOthersAudioPrompt(true);
          },
          ariaLabel: localeStrings.forbidOthersAudioMenuLabel,
          disabled: !hasAttendee
        });
    }

    if (onPermitOthersAudio && remoteParticipants) {
      hasAttendee &&
        !isMeetingAudioPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-permit-all-attendees-audio',
          key: 'permitOthersAudio',
          text: localeStrings.permitOthersAudioMenuLabel,
          iconProps: {
            iconName: 'ControlButtonMicOn',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowPermitOthersAudioPrompt(true);
          },
          ariaLabel: localeStrings.permitOthersAudioMenuLabel,
          disabled: !hasAttendee
        });
    }

    if (onForbidOthersVideo && remoteParticipants) {
      hasAttendee &&
        isMeetingVideoPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-forbid-all-attendees-video',
          key: 'forbidOthersVideo',
          text: localeStrings.forbidOthersVideoMenuLabel,
          iconProps: {
            iconName: 'ControlButtonCameraProhibitedSmall',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowForbidOthersVideoPrompt(true);
          },
          ariaLabel: localeStrings.forbidOthersVideoMenuLabel,
          disabled: !hasAttendee
        });
    }

    if (onPermitOthersVideo && remoteParticipants) {
      hasAttendee &&
        !isMeetingVideoPermitted &&
        menuItems.push({
          ['data-ui-id']: 'people-pane-permit-all-attendees-video',
          key: 'permitOthersVideo',
          text: localeStrings.permitOthersVideoMenuLabel,
          iconProps: {
            iconName: 'ControlButtonCameraOn',
            styles: { root: { lineHeight: 0 } }
          },
          onClick: () => {
            setShowPermitOthersVideoPrompt(true);
          },
          ariaLabel: localeStrings.permitOthersVideoMenuLabel,
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
    meetingMediaAccess,
    onForbidOthersAudio,
    onPermitOthersAudio,
    onForbidOthersVideo,
    onPermitOthersVideo,
    onStopAllSpotlight,
    spotlightedParticipantUserIds,
    localeStrings.muteAllMenuLabel,
    localeStrings.forbidOthersAudioMenuLabel,
    localeStrings.permitOthersAudioMenuLabel,
    localeStrings.forbidOthersVideoMenuLabel,
    localeStrings.permitOthersVideoMenuLabel,
    localeStrings.stopAllSpotlightMenuLabel
  ]);

  const onRenderHeader = useCallback(
    () => (
      <SidePaneHeader
        onClose={closePane}
        paneOpenerButton={peopleButtonRef}
        headingText={localeStrings.peoplePaneTitle}
        dismissSidePaneButtonAriaLabel={localeStrings.dismissSidePaneButtonLabel}
        mobileView={mobileView ?? false}
        dismissButtonComponentRef={sidePaneDismissButtonRef}
        chatButtonPresent={chatButtonPresent}
      />
    ),
    [
      closePane,
      peopleButtonRef,
      localeStrings.peoplePaneTitle,
      localeStrings.dismissSidePaneButtonLabel,
      mobileView,
      sidePaneDismissButtonRef,
      chatButtonPresent
    ]
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
          role: 'menuitem',
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

      const remoteParticipant = remoteParticipants?.[participantId];

      if (
        remoteParticipant?.mediaAccess &&
        !remoteParticipant.mediaAccess.isAudioPermitted &&
        remoteParticipant?.role === 'Attendee' &&
        onPermitAudio
      ) {
        _defaultMenuItems.push({
          key: 'permit-audio',
          text: localeStrings.permitAudioMenuLabel,
          role: 'menuitem',
          iconProps: {
            iconName: 'ControlButtonMicOn',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onPermitAudio([participantId]);
          },
          'data-ui-id': 'participant-item-permit-microphone-button',
          ariaLabel: localeStrings.permitAudioMenuLabel
        });
      }

      if (remoteParticipant?.mediaAccess?.isAudioPermitted && remoteParticipant?.role === 'Attendee' && onForbidAudio) {
        _defaultMenuItems.push({
          key: 'forbid-audio',
          text: localeStrings.forbidAudioMenuLabel,
          role: 'menuitem',
          iconProps: {
            iconName: 'ControlButtonMicProhibited',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onForbidAudio([participantId]);
          },
          'data-ui-id': 'participant-item-forbid-microphone-button',
          ariaLabel: localeStrings.forbidAudioMenuLabel
        });
      }

      if (
        remoteParticipant?.mediaAccess &&
        !remoteParticipant.mediaAccess.isVideoPermitted &&
        remoteParticipant?.role === 'Attendee' &&
        onPermitVideo
      ) {
        _defaultMenuItems.push({
          key: 'permit-video',
          text: localeStrings.permitVideoMenuLabel,
          role: 'menuitem',
          iconProps: {
            iconName: 'ControlButtonCameraOn',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onPermitVideo([participantId]);
          },
          'data-ui-id': 'participant-item-permit-camera-button',
          ariaLabel: localeStrings.permitVideoMenuLabel
        });
      }

      if (remoteParticipant?.mediaAccess?.isVideoPermitted && remoteParticipant?.role === 'Attendee' && onForbidVideo) {
        _defaultMenuItems.push({
          key: 'forbid-video',
          text: localeStrings.forbidVideoMenuLabel,
          role: 'menuitem',
          iconProps: {
            iconName: 'ControlButtonCameraProhibitedSmall',
            styles: { root: { lineHeight: '1rem', textAlign: 'center' } }
          },
          onClick: () => {
            onForbidVideo([participantId]);
          },
          'data-ui-id': 'participant-item-forbid-camera-button',
          ariaLabel: localeStrings.forbidVideoMenuLabel
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
            role: 'menuitem',
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
            role: 'menuitem',
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
            role: 'menuitem',
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
            role: 'menuitem',
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
      onPermitAudio,
      onForbidAudio,
      onPermitVideo,
      onForbidVideo,
      onFetchParticipantMenuItems,
      localeStrings.permitAudioMenuLabel,
      localeStrings.forbidAudioMenuLabel,
      localeStrings.permitVideoMenuLabel,
      localeStrings.forbidVideoMenuLabel,
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
          <Prompt
            heading={localeStrings.forbidOthersAudioDialogTitle}
            text={localeStrings.forbidOthersAudioDialogContent}
            confirmButtonLabel={localeStrings.forbidOthersAudioConfirmButtonLabel}
            cancelButtonLabel={localeStrings.forbidOthersAudioCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onForbidAllAttendeesPromptConfirm()}
            isOpen={showForbidOthersAudioPrompt}
            onCancel={() => setShowForbidOthersAudioPrompt(false)}
          />
        }
        {
          <Prompt
            heading={localeStrings.permitOthersAudioDialogTitle}
            text={localeStrings.permitOthersAudioDialogContent}
            confirmButtonLabel={localeStrings.permitOthersAudioConfirmButtonLabel}
            cancelButtonLabel={localeStrings.permitOthersAudioCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onPermitAllAttendeesPromptConfirm()}
            isOpen={showPermitOthersAudioPrompt}
            onCancel={() => setShowForbidOthersAudioPrompt(false)}
          />
        }
        {
          <Prompt
            heading={localeStrings.forbidOthersVideoDialogTitle}
            text={localeStrings.forbidOthersVideoDialogContent}
            confirmButtonLabel={localeStrings.forbidOthersVideoConfirmButtonLabel}
            cancelButtonLabel={localeStrings.forbidOthersVideoCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onForbidOthersVideoPromptConfirm()}
            isOpen={showForbidOthersVideoPrompt}
            onCancel={() => setShowForbidOthersVideoPrompt(false)}
          />
        }
        {
          <Prompt
            heading={localeStrings.permitOthersVideoDialogTitle}
            text={localeStrings.permitOthersVideoDialogContent}
            confirmButtonLabel={localeStrings.permitOthersVideoConfirmButtonLabel}
            cancelButtonLabel={localeStrings.permitOthersVideoCancelButtonLabel}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onPermitOthersVideoPromptConfirm()}
            isOpen={showPermitOthersVideoPrompt}
            onCancel={() => setShowForbidOthersVideoPrompt(false)}
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
    localeStrings.forbidOthersAudioDialogTitle,
    localeStrings.forbidOthersAudioDialogContent,
    localeStrings.forbidOthersAudioConfirmButtonLabel,
    localeStrings.forbidOthersAudioCancelButtonLabel,
    localeStrings.permitOthersAudioDialogTitle,
    localeStrings.permitOthersAudioDialogContent,
    localeStrings.permitOthersAudioConfirmButtonLabel,
    localeStrings.permitOthersAudioCancelButtonLabel,
    localeStrings.forbidOthersVideoDialogTitle,
    localeStrings.forbidOthersVideoDialogContent,
    localeStrings.forbidOthersVideoConfirmButtonLabel,
    localeStrings.forbidOthersVideoCancelButtonLabel,
    localeStrings.permitOthersVideoDialogTitle,
    localeStrings.permitOthersVideoDialogContent,
    localeStrings.permitOthersVideoConfirmButtonLabel,
    localeStrings.permitOthersVideoCancelButtonLabel,
    showForbidOthersAudioPrompt,
    showPermitOthersAudioPrompt,
    showForbidOthersVideoPrompt,
    showPermitOthersVideoPrompt,
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
    onForbidOthersVideoPromptConfirm,
    onPermitOthersVideoPromptConfirm
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
