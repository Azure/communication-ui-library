// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenu,
  DirectionalHint,
  Icon,
  IContextualMenuItem,
  IStyle,
  mergeStyles,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
  Text
} from '@fluentui/react';
import React, { useMemo, useRef, useState } from 'react';
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles, OnRenderAvatarCallback } from '../types';
import {
  iconContainerStyle,
  iconStyles,
  meContainerStyle,
  menuButtonContainerStyle,
  participantItemContainerStyle,
  participantStateMaxWidth,
  participantStateStringStyles
} from './styles/ParticipantItem.styles';
import { _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';
/* @conditional-compile-remove(one-to-n-calling) */
/* @conditional-compile-remove(PSTN-calls) */
import { ParticipantState } from '../types';
import { _generateUniqueId } from '@internal/acs-ui-common';

/**
 * Fluent styles for {@link ParticipantItem}.
 *
 * @public
 */
export interface ParticipantItemStyles extends BaseCustomStyles {
  /** Styles for the avatar. */
  avatar?: IStyle;
  /** Styles for the (You) string. */
  me?: IStyle;
  /** Styles for the container of the icon. */
  iconContainer?: IStyle;
  /** Styles for the menu. */
  menu?: IStyle;
}

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
  styles?: ParticipantItemStyles;
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
  /**
   * Optional aria property that prefixes the ParticipantItems aria content
   * Takes in a unique id value of the element you would like to be read before the ParticipantItem.
   */
  ariaLabelledBy?: string;
}

/**
 * Component to render a calling or chat participant.
 *
 * Displays the participant's avatar, displayName and status as well as optional icons and context menu.
 *
 * @public
 */
export const ParticipantItem = (props: ParticipantItemProps): JSX.Element => {
  const {
    userId,
    displayName,
    onRenderAvatar,
    menuItems,
    onRenderIcon,
    presence,
    styles,
    me,
    onClick,
    showParticipantOverflowTooltip
  } = props;
  const [itemHovered, setItemHovered] = useState<boolean>(false);
  const [itemFocused, setItemFocused] = useState<boolean>(false);
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const localeStrings = useLocale().strings.participantItem;
  const ids = useIdentifiers();
  const uniqueId = _generateUniqueId();

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

  const avatar = onRenderAvatar ? (
    onRenderAvatar(userId ?? '', avatarOptions)
  ) : (
    <Persona
      className={mergeStyles(
        {
          // Prevents persona text from being vertically truncated if a global line height is less than 1.15.
          lineHeight: '1.15rem'
        },
        styles?.avatar
      )}
      {...avatarOptions}
    />
  );

  const meTextStyle = useMemo(
    () => mergeStyles(meContainerStyle, { color: theme.palette.neutralSecondary }, styles?.me),
    [theme.palette.neutralSecondary, styles?.me]
  );
  const contextualMenuStyle = useMemo(
    () => mergeStyles({ background: theme.palette.neutralLighterAlt }, styles?.menu),
    [theme.palette.neutralLighterAlt, styles?.menu]
  );
  const infoContainerStyle = useMemo(
    () => mergeStyles(iconContainerStyle, { color: theme.palette.neutralTertiary }, styles?.iconContainer),
    [theme.palette.neutralTertiary, styles?.iconContainer]
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
        <Icon
          iconName={
            itemHovered || itemFocused || !menuHidden ? 'ParticipantItemOptionsHovered' : 'ParticipantItemOptions'
          }
          className={iconStyles}
        />
      </Stack>
    ),
    [strings.menuTitle, ids.participantItemMenuButton, itemHovered, itemFocused, menuHidden]
  );

  const onDismissMenu = (): void => {
    setItemHovered(false);
    setItemFocused(false);
    setMenuHidden(true);
  };

  const participantStateString = participantStateStringTrampoline(props, strings);
  return (
    <div
      ref={containerRef}
      role={'menuitem'}
      data-is-focusable={true}
      data-ui-id="participant-item"
      className={mergeStyles(
        participantItemContainerStyle({
          localparticipant: me,
          clickable: !!menuItems && menuItems.length > 0
        }),
        styles?.root
      )}
      onMouseEnter={() => setItemHovered(true)}
      onMouseLeave={() => setItemHovered(false)}
      onFocus={() => setItemFocused(true)}
      onBlur={() => setItemFocused(false)}
      onClick={() => {
        if (!participantStateString) {
          setItemHovered(true);
          setMenuHidden(false);
          onClick?.(props);
        }
      }}
      tabIndex={0}
    >
      <Stack
        horizontal
        className={mergeStyles({
          width: `calc(100% - ${
            !me && participantStateString ? participantStateMaxWidth : menuButtonContainerStyle.width
          })`,
          alignItems: 'center'
        })}
        id={uniqueId}
        aria-labelledby={`${props.ariaLabelledBy} ${uniqueId}`}
      >
        {avatar}
        {me && <Text className={meTextStyle}>{strings.isMeText}</Text>}
        <Stack horizontal className={mergeStyles(infoContainerStyle)}>
          {onRenderIcon && onRenderIcon(props)}
        </Stack>
      </Stack>
      {/* When the participantStateString has a value, we don't show the menu  */}
      {!me && participantStateString ? (
        <Text data-ui-id="participant-item-state-string" className={mergeStyles(participantStateStringStyles)}>
          {participantStateString}
        </Text>
      ) : (
        <div>
          {menuItems && menuItems.length > 0 && (
            <>
              {menuButton}
              <ContextualMenu
                items={menuItems}
                hidden={menuHidden}
                target={containerRef}
                onItemClick={onDismissMenu}
                onDismiss={onDismissMenu}
                directionalHint={DirectionalHint.bottomRightEdge}
                className={contextualMenuStyle}
                calloutProps={{
                  preventDismissOnEvent
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const participantStateStringTrampoline = (
  props: ParticipantItemProps,
  strings: ParticipantItemStrings
): string | undefined => {
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  return props.participantState === 'EarlyMedia' || props.participantState === 'Ringing'
    ? strings?.participantStateRinging
    : props.participantState === 'Hold'
    ? strings?.participantStateHold
    : undefined;

  return undefined;
};
