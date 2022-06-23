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
  participantItemContainerStyle
} from './styles/ParticipantItem.styles';

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
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const localeStrings = useLocale().strings.participantItem;
  const ids = useIdentifiers();

  const isMeText = props.strings?.isMeText ?? localeStrings.isMeText;
  const menuTitle = props.strings?.menuTitle ?? localeStrings.menuTitle;

  const avatarOptions = {
    text: displayName,
    size: PersonaSize.size32,
    presence: presence,
    initialsTextColor: 'white',
    showOverflowTooltip: showParticipantOverflowTooltip
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
    () => mergeStyles(meContainerStyle, { color: theme.palette.neutralTertiary }, styles?.me),
    [theme.palette.neutralTertiary, styles?.me]
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
        title={menuTitle}
        data-ui-id={ids.participantItemMenuButton}
      >
        <Icon
          iconName={itemHovered ? 'ParticipantItemOptionsHovered' : 'ParticipantItemOptions'}
          className={iconStyles}
        />
      </Stack>
    ),
    [itemHovered, menuTitle, ids.participantItemMenuButton]
  );

  const onDismissMenu = (): void => {
    setItemHovered(false);
    setMenuHidden(true);
  };

  return (
    <div
      ref={containerRef}
      role={'menuitem'}
      data-is-focusable={true}
      className={mergeStyles(
        participantItemContainerStyle({ localparticipant: me, clickable: !!menuItems }),
        styles?.root
      )}
      onMouseEnter={() => setItemHovered(true)}
      onMouseLeave={() => setItemHovered(false)}
      onClick={() => {
        setItemHovered(true);
        setMenuHidden(false);
        onClick?.(props);
      }}
    >
      <Stack
        horizontal
        className={mergeStyles({ width: `calc(100% - ${menuButtonContainerStyle.width})`, alignItems: 'center' })}
      >
        {avatar}
        {me && <Text className={meTextStyle}>{isMeText}</Text>}
        <Stack horizontal className={mergeStyles(infoContainerStyle)}>
          {onRenderIcon && onRenderIcon(props)}
        </Stack>
      </Stack>
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
            }}
          />
        </>
      )}
    </div>
  );
};
