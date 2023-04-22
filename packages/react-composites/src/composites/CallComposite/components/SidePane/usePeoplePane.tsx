// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { useCloseSidePane, useOpenSidePane } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
import { PeoplePaneContent } from '../../../common/PeoplePaneContent';
import { useLocale } from '../../../localization';
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

  const localeStrings = useLocale();

  const onRenderHeader = useCallback(
    () => (
      <SidePaneHeader
        onClose={closePane}
        headingText={localeStrings.strings.call.peoplePaneTitle ?? localeStrings.strings.callWithChat.peoplePaneTitle}
        dismissSidePaneButtonAriaLabel={
          localeStrings.strings.call.dismissSidePaneButtonLabel ??
          localeStrings.strings.callWithChat.dismissSidePaneButtonLabel ??
          ''
        }
        mobileView={mobileView ?? false}
      />
    ),
    [
      mobileView,
      closePane,
      localeStrings.strings.call.peoplePaneTitle,
      localeStrings.strings.call.dismissSidePaneButtonLabel,
      localeStrings.strings.callWithChat.peoplePaneTitle,
      localeStrings.strings.callWithChat.dismissSidePaneButtonLabel
    ]
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
