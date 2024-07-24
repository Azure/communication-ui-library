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
/* @conditional-compile-remove(soft-mute) */
import { getRemoteParticipants } from '../../selectors/baseSelectors';
/* @conditional-compile-remove(soft-mute) */
import { useSelector } from '../../hooks/useSelector';
/* @conditional-compile-remove(soft-mute) */
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
  /* @conditional-compile-remove(soft-mute) */
  onMuteParticipant?: (userId: string) => Promise<void>;
  /* @conditional-compile-remove(soft-mute) */
  onMuteAllRemoteParticipants?: () => Promise<void>;
  pinnedParticipants?: string[];
  onPinParticipant?: (userId: string) => void;
  onUnpinParticipant?: (userId: string) => void;
  disablePinMenuItem?: boolean;
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
    /* @conditional-compile-remove(soft-mute) */
    onMuteParticipant,
    pinnedParticipants,
    onPinParticipant,
    onUnpinParticipant,
    disablePinMenuItem,
    /* @conditional-compile-remove(soft-mute) */
    onMuteAllRemoteParticipants
  } = props;

  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
    peopleButtonRef?.current?.focus();
  }, [peopleButtonRef, updateSidePaneRenderer]);

  const localeStrings = useLocale().strings.call;
  /* @conditional-compile-remove(soft-mute) */
  const remoteParticipants = useSelector(getRemoteParticipants);
  /* @conditional-compile-remove(soft-mute) */
  const [showMuteAllPrompt, setShowMuteAllPrompt] = React.useState(false);
  /* @conditional-compile-remove(soft-mute) */
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

  /* @conditional-compile-remove(soft-mute) */
  const onMuteAllPromptConfirm = useCallback(() => {
    onMuteAllRemoteParticipants && onMuteAllRemoteParticipants();
    setShowMuteAllPrompt(false);
  }, [onMuteAllRemoteParticipants, setShowMuteAllPrompt]);
  
  const sidePaneHeaderMenuProps: IContextualMenuProps = useMemo(() => {
    const menuItems: IContextualMenuItem[] = [];
    /* @conditional-compile-remove(soft-mute) */
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
    onStopAllSpotlight,
    spotlightedParticipantUserIds,
    localeStrings.stopAllSpotlightMenuLabel,
    /* @conditional-compile-remove(soft-mute) */ localeStrings.muteAllMenuLabel,
    /* @conditional-compile-remove(soft-mute) */ onMuteAllRemoteParticipants,
    /* @conditional-compile-remove(soft-mute) */ setShowMuteAllPrompt,
    /* @conditional-compile-remove(soft-mute) */ remoteParticipants
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
    ( participantId: string, myUserId?: string, defaultMenuItems?: IContextualMenuItem[]): IContextualMenuItem[] => {
      let isPinned = pinnedParticipants?.includes(participantId);
      const _defaultMenuItems: IContextualMenuItem[] = [];
      const isSpotlighted = spotlightedParticipantUserIds?.includes(participantId);
      const isMe = myUserId === participantId;
      isPinned = isSpotlighted ? false : isPinned;
      /* @conditional-compile-remove(soft-mute) */
      if (onMuteParticipant && !isMe && remoteParticipants && remoteParticipants) {
        const participant = remoteParticipants[participantId];
        const isMuted = participant.isMuted;
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
      }
      if (defaultMenuItems) {
        _defaultMenuItems.push(...defaultMenuItems);
      }
      return onFetchParticipantMenuItems
        ? onFetchParticipantMenuItems(participantId, myUserId, _defaultMenuItems)
        : _defaultMenuItems;
    },
    [
      spotlightedParticipantUserIds,
      onStartLocalSpotlight,
      onStopLocalSpotlight,
      onStartRemoteSpotlight,
      onStopRemoteSpotlight,
      onFetchParticipantMenuItems,
      /* @conditional-compile-remove(soft-mute) */
      onMuteParticipant,
      /* @conditional-compile-remove(soft-mute) */
      remoteParticipants,
      localeStrings.stopSpotlightMenuLabel,
      localeStrings.stopSpotlightOnSelfMenuLabel,
      localeStrings.addSpotlightMenuLabel,
      localeStrings.startSpotlightMenuLabel,
      localeStrings.spotlightLimitReachedMenuTitle,
      maxParticipantsToSpotlight,
      pinnedParticipants,
      onPinParticipant,
      onUnpinParticipant,
      disablePinMenuItem,
      localeStrings.pinParticipantMenuLabel,
      localeStrings.pinParticipantLimitReachedMenuLabel,
      localeStrings.unpinParticipantMenuLabel,
      localeStrings.unpinParticipantMenuItemAriaLabel,
      localeStrings.pinParticipantMenuItemAriaLabel
    ]
  );

  const onRenderContent = useCallback((): JSX.Element => {
    return (
      <>
        {
          /* @conditional-compile-remove(soft-mute) */
          <Prompt
            {...muteAllPromptLabels}
            styles={{ main: { minWidth: '22.5rem', padding: '1.5rem' } }}
            onConfirm={() => onMuteAllPromptConfirm()}
            isOpen={showMuteAllPrompt}
            onCancel={() => setShowMuteAllPrompt(false)}
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
        />
      </>
    );
  }, [
    inviteLink,
    mobileView,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItemsForCallComposite,
    setDrawerMenuItems,
    setParticipantActioned,
    sidePaneHeaderMenuProps,
    pinnedParticipants,
    /* @conditional-compile-remove(soft-mute) */ showMuteAllPrompt,
    /* @conditional-compile-remove(soft-mute) */ setShowMuteAllPrompt,
    /* @conditional-compile-remove(soft-mute) */ muteAllPromptLabels,
    /* @conditional-compile-remove(soft-mute) */ onMuteAllPromptConfirm
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
