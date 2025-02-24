// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
  displayNoneStyle,
  iconContainerStyle,
  iconStyles,
  meContainerStyle,
  menuButtonContainerStyle,
  participantItemContainerStyle,
  participantStateStringStyles
} from './styles/ParticipantItem.styles';
import { _formatString, _preventDismissOnEvent as preventDismissOnEvent } from '@internal/acs-ui-common';
import { ParticipantState } from '../types';
import { useId } from '@fluentui/react-hooks';

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
  /** Label for the raised hand icon in participant state stack  */
  handRaisedIconLabel?: string;
  /** placeholder text for participants who does not have a display name*/
  displayNamePlaceholder?: string;
  /** String shown when `participantState` is `Ringing` */
  participantStateRinging?: string;
  /** String shown when `participantState` is `Hold` */
  participantStateHold?: string;
  /** Aria Label applied to the base element of the `participantItem` */
  participantItemAriaLabel?: string;
  /** Aria Label applied to the base element of the `participantItem` when there are more options present */
  participantItemWithMoreOptionsAriaLabel?: string;
  /** String for the attendee role */
  attendeeRole: string;
  /** Label for the disabled microphone icon in participant state stack  */
  micDisabledIconLabel: string;
  /** Label for the disabled camera icon in participant state stack  */
  cameraDisabledIconLabel: string;
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
  /** Optional value to determine if the tooltip should be shown for participants or not */
  showParticipantOverflowTooltip?: boolean;
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
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const localeStrings = useLocale().strings.participantItem;
  const ids = useIdentifiers();
  const participantItemId = useId();
  const participantItemFlyoutId = useId();
  const hasFlyout = !!(menuItems && menuItems?.length > 0);

  const strings = { ...localeStrings, ...props.strings };
  const participantStateString = formatParticipantStateString(props, strings);

  const showMenuIcon = !participantStateString && (itemHovered || !menuHidden) && hasFlyout;

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
    () =>
      mergeStyles(
        iconContainerStyle,
        { color: theme.palette.neutralSecondary, marginLeft: 'auto' },
        styles?.iconContainer
      ),
    [theme.palette.neutralSecondary, styles?.iconContainer]
  );

  const onDismissMenu = (): void => {
    setItemHovered(false);
    setMenuHidden(true);
  };

  const menuButton = useMemo(
    () => (
      <Stack
        horizontal={true}
        horizontalAlign="end"
        className={mergeStyles(menuButtonContainerStyle, { color: theme.palette.neutralPrimary })}
        title={strings.menuTitle}
        aria-controls={participantItemFlyoutId}
        data-ui-id={ids.participantItemMenuButton}
      >
        <Icon
          iconName="ParticipantItemOptionsHovered"
          className={mergeStyles(iconStyles, !showMenuIcon ? displayNoneStyle : {})}
        />
      </Stack>
    ),
    [
      theme.palette.neutralPrimary,
      strings.menuTitle,
      participantItemFlyoutId,
      ids.participantItemMenuButton,
      showMenuIcon
    ]
  );

  return (
    <div
      ref={containerRef}
      role={'menuitem'}
      id={participantItemId}
      aria-label={
        (hasFlyout ? props.strings?.participantItemWithMoreOptionsAriaLabel : undefined) ??
        props.strings?.participantItemAriaLabel
      }
      aria-labelledby={`${props.ariaLabelledBy} ${participantItemId}`}
      aria-expanded={!menuHidden}
      aria-disabled={hasFlyout || props.onClick ? false : true}
      aria-haspopup={hasFlyout ? true : undefined}
      aria-controls={participantItemFlyoutId}
      data-is-focusable={hasFlyout}
      data-ui-id="participant-item"
      className={mergeStyles(participantItemContainerStyle({ clickable: hasFlyout }, theme), styles?.root)}
      onMouseEnter={() => setItemHovered(true)}
      onMouseLeave={() => setItemHovered(false)}
      onClick={() => {
        if (!participantStateString) {
          setItemHovered(true);
          setMenuHidden(false);
          onClick?.(props);
        }
        if (!menuHidden) {
          onDismissMenu();
        }
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          setMenuHidden(false);
        }
      }}
      tabIndex={hasFlyout ? 0 : undefined}
    >
      <Stack
        horizontal
        className={mergeStyles({
          flexGrow: 1,
          maxWidth: '100%',
          alignItems: 'center'
        })}
      >
        {avatar}
        {me && <Text className={meTextStyle}>{strings.isMeText}</Text>}
        <Stack horizontal className={mergeStyles(infoContainerStyle)}>
          {!showMenuIcon && onRenderIcon && onRenderIcon(props)}
          {/* When the participantStateString has a value, we don't show the menu  */}
          {!me && participantStateString ? (
            <Text data-ui-id="participant-item-state-string" className={mergeStyles(participantStateStringStyles)}>
              {participantStateString}
            </Text>
          ) : (
            <>
              {hasFlyout && (
                <>
                  {menuButton}
                  <ContextualMenu
                    id={participantItemFlyoutId}
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
            </>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

/** @private */
export const formatParticipantStateString = (
  props: ParticipantItemProps,
  strings: ParticipantItemStrings
): string | undefined => {
  return props.participantState === 'EarlyMedia' || props.participantState === 'Ringing'
    ? strings?.participantStateRinging
    : props.participantState === 'Hold'
      ? strings?.participantStateHold
      : undefined;
};
