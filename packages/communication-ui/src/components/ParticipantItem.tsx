// © Microsoft Corporation. All rights reserved.

import {
  memberItemContainerStyle,
  memberItemIsYouStyle,
  memberItemNameStyle,
  iconsDivStyle
} from './styles/MemberItem.styles';

import { ContextualMenu, DirectionalHint, IContextualMenuItem, Persona, PersonaSize } from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from '../providers/ErrorProvider';

interface ParticipantItemProps {
  name: string;
  userId: string;
  isYou: boolean;
  removeThreadMemberByUserId?: (userId: string) => Promise<void>;
  avatarToUse?: JSX.Element;
  menuItems: IContextualMenuItem[];
  icons?: JSX.Element[];
}

const ParticipantItemBase = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element => {
  const { name, isYou, avatarToUse, menuItems, icons } = props;
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

  let avatar = <Persona text={name} size={PersonaSize.size32} />;
  if (avatarToUse) {
    avatar = (
      <div style={{ display: 'flex' }}>
        {avatarToUse}
        <span className={memberItemNameStyle}>{name}</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={memberItemContainerStyle} onClick={showMenu}>
      {avatar}
      {isYou && <span className={memberItemIsYouStyle}>(you)</span>}
      {icons && icons.length > 0 && <div style={iconsDivStyle}>{icons}</div>}
      <ContextualMenu
        items={menuItems}
        hidden={menuHidden || isYou}
        target={clickEvent ?? containerRef}
        onItemClick={hideMenu}
        onDismiss={hideMenu}
        directionalHint={DirectionalHint.bottomLeftEdge}
      />
    </div>
  );
};

export const ParticipantItem = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(ParticipantItemBase, props);
