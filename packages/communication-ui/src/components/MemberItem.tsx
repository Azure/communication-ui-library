// © Microsoft Corporation. All rights reserved.

import { memberItemContainerStyle, memberItemIsYouStyle, memberItemNameStyle } from './styles/MemberItem.styles';

import { ContextualMenu, DirectionalHint, IContextualMenuItem, Persona, PersonaSize } from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';

interface MemberItemProps {
  name: string;
  userId: string;
  isYou: boolean;
  removeThreadMemberByUserId?: (userId: string) => Promise<void>;
  onRenderAvatar?: (userId: string) => JSX.Element;
}

const MemberItemComponentBase = (props: MemberItemProps & ErrorHandlingProps): JSX.Element => {
  const { name, userId, isYou, removeThreadMemberByUserId, onRenderAvatar, onErrorCallback } = props;
  const [clickEvent, setClickEvent] = useState<MouseEvent | undefined>();
  const [menuHidden, setMenuHidden] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuItems: IContextualMenuItem[] = [
    {
      key: 'Remove',
      text: 'Remove',
      onClick: () => {
        removeThreadMemberByUserId?.(userId).catch((error) => {
          propagateError(error, onErrorCallback);
        });
      }
    }
  ];

  const showMenu = (clickEvent: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (removeThreadMemberByUserId) {
      setClickEvent(clickEvent.nativeEvent);
      setMenuHidden(false);
    }
  };

  const hideMenu = (): void => {
    setClickEvent(undefined);
    setMenuHidden(true);
  };

  let avatar = <Persona text={name} size={PersonaSize.size32} />;
  if (onRenderAvatar) {
    avatar = (
      <div style={{ display: 'flex' }}>
        {onRenderAvatar(userId)}
        <span className={memberItemNameStyle}>{name}</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={memberItemContainerStyle} onClick={showMenu}>
      {avatar}
      <ContextualMenu
        items={menuItems}
        hidden={menuHidden || isYou}
        target={clickEvent ?? containerRef}
        onItemClick={hideMenu}
        onDismiss={hideMenu}
        directionalHint={DirectionalHint.bottomLeftEdge}
      />
      {isYou && <span className={memberItemIsYouStyle}>(you)</span>}
    </div>
  );
};

export default (props: MemberItemProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MemberItemComponentBase, props);
