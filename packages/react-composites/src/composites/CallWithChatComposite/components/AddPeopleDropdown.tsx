// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  DefaultButton,
  IButtonStyles,
  IContextualMenuItem,
  IContextualMenuProps,
  IContextualMenuStyles,
  PrimaryButton,
  Stack,
  useTheme
} from '@fluentui/react';
import { _DrawerMenu, _DrawerMenuItemProps } from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo, useState } from 'react';
import { CallWithChatCompositeIcon } from '../../common/icons';
import { copyLinkButtonContainerStyles, copyLinkButtonStackStyles } from '../../common/styles/PeoplePaneContent.styles';
import { convertContextualMenuItemToDrawerMenuItem } from '../ConvertContextualMenuItemToDrawerMenuItem';
import { drawerContainerStyles } from '../styles/CallWithChatCompositeStyles';
import { iconStyles, themedCopyLinkButtonStyles, themedMenuStyle } from './AddPeopleDropdown.styles';
import { PreparedDialpad, PreparedDialpadStrings } from './PreparedDialpad';

/** @private */
export interface AddPeopleDropdownStrings extends PreparedDialpadStrings {
  copyInviteLinkButtonLabel: string;
  openDialpadButtonLabel: string;
  peoplePaneAddPeopleButtonLabel: string;
}

/** @private */
export interface AddPeopleDropdownProps {
  inviteLink?: string;
  mobileView?: boolean;
  strings: AddPeopleDropdownStrings;
}

/** @private */
export const AddPeopleDropdown = (props: AddPeopleDropdownProps): JSX.Element => {
  const theme = useTheme();

  const { inviteLink, strings, mobileView } = props;
  const [showDialpad, setShowDialpad] = useState(false);

  const menuStyleThemed: Partial<IContextualMenuStyles> = useMemo(() => themedMenuStyle(theme), [theme]);

  const copyLinkButtonStylesThemed = useMemo(
    (): IButtonStyles => themedCopyLinkButtonStyles(mobileView, theme),
    [mobileView, theme]
  );

  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      styles: menuStyleThemed,
      items: [],
      useTargetWidth: true,
      calloutProps: {
        // Disable dismiss on resize to work around a couple Fluent UI bugs
        // - The Callout is dismissed whenever *any child of window (inclusive)* is resized. In practice, this
        //   happens when we change the VideoGallery layout, or even when the video stream element is internally resized
        //   by the headless SDK.
        // - There is a `preventDismissOnEvent` prop that we could theoretically use to only dismiss when the target of
        //   of the 'resize' event is the window itself. But experimentation shows that setting that prop doesn't
        //   deterministically avoid dismissal.
        //
        // A side effect of this workaround is that the context menu stays open when window is resized, and may
        // get detached from original target visually. That bug is preferable to the bug when this value is not set -
        // The Callout (frequently) gets dismissed automatically.
        preventDismissOnResize: true
      }
    };

    if (inviteLink) {
      menuProps.items.push({
        key: 'InviteLinkKey',
        text: strings.copyInviteLinkButtonLabel,
        itemProps: { styles: copyLinkButtonStylesThemed },
        iconProps: { iconName: 'Link', style: iconStyles },
        onClick: () => copy(inviteLink)
      });
    }

    menuProps.items.push({
      key: 'DialpadKey',
      text: strings.openDialpadButtonLabel,
      itemProps: { styles: copyLinkButtonStylesThemed },
      iconProps: { iconName: 'PeoplePaneOpenDialpad', style: iconStyles },
      onClick: () => setShowDialpad(true),
      'data-ui-id': 'call-with-chat-composite-dial-phone-number-button'
    });

    return menuProps;
  }, [
    strings.copyInviteLinkButtonLabel,
    strings.openDialpadButtonLabel,
    copyLinkButtonStylesThemed,
    inviteLink,
    menuStyleThemed
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
        <Stack.Item styles={copyLinkButtonContainerStyles}>
          <PrimaryButton
            onClick={setDrawerMenuItemsForAddPeople}
            styles={copyLinkButtonStylesThemed}
            onRenderIcon={() => <CallWithChatCompositeIcon iconName="PeoplePaneAddPerson" />}
            text={strings.peoplePaneAddPeopleButtonLabel}
            data-ui-id="call-with-chat-composite-add-people-button"
          />
        </Stack.Item>

        {addPeopleDrawerMenuItems.length > 0 && (
          <Stack styles={drawerContainerStyles} data-ui-id="call-with-chat-composite-add-people-dropdown">
            <_DrawerMenu onLightDismiss={() => setAddPeopleDrawerMenuItems([])} items={addPeopleDrawerMenuItems} />
          </Stack>
        )}

        <PreparedDialpad isMobile strings={strings} showDialpad={showDialpad} onDismissDialpad={onDismissDialpad} />
      </Stack>
    );
  }

  return (
    <Stack>
      <PreparedDialpad
        isMobile={false}
        strings={strings}
        showDialpad={showDialpad}
        onDismissDialpad={onDismissDialpad}
      />

      <Stack styles={copyLinkButtonStackStyles}>
        <DefaultButton
          onRenderIcon={() => <CallWithChatCompositeIcon iconName="PeoplePaneAddPerson" />}
          text={strings.peoplePaneAddPeopleButtonLabel}
          menuProps={defaultMenuProps}
          styles={copyLinkButtonStylesThemed}
          data-ui-id="call-with-chat-composite-add-people-button"
        />
      </Stack>
    </Stack>
  );
};
