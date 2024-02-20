// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { RefObject, useCallback, useEffect, useMemo } from 'react';
import { SidePaneRenderer, useIsParticularSidePaneOpen } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
import { PeoplePaneContent } from '../../../common/PeoplePaneContent';
import { useLocale } from '../../../localization';
import { ParticipantMenuItemsCallback, _DrawerMenuItemProps } from '@internal/react-components';
import { AvatarPersonaDataCallback } from '../../../common/AvatarPersona';
import { IButton } from '@fluentui/react';
/* @conditional-compile-remove(spotlight) */
import { IContextualMenuItem } from '@fluentui/react';

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
  /* @conditional-compile-remove(spotlight) */
  spotlightedParticipantUserIds?: string[];
  /* @conditional-compile-remove(spotlight) */
  onStartLocalSpotlight?: () => Promise<void>;
  /* @conditional-compile-remove(spotlight) */
  onStopLocalSpotlight?: () => Promise<void>;
  /* @conditional-compile-remove(spotlight) */
  onStartRemoteSpotlight?: (userIds?: string[]) => Promise<void>;
  /* @conditional-compile-remove(spotlight) */
  onStopRemoteSpotlight?: (userIds?: string[]) => Promise<void>;
  /* @conditional-compile-remove(spotlight) */
  maxParticipantsToSpotlight?: number;
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
    /* @conditional-compile-remove(spotlight) */
    spotlightedParticipantUserIds,
    /* @conditional-compile-remove(spotlight) */
    onStartLocalSpotlight,
    /* @conditional-compile-remove(spotlight) */
    onStopLocalSpotlight,
    /* @conditional-compile-remove(spotlight) */
    onStartRemoteSpotlight,
    /* @conditional-compile-remove(spotlight) */
    onStopRemoteSpotlight,
    /* @conditional-compile-remove(spotlight) */
    maxParticipantsToSpotlight
  } = props;

  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
    peopleButtonRef?.current?.focus();
  }, [peopleButtonRef, updateSidePaneRenderer]);

  const localeStrings = useLocale().strings.call;

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

  /* @conditional-compile-remove(spotlight) */
  const onFetchParticipantMenuItemsForCallComposite = useCallback(
    (participantId: string, myUserId?: string, defaultMenuItems?: IContextualMenuItem[]): IContextualMenuItem[] => {
      const _defaultMenuItems: IContextualMenuItem[] = defaultMenuItems ?? [];
      const isSpotlighted = spotlightedParticipantUserIds?.find((p) => p === participantId);
      const isMe = myUserId === participantId;
      if (isSpotlighted) {
        const stopSpotlightMenuText = isMe
          ? localeStrings.stopSpotlightOnSelfParticipantListMenuLabel
          : localeStrings.stopSpotlightParticipantListMenuLabel;
        const onStopSpotlight = isMe
          ? onStopLocalSpotlight
          : () => {
              onStopRemoteSpotlight?.([participantId]);
            };
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
            ? localeStrings.addSpotlightParticipantListMenuLabel
            : localeStrings.startSpotlightParticipantListMenuLabel;
        const maxSpotlightedParticipantsReached = maxParticipantsToSpotlight
          ? spotlightedParticipantUserIds
            ? spotlightedParticipantUserIds.length >= maxParticipantsToSpotlight
            : false
          : false;
        const onStartSpotlight = isMe
          ? onStartLocalSpotlight
          : () => {
              onStartRemoteSpotlight?.([participantId]);
            };
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
            title: maxSpotlightedParticipantsReached
              ? localeStrings.spotlightLimitReachedParticipantListMenuTitle
              : undefined
          });
        }
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
      localeStrings.stopSpotlightParticipantListMenuLabel,
      localeStrings.stopSpotlightOnSelfParticipantListMenuLabel,
      localeStrings.addSpotlightParticipantListMenuLabel,
      localeStrings.startSpotlightParticipantListMenuLabel,
      localeStrings.spotlightLimitReachedParticipantListMenuTitle,
      maxParticipantsToSpotlight
    ]
  );

  let _onFetchParticipantMenuItems = onFetchParticipantMenuItems;
  /* @conditional-compile-remove(spotlight) */
  _onFetchParticipantMenuItems = onFetchParticipantMenuItemsForCallComposite;

  const onRenderContent = useCallback((): JSX.Element => {
    return (
      <PeoplePaneContent
        inviteLink={inviteLink}
        onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        onFetchParticipantMenuItems={_onFetchParticipantMenuItems}
        setDrawerMenuItems={setDrawerMenuItems}
        mobileView={mobileView}
      />
    );
  }, [inviteLink, mobileView, onFetchAvatarPersonaData, _onFetchParticipantMenuItems, setDrawerMenuItems]);

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
