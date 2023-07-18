// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import {
  DefaultButton,
  IContextualMenuItem,
  IContextualMenuProps,
  PrimaryButton,
  Stack,
  useTheme
} from '@fluentui/react';

import { _DrawerMenu, _DrawerMenuItemProps, Announcer } from '@internal/react-components';
import copy from 'copy-to-clipboard';
import { useMemo, useState } from 'react';
/* @conditional-compile-remove(PSTN-calls) */
import { CallWithChatCompositeIcon } from './icons';
import { iconStyles, themedCopyLinkButtonStyles, themedMenuStyle } from './AddPeopleDropdown.styles';
import { CallingDialpad } from './CallingDialpad';
import { CallingDialpadStrings } from './CallingDialpad';
import { _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';
import { copyLinkButtonContainerStyles, copyLinkButtonStackStyles } from './styles/PeoplePaneContent.styles';
import { drawerContainerStyles } from '../CallComposite/styles/CallComposite.styles';
import { convertContextualMenuItemToDrawerMenuItem } from './ConvertContextualMenuItemToDrawerMenuItem';
import { PhoneNumberIdentifier } from '@azure/communication-common';
import { AddPhoneNumberOptions } from '@azure/communication-calling';

/** @private */
export interface AddPeopleDropdownStrings extends CallingDialpadStrings {
  copyInviteLinkButtonLabel: string;
  openDialpadButtonLabel: string;
  peoplePaneAddPeopleButtonLabel: string;
  copyInviteLinkActionedAriaLabel: string;
}

/** @private */
export interface AddPeopleDropdownProps {
  inviteLink?: string;
  mobileView?: boolean;
  strings: AddPeopleDropdownStrings;
  onAddParticipant: (participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions) => void;
  alternateCallerId?: string;
}

/** @private */
export const AddPeopleDropdown = (props: AddPeopleDropdownProps): JSX.Element => {
  const theme = useTheme();

  const { inviteLink, strings, mobileView, onAddParticipant, alternateCallerId } = props;

  const [showDialpad, setShowDialpad] = useState(false);

  const [announcerStrings, setAnnouncerStrings] = useState<string>();

  const menuStyleThemed = useMemo(() => themedMenuStyle(theme), [theme]);

  const copyLinkButtonStylesThemed = useMemo(() => themedCopyLinkButtonStyles(theme, mobileView), [mobileView, theme]);

  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      styles: menuStyleThemed,
      items: [],
      useTargetWidth: true,
      calloutProps: {
        preventDismissOnEvent
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onMenuOpened(contextualMenu?) {
        setAnnouncerStrings(undefined);
      }
    };

    if (inviteLink) {
      menuProps.items.push({
        key: 'InviteLinkKey',
        text: strings.copyInviteLinkButtonLabel,
        itemProps: { styles: copyLinkButtonStylesThemed },
        iconProps: { iconName: 'Link', style: iconStyles },
        onClick: () => {
          setAnnouncerStrings(strings.copyInviteLinkActionedAriaLabel);
          copy(inviteLink);
        }
      });
    }

    // only show the dialpad option when alternateCallerId is set
    if (alternateCallerId) {
      menuProps.items.push({
        key: 'DialpadKey',
        text: strings.openDialpadButtonLabel,
        itemProps: { styles: copyLinkButtonStylesThemed },
        iconProps: { iconName: PeoplePaneOpenDialpadIconNameTrampoline(), style: iconStyles },
        onClick: () => setShowDialpad(true),
        'data-ui-id': 'call-dial-phone-number-button'
      });
    }

    return menuProps;
  }, [
    menuStyleThemed,
    inviteLink,
    alternateCallerId,
    strings.copyInviteLinkButtonLabel,
    strings.copyInviteLinkActionedAriaLabel,
    strings.openDialpadButtonLabel,
    copyLinkButtonStylesThemed
  ]);

  const onDismissDialpad = (): void => {
    setShowDialpad(false);
  };

  const [addPeopleDrawerMenuItems, setAddPeopleDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const setDrawerMenuItemsForAddPeople: () => void = useMemo(() => {
    return () => {
      const drawerMenuItems = defaultMenuProps.items.map((contextualMenu: IContextualMenuItem) =>
        convertContextualMenuItemToDrawerMenuItem(contextualMenu, () => setAddPeopleDrawerMenuItems([]))
      );
      setAddPeopleDrawerMenuItems(drawerMenuItems);
    };
  }, [defaultMenuProps, setAddPeopleDrawerMenuItems]);

  if (mobileView) {
    return (
      <Stack>
        <Announcer ariaLive={'assertive'} announcementString={announcerStrings} />
        {defaultMenuProps.items.length > 0 && (
          <Stack.Item styles={copyLinkButtonContainerStyles}>
            <PrimaryButton
              onClick={setDrawerMenuItemsForAddPeople}
              styles={copyLinkButtonStylesThemed}
              onRenderIcon={() => PeoplePaneAddPersonIconTrampoline()}
              text={strings.peoplePaneAddPeopleButtonLabel}
              data-ui-id="call-add-people-button"
            />
          </Stack.Item>
        )}

        {addPeopleDrawerMenuItems.length > 0 && (
          <Stack styles={drawerContainerStyles()} data-ui-id="call-add-people-dropdown">
            <_DrawerMenu
              disableMaxHeight={true}
              onLightDismiss={() => setAddPeopleDrawerMenuItems([])}
              items={addPeopleDrawerMenuItems}
            />
          </Stack>
        )}
        {alternateCallerId && (
          <CallingDialpad
            isMobile
            strings={strings}
            showDialpad={showDialpad}
            onDismissDialpad={onDismissDialpad}
            onAddParticipant={onAddParticipant}
            alternateCallerId={alternateCallerId}
          />
        )}
      </Stack>
    );
  }

  return (
    <>
      {
        <Stack>
          <Announcer ariaLive={'assertive'} announcementString={announcerStrings} />
          {alternateCallerId && (
            <CallingDialpad
              isMobile={false}
              strings={strings}
              showDialpad={showDialpad}
              onDismissDialpad={onDismissDialpad}
              onAddParticipant={onAddParticipant}
              alternateCallerId={alternateCallerId}
            />
          )}

          {defaultMenuProps.items.length > 0 && (
            <Stack styles={copyLinkButtonStackStyles}>
              <DefaultButton
                onRenderIcon={() => PeoplePaneAddPersonIconTrampoline()}
                text={strings.peoplePaneAddPeopleButtonLabel}
                menuProps={defaultMenuProps}
                styles={copyLinkButtonStylesThemed}
                data-ui-id="call-add-people-button"
              />
            </Stack>
          )}
        </Stack>
      }
    </>
  );
};

function PeoplePaneOpenDialpadIconNameTrampoline(): string {
  /* @conditional-compile-remove(PSTN-calls) */
  return 'PeoplePaneOpenDialpad';

  return '';
}

function PeoplePaneAddPersonIconTrampoline(): JSX.Element {
  /* @conditional-compile-remove(PSTN-calls) */
  return <CallWithChatCompositeIcon iconName="PeoplePaneAddPerson" />;

  return <></>;
}
