// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { participantItemContainerStyle, iconContainerStyle } from './styles/ParticipantItem.styles';
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
import { useTheme } from '@fluentui/react-theme-provider';
import { BaseCustomStylesProps } from '../types';
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

  const avatarToUse = (
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
  const menuButtonContainerStyle = mergeStyles({
    root: {
      selectors: {
        '&:hover': { background: 'none' },
        '&:active': { background: 'none' }
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className={mergeStyles(participantItemContainerStyle, styles?.root)}
      onMouseEnter={() => setItemHovered(true)}
      onMouseLeave={() => setItemHovered(false)}
    >
      {avatarToUse}
      {me && <Stack className={meTextStyle}>{`(you)`}</Stack>}
      {onRenderIcon && (
        <Stack horizontal={true} className={mergeStyles(iconContainerStyle, styles?.iconContainer)}>
          {menuItems && menuItems.length > 0 && (itemHovered || !menuHidden) ? (
            <div
              onMouseEnter={() => setMenuButtonHovered(true)}
              onMouseLeave={() => setMenuButtonHovered(false)}
              title="More options"
              className={menuButtonContainerStyle}
              onClick={() => setMenuHidden(false)}
            >
              {!menuButtonHovered ? (
                <MoreHorizontal20Regular primaryFill="currentColor" />
              ) : (
                <MoreHorizontal20Filled primaryFill="currentColor" />
              )}
            </div>
          ) : (
            onRenderIcon(props)
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
      )}
    </div>
  );
};
