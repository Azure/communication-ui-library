// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { useCloseSidePane, useOpenSidePane } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
import { PeoplePaneContent } from '../../../common/PeoplePaneContent';
import { CompositeLocale, useLocale } from '../../../localization';
import { ParticipantMenuItemsCallback, _DrawerMenuItemProps } from '@internal/react-components';
import { AvatarPersonaDataCallback } from '../../../common/AvatarPersona';

/** @private */
export const usePeoplePane = (props: {
  setDrawerMenuItems: (items: _DrawerMenuItemProps[]) => void;
  inviteLink?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  mobileView?: boolean;
}): {
  openPeoplePane: () => void;
  closePeoplePane: () => void;
  isPeoplePaneOpen: boolean;
} => {
  const { inviteLink, onFetchAvatarPersonaData, onFetchParticipantMenuItems, setDrawerMenuItems, mobileView } = props;
  const { closePane } = useCloseSidePane();

  const localeStrings = localeTrampoline(useLocale());

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

  const onRenderContent = useCallback((): JSX.Element => {
    return (
      <PeoplePaneContent
        inviteLink={inviteLink}
        onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        setDrawerMenuItems={setDrawerMenuItems}
        mobileView={mobileView}
      />
    );
  }, [inviteLink, mobileView, onFetchAvatarPersonaData, onFetchParticipantMenuItems, setDrawerMenuItems]);

  const { isOpen, openPane } = useOpenSidePane('people', onRenderHeader, onRenderContent);

  return { openPeoplePane: openPane, closePeoplePane: closePane, isPeoplePaneOpen: isOpen };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const localeTrampoline = (locale: CompositeLocale): any => {
  /* @conditional-compile-remove(new-call-control-bar) */
  return locale.strings.call;

  return locale.strings.callWithChat;
};
