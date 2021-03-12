// © Microsoft Corporation. All rights reserved.

import {
  memberItemContainerStyle,
  memberItemIsYouStyle,
  memberItemNameStyle,
  iconStackStyle,
  iconStackTokens
} from './styles/ParticipantItem.styles';

import {
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Persona,
  PersonaSize,
  PersonaPresence,
  Stack
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from '../providers/ErrorProvider';

interface ParticipantItemProps {
  /** Name of participant */
  name: string;
  /** Optional indicator to show participant is the user */
  isYou?: boolean;
  /** Optional JSX element to override avatar */
  avatar?: JSX.Element;
  /** Optional array of IContextualMenuItem for contextual menu */
  menuItems?: IContextualMenuItem[];
  /** Optional children to component such as icons */
  children?: React.ReactNode;
  /** Optional PersonaPresence to show participant presence. This will not have an effect if property avatar is assigned */
  presence?: PersonaPresence;
}

const ParticipantItemBase = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element => {
  const { name, isYou, avatar, menuItems, children, presence } = props;
  const [clickEvent, setClickEvent] = useState<MouseEvent | undefined>();
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const showMenu = (clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    setClickEvent(clickEvent.nativeEvent);
    setMenuHidden(false);
  };

  const hideMenu = (): void => {
    setClickEvent(undefined);
    setMenuHidden(true);
  };

  let avatarToUse = <Persona text={name} size={PersonaSize.size32} presence={presence} />;
  if (avatar) {
    avatarToUse = (
      <div style={{ display: 'flex' }}>
        {avatar}
        <span className={memberItemNameStyle}>{name}</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={memberItemContainerStyle} onClick={showMenu}>
      {avatarToUse}
      {isYou && <span className={memberItemIsYouStyle}>(you)</span>}
      <Stack horizontal={true} className={iconStackStyle} tokens={iconStackTokens}>
        {children}
      </Stack>
      {menuItems && (
        <ContextualMenu
          items={menuItems}
          hidden={menuHidden || isYou}
          target={clickEvent ?? containerRef}
          onItemClick={hideMenu}
          onDismiss={hideMenu}
          directionalHint={DirectionalHint.bottomLeftEdge}
        />
      )}
    </div>
  );
};

export const ParticipantItem = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ParticipantItemBase, props);
