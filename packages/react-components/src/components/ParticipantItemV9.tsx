// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IContextualMenuItem, mergeStyles, PersonaPresence, PersonaSize, Stack } from '@fluentui/react';
import React, { useMemo, useRef, useState } from 'react';
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { OnRenderAvatarCallback } from '../types';
import {
  iconContainerStyle,
  iconStyles,
  meContainerStyle,
  menuButtonContainerStyle,
  participantItemContainerStyle
} from './styles/ParticipantItem.styles';
/* @conditional-compile-remove(one-to-n-calling) */
/* @conditional-compile-remove(PSTN-calls) */
import { ParticipantState } from '../types';
import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger, Persona, Text } from '@fluentui/react-components';

/**
 * Strings of {@link ParticipantItem} that can be overridden.
 *
 * @public
 */
export interface ParticipantItemStrings {
  /** String shown when participant is me */
  isMeText: string;
  /** String shown when hovering over menu button */
  menuTitle: string;
  /** Label for the remove button in participant menu  */
  removeButtonLabel: string;
  /** Label for the sharing icon in participant state stack  */
  sharingIconLabel: string;
  /** Label for the muted icon in participant state stack  */
  mutedIconLabel: string;
  /** placeholder text for participants who does not have a display name*/
  displayNamePlaceholder?: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  /** String shown when `participantState` is `Ringing` */
  participantStateRinging?: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  /** String shown when `participantState` is `Hold` */
  participantStateHold?: string;
}

/**
 * Props for {@link ParticipantItem}.
 *
 * @public
 */
export interface ParticipantItemProps {
  /** Unique User ID of the participant. This `userId` is available in the `onRenderAvatar` callback function */
  userId?: string;
  /** Name of participant. */
  displayName?: string;
  /** Optional indicator to show participant is the user. */
  me?: boolean;
  /** Optional callback returning a JSX element to override avatar. */
  onRenderAvatar?: OnRenderAvatarCallback;
  /** Optional array of IContextualMenuItem for contextual menu. */
  menuItems?: IContextualMenuItem[];
  /** Optional callback returning a JSX element rendered on the right portion of the ParticipantItem. Intended for adding icons. */
  onRenderIcon?: (props?: ParticipantItemProps) => JSX.Element | null;
  /** Optional PersonaPresence to show participant presence. This will not have an effect if property avatar is assigned. */
  presence?: PersonaPresence;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <ParticipantItem styles={{ root: { background: 'blue' } }} />
   * ```
   */
  // styles?: ParticipantItemStyles;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<ParticipantItemStrings>;
  /**
   * Optional callback when component is clicked
   */
  onClick?: (props?: ParticipantItemProps) => void;
  /** prop to determine if we should show tooltip for participants or not */
  showParticipantOverflowTooltip?: boolean;
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Optional value to determine and display a participants connection status.
   * For example, `Connecting`, `Ringing` etc.
   * The actual text that is displayed is determined by the localized string
   * corresponding to the provided participant state.
   * For example, `strings.participantStateConnecting` will be used if `participantState` is `Connecting`.
   */
  participantState?: ParticipantState;
}

/**
 * Component to render a calling or chat participant.
 *
 * Displays the participant's avatar, displayName and status as well as optional icons and context menu.
 *
 * @public
 */
export const ParticipantItemV9 = (props: ParticipantItemProps): JSX.Element => {
  const { displayName, menuItems, onRenderIcon, presence, me, onClick, showParticipantOverflowTooltip } = props;
  const [itemHovered, setItemHovered] = useState<boolean>(false);
  const [itemFocused, setItemFocused] = useState<boolean>(false);
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const localeStrings = useLocale().strings.participantItem;
  const ids = useIdentifiers();

  const strings = { ...localeStrings, ...props.strings };

  // For 'me' show empty name so avatar will get 'Person' icon, when there is no name
  const meAvatarText = displayName?.trim() || '';

  const avatarOptions = {
    text: me ? meAvatarText : displayName?.trim() || strings.displayNamePlaceholder,
    size: PersonaSize.size32,
    presence: presence,
    initialsTextColor: 'white',
    showOverflowTooltip: showParticipantOverflowTooltip,
    showUnknownPersonaCoin: !me && (!displayName?.trim() || displayName === strings.displayNamePlaceholder)
  };

  const meTextStyle = useMemo(
    () => mergeStyles(meContainerStyle, { color: theme.palette.neutralSecondary }),
    [theme.palette.neutralSecondary]
  );
  const infoContainerStyle = useMemo(
    () => mergeStyles(iconContainerStyle, { color: theme.palette.neutralTertiary }),
    [theme.palette.neutralTertiary]
  );

  const menuButton = useMemo(
    () => (
      <Stack
        horizontal={true}
        horizontalAlign="end"
        className={mergeStyles(menuButtonContainerStyle)}
        title={strings.menuTitle}
        data-ui-id={ids.participantItemMenuButton}
      >
        {(itemHovered || itemFocused || !menuHidden) && (
          <Icon iconName={'ParticipantItemOptionsHovered'} className={iconStyles} />
        )}
      </Stack>
    ),
    [strings.menuTitle, ids.participantItemMenuButton, itemHovered, itemFocused, menuHidden]
  );

  const onDismissMenu = (): void => {
    setItemHovered(false);
    setItemFocused(false);
    setMenuHidden(true);
  };

  return (
    <Menu
      positioning="below-end"
      onOpenChange={(e, openChangeData) => {
        openChangeData.open ? setItemHovered(true) : onDismissMenu();
      }}
    >
      <MenuTrigger>
        <div
          ref={containerRef}
          role={'menuitem'}
          data-is-focusable={true}
          data-ui-id="participant-item"
          className={mergeStyles(
            participantItemContainerStyle({
              localparticipant: me,
              clickable: !!menuItems
            })
          )}
          onMouseEnter={() => setItemHovered(true)}
          onMouseLeave={() => setItemHovered(false)}
          onFocus={() => setItemFocused(true)}
          onBlur={() => setItemFocused(false)}
          onClick={() => {
            setItemHovered(true);
            setMenuHidden(false);
            onClick?.(props);
          }}
          tabIndex={0}
        >
          <Stack
            horizontal
            className={mergeStyles({
              width: `calc(100% - ${menuButtonContainerStyle.width})`,
              alignItems: 'center'
            })}
          >
            <Persona
              name={avatarOptions.text}
              presence={{ status: 'available' }}
              avatar={{ color: 'colorful' }}
              textAlignment="center"
            />
            {me && <Text className={meTextStyle}>{strings.isMeText}</Text>}
            <Stack horizontal className={mergeStyles(infoContainerStyle)}>
              {onRenderIcon && onRenderIcon(props)}
            </Stack>
          </Stack>
          <div>{menuItems && menuItems.length > 0 && <>{menuButton}</>}</div>
        </div>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {menuItems?.map((item, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                item.onClick?.();
                onDismissMenu();
              }}
            >
              {item.text}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
