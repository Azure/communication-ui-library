// © Microsoft Corporation. All rights reserved.

import React, { useState } from 'react';
import {
  Persona,
  PersonaPresence,
  PersonaSize,
  ContextualMenu,
  IContextualMenuItem,
  DirectionalHint
} from '@fluentui/react';
import { itemStyles, iconsDivStyle, iconStyle, participantStackItemStyle } from './styles/ParticipantStackItem.styles';
import { MicOffIcon, CallControlPresentNewIcon } from '@fluentui/react-northstar';

export interface ParticipantStackItemProps {
  /** Participant key */
  key: string;
  /** Participant name */
  name: string;
  /** Participant state */
  state: string;
  /** Indicator when participant is sharing screen */
  isScreenSharing: boolean;
  /** Indicator when participant is muted */
  isMuted: boolean;
  /** Callback for when participant is removed */
  onRemove?: () => void;
  /** Callback for when participant is muted */
  onMute?: () => void;
}

export const ParticipantStackItemComponent = (props: ParticipantStackItemProps): JSX.Element => {
  const { name, isScreenSharing, isMuted, state, onRemove, onMute } = props;
  let personaPresence = PersonaPresence.offline;
  if (state === 'Connected') {
    personaPresence = PersonaPresence.online;
  } else if (state === 'Idle') {
    personaPresence = PersonaPresence.away;
  }

  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const [mouseEvent, setMouseEvent] = useState<MouseEvent | null>(null);
  const onShowContextualMenu: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    event.preventDefault(); // don't navigate
    setShowContextualMenu(true);
    setMouseEvent(event.nativeEvent);
  };
  const onHideContextualMenu: () => void = () => setShowContextualMenu(false);

  const menuItems: IContextualMenuItem[] = [];
  if (onMute && !isMuted) {
    menuItems.push({
      key: 'Mute',
      text: 'Mute',
      onClick: onMute
    });
  }
  if (onRemove) {
    menuItems.push({
      key: 'Remove',
      text: 'Remove',
      onClick: onRemove
    });
  }

  return (
    <div style={participantStackItemStyle} onContextMenu={onShowContextualMenu}>
      <Persona id={props.key} text={name} styles={itemStyles} size={PersonaSize.size32} presence={personaPresence} />
      {(isScreenSharing || isMuted) && (
        <div style={iconsDivStyle}>
          {isScreenSharing && <CallControlPresentNewIcon size="small" className={iconStyle} />}
          {isMuted && <MicOffIcon size="small" className={iconStyle} />}
        </div>
      )}
      <ContextualMenu
        items={menuItems}
        hidden={!showContextualMenu}
        onItemClick={onHideContextualMenu}
        onDismiss={onHideContextualMenu}
        target={mouseEvent}
        directionalHint={DirectionalHint.bottomLeftEdge}
      />
    </div>
  );
};
