// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  participantItemContainerStyle,
  iconContainerStyle,
  iconStyles,
  menuButtonContainerStyle
} from './styles/ParticipantItem.styles';
import {
  IContextualMenuItem,
  Persona,
  PersonaSize,
  PersonaPresence,
  Stack,
  mergeStyles,
  IStyle,
  ContextualMenu,
  DirectionalHint
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { BaseCustomStylesProps } from '../types';
import { useTheme } from '../theming';
import { useLocale } from '../localization';
import { MoreHorizontal20Filled, MoreHorizontal20Regular } from '@fluentui/react-icons';

export interface ParticipantItemStylesProps extends BaseCustomStylesProps {
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
 * Strings of ParticipantItem that can be overridden
 */
export interface ParticipantItemStrings {
  /** String shown when participant is me */
  isMeText: string;
  /** String shown when hovering over menu button */
  menuTitle: string;
}

/**
 * Props for ParticipantItem component
 */
export interface ParticipantItemProps {
  /** Name of participant. */
  displayName: string;
  /** Optional indicator to show participant is the user. */
  me?: boolean;
  /** Optional callback returning a JSX element to override avatar. */
  onRenderAvatar?: (props?: ParticipantItemProps) => JSX.Element | null;
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
  styles?: ParticipantItemStylesProps;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<ParticipantItemStrings>;
}

/**
 * `ParticipantItem` represents a participant in Calling or Chat. `ParticipantItem` displays a participant's avatar,
 * displayName and status as well as optional icons and context menu.
 */
export const ParticipantItem = (props: ParticipantItemProps): JSX.Element => {
  const { displayName, onRenderAvatar, menuItems, onRenderIcon, presence, styles, me } = props;
  const [itemHovered, setItemHovered] = useState<boolean>(false);
  const [menuButtonHovered, setMenuButtonHovered] = useState<boolean>(false);
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const { strings } = useLocale();

  const isMeText = props.strings?.isMeText ?? strings.participantItem.isMeText;
  const menuTitle = props.strings?.menuTitle ?? strings.participantItem.menuTitle;

  const persona = (
    <Persona
      text={displayName}
      size={PersonaSize.size32}
      presence={presence}
      onRenderPersonaCoin={onRenderAvatar ? () => onRenderAvatar(props) : undefined}
      className={mergeStyles(styles?.avatar)}
      initialsTextColor="white"
    />
  );

  const meTextStyle = mergeStyles({ color: theme.palette.neutralTertiary }, styles?.me);
  const contextualMenuStyle = mergeStyles({ background: theme.palette.neutralLighterAlt }, styles?.menu);
  const iconsContainerWidth = '3.5rem';

  return (
    <div
      ref={containerRef}
      className={mergeStyles(participantItemContainerStyle, styles?.root)}
      onMouseEnter={() => setItemHovered(true)}
      onMouseLeave={() => setItemHovered(false)}
    >
      <Stack horizontal className={mergeStyles({ width: `calc(100% - ${iconsContainerWidth})`, alignItems: 'center' })}>
        {persona}
        {me && <Stack className={meTextStyle}>{isMeText}</Stack>}
      </Stack>
      <Stack
        horizontalAlign="end"
        horizontal
        className={mergeStyles(iconContainerStyle, { width: iconsContainerWidth }, styles?.iconContainer)}
      >
        {menuItems && menuItems.length > 0 && (itemHovered || !menuHidden) ? (
          <Stack
            horizontalAlign="end"
            onMouseEnter={() => setMenuButtonHovered(true)}
            onMouseLeave={() => setMenuButtonHovered(false)}
            title={menuTitle}
            className={menuButtonContainerStyle}
            onClick={() => setMenuHidden(false)}
          >
            {!menuButtonHovered ? (
              <MoreHorizontal20Regular className={iconStyles} primaryFill="currentColor" />
            ) : (
              <MoreHorizontal20Filled className={iconStyles} primaryFill="currentColor" />
            )}
          </Stack>
        ) : (
          onRenderIcon && (
            <Stack
              horizontalAlign="end"
              className={mergeStyles({ width: iconsContainerWidth, height: '100%', overflow: 'hidden' })}
            >
              {onRenderIcon(props)}
            </Stack>
          )
        )}
        {menuItems && menuItems.length > 0 && (
          <ContextualMenu
            items={menuItems}
            hidden={menuHidden}
            target={containerRef}
            onItemClick={() => setMenuHidden(true)}
            onDismiss={() => setMenuHidden(true)}
            directionalHint={DirectionalHint.bottomRightEdge}
            className={contextualMenuStyle}
          />
        )}
      </Stack>
    </div>
  );
};
