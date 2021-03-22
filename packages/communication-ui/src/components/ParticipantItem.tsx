// © Microsoft Corporation. All rights reserved.

import {
  memberItemContainerStyle,
  memberItemIsYouStyle,
  memberItemNameStyle,
  iconsContainerStyle
} from './styles/ParticipantItem.styles';
import {
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Persona,
  PersonaSize,
  PersonaPresence,
  Stack,
  IRenderFunction
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
import { useTheme } from '@fluentui/react-theme-provider';

/**
 * Props for ParticipantItem component
 */
export type ParticipantItemProps = {
  /** Name of participant */
  name: string;
  /** Optional indicator to show participant is the user */
  isYou?: boolean;
  /** Optional callback returning a JSX element to override avatar */
  onRenderAvatar?: IRenderFunction<ParticipantItemProps>;
  /** Optional array of IContextualMenuItem for contextual menu */
  menuItems?: IContextualMenuItem[];
  /** Optional callback returning a JSX element rendered on the right portion of the ParticipantItem. Intended for adding icons. */
  onRenderIcon?: IRenderFunction<ParticipantItemProps>;
  /** Optional PersonaPresence to show participant presence. This will not have an effect if property avatar is assigned */
  presence?: PersonaPresence;
};

const ParticipantItemBase = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element => {
  const { name, isYou, onRenderAvatar, menuItems, onRenderIcon, presence } = props;
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

  const avatarToUse = onRenderAvatar ? (
    <div style={{ display: 'flex' }}>
      {onRenderAvatar()}
      <span className={memberItemNameStyle}>{name}</span>
    </div>
  ) : (
    <Persona text={name} size={PersonaSize.size32} presence={presence} />
  );

  return (
    <div ref={containerRef} className={memberItemContainerStyle(theme)} onClick={showMenu}>
      {avatarToUse}
      {isYou && <span className={memberItemIsYouStyle}>(you)</span>}
      {onRenderIcon && <Stack className={iconsContainerStyle}>{onRenderIcon()}</Stack>}
      {menuItems && (
        <ContextualMenu
          items={menuItems}
          hidden={menuHidden}
          target={clickEvent ?? containerRef}
          onItemClick={hideMenu}
          onDismiss={hideMenu}
          directionalHint={DirectionalHint.bottomLeftEdge}
        />
      )}
    </div>
  );
};

/**
 * Participant Item component representing a participant in Calling or Chat
 * @param props - ParticipantItemProps & ErrorHandlingProps
 */
export const ParticipantItem = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ParticipantItemBase, props);
