// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  participantItemContainerStyle,
  participantItemMeStyle,
  iconContainerStyle
} from './styles/ParticipantItem.styles';
import {
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Persona,
  PersonaSize,
  PersonaPresence,
  Stack,
  mergeStyles,
  IStyle
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { useTheme } from '@fluentui/react-theme-provider';
import { BaseCustomStylesProps } from '../types';

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
  const { displayName, me, onRenderAvatar, menuItems, onRenderIcon, presence, styles } = props;
  const [clickEvent, setClickEvent] = useState<MouseEvent | undefined>();
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const showMenu = (clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    setClickEvent(clickEvent.nativeEvent);
    setMenuHidden(false);
  };

  const hideMenu = (): void => {
    setClickEvent(undefined);
    setMenuHidden(true);
  };

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
  return (
    <div
      ref={containerRef}
      className={mergeStyles(participantItemContainerStyle(theme), styles?.root)}
      onClick={showMenu}
    >
      {avatarToUse}
      {me && <span className={mergeStyles(participantItemMeStyle, styles?.me)}>(you)</span>}
      {onRenderIcon && (
        <Stack className={mergeStyles(iconContainerStyle, styles?.iconContainer)}>{onRenderIcon(props)}</Stack>
      )}
      {menuItems && (
        <ContextualMenu
          items={menuItems}
          hidden={menuHidden}
          target={clickEvent ?? containerRef}
          onItemClick={hideMenu}
          onDismiss={hideMenu}
          directionalHint={DirectionalHint.bottomLeftEdge}
          className={mergeStyles(styles?.menu)}
        />
      )}
    </div>
  );
};
