// © Microsoft Corporation. All rights reserved.

import {
  memberItemContainerStyle,
  memberItemIsYouStyle,
  memberItemNameStyle,
  iconsDivStyle,
  iconStyle
} from './styles/ParticipantItem.styles';

import {
  ContextualMenu,
  DirectionalHint,
  IContextualMenuItem,
  Persona,
  PersonaSize,
  PersonaPresence
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
  /** Optional array of IContextualMenuItem to for contextual menu */
  menuItems?: IContextualMenuItem[];
  /** Optional array of JSX elements to add to component */
  icons?: JSX.Element[];
  /** Optional PersonaPresence to show participant presence. This won't have an effect if property avatar has a value */
  presence?: PersonaPresence;
}

const ParticipantItemBase = (props: ParticipantItemProps & ErrorHandlingProps): JSX.Element => {
  const { name, isYou, avatar, menuItems, icons, presence } = props;
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
      {icons && (
        <div style={iconsDivStyle}>
          {icons.map((icon, index) => (
            <div key={index} style={iconStyle}>
              {icon}
            </div>
          ))}
        </div>
      )}
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
